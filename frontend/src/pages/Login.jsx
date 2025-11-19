import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountCircle,
  Security,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { gradients, colors } from "../styles/designSystem";
import GlassCard from "../components/common/GlassCard";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Mensagem de sucesso do registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Limpar mensagem após 5 segundos
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location.state]);

  // Validação de campos em tempo real
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case "email":
        if (!value) {
          errors.email = "E-mail é obrigatório";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = "E-mail inválido";
        } else {
          delete errors.email;
        }
        break;
      case "password":
        if (!value) {
          errors.password = "Senha é obrigatória";
        } else if (value.length < 6) {
          errors.password = "Senha deve ter no mínimo 6 caracteres";
        } else {
          delete errors.password;
        }
        break;
      default:
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === "rememberMe" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar campo em tempo real
    if (name !== "rememberMe") {
      validateField(name, newValue);
    }

    // Limpar erro geral se houver
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validar todos os campos
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (!emailValid || !passwordValid) {
      setLoading(false);
      return;
    }

    try {
      const success = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (success) {
        // Animação de sucesso antes de navegar
        setSuccessMessage("Login realizado com sucesso! Redirecionando...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setError("Credenciais inválidas. Verifique seu e-mail e senha.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      if (err.response?.status === 401) {
        setError("E-mail ou senha incorretos.");
      } else if (err.response?.status === 429) {
        setError("Muitas tentativas. Tente novamente em alguns minutos.");
      } else {
        setError("Erro de conexão. Verifique sua internet e tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.brand.petrol}, ${colors.brand.mint})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: "float 6s ease-in-out infinite",
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 480 }}
      >
        <GlassCard blur={20} opacity={0.15} padding={4}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: gradients.purpleBlue,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "white",
                  fontSize: "2rem",
                  fontWeight: 700,
                  boxShadow: "0 8px 32px rgba(99, 102, 241, 0.4)",
                }}
              >
                💰
              </Box>
            </motion.div>
            <Typography
              variant="h4"
              fontWeight={800}
              mb={1}
              sx={{
                background: gradients.purpleBlue,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              DespFinance
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              Gerencie suas finanças com inteligência
            </Typography>
          </Box>

          {/* Mensagem de Sucesso */}
          <Fade in={!!successMessage}>
            <Box mb={2}>
              {successMessage && (
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  {successMessage}
                </Alert>
              )}
            </Box>
          </Fade>

          {/* Mensagem de Erro */}
          <Fade in={!!error}>
            <Box mb={2}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {error}
                </Alert>
              )}
            </Box>
          </Fade>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Campo E-mail */}
            <TextField
              fullWidth
              label="E-mail"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              margin="normal"
              required
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email
                      color={validationErrors.email ? "error" : "action"}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
                  },
                },
              }}
            />

            {/* Campo Senha */}
            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock
                      color={validationErrors.password ? "error" : "action"}
                    />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.2)",
                  },
                },
              }}
            />

            {/* Lembrar-me */}
            <Box sx={{ mt: 2, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    sx={{
                      color: "rgba(255, 255, 255, 0.7)",
                      "&.Mui-checked": {
                        color: colors.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                  >
                    Lembrar-me por 30 dias
                  </Typography>
                }
              />
            </Box>

            {/* Botão de Login */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || Object.keys(validationErrors).length > 0}
              sx={{
                py: 2,
                background: gradients.purpleBlue,
                fontSize: "1.1rem",
                fontWeight: 600,
                borderRadius: 2,
                boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
                "&:hover": {
                  background: gradients.purpleBlue,
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 35px rgba(99, 102, 241, 0.5)",
                },
                "&:disabled": {
                  background: "rgba(99, 102, 241, 0.5)",
                  transform: "none",
                  boxShadow: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} color="inherit" />
                  Entrando...
                </Box>
              ) : (
                <>
                  <Security sx={{ mr: 1 }} />
                  Entrar
                </>
              )}
            </Button>

            <Divider sx={{ my: 3, color: "rgba(255, 255, 255, 0.3)" }}>
              ou
            </Divider>

            {/* Links */}
            <Box textAlign="center" mb={2}>
              <Link
                to="/forgot-password"
                style={{
                  color: colors.primary.light,
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                }}
              >
                Esqueceu a senha?
              </Link>
            </Box>

            <Box textAlign="center">
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                Ainda não tem conta?{" "}
                <Link
                  to="/register"
                  style={{
                    color: colors.primary.light,
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Cadastre-se agora
                </Link>
              </Typography>
            </Box>
          </Box>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default Login;
