import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rememberMe" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (success) {
        navigate("/");
      } else {
        setError("Credenciais inválidas. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <span className="auth-logo">💰</span>
            <h1 className="auth-title">Desp Finance</h1>
            <p className="auth-subtitle">
              Gerencie suas finanças com inteligência
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                color: "#dc2626",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                border: "1px solid #fecaca",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Senha
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <label className="form-checkbox">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span>Lembrar-me por 30 dias</span>
            </label>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="auth-divider">ou</div>

            <div className="auth-links">
              <Link to="/forgot-password" className="auth-link">
                Esqueceu a senha?
              </Link>
              <Link to="/register" className="auth-link">
                Criar uma conta
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            Ainda não tem conta? <Link to="/register">Cadastre-se agora</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
