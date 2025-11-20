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
  LinearProgress,
  Chip,
  Switch,
  Autocomplete,
  Grid,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  AccountCircle,
  Security,
  Google,
  Facebook,
  DarkMode,
  LightMode,
  Fingerprint,
  Shield,
  AutoAwesome,
  Speed,
  CheckCircle,
  Warning,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { gradients, colors, shadows } from "../styles/designSystem";
import GlassCard from "../components/common/GlassCard";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [showBiometric, setShowBiometric] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Emails sugeridos para autocomplete
  const suggestedEmails = [
    "@gmail.com",
    "@hotmail.com",
    "@outlook.com",
    "@yahoo.com.br",
    "@uol.com.br",
    "@bol.com.br",
  ];

  // Verificar suporte à biometria (simulado)
  useEffect(() => {
    if (window.navigator?.credentials) {
      setBiometricSupported(true);
    }
  }, []);

  // Mensagem de sucesso do registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  }, [location.state]);

  // Calcular força da senha
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Muito Fraca", color: colors.error.main };
      case 2:
        return { text: "Fraca", color: colors.warning.main };
      case 3:
        return { text: "Média", color: colors.info.main };
      case 4:
        return { text: "Forte", color: colors.success.light };
      case 5:
        return { text: "Muito Forte", color: colors.success.main };
      default:
        return { text: "", color: colors.gray[400] };
    }
  };

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
        setPasswordStrength(calculatePasswordStrength(value));
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

  // Login com biometria (simulado)
  const handleBiometricLogin = async () => {
    setShowBiometric(true);
    try {
      // Simular autenticação biométrica
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccessMessage("Autenticação biométrica realizada com sucesso!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError("Falha na autenticação biométrica");
    } finally {
      setShowBiometric(false);
    }
  };

  // Login social simulado
  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccessMessage(`Login com ${provider} realizado com sucesso!`);
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setError(`Erro no login com ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoginAttempts((prev) => prev + 1);

    // Validar todos os campos
    const emailValid = validateField("email", formData.email);
    const passwordValid = validateField("password", formData.password);

    if (!emailValid || !passwordValid) {
      setLoading(false);
      return;
    }

    // Simular captcha após 3 tentativas
    if (loginAttempts >= 3) {
      const captchaResult = await handleCaptcha();
      if (!captchaResult) {
        setLoading(false);
        return;
      }
    }

    try {
      const success = await login(
        formData.email,
        formData.password,
        formData.rememberMe
      );

      if (success) {
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

  // Captcha simples (simulado)
  const handleCaptcha = async () => {
    return new Promise((resolve) => {
      const result = window.confirm(
        "Confirme que você não é um robô\n\nClique OK para continuar"
      );
      resolve(result);
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
          : `linear-gradient(135deg, ${colors.brand.petrol}, ${colors.brand.mint})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: isMobile ? 1 : 2,
        position: "relative",
        transition: "all 0.5s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: "float 6s ease-in-out infinite",
          opacity: darkMode ? 0.3 : 1,
        },
        "@keyframes float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      }}
    >
      {/* Toggle Modo Escuro */}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Alternar tema">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 1,
              borderRadius: 3,
              backdropFilter: "blur(10px)",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <LightMode
              sx={{ color: darkMode ? colors.gray[500] : colors.warning.main }}
            />
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              sx={{
                "& .MuiSwitch-thumb": {
                  backgroundColor: darkMode
                    ? colors.primary.main
                    : colors.warning.main,
                },
              }}
            />
            <DarkMode
              sx={{ color: darkMode ? colors.primary.main : colors.gray[500] }}
            />
          </Box>
        </Tooltip>
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: isMobile ? 360 : 480 }}
      >
        <GlassCard
          blur={20}
          opacity={darkMode ? 0.1 : 0.15}
          padding={isMobile ? 3 : 4}
          sx={{
            background: darkMode
              ? "rgba(15, 23, 42, 0.8)"
              : "rgba(255, 255, 255, 0.1)",
            border: darkMode
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          {/* Header com animação */}
          <Box textAlign="center" mb={4}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.1 }}
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
                  boxShadow: shadows.primaryGlow,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: -2,
                    borderRadius: "50%",
                    background: gradients.purpleBlue,
                    opacity: 0.5,
                    animation: "pulse 2s infinite",
                  },
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 0.5, scale: 1 },
                    "50%": { opacity: 0.8, scale: 1.05 },
                  },
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
              color={darkMode ? "rgba(255,255,255,0.8)" : "text.secondary"}
              sx={{ opacity: 0.8, mb: 2 }}
            >
              Gerencie suas finanças com inteligência
            </Typography>

            {/* Chips de Recursos */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
                mb: 2,
              }}
            >
              <Chip
                icon={<Security />}
                label="Seguro"
                size="small"
                sx={{
                  background: "rgba(16, 185, 129, 0.1)",
                  color: colors.success.main,
                  border: `1px solid ${colors.success.main}`,
                }}
              />
              <Chip
                icon={<Speed />}
                label="Rápido"
                size="small"
                sx={{
                  background: "rgba(99, 102, 241, 0.1)",
                  color: colors.primary.main,
                  border: `1px solid ${colors.primary.main}`,
                }}
              />
              {biometricSupported && (
                <Chip
                  icon={<Fingerprint />}
                  label="Biométrico"
                  size="small"
                  sx={{
                    background: "rgba(245, 158, 11, 0.1)",
                    color: colors.warning.main,
                    border: `1px solid ${colors.warning.main}`,
                  }}
                />
              )}
            </Box>
          </Box>

          {/* Biometric Login */}
          <AnimatePresence>
            {biometricSupported && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Box textAlign="center" mb={3}>
                  <Button
                    onClick={handleBiometricLogin}
                    disabled={loading || showBiometric}
                    sx={{
                      background: "rgba(245, 158, 11, 0.1)",
                      border: `2px solid ${colors.warning.main}`,
                      borderRadius: 3,
                      p: 2,
                      minWidth: 200,
                      color: colors.warning.main,
                      "&:hover": {
                        background: "rgba(245, 158, 11, 0.2)",
                        transform: "scale(1.02)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    {showBiometric ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <>
                        <Fingerprint sx={{ mr: 1 }} />
                        Entrar com Biometria
                      </>
                    )}
                  </Button>
                </Box>

                <Divider sx={{ my: 2, color: "rgba(255, 255, 255, 0.3)" }}>
                  ou continue com e-mail
                </Divider>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mensagens de Status */}
          <AnimatePresence>
            {(successMessage || error) && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Box mb={2}>
                  {successMessage && (
                    <Alert
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{
                        borderRadius: 2,
                        backdropFilter: "blur(10px)",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: `1px solid ${colors.success.main}`,
                        color: colors.success.main,
                        "& .MuiAlert-icon": { color: colors.success.main },
                      }}
                    >
                      {successMessage}
                    </Alert>
                  )}
                  {error && (
                    <Alert
                      severity="error"
                      icon={<Warning />}
                      sx={{
                        borderRadius: 2,
                        backdropFilter: "blur(10px)",
                        background: "rgba(239, 68, 68, 0.1)",
                        border: `1px solid ${colors.error.main}`,
                        color: colors.error.main,
                        "& .MuiAlert-icon": { color: colors.error.main },
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          <Box component="form" onSubmit={handleSubmit}>
            {/* Campo E-mail com Autocomplete */}
            <Autocomplete
              freeSolo
              options={suggestedEmails.map((domain) =>
                formData.email.includes("@")
                  ? formData.email
                  : formData.email + domain
              )}
              value={formData.email}
              onInputChange={(event, newValue) => {
                handleChange({
                  target: { name: "email", value: newValue || "" },
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="E-mail"
                  type="email"
                  name="email"
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                  margin="normal"
                  required
                  autoFocus
                  InputProps={{
                    ...params.InputProps,
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
                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.02)"
                        : "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      borderRadius: 2,
                      transition: "all 0.3s ease",
                      border: validationErrors.email
                        ? `2px solid ${colors.error.main}`
                        : "none",
                      "&:hover": {
                        backgroundColor: darkMode
                          ? "rgba(255, 255, 255, 0.05)"
                          : "rgba(255, 255, 255, 0.08)",
                        transform: "translateY(-1px)",
                      },
                      "&.Mui-focused": {
                        backgroundColor: darkMode
                          ? "rgba(255, 255, 255, 0.08)"
                          : "rgba(255, 255, 255, 0.1)",
                        boxShadow: `0 0 0 2px ${colors.primary.main}40`,
                        transform: "translateY(-2px)",
                      },
                    },
                  }}
                />
              )}
            />

            {/* Campo Senha com Indicador de Força */}
            <Box>
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
                        sx={{
                          transition: "all 0.3s ease",
                          "&:hover": { transform: "scale(1.1)" },
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: darkMode
                      ? "rgba(255, 255, 255, 0.02)"
                      : "rgba(255, 255, 255, 0.05)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                    border: validationErrors.password
                      ? `2px solid ${colors.error.main}`
                      : "none",
                    "&:hover": {
                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.05)"
                        : "rgba(255, 255, 255, 0.08)",
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: darkMode
                        ? "rgba(255, 255, 255, 0.08)"
                        : "rgba(255, 255, 255, 0.1)",
                      boxShadow: `0 0 0 2px ${colors.primary.main}40`,
                      transform: "translateY(-2px)",
                    },
                  },
                }}
              />

              {/* Indicador de Força da Senha */}
              <AnimatePresence>
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Box sx={{ mt: 1, px: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color:
                              getPasswordStrengthText(passwordStrength).color,
                          }}
                        >
                          Força:{" "}
                          {getPasswordStrengthText(passwordStrength).text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          {passwordStrength}/5
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(passwordStrength / 5) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 3,
                            backgroundColor:
                              getPasswordStrengthText(passwordStrength).color,
                            transition: "all 0.3s ease",
                          },
                        }}
                      />
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Lembrar-me e Contador de Tentativas */}
            <Box
              sx={{
                mt: 2,
                mb: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
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
                      transition: "all 0.3s ease",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    sx={{
                      color: darkMode
                        ? "rgba(255, 255, 255, 0.8)"
                        : "rgba(255, 255, 255, 0.8)",
                    }}
                  >
                    Lembrar-me
                  </Typography>
                }
              />

              {loginAttempts > 0 && (
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      loginAttempts >= 3
                        ? colors.warning.main
                        : colors.gray[500],
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Shield size={12} />
                  Tentativas: {loginAttempts}
                </Typography>
              )}
            </Box>

            {/* Botão de Login Principal */}
            <motion.div
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || Object.keys(validationErrors).length > 0}
                sx={{
                  py: 2.5,
                  background: gradients.purpleBlue,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: shadows.primaryGlow,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    background: gradients.purpleBlue,
                    transform: "translateY(-2px)",
                    boxShadow: `0 12px 35px ${colors.primary.main}50`,
                  },
                  "&:disabled": {
                    background: "rgba(99, 102, 241, 0.5)",
                    transform: "none",
                    boxShadow: "none",
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.5s",
                  },
                  "&:hover::before": {
                    left: "100%",
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
                    Entrar com Segurança
                  </>
                )}
              </Button>
            </motion.div>

            {/* Divisor com Animação */}
            <Box sx={{ my: 3, position: "relative" }}>
              <Divider
                sx={{
                  color: "rgba(255, 255, 255, 0.3)",
                  "&::before, &::after": {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                  },
                }}
              >
                <Chip
                  label="ou continue com"
                  size="small"
                  sx={{
                    background: darkMode
                      ? "rgba(0,0,0,0.5)"
                      : "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.8)",
                    backdropFilter: "blur(10px)",
                  }}
                />
              </Divider>
            </Box>

            {/* Login Social */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      color: darkMode ? "white" : "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        borderColor: colors.error.main,
                        background: "rgba(234, 67, 53, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Google sx={{ mr: 1, color: "#EA4335" }} />
                    Google
                  </Button>
                </motion.div>
              </Grid>
              <Grid item xs={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      background: "rgba(255, 255, 255, 0.05)",
                      backdropFilter: "blur(10px)",
                      color: darkMode ? "white" : "rgba(255, 255, 255, 0.9)",
                      "&:hover": {
                        borderColor: "#1877F2",
                        background: "rgba(24, 119, 242, 0.1)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Facebook sx={{ mr: 1, color: "#1877F2" }} />
                    Facebook
                  </Button>
                </motion.div>
              </Grid>
            </Grid>

            {/* Links de Navegação */}
            <Box textAlign="center" mb={2}>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: colors.primary.light,
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 16 }} />
                  Recuperar senha
                </Link>
              </motion.div>
            </Box>

            <Box textAlign="center">
              <Typography
                variant="body2"
                sx={{
                  color: darkMode
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(255, 255, 255, 0.7)",
                  mb: 1,
                }}
              >
                Novo por aqui?{" "}
                <motion.span whileHover={{ scale: 1.05 }}>
                  <Link
                    to="/register"
                    style={{
                      color: colors.primary.light,
                      textDecoration: "none",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    Cadastre-se gratuitamente
                    <AccountCircle sx={{ fontSize: 16 }} />
                  </Link>
                </motion.span>
              </Typography>

              {/* Indicador de Segurança */}
              <Typography
                variant="caption"
                sx={{
                  color: colors.success.main,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  mt: 1,
                }}
              >
                <Shield sx={{ fontSize: 12 }} />
                Seus dados estão protegidos com criptografia SSL
              </Typography>
            </Box>
          </Box>
        </GlassCard>
      </motion.div>
    </Box>
  );
};

export default Login;
