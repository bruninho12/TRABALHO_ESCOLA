import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../services/api";
import { SESSION_CONFIG } from "../config/security";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasInitialized = React.useRef(false);

  useEffect(() => {
    // Evitar execução duplicada em modo desenvolvimento
    if (hasInitialized.current) {
      console.log("⏭️ Pulando verificação duplicada");
      return;
    }
    hasInitialized.current = true;

    console.log("🔐 AuthContext: Verificando autenticação...");
    let token = localStorage.getItem(SESSION_CONFIG.tokenKey);

    // Migração de sessões antigas que usavam a chave "token"
    if (!token) {
      const legacyToken = localStorage.getItem("token");
      if (legacyToken) {
        token = legacyToken;
        localStorage.setItem(SESSION_CONFIG.tokenKey, legacyToken);
        localStorage.removeItem("token");
      }
    }

    console.log("🔑 Token encontrado:", token ? "SIM" : "NÃO");

    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      console.log("📡 Buscando perfil do usuário...");
      api
        .get("/users/profile")
        .then((response) => {
          console.log("✅ Perfil recebido:", response.data);
          const userData =
            response.data.data?.user || response.data.user || response.data;
          setUser(userData);
          localStorage.setItem("cached_user", JSON.stringify(userData));
          console.log(
            "👤 Usuário autenticado:",
            userData?.name || userData?.email
          );
        })
        .catch((error) => {
          console.error("❌ Erro ao buscar perfil:", error);
          console.error("❌ Status:", error.response?.status);
          console.error("❌ Message:", error.message);

          // Só remover token se for erro de autenticação (401)
          if (error.response?.status === 401) {
            console.warn("🔓 Token inválido (401) - removendo");
            localStorage.removeItem("token");
            localStorage.removeItem(SESSION_CONFIG.tokenKey);
            setUser(null);
          } else if (error.response?.status === 429) {
            console.warn("⏸️ Erro 429 (Rate Limit) - usando cache");
            const cachedUser = localStorage.getItem("cached_user");
            if (cachedUser) {
              try {
                setUser(JSON.parse(cachedUser));
                console.log("👤 Usando dados em cache (rate limit)");
              } catch (e) {
                console.error("Erro ao parsear usuário em cache");
              }
            }
          } else {
            console.warn("⚠️ Erro de conectividade - mantendo sessão");
            const cachedUser = localStorage.getItem("cached_user");
            if (cachedUser) {
              try {
                setUser(JSON.parse(cachedUser));
                console.log("👤 Usando dados em cache do usuário");
              } catch (e) {
                console.error("Erro ao parsear usuário em cache");
              }
            }
          }
        })
        .finally(() => {
          setLoading(false);
          console.log("🏁 AuthContext: Verificação concluída");
        });
    } else {
      console.log("⚠️ Nenhum token encontrado - usuário não autenticado");
      setLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const { token, user: userData } = response.data.data || response.data;

      localStorage.setItem(SESSION_CONFIG.tokenKey, token);
      localStorage.setItem("cached_user", JSON.stringify(userData));
      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(userData);

      console.log("✅ Login concluído com sucesso!");
      console.log("📦 Token e dados do usuário salvos no localStorage");

      return true;
    } catch (error) {
      console.error("❌ Erro no login:", error);

      // Tratamento específico para conta bloqueada
      let errorTitle = "Erro ao fazer login";
      let errorText =
        error.response?.data?.message ||
        "Ocorreu um erro ao tentar fazer login";

      if (
        error.response?.status === 403 &&
        error.response?.data?.error === "Sua conta foi bloqueada"
      ) {
        errorTitle = "🚫 Conta Bloqueada";
        errorText = error.response?.data?.reason
          ? `Sua conta foi bloqueada.\n\nMotivo: ${error.response.data.reason}`
          : "Sua conta foi bloqueada pelo administrador.";
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorText,
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_CONFIG.tokenKey);
    localStorage.removeItem("token");
    localStorage.removeItem("cached_user");
    api.defaults.headers.authorization = "";
    setUser(null);
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });

      // Se não redirecionar automaticamente, apenas retorna sucesso
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao criar conta",
        text:
          error.response?.data?.message ||
          "Ocorreu um erro ao tentar criar a conta",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("O useAuth deve ser usado dentro de um AuthProvider.");
  }
  return context;
}
