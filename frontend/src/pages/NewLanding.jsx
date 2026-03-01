/**
 * @fileoverview Landing Page - DespFinancee - Mobile Optimized
 */

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Divider,
  Collapse,
  IconButton,
  Backdrop,
  useMediaQuery,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  SportsEsports as GamificationIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Assessment as ReportsIcon,
  ArrowForward,
  CheckCircle,
  Star,
  Shield,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore,
  Email,
  QuestionAnswer,
  Lightbulb,
  Visibility,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout";

const NewLanding = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [typedText, setTypedText] = useState("");
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enableVisualEffects = !isMobile && !prefersReducedMotion;

  // Loader começa desativado para priorizar LCP
  const [showLoader, setShowLoader] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Iniciando...");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [currentBg, setCurrentBg] = useState(0);
  const [showParticles, setShowParticles] = useState(false);
  const [magneticButtons] = useState(new Set());
  const containerRef = useRef(null);

  // Estados para checkout MercadoPago
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("silver");

  // Abrir modal de checkout
  const handleOpenCheckout = (plan) => {
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  // Fechar modal de checkout
  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
  };

  // Callback de sucesso do pagamento
  const handlePaymentSuccess = () => {
    setCheckoutOpen(false);
    setSnackbarMessage(
      "🎉 Pagamento processado com sucesso! Seu plano será ativado em breve."
    );
    setShowSnackbar(true);
    // Redirecionar para dashboard após alguns segundos
    setTimeout(() => {
      navigate("/dashboard");
    }, 3000);
  };

  // Componente do Loader como Portal
  const LoaderPortal = () => {
    if (!showLoader) return null;

    return createPortal(
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999999,
            background: "linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Partículas flutuantes no loader */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                borderRadius: "50%",
                background: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
                pointerEvents: "none",
              }}
            />
          ))}

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
            transition={{ duration: 0.8, ease: "backOut" }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: 2,
                background: "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                mb: 4,
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: "white",
                    fontWeight: 900,
                    textShadow: "0 0 20px rgba(255,255,255,0.5)",
                  }}
                >
                  💰
                </Typography>
              </motion.div>
            </Box>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 2,
                textAlign: "center",
              }}
            >
              DespFinance
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.7)",
                textAlign: "center",
                mb: 4,
                minHeight: 24,
              }}
            >
              {loadingMessage}
            </Typography>
          </motion.div>

          {/* Barra de progresso real */}
          <Box sx={{ width: 200, position: "relative", mb: 2 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${loaderProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                height: 6,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                borderRadius: 3,
                boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -2,
                width: "100%",
                height: 10,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 3,
                zIndex: -1,
              }}
            />
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontFamily: "monospace",
              letterSpacing: 1,
            }}
          >
            {Math.round(loaderProgress)}%
          </Typography>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const fullText = "Transforme suas finanças em um jogo divertido!";

  // Controle do loader
  useEffect(() => {
    if (!enableVisualEffects) {
      setShowLoader(false);
      return;
    }

    setShowLoader(true);

    const loadingMessages = [
      "Iniciando...",
      "Carregando recursos...",
      "Preparando interface...",
      "Configurando dados...",
      "Otimizando experiência...",
      "Quase pronto...",
    ];

    let progress = 0;
    let messageIndex = 0;

    const loadingTimer = setInterval(() => {
      progress += Math.random() * 15 + 5; // Progresso variável mais realista
      const currentProgress = Math.min(progress, 100);
      setLoaderProgress(currentProgress);

      // Atualizar mensagem baseada no progresso
      const newMessageIndex = Math.floor(
        (currentProgress / 100) * (loadingMessages.length - 1)
      );
      if (
        newMessageIndex !== messageIndex &&
        loadingMessages[newMessageIndex]
      ) {
        messageIndex = newMessageIndex;
        setLoadingMessage(loadingMessages[newMessageIndex]);
      }

      if (progress >= 100) {
        clearInterval(loadingTimer);
        setLoadingMessage("Pronto!");
        // Aguardar um pouco antes de esconder o loader
        setTimeout(() => {
          setShowLoader(false);
        }, 800);
      }
    }, 150);

    return () => clearInterval(loadingTimer);
  }, [enableVisualEffects]);
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [enableVisualEffects]);

  // Efeito de elementos flutuantes - agora conectado ao loader
  useEffect(() => {
    if (!enableVisualEffects) {
      setShowFloatingElements(false);
      return;
    }

    // Só ativar elementos flutuantes após o loader terminar
    if (!showLoader) {
      const timer = setTimeout(() => setShowFloatingElements(true), 500);
      return () => clearTimeout(timer);
    }
  }, [showLoader, enableVisualEffects]);

  // Tracking do mouse para parallax
  useEffect(() => {
    if (!enableVisualEffects) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Sistema de Cursor Magnético Otimizado
      if (magneticButtons.size > 0) {
        magneticButtons.forEach((buttonId) => {
          const button = document.getElementById(buttonId);
          if (button) {
            const rect = button.getBoundingClientRect();
            const buttonCenterX = rect.left + rect.width / 2;
            const buttonCenterY = rect.top + rect.height / 2;

            const deltaX = e.clientX - buttonCenterX;
            const deltaY = e.clientY - buttonCenterY;
            const distanceSquared = deltaX * deltaX + deltaY * deltaY;

            if (distanceSquared < 6400) {
              // 80px squared
              const magnetX = deltaX * 0.15;
              const magnetY = deltaY * 0.15;

              button.style.transform = `translate(${magnetX}px, ${magnetY}px)`;
            } else {
              button.style.transform = `translate(0px, 0px)`;
            }
          }
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [magneticButtons, enableVisualEffects]);

  // Sistema de Partículas Otimizado
  useEffect(() => {
    if (!enableVisualEffects) {
      setShowParticles(false);
      setParticles([]);
      return;
    }

    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 8; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 2,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setParticles(newParticles);
      setShowParticles(true);
    };

    const timer = setTimeout(generateParticles, 500);
    return () => clearTimeout(timer);
  }, [enableVisualEffects]);

  // Background Morphing Otimizado
  useEffect(() => {
    if (!enableVisualEffects) return;

    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, [enableVisualEffects]);

  return (
    <>
      {/* Loader Cinematográfico - Agora com máxima prioridade */}
      <AnimatePresence>
        {showLoader && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 999999, // Z-index máximo
              background: "linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Partículas flutuantes no loader */}
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 0.6, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  width: Math.random() * 4 + 2,
                  height: Math.random() * 4 + 2,
                  borderRadius: "50%",
                  background: `hsl(${Math.random() * 60 + 240}, 70%, 60%)`,
                  pointerEvents: "none",
                }}
              />
            ))}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: 2,
                  background:
                    "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  mb: 4,
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: "white",
                      fontWeight: 900,
                      textShadow: "0 0 20px rgba(255,255,255,0.5)",
                    }}
                  >
                    F
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  mb: 2,
                  textAlign: "center",
                }}
              >
                DespFinance
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "center",
                  mb: 4,
                  minHeight: 24, // Evita mudança de layout
                }}
              >
                {loadingMessage}
              </Typography>
            </motion.div>

            {/* Barra de progresso real */}
            <Box sx={{ width: 200, position: "relative", mb: 2 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loaderProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{
                  height: 6,
                  background:
                    "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                  borderRadius: 3,
                  boxShadow: "0 0 10px rgba(99, 102, 241, 0.5)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: -2,
                  width: "100%",
                  height: 10,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  zIndex: -1,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.8)",
                fontFamily: "monospace",
                letterSpacing: 1,
              }}
            >
              {Math.round(loaderProgress)}%
            </Typography>
          </Box>
        )}
      </AnimatePresence>

      {/* Cursor Personalizado */}
      {enableVisualEffects && <motion.div
        style={{
          position: "fixed",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "difference",
        }}
        animate={{
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />}
      {/* Sistema de Partículas */}
      {enableVisualEffects && (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: particle.opacity,
              scale: 1,
              x: [particle.x, particle.x + particle.speedX * 100],
              y: [particle.y, particle.y + particle.speedY * 100],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background: particle.color,
              filter: "blur(0.5px)",
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </Box>
      )}
      {/* Background Morphing */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: [
            "linear-gradient(45deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
            "linear-gradient(45deg, #fef3cd 0%, #fef9e7 50%, #f8fafc 100%)",
            "linear-gradient(45deg, #f0f9ff 0%, #e0f2fe 50%, #f8fafc 100%)",
            "linear-gradient(45deg, #fef2f2 0%, #fef7f7 50%, #f8fafc 100%)",
          ][currentBg],
          transition: "background 2s ease-in-out",
        }}
      />
      {/* Sistema de Partículas Flutuantes */}
      <AnimatePresence>
        {showParticles && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{
                  x: particle.x,
                  y: particle.y,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: [particle.x, particle.x + particle.speedX * 60],
                  y: [particle.y, particle.y + particle.speedY * 60],
                  opacity: [0, particle.opacity, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 1,
                }}
                style={{
                  position: "absolute",
                  width: particle.size,
                  height: particle.size,
                  background: `rgba(99, 102, 241, ${particle.opacity})`,
                  borderRadius: "50%",
                  willChange: "transform, opacity",
                  backfaceVisibility: "hidden",
                }}
              />
            ))}
          </Box>
        )}
      </AnimatePresence>
      {/* Cursor Customizado Otimizado */}
      {enableVisualEffects && <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "16px",
          height: "16px",
          background: "rgba(99, 102, 241, 0.6)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "transform",
        }}
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 40,
        }}
      />}
      {/* Background Morphing */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: [
            "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
          ][currentBg],
          transition: "background 4s ease-in-out",
        }}
      />
      <Box
        sx={{
          bgcolor: "transparent",
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
          width: "100%",
          overflowX: "hidden",
        }}
        ref={containerRef}
      >
        {/* Header Responsivo */}
        <Box
          component="header"
          sx={{
            bgcolor: "white",
            borderBottom: "1px solid #e2e8f0",
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(10px)",
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              maxWidth: "100%",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              py={{ xs: 1.5, sm: 2 }}
            >
              {/* Logo */}
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    borderRadius: 1,
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: { xs: "1rem", sm: "1.2rem" },
                  }}
                >
                  F
                </Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  color="#1e293b"
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  DespFinance
                </Typography>
              </Stack>

              {/* Desktop Navigation */}
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <Typography
                  sx={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "&:hover": { color: "#1e293b" },
                    transition: "color 0.2s ease",
                  }}
                >
                  Recursos
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "&:hover": { color: "#1e293b" },
                    transition: "color 0.2s ease",
                  }}
                >
                  Gamificação
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "&:hover": { color: "#1e293b" },
                    transition: "color 0.2s ease",
                  }}
                >
                  Preços
                </Typography>
                <Typography
                  sx={{
                    color: "black",
                    cursor: "pointer",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    "&:hover": { color: "#1e293b" },
                    transition: "color 0.2s ease",
                  }}
                >
                  Depoimentos
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/login")}
                  size="small"
                  sx={{
                    borderColor: "#e2e8f0",
                    color: "black",
                    fontSize: "0.875rem",
                    px: 2,
                    py: 0.75,
                    "&:hover": {
                      borderColor: "#6366f1",
                      bgcolor: "rgba(99, 102, 241, 0.04)",
                    },
                  }}
                >
                  Entrar
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "none",
                    fontSize: "0.875rem",
                    px: 2.5,
                    py: 0.75,
                    "&:hover": {
                      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
                    },
                  }}
                >
                  Começar Grátis
                </Button>
              </Stack>

              {/* Mobile Actions */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ display: { xs: "flex", md: "none" } }}
              >
                <Button
                  variant="contained"
                  onClick={() => navigate("/register")}
                  size="small"
                  sx={{
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    boxShadow: "none",
                    fontSize: "0.8rem",
                    px: 2,
                    py: 0.75,
                    minWidth: "auto",
                    "&:hover": {
                      boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
                    },
                  }}
                >
                  Grátis
                </Button>

                {/* Menu Hamburger */}
                <IconButton
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  sx={{
                    color: "#64748b",
                    p: 1,
                    "&:hover": {
                      bgcolor: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>
              </Stack>
            </Stack>

            {/* Mobile Menu */}
            <Collapse in={mobileMenuOpen}>
              <Box
                sx={{
                  py: 2,
                  borderTop: "1px solid #e2e8f0",
                  display: { md: "none" },
                }}
              >
                <Stack spacing={2}>
                  <Typography
                    sx={{
                      color: "#64748b",
                      cursor: "pointer",
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      "&:hover": {
                        color: "#1e293b",
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Recursos
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      cursor: "pointer",
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      "&:hover": {
                        color: "#1e293b",
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Gamificação
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      cursor: "pointer",
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      "&:hover": {
                        color: "#1e293b",
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Preços
                  </Typography>
                  <Typography
                    sx={{
                      color: "#64748b",
                      cursor: "pointer",
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      "&:hover": {
                        color: "#1e293b",
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    Depoimentos
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      navigate("/login");
                      setMobileMenuOpen(false);
                    }}
                    fullWidth
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#6366f1",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      },
                    }}
                  >
                    Fazer Login
                  </Button>
                </Stack>
              </Box>
            </Collapse>
          </Container>
        </Box>

        {/* Announcement Bar */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            py: { xs: 1, sm: 1.5 },
          }}
        >
          <Container
            maxWidth={false}
            sx={{
              px: { xs: 2, sm: 3, md: 4 },
              maxWidth: "100%",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="center">
              <Chip
                label="🚀 +50.000 usuários economizando jogando"
                sx={{
                  bgcolor: "rgba(255,255,255,0.2)",
                  color: "black",
                  fontWeight: 600,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  px: { xs: 1, sm: 2 },
                }}
              />
            </Stack>
          </Container>
        </Box>

        {/* Hero Section */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f1419 75%, #0a0e27 100%)",
            pt: { xs: 8, sm: 10, md: 16 },
            pb: { xs: 6, sm: 8, md: 12 },
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: "90vh", md: "100vh" },
            display: "flex",
            alignItems: "center",
            "&::before": {
              content: "''",
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)",
              zIndex: 0,
            },
          }}
        >
          {/* Elementos decorativos avançados */}
          <AnimatePresence>
            {showFloatingElements && (
              <>
                {/* Círculo principal flutuante */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                    y: [0, -30, 0],
                    rotate: [0, 360],
                  }}
                  style={{
                    position: "absolute",
                    top: "15%",
                    right: "8%",
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    filter: "blur(1px)",
                    zIndex: 0,
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Forma orgânica flutuante */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                    x: [0, 40, 0],
                    rotate: [0, -360],
                  }}
                  style={{
                    position: "absolute",
                    bottom: "25%",
                    left: "3%",
                    width: 100,
                    height: 100,
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                    background: "linear-gradient(135deg, #ec4899, #f59e0b)",
                    filter: "blur(1px)",
                    zIndex: 0,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Partículas pequenas */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 0.6, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.random() * 100 - 50, 0],
                      y: [0, Math.random() * 100 - 50, 0],
                    }}
                    style={{
                      position: "absolute",
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                      width: 4 + Math.random() * 8,
                      height: 4 + Math.random() * 8,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${
                        i % 2 === 0 ? "#6366f1, #8b5cf6" : "#ec4899, #f59e0b"
                      })`,
                      zIndex: 0,
                    }}
                    transition={{
                      duration: 3 + Math.random() * 4,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>

          <Container
            maxWidth="xl"
            sx={{
              position: "relative",
              zIndex: 1,
              px: { xs: 1.5, sm: 2, md: 3 },
              py: { xs: 4, md: 6 },
              maxWidth: "100%",
            }}
          >
            <Grid
              container
              spacing={{ xs: 3, sm: 4, md: 6 }}
              alignItems="center"
              sx={{ minHeight: { xs: "auto", md: "80vh" } }}
            >
              <Grid item xs={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ y: y1 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.01, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Typography
                      variant="h1"
                      sx={{
                        fontSize: {
                          xs: "1.5rem",
                          sm: "2rem",
                          md: "2.5rem",
                          lg: "3.25rem",
                          xl: "3.5rem",
                        },
                        fontWeight: 800,
                        color: "white",
                        lineHeight: { xs: 1.3, sm: 1.2, md: 1.1 },
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        textAlign: { xs: "center", lg: "left" },
                        px: { xs: 0.5, sm: 0 },
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      Controle financeiro{" "}
                      <Box
                        component="span"
                        sx={{
                          background:
                            "linear-gradient(135deg, #6366f1, #ec4899)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          position: "relative",
                          display: { xs: "block", sm: "inline" },
                          "&::after": {
                            content: "''",
                            position: "absolute",
                            bottom: { xs: -2, md: -5 },
                            left: 0,
                            right: 0,
                            height: { xs: 2, md: 3 },
                            background:
                              "linear-gradient(135deg, #6366f1, #ec4899)",
                            borderRadius: 2,
                            animation: "pulse 2s infinite",
                          },
                          "@keyframes pulse": {
                            "0%": { opacity: 0.5, transform: "scaleX(0.8)" },
                            "50%": { opacity: 1, transform: "scaleX(1)" },
                            "100%": { opacity: 0.5, transform: "scaleX(0.8)" },
                          },
                        }}
                      >
                        que te faz economizar
                      </Box>{" "}
                      <Box
                        component="span"
                        sx={{
                          background:
                            "linear-gradient(135deg, #f59e0b, #f97316)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                          display: { xs: "block", sm: "inline" },
                        }}
                      >
                        jogando
                      </Box>
                    </Typography>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "rgba(255, 255, 255, 0.9)",
                          mb: { xs: 3, sm: 3.5, md: 4 },
                          fontSize: {
                            xs: "0.95rem",
                            sm: "1.1rem",
                            md: "1.25rem",
                          },
                          lineHeight: { xs: 1.6, md: 1.6 },
                          minHeight: { xs: "auto", md: "2em" },
                          textAlign: { xs: "center", lg: "left" },
                          px: { xs: 1, sm: 0 },
                          maxWidth: { xs: "100%", lg: "90%" },
                          fontWeight: 400,
                        }}
                      >
                        {typedText ||
                          "Transforme suas finanças em um jogo divertido!"}
                        {typedText && (
                          <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{
                              color: "#6366f1",
                              fontWeight: 700,
                              fontSize: "1.2em",
                            }}
                          >
                            |
                          </motion.span>
                        )}
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          mb: { xs: 4, md: 5 },
                          fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                          lineHeight: 1.7,
                          textAlign: { xs: "center", lg: "left" },
                          px: { xs: 1, sm: 0 },
                          maxWidth: { xs: "100%", lg: "85%" },
                        }}
                      >
                        O primeiro app de finanças pessoais com{" "}
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 700,
                            color: "#a855f7",
                            background:
                              "linear-gradient(135deg, #6366f1, #a855f7)",
                            WebkitBackgroundClip: "text",
                            backgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          gamificação completa
                        </Box>
                        . Ganhe XP, suba níveis, desbloqueie conquistas e
                        economize mais do que nunca.
                      </Typography>
                    </motion.div>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={{ xs: 2, sm: 3 }}
                      mb={{ xs: 4, sm: 5, md: 6 }}
                      alignItems={{ xs: "stretch", sm: "center" }}
                      justifyContent={{ xs: "center", lg: "flex-start" }}
                      sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "auto" },
                      }}
                    >
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          y: -4,
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                          duration: 0.3,
                        }}
                        style={{ width: "100%" }}
                      >
                        <Button
                          id="main-cta"
                          variant="contained"
                          size="large"
                          startIcon={<span>🚀</span>}
                          endIcon={
                            <motion.div
                              animate={{
                                x: [0, 8, 0],
                                rotate: [0, 15, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <ArrowForward />
                            </motion.div>
                          }
                          onClick={() => navigate("/register")}
                          sx={{
                            background:
                              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
                            px: { xs: 3, sm: 4, md: 6 },
                            py: { xs: 2.5, sm: 3, md: 3.5 },
                            fontSize: {
                              xs: "1rem",
                              sm: "1.15rem",
                              md: "1.25rem",
                            },
                            fontWeight: 700,
                            width: { xs: "100%", sm: "auto" },
                            minWidth: { xs: "auto", sm: "250px" },
                            maxWidth: { xs: "100%", sm: "350px" },
                            boxShadow: "0 20px 40px rgba(99, 102, 241, 0.4)",
                            borderRadius: { xs: 3, sm: 4 },
                            position: "relative",
                            overflow: "hidden",
                            textTransform: "none",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: "-100%",
                              width: "100%",
                              height: "100%",
                              background:
                                "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                              transition: "left 0.8s",
                            },
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: "0 25px 50px rgba(99, 102, 241, 0.5)",
                              "&::before": {
                                left: "100%",
                              },
                            },
                          }}
                        >
                          Criar Conta Mágica
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{
                          scale: 1.02,
                          y: -2,
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        style={{ width: "100%" }}
                      >
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={
                            <motion.div
                              animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Visibility />
                            </motion.div>
                          }
                          sx={{
                            borderColor: "rgba(255, 255, 255, 0.3)",
                            color: "rgba(255, 255, 255, 0.9)",
                            px: { xs: 2.5, sm: 3, md: 4 },
                            py: { xs: 2, sm: 2.5, md: 3 },
                            fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                              md: "1.05rem",
                            },
                            fontWeight: 600,
                            borderRadius: { xs: 3, sm: 4 },
                            borderWidth: 2,
                            background: "rgba(255, 255, 255, 0.05)",
                            backdropFilter: "blur(20px)",
                            width: { xs: "100%", sm: "auto" },
                            minWidth: { xs: "auto", sm: "200px" },
                            maxWidth: { xs: "100%", sm: "280px" },
                            position: "relative",
                            overflow: "hidden",
                            textTransform: "none",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
                              transform: "translateX(-100%)",
                              transition: "transform 0.6s",
                            },
                            "&:hover": {
                              borderColor: "rgba(255, 255, 255, 0.6)",
                              color: "white",
                              bgcolor: "rgba(255, 255, 255, 0.1)",
                              boxShadow: "0 15px 35px rgba(255, 255, 255, 0.1)",
                              "&::before": {
                                transform: "translateX(100%)",
                              },
                            },
                          }}
                        >
                          ✨ Ver Demonstração
                        </Button>
                      </motion.div>
                    </Stack>
                  </motion.div>
                </motion.div>
              </Grid>

              <Grid item xs={12} lg={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mt: { xs: 6, lg: 0 },
                      px: { xs: 2, sm: 0 },
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}
                  >
                    {/* Painel Principal de Métricas */}
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                        rotateY: [0, 5, 0],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: 4,
                          p: { xs: 3, sm: 4 },
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        <Grid container spacing={3}>
                          {/* Usuários Ativos */}
                          <Grid item xs={6}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Paper
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                  p: 3,
                                  borderRadius: 3,
                                  color: "white",
                                  textAlign: "center",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background:
                                      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                                    animation: "shimmer 3s infinite",
                                  },
                                  "@keyframes shimmer": {
                                    "0%": { transform: "translateX(-100%)" },
                                    "100%": { transform: "translateX(100%)" },
                                  },
                                }}
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    sx={{ mb: 1 }}
                                  >
                                    50.000+
                                  </Typography>
                                </motion.div>
                                <Typography
                                  variant="body2"
                                  sx={{ opacity: 0.9 }}
                                >
                                  Usuários Ativos
                                </Typography>
                              </Paper>
                            </motion.div>
                          </Grid>

                          {/* Dinheiro Economizado */}
                          <Grid item xs={6}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Paper
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #10b981, #059669)",
                                  p: 3,
                                  borderRadius: 3,
                                  color: "white",
                                  textAlign: "center",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background:
                                      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                                    animation: "shimmer 3s infinite 0.5s",
                                  },
                                }}
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    sx={{ mb: 1 }}
                                  >
                                    R$ 25M+
                                  </Typography>
                                </motion.div>
                                <Typography
                                  variant="body2"
                                  sx={{ opacity: 0.9 }}
                                >
                                  Economizados
                                </Typography>
                              </Paper>
                            </motion.div>
                          </Grid>

                          {/* Avaliação */}
                          <Grid item xs={6}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Paper
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #f59e0b, #f97316)",
                                  p: 3,
                                  borderRadius: 3,
                                  color: "white",
                                  textAlign: "center",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background:
                                      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                                    animation: "shimmer 3s infinite 1s",
                                  },
                                }}
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 1,
                                  }}
                                >
                                  <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    sx={{ mb: 1 }}
                                  >
                                    4.9/5
                                  </Typography>
                                </motion.div>
                                <Typography
                                  variant="body2"
                                  sx={{ opacity: 0.9 }}
                                >
                                  Avaliação
                                </Typography>
                              </Paper>
                            </motion.div>
                          </Grid>

                          {/* Satisfação */}
                          <Grid item xs={6}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Paper
                                sx={{
                                  background:
                                    "linear-gradient(135deg, #ec4899, #be185d)",
                                  p: 3,
                                  borderRadius: 3,
                                  color: "white",
                                  textAlign: "center",
                                  position: "relative",
                                  overflow: "hidden",
                                  "&::before": {
                                    content: '""',
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background:
                                      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
                                    animation: "shimmer 3s infinite 1.5s",
                                  },
                                }}
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.1, 1] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: 1.5,
                                  }}
                                >
                                  <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    sx={{ mb: 1 }}
                                  >
                                    98%
                                  </Typography>
                                </motion.div>
                                <Typography
                                  variant="body2"
                                  sx={{ opacity: 0.9 }}
                                >
                                  Satisfação
                                </Typography>
                              </Paper>
                            </motion.div>
                          </Grid>
                        </Grid>
                      </Paper>
                    </motion.div>

                    {/* Indicações Visuais */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.8 }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        flexWrap="wrap"
                      >
                        <Chip
                          icon={
                            <CheckCircle sx={{ color: "#10b981 !important" }} />
                          }
                          label="100% Gratuito"
                          sx={{
                            bgcolor: "rgba(16, 185, 129, 0.1)",
                            color: "#10b981",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          icon={<Shield sx={{ color: "#6366f1 !important" }} />}
                          label="Dados Seguros"
                          sx={{
                            bgcolor: "rgba(99, 102, 241, 0.1)",
                            color: "#6366f1",
                            border: "1px solid rgba(99, 102, 241, 0.3)",
                            fontWeight: 600,
                          }}
                        />
                        <Chip
                          icon={<Star sx={{ color: "#f59e0b !important" }} />}
                          label="Sem Anúncios"
                          sx={{
                            bgcolor: "rgba(245, 158, 11, 0.1)",
                            color: "#f59e0b",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box sx={{ bgcolor: "white", py: 12 }}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={8}>
              <Chip
                label="RECURSOS"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 800,
                  color: "#0f172a",
                  mb: 2,
                }}
              >
                Tudo que você precisa
              </Typography>
              <Typography
                variant="h6"
                color="#64748b"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Ferramentas profissionais para transformar sua relação com o
                dinheiro
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {[
                {
                  icon: (
                    <DashboardIcon sx={{ fontSize: 48, color: "#6366F1" }} />
                  ),
                  title: "Dashboard Inteligente",
                  description:
                    "Visualize suas finanças com gráficos modernos e insights automáticos em tempo real.",
                },
                {
                  icon: (
                    <TrendingUpIcon sx={{ fontSize: 48, color: "#8B5CF6" }} />
                  ),
                  title: "Lançamentos Instantâneos",
                  description:
                    "Adicione transações em segundos com categorização automática e inteligente.",
                },
                {
                  icon: (
                    <GamificationIcon sx={{ fontSize: 48, color: "#EC4899" }} />
                  ),
                  title: "Gamificação Viciante",
                  description:
                    "Ganhe XP, suba níveis, desbloqueie conquistas e compete com outros usuários.",
                },
                {
                  icon: (
                    <SecurityIcon sx={{ fontSize: 48, color: "#06B6D4" }} />
                  ),
                  title: "Segurança Bancária",
                  description:
                    "Seus dados protegidos com criptografia de nível militar e backup automático.",
                },
                {
                  icon: (
                    <AnalyticsIcon sx={{ fontSize: 48, color: "#8B5CF6" }} />
                  ),
                  title: "Metas Inteligentes",
                  description:
                    "Defina objetivos e acompanhe seu progresso com notificações inteligentes.",
                },
                {
                  icon: <ReportsIcon sx={{ fontSize: 48, color: "#10B981" }} />,
                  title: "Relatórios Avançados",
                  description:
                    "Analise detalhes de gastos, receitas e projeções futuras.",
                },
              ].map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Paper
                      sx={{
                        p: 4,
                        height: "100%",
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box mb={3}>{feature.icon}</Box>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        color="#0f1"
                        mb={2}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          background:
                            "linear-gradient(135deg, #8b5cf6, #ec4899)",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Gamification Section */}
        <Box sx={{ py: 12 }}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={8}>
              <Chip
                label="GAMIFICAÇÃO"
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.1)",
                  color: "#8b5cf6",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 800,
                  color: "#0f1",
                  mb: 2,
                }}
              >
                Economize{" "}
                <Box
                  component="span"
                  sx={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  jogando
                </Box>
              </Typography>
              <Typography
                variant="h6"
                color="#64748b"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                O único app de finanças que transforma economia em um jogo
                viciante
              </Typography>
            </Box>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Grid container spacing={3}>
                  {[
                    {
                      icon: "🏆",
                      title: "Sistema de XP",
                      desc: "Ganhe pontos por cada meta cumprida e transação registrada.",
                    },
                    {
                      icon: "🎯",
                      title: "Níveis e Títulos",
                      desc: "Evolua de Novato a Mestre das Finanças",
                    },
                    {
                      icon: "✨",
                      title: "Conquistas Raras",
                      desc: "Desbloqueie badges exclusivas e comemore suas vitórias",
                    },
                    {
                      icon: "📊",
                      title: "Ranking Semanal",
                      desc: "Compete com outros usuários e veja quem mais economiza",
                    },
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper
                        sx={{
                          p: 3,
                          textAlign: "center",
                          borderRadius: 3,
                          border: "1px solid #e2e8f0",
                          height: "100%",
                          transition: "all 0.3s",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 20px 40px rgba(139, 92, 246, 0.15)",
                          },
                        }}
                      >
                        <Typography
                          variant="h2"
                          sx={{ fontSize: "3rem", mb: 2 }}
                        >
                          {item.icon}
                        </Typography>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#0f1"
                          mb={1}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            background:
                              "linear-gradient(135deg, #8b5cf6, #ec4899)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                          }}
                        >
                          {item.desc}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="#0f172a"
                    mb={3}
                    textAlign="center"
                  >
                    Sistema de Níveis
                  </Typography>
                  <Stack spacing={3}>
                    {[
                      { level: "Novato", xp: "0 XP", color: "#9CA3AF" },
                      { level: "Poupador", xp: "1.000 XP", color: "#3B82F6" },
                      { level: "Investidor", xp: "5.000 XP", color: "#8B5CF6" },
                      { level: "Expert", xp: "7.500 XP", color: "#F59E0B" },
                      {
                        level: "Mestre das Finanças",
                        xp: "20.000 XP",
                        color: "#10B981",
                      },
                    ].map((level, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: level.color,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#0f172a"
                          >
                            {level.level}
                          </Typography>
                          <Typography variant="body2" color="#64748b">
                            {level.xp}
                          </Typography>
                        </Box>
                        {index === 4 && (
                          <Box
                            sx={{
                              padding: "4px 8px",
                              borderRadius: 1,
                              bgcolor: "#fbbf24",
                              color: "white",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            🏆
                          </Box>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Pricing Section */}
        <Box
          sx={{
            background:
              "linear-gradient(180deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%)",
            py: 12,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Decorations */}
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              right: "-5%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: "5%",
              left: "-5%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(192,192,192,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Box textAlign="center" mb={8}>
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                >
                  <Chip
                    label="PREÇOS"
                    icon={<Star sx={{ color: "#f59e0b !important" }} />}
                    sx={{
                      bgcolor: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                      fontWeight: 700,
                      mb: 3,
                      px: 2,
                      py: 3,
                      fontSize: "0.9rem",
                      border: "2px solid rgba(245, 158, 11, 0.2)",
                    }}
                  />
                </motion.div>

                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: "2.2rem", md: "3rem" },
                    fontWeight: 900,
                    background:
                      "linear-gradient(135deg, #0f172a 0%, #334155 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 2,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Comece grátis, evolua quando quiser
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: "#64748b",
                    maxWidth: 700,
                    mx: "auto",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  Sem cartão de crédito. Sem compromisso. Cancele quando quiser.
                </Typography>
              </Box>
            </motion.div>

            <Grid container spacing={4} justifyContent="center">
              {/* 🥉 BRONZE (Free) */}
              <Grid item xs={12} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      border: "2px solid #e2e8f0",
                      height: "100%",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#cd7f32",
                        boxShadow: "0 20px 60px rgba(205, 127, 50, 0.2)",
                      },
                    }}
                  >
                    {/* Espaçador invisível para alinhar com os badges dos outros cards */}
                    <Box sx={{ height: 20, mb: 2 }} />

                    <Box textAlign="center" mb={4}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #cd7f32, #b87333)",
                          mb: 3,
                          fontSize: "2.5rem",
                          boxShadow: "0 10px 30px rgba(205, 127, 50, 0.3)",
                        }}
                      >
                        🥉
                      </Box>

                      <Typography
                        variant="h4"
                        fontWeight={800}
                        color="white"
                        mb={1}
                      >
                        Bronze
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#94a3b8",
                          mb: 3,
                          fontSize: "0.95rem",
                        }}
                      >
                        Trial 30 dias gratuito
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h2"
                          fontWeight={900}
                          sx={{
                            background:
                              "linear-gradient(135deg, #cd7f32, #ffd700)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          R$ 0
                        </Typography>
                        <Typography
                          variant="body1"
                          color="#94a3b8"
                          fontWeight={500}
                        >
                          /trial grátis
                        </Typography>
                      </Box>

                      <Chip
                        label="🎮 Sistema de gamificação"
                        size="small"
                        sx={{
                          bgcolor: "rgba(16, 185, 129, 0.2)",
                          color: "#10b981",
                          fontWeight: 600,
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{ mb: 3, borderColor: "rgba(255,255,255,0.1)" }}
                    />

                    <Stack spacing={2.5} mb={4} sx={{ minHeight: 530 }}>
                      {[
                        "Trial 30 dias",
                        "Funcionalidades básicas",
                        "Orçamentos limitados",
                        "Sistema de gamificação",
                        "Dashboard simples",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <CheckCircle
                              sx={{
                                color: "#cd7f32",
                                fontSize: 22,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="white"
                              fontWeight={500}
                            >
                              {feature}
                            </Typography>
                          </Stack>
                        </motion.div>
                      ))}

                      {/* Espaçadores invisíveis para igualar altura */}
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Box
                          key={`spacer-${item}`}
                          sx={{ height: 36.5, visibility: "hidden" }}
                        />
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => handleOpenCheckout("bronze")}
                      sx={{
                        background: "linear-gradient(135deg, #cd7f32, #b87333)",
                        py: 1.8,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        borderRadius: 3,
                        textTransform: "none",
                        boxShadow: "0 10px 30px rgba(205, 127, 50, 0.4)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 40px rgba(205, 127, 50, 0.5)",
                          background:
                            "linear-gradient(135deg, #b87333, #cd7f32)",
                        },
                      }}
                    >
                      Começar Grátis 🚀
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>

              {/* 🥈 SILVER (R$ 9,90) */}
              <Grid item xs={12} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                >
                  <Paper
                    elevation={8}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      border: "3px solid #c0c0c0",
                      height: "100%",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                      boxShadow: "0 20px 60px rgba(192, 192, 192, 0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 30px 80px rgba(192, 192, 192, 0.4)",
                        borderColor: "#a8a9ad",
                      },
                    }}
                  >
                    {/* Badge Destaque */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #c0c0c0, #a8a9ad)",
                        color: "white",
                        px: 4,
                        py: 1.2,
                        borderRadius: 3,
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        boxShadow: "0 8px 20px rgba(192, 192, 192, 0.4)",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      ⭐ Melhor Custo-Benefício
                    </Box>

                    <Box textAlign="center" mb={4} mt={2}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 90,
                          height: 90,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #c0c0c0, #a8a9ad)",
                          mb: 3,
                          fontSize: "3rem",
                          boxShadow: "0 15px 40px rgba(192, 192, 192, 0.4)",
                          animation: "pulse 2s infinite",
                          "@keyframes pulse": {
                            "0%, 100%": { transform: "scale(1)" },
                            "50%": { transform: "scale(1.05)" },
                          },
                        }}
                      >
                        🥈
                      </Box>

                      <Typography
                        variant="h4"
                        fontWeight={800}
                        color="#0f172a"
                        mb={1}
                      >
                        Silver
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          mb: 3,
                          fontSize: "0.95rem",
                          fontWeight: 500,
                        }}
                      >
                        Recursos premium selecionados
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                          alignItems="baseline"
                        >
                          <Typography
                            variant="h2"
                            fontWeight={900}
                            sx={{
                              background:
                                "linear-gradient(135deg, #6c757d, #495057)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            R$ 9,90
                          </Typography>
                        </Stack>
                        <Typography
                          variant="body1"
                          color="#64748b"
                          fontWeight={500}
                        >
                          /mês
                        </Typography>
                      </Box>

                      <Chip
                        label="🎯 Ideal para começar"
                        size="small"
                        sx={{
                          bgcolor: "rgba(16, 185, 129, 0.15)",
                          color: "#059669",
                          fontWeight: 700,
                          border: "2px solid rgba(16, 185, 129, 0.3)",
                          px: 1,
                        }}
                      />
                    </Box>

                    <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

                    <Stack spacing={2.5} mb={4} sx={{ minHeight: 530 }}>
                      {[
                        "Insights avançados",
                        "Até 10 orçamentos",
                        "Exportação CSV",
                        "Conquistas especiais RPG",
                        "Níveis até 7",
                        "Dashboard avançado",
                        "Notificações personalizadas",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 + index * 0.05 }}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <CheckCircle
                              sx={{
                                color: "#c0c0c0",
                                fontSize: 22,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="#0f172a"
                              fontWeight={600}
                            >
                              {feature}
                            </Typography>
                          </Stack>
                        </motion.div>
                      ))}

                      {/* Espaçadores invisíveis para igualar altura */}
                      {[1, 2, 3].map((item) => (
                        <Box
                          key={`spacer-${item}`}
                          sx={{ height: 36.5, visibility: "hidden" }}
                        />
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => handleOpenCheckout("silver")}
                      sx={{
                        background: "linear-gradient(135deg, #c0c0c0, #a8a9ad)",
                        py: 1.8,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "white",
                        borderRadius: 3,
                        textTransform: "none",
                        boxShadow: "0 10px 30px rgba(192, 192, 192, 0.5)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 40px rgba(192, 192, 192, 0.6)",
                          background:
                            "linear-gradient(135deg, #a8a9ad, #c0c0c0)",
                        },
                      }}
                    >
                      Assinar Silver ⚡
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>

              {/* 🥇 GOLD (R$ 19,90) */}
              <Grid item xs={12} md={6} lg={4}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -8 }}
                >
                  <Paper
                    elevation={6}
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      border: "3px solid #ffd700",
                      height: "100%",
                      position: "relative",
                      background:
                        "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
                      boxShadow: "0 20px 60px rgba(255, 215, 0, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 30px 80px rgba(255, 215, 0, 0.45)",
                        borderColor: "#d4af37",
                      },
                    }}
                  >
                    {/* Badge Popular */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: -16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "linear-gradient(135deg, #ffd700, #d4af37)",
                        color: "#0f172a",
                        px: 4,
                        py: 1.2,
                        borderRadius: 3,
                        fontSize: "0.85rem",
                        fontWeight: 800,
                        boxShadow: "0 8px 25px rgba(255, 215, 0, 0.5)",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                      }}
                    >
                      🏆 Mais Popular
                    </Box>

                    <Box textAlign="center" mb={4} mt={2}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 90,
                          height: 90,
                          borderRadius: "50%",
                          background:
                            "linear-gradient(135deg, #ffd700, #d4af37)",
                          mb: 3,
                          fontSize: "3rem",
                          boxShadow: "0 15px 45px rgba(255, 215, 0, 0.5)",
                          animation: "shine 2s infinite",
                          "@keyframes shine": {
                            "0%, 100%": {
                              boxShadow: "0 15px 45px rgba(255, 215, 0, 0.5)",
                              transform: "scale(1)",
                            },
                            "50%": {
                              boxShadow: "0 20px 60px rgba(255, 215, 0, 0.7)",
                              transform: "scale(1.05)",
                            },
                          },
                        }}
                      >
                        🥇
                      </Box>

                      <Typography
                        variant="h4"
                        fontWeight={800}
                        color="#0f172a"
                        mb={1}
                      >
                        Gold
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: "#78716c",
                          mb: 3,
                          fontSize: "0.95rem",
                          fontWeight: 500,
                        }}
                      >
                        Acesso completo a tudo
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h2"
                          fontWeight={900}
                          sx={{
                            background:
                              "linear-gradient(135deg, #d4af37, #ffd700)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            letterSpacing: "-0.02em",
                          }}
                        >
                          R$ 19,90
                        </Typography>
                        <Typography
                          variant="body1"
                          color="#78716c"
                          fontWeight={500}
                        >
                          /mês
                        </Typography>
                      </Box>

                      <Chip
                        label="⚔️ Avatares e itens exclusivos"
                        size="small"
                        sx={{
                          bgcolor: "rgba(245, 158, 11, 0.2)",
                          color: "#d97706",
                          fontWeight: 700,
                          border: "2px solid rgba(245, 158, 11, 0.4)",
                          px: 1,
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{ mb: 3, borderColor: "rgba(212, 175, 55, 0.3)" }}
                    />

                    <Stack spacing={2.5} mb={4} sx={{ minHeight: 530 }}>
                      {[
                        "Tudo do Silver +",
                        "Orçamentos ilimitados",
                        "Exportações Excel/PDF",
                        "Todos os 10 níveis RPG",
                        "Avatares exclusivos",
                        "Itens raros RPG",
                        "Ranking global",
                        "Suporte prioritário",
                        "Sem anúncios",
                        "API de integração",
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <CheckCircle
                              sx={{
                                color: "#ffd700",
                                fontSize: 22,
                                flexShrink: 0,
                                filter:
                                  "drop-shadow(0 2px 4px rgba(255,215,0,0.3))",
                              }}
                            />
                            <Typography
                              variant="body2"
                              color="#0f172a"
                              fontWeight={600}
                            >
                              {feature}
                            </Typography>
                          </Stack>
                        </motion.div>
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={() => handleOpenCheckout("gold")}
                      sx={{
                        background: "linear-gradient(135deg, #ffd700, #d4af37)",
                        py: 1.8,
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        borderRadius: 3,
                        textTransform: "none",
                        boxShadow: "0 10px 35px rgba(255, 215, 0, 0.5)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 45px rgba(255, 215, 0, 0.65)",
                          background:
                            "linear-gradient(135deg, #d4af37, #ffd700)",
                        },
                      }}
                    >
                      Assinar Gold 👑
                    </Button>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="center"
                spacing={{ xs: 2, md: 4 }}
                mt={6}
                sx={{
                  bgcolor: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                    }}
                  >
                    <CheckCircle sx={{ color: "#10b981", fontSize: 24 }} />
                  </Box>
                  <Typography variant="body2" color="#0f172a" fontWeight={600}>
                    7 dias de garantia
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                    }}
                  >
                    <CheckCircle sx={{ color: "#10b981", fontSize: 24 }} />
                  </Box>
                  <Typography variant="body2" color="#0f172a" fontWeight={600}>
                    Cancele quando quiser
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Box
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.1)",
                      borderRadius: "50%",
                      p: 1,
                      display: "flex",
                    }}
                  >
                    <CheckCircle sx={{ color: "#10b981", fontSize: 24 }} />
                  </Box>
                  <Typography variant="body2" color="#0f172a" fontWeight={600}>
                    Suporte dedicado
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>
          </Container>
        </Box>

        {/* Testimonials */}
        <Box sx={{ py: 12 }}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={8}>
              <Chip
                label="DEPOIMENTOS"
                sx={{
                  bgcolor: "rgba(236, 72, 153, 0.1)",
                  color: "#ec4899",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 800,
                  color: "#0f1",
                  mb: 2,
                }}
              >
                O que nossos usuários dizem
              </Typography>
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={1}
                mb={2}
              >
                <Rating value={5} readOnly size="large" />
                <Typography
                  variant="h6"
                  sx={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  4.9/5 de 5.000+ avaliações
                </Typography>
              </Stack>
            </Box>

            <Grid container spacing={4}>
              {[
                {
                  name: "Marina Santos",
                  role: "Designer",
                  comment:
                    "A gamificação é incrível! Em 2 meses economizei R$ 3.600 sem sentir",
                  avatar: "M",
                },
                {
                  name: "Lucas Souza",
                  role: "Desenvolvedor",
                  comment:
                    "Melhor app de finanças que já usei. O sistema de conquistas me motiva a economizar todo dia!",
                  avatar: "P",
                },
                {
                  name: "Bruno Souza",
                  role: "Estudante",
                  comment:
                    "Sai de R$ 2.500 negativos para R$ 1.500 positivos em 3 meses. Mudou minha vida!",
                  avatar: "J",
                },
              ].map((testimonial, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Paper
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 3,
                      border: "1px solid #e2e8f0",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <Stack spacing={3}>
                      <Rating value={5} readOnly size="small" />

                      <Typography
                        variant="body1"
                        color="white"
                        fontStyle="italic"
                        lineHeight={1.7}
                      >
                        {`"${testimonial.comment}"`}
                      </Typography>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: "#6366f1",
                            color: "white",
                            fontWeight: 700,
                            fontSize: "1.2rem",
                          }}
                        >
                          {testimonial.avatar}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="#0f1"
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="white">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #6366f1, #ec4899)",
            py: 12,
            color: "white",
          }}
        >
          <Container maxWidth="lg">
            <Box textAlign="center">
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 800,
                  mb: 2,
                }}
              >
                Pronto para economizar jogando?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.95,
                  maxWidth: 600,
                  mx: "auto",
                  lineHeight: 1.6,
                }}
              >
                Junte-se a mais de 50.000 usuários que já transformaram suas
                finanças
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  bgcolor: "white",
                  color: "#6366f1",
                  px: 6,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  boxShadow: "0 8px 25px rgba(255,255,255,0.3)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(255,255,255,0.4)",
                  },
                  transition: "all 0.3s",
                }}
              >
                ⭐ Começar Grátis Agora
              </Button>
              <Typography
                variant="body2"
                sx={{
                  mt: 2,
                  opacity: 0.8,
                  color: "black",
                }}
              >
                Sem cartão • Sem compromisso • Cancele quando quiser
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Comparison Section */}
        <Box sx={{ py: 8, bgcolor: "#f8fafc" }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Box textAlign="center" mb={8}>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  color="#0f172a"
                  mb={3}
                >
                  Por que escolher o DespFinance?
                </Typography>
                <Typography
                  variant="h6"
                  color="#64748b"
                  maxWidth="800px"
                  mx="auto"
                >
                  Compare e veja como somos diferentes dos outros apps de
                  finanças
                </Typography>
              </Box>

              <Box sx={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "800px",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: "left",
                          padding: "16px",
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Características
                        </Typography>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          borderBottom: "2px solid #e2e8f0",
                          background: "rgba(99, 102, 241, 0.1)",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              background:
                                "linear-gradient(135deg, #6366f1, #8b5cf6)",
                              borderRadius: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                            }}
                          >
                            F
                          </Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            color="#6366f1"
                          >
                            DespFinance
                          </Typography>
                        </Box>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#64748b"
                        >
                          App X
                        </Typography>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#64748b"
                        >
                          App Y
                        </Typography>
                      </th>
                      <th
                        style={{
                          textAlign: "center",
                          padding: "16px",
                          borderBottom: "2px solid #e2e8f0",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          color="#64748b"
                        >
                          App Z
                        </Typography>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        feature: "Gamificação Completa",
                        despfinance: true,
                        others: [false, false, false],
                      },
                      {
                        feature: "Sistema RPG",
                        despfinance: true,
                        others: [false, false, false],
                      },
                      {
                        feature: "Controle de Gastos",
                        despfinance: true,
                        others: [true, true, true],
                      },
                      {
                        feature: "Metas Inteligentes",
                        despfinance: true,
                        others: [true, false, true],
                      },
                      {
                        feature: "Relatórios Premium",
                        despfinance: true,
                        others: [false, true, false],
                      },
                      {
                        feature: "Suporte 24/7",
                        despfinance: true,
                        others: [false, false, true],
                      },
                      {
                        feature: "Interface Moderna",
                        despfinance: true,
                        others: [false, true, false],
                      },
                      {
                        feature: "Gratuito para Começar",
                        despfinance: true,
                        others: [false, false, true],
                      },
                    ].map((row, index) => (
                      <tr
                        key={index}
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                      >
                        <td style={{ padding: "16px" }}>
                          <Typography variant="body1" fontWeight={600}>
                            {row.feature}
                          </Typography>
                        </td>
                        <td
                          style={{
                            padding: "16px",
                            textAlign: "center",
                            background: row.despfinance
                              ? "rgba(16, 185, 129, 0.1)"
                              : "rgba(239, 68, 68, 0.1)",
                          }}
                        >
                          {row.despfinance ? (
                            <CheckCircle
                              sx={{ color: "#10b981", fontSize: 24 }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: "50%",
                                bgcolor: "#ef4444",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1rem",
                                fontWeight: 700,
                                mx: "auto",
                              }}
                            >
                              ✕
                            </Box>
                          )}
                        </td>
                        {row.others.map((has, idx) => (
                          <td
                            key={idx}
                            style={{ padding: "16px", textAlign: "center" }}
                          >
                            {has ? (
                              <CheckCircle
                                sx={{ color: "#10b981", fontSize: 24 }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  bgcolor: "#ef4444",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "1rem",
                                  fontWeight: 700,
                                  mx: "auto",
                                }}
                              >
                                ✕
                              </Box>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>

              <Box textAlign="center" mt={6}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/register")}
                    sx={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      px: 6,
                      py: 3,
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      borderRadius: 3,
                      boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 15px 40px rgba(99, 102, 241, 0.4)",
                      },
                    }}
                  >
                    Experimente Grátis Agora
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* FAQ Section */}
        <Box sx={{ bgcolor: "#f8fafc", py: 12 }}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={8}>
              <Chip
                label="PERGUNTAS FREQUENTES"
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  color: "#6366f1",
                  fontWeight: 700,
                  mb: 2,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 800,
                  color: "#0f172a",
                  mb: 2,
                }}
              >
                Dúvidas? Nós respondemos!
              </Typography>
              <Typography
                variant="h6"
                color="#64748b"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                As perguntas mais comuns sobre o DespFinance
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {[
                    {
                      question: "O DespFinance é realmente gratuito?",
                      answer:
                        "Sim! Nosso plano gratuito inclui até 50 transações por mês, gráficos básicos e níveis até 3. Você pode usar para sempre sem pagar nada.",
                    },
                    {
                      question: "Como funciona a gamificação?",
                      answer:
                        "Você ganha XP a cada transação registrada, meta cumprida ou insight aplicado. Suba de nível, desbloqueie conquistas e compete no ranking semanal!",
                    },
                    {
                      question: "Meus dados estão seguros?",
                      answer:
                        "Absolutamente! Usamos criptografia de ponta, autenticação de dois fatores e nunca armazenamos dados bancários sensíveis. Sua privacidade é nossa prioridade.",
                    },
                    {
                      question:
                        "Posso cancelar o plano Premium a qualquer momento?",
                      answer:
                        "Claro! Não há fidelidade. Cancele quando quiser pelo próprio app. Você mantém acesso aos recursos Premium até o fim do período pago.",
                    },
                  ].map((faq, index) => (
                    <Accordion
                      key={index}
                      expanded={expandedFaq === index}
                      onChange={() =>
                        setExpandedFaq(expandedFaq === index ? false : index)
                      }
                      sx={{
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        boxShadow: "none",
                        "&:before": { display: "none" },
                        mb: 1,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: "#6366f1" }} />}
                        sx={{
                          px: 3,
                          py: 2,
                          "& .MuiAccordionSummary-content": {
                            alignItems: "center",
                          },
                        }}
                      >
                        <QuestionAnswer sx={{ mr: 2, color: "#6366f1" }} />
                        <Typography variant="h6" fontWeight={600} color="white">
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pb: 3 }}>
                        <Typography
                          variant="body1"
                          color="#64748b"
                          lineHeight={1.7}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  {[
                    {
                      question: "Como funciona o sistema RPG?",
                      answer:
                        "Cada ação nas suas finanças te dá XP. Cadastrar transação (+10 XP), cumprir meta (+50 XP), insights aplicados (+25 XP). Evolua de Novato para Mestre das Finanças!",
                    },
                    {
                      question: "Posso importar dados de outros apps?",
                      answer:
                        "Em breve! Estamos desenvolvendo integração com os principais bancos e apps de finanças. Por enquanto, você pode importar via CSV ou digitar manualmente.",
                    },
                    {
                      question: "Há versão mobile?",
                      answer:
                        "O DespFinance é 100% responsivo e funciona perfeitamente no celular. Uma versão mobile nativa está em desenvolvimento para 2026!",
                    },
                    {
                      question: "Como funciona o suporte?",
                      answer:
                        "Usuários gratuitos têm suporte via email. Premium tem suporte prioritário com resposta em até 2 horas e chat direto no app.",
                    },
                  ].map((faq, index) => (
                    <Accordion
                      key={index + 4}
                      expanded={expandedFaq === index + 4}
                      onChange={() =>
                        setExpandedFaq(
                          expandedFaq === index + 4 ? false : index + 4
                        )
                      }
                      sx={{
                        borderRadius: 3,
                        border: "1px solid #e2e8f0",
                        boxShadow: "none",
                        "&:before": { display: "none" },
                        mb: 1,
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore sx={{ color: "#6366f1" }} />}
                        sx={{
                          px: 3,
                          py: 2,
                          "& .MuiAccordionSummary-content": {
                            alignItems: "center",
                          },
                        }}
                      >
                        <Lightbulb sx={{ mr: 2, color: "#6366f1" }} />
                        <Typography variant="h6" fontWeight={600} color="white">
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ px: 3, pb: 3 }}>
                        <Typography
                          variant="body1"
                          color="#64748b"
                          lineHeight={1.7}
                        >
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              </Grid>
            </Grid>

            <Box textAlign="center" mt={8}>
              <Paper
                sx={{
                  p: 6,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  maxWidth: 600,
                  mx: "auto",
                }}
              >
                <Typography variant="h4" fontWeight={700} mb={2}>
                  Ainda tem dúvidas?
                </Typography>
                <Typography variant="body1" mb={4} opacity={0.9}>
                  Nossa equipe está aqui para ajudar! Entre em contato conosco.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    fontWeight: 700,
                    "&:hover": {
                      bgcolor: "#f8fafc",
                      transform: "translateY(-2px)",
                    },
                  }}
                  onClick={() => window.open("mailto:contato@despfinance.app")}
                >
                  Falar Conosco
                </Button>
              </Paper>
            </Box>
          </Container>
        </Box>

        {/* Newsletter Section */}
        <Box sx={{ py: 12, bgcolor: "white" }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Email sx={{ color: "white", fontSize: 24 }} />
                    </Box>
                    <Typography variant="h4" fontWeight={800} color="#0f172a">
                      Fique por dentro!
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    color="black"
                    mb={4}
                    lineHeight={1.7}
                  >
                    Receba dicas exclusivas de educação financeira, novidades do
                    app e insights personalizados direto no seu email.
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      📊 +15.000 pessoas já se inscreveram!
                    </Box>
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    {[
                      { icon: "🎯", text: "Dicas semanais" },
                      { icon: "🚀", text: "Novidades em primeira mão" },
                      { icon: "💡", text: "Insights exclusivos" },
                    ].map((benefit, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography variant="body2">{benefit.icon}</Typography>
                        <Typography
                          variant="body2"
                          color="black"
                          fontWeight={500}
                        >
                          {benefit.text}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Paper
                    sx={{
                      p: 6,
                      borderRadius: 4,
                      border: "1px solid #e2e8f0",
                      background: "linear-gradient(135deg, #f8fafc, #ffffff)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="#0f172a"
                      mb={3}
                      textAlign="center"
                    >
                      Newsletter DespFinance 💌
                    </Typography>

                    <Stack spacing={3}>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="Seu melhor email aqui..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email sx={{ color: "white" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: "#0f172a",
                          },
                        }}
                      />

                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        onClick={() => {
                          if (newsletterEmail) {
                            setSnackbarMessage(
                              "🎉 Inscrição realizada com sucesso!"
                            );
                            setShowSnackbar(true);
                            setNewsletterEmail("");
                          }
                        }}
                        sx={{
                          background:
                            "linear-gradient(135deg, #6366f1, #8b5cf6)",
                          py: 2,
                          borderRadius: 3,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 35px rgba(99, 102, 241, 0.4)",
                          },
                        }}
                      >
                        🚀 Quero me inscrever!
                      </Button>
                    </Stack>

                    <Typography
                      variant="caption"
                      color="black"
                      textAlign="center"
                      display="block"
                      mt={2}
                    >
                      📩 Sem spam. Apenas conteúdo valioso. Cancele quando
                      quiser.
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            bgcolor: "#0f172a",
            color: "white",
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6}>
              <Grid item xs={12} md={4}>
                <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    F
                  </Box>
                  <Typography variant="h6" color="white" fontWeight={700}>
                    DespFinance
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="#94a3b8"
                  mb={3}
                  lineHeight={1.7}
                >
                  Gamificação + Finanças Pessoais + Sistema Intuitivo + Suporte
                  qualificado
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="h6" color="white" fontWeight={700} mb={3}>
                  Produto
                </Typography>
                <Stack spacing={2}>
                  {[
                    "Recursos",
                    "Gamificação",
                    "Preços",
                    "Central de Ajuda",
                  ].map((link, index) => (
                    <Typography
                      key={index}
                      variant="body2"
                      color="#94a3b8"
                      sx={{
                        cursor: "pointer",
                        "&:hover": { color: "#6366f1" },
                        transition: "color 0.3s",
                      }}
                    >
                      {link}
                    </Typography>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="h6" color="white" fontWeight={700} mb={3}>
                  Legal
                </Typography>
                <Stack spacing={2}>
                  {["Termos de Uso", "Privacidade", "Cancelamento"].map(
                    (link, index) => (
                      <Typography
                        key={index}
                        variant="body2"
                        color="#94a3b8"
                        sx={{
                          cursor: "pointer",
                          "&:hover": { color: "#6366f1" },
                          transition: "color 0.3s",
                        }}
                      >
                        {link}
                      </Typography>
                    )
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="h6" color="white" fontWeight={700} mb={3}>
                  Contato
                </Typography>
                <Stack spacing={2}>
                  <Typography variant="body2" color="#94a3b8">
                    contato@despfinance.app
                  </Typography>
                  <Typography variant="body2" color="#94a3b8">
                    WhatsApp: (11) 99999-9999
                  </Typography>
                </Stack>
              </Grid>
            </Grid>

            <Box
              sx={{
                borderTop: "1px solid #334155",
                mt: 6,
                pt: 6,
                textAlign: "center",
              }}
            >
              <Typography variant="body2" color="#94a3b8">
                © 2025 DespFinance. Todos os direitos reservados.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Snackbar para feedback */}
        <Snackbar
          open={showSnackbar}
          autoHideDuration={4000}
          onClose={() => setShowSnackbar(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity="success"
            variant="filled"
            sx={{
              borderRadius: 3,
              fontWeight: 600,
            }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Modal de Checkout MercadoPago */}
        <MercadoPagoCheckout
          open={checkoutOpen}
          onClose={handleCloseCheckout}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      </Box>
    </>
  );
};

export default NewLanding;
