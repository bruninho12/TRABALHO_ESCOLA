import React, { createContext, useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("finance_flow_token");
    if (token) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      api
        .get("/users/profile")
        .then((response) => {
          setUser(
            response.data.data?.user || response.data.user || response.data
          );
        })
        .catch((error) => {
          // Só remover token se for erro de autenticação, não de conectividade
          if (
            error.response?.status === 401 ||
            error.message !== "API_OFFLINE"
          ) {
            localStorage.removeItem("finance_flow_token");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
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

      localStorage.setItem("finance_flow_token", token);
      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(userData);

      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro ao fazer login",
        text:
          error.response?.data?.message ||
          "Ocorreu um erro ao tentar fazer login",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("finance_flow_token");
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
