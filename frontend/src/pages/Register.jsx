import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import usePlan from "../hooks/usePlan";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { setPlan } = usePlan();
  const [searchParams] = useSearchParams();
  const planParam = searchParams.get("plan");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Se houver plano na URL, seta e mostra notificação
  useEffect(() => {
    if (planParam && ["premium", "anual", "vitalicio"].includes(planParam)) {
      setPlan(planParam);
      Swal.fire({
        icon: "info",
        title: "Plano selecionado",
        text: `Você será registrado com o plano ${
          planParam === "premium"
            ? "Premium"
            : planParam === "anual"
            ? "Anual"
            : "Vitalício"
        }.`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }, [planParam, setPlan]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "agreeToTerms" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Você precisa concordar com os termos de uso");
      return;
    }

    setLoading(true);

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );

      if (success) {
        navigate("/login", {
          state: {
            message: "Conta criada com sucesso! Faça login para continuar.",
          },
        });
      } else {
        setError("Erro ao criar conta. Tente novamente.");
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
            <h1 className="auth-title">Finance Flow</h1>
            <p className="auth-subtitle">Crie sua conta e comece agora</p>
            {planParam && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6366F1",
                  marginTop: "0.5rem",
                  fontWeight: 600,
                }}
              >
                Plano selecionado:{" "}
                {planParam === "premium"
                  ? "Premium 💎"
                  : planParam === "anual"
                  ? "Anual 📅"
                  : "Vitalício ⭐"}
              </p>
            )}
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
              <label className="form-label" htmlFor="name">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="Seu nome"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

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

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmar senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <label className="form-checkbox">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
              />
              <span>
                Concordo com os{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--color-primary)",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Política de Privacidade
                </a>
              </span>
            </label>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? "Criando conta..." : "Criar conta"}
            </button>

            <div className="auth-divider">ou</div>

            <div className="auth-links">
              <Link to="/login" className="auth-link">
                Já tem uma conta? Faça login
              </Link>
            </div>
          </form>

          <div className="auth-footer">
            Ao se registrar, você concorda com nossos termos e políticas
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
