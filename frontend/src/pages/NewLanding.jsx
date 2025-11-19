/**
 * @fileoverview Landing Page - DespFinancee - Mobile Optimized
 */
/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Card,
  CardContent,
  Divider,
  Tooltip,
  Zoom,
  Fade,
  Slide,
  Grow,
  Backdrop,
  CircularProgress,
  Collapse,
  IconButton,
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
  PlayCircle,
  Star,
  Speed,
  Shield,
  CloudSync,
  PhoneAndroid,
  TrendingDown,
  Savings,
  AttachMoney,
  CreditCard,
  AutoGraph,
  Menu as MenuIcon,
  Close as CloseIcon,
  ExpandMore,
  Email,
  QuestionAnswer,
  Lightbulb,
  Rocket,
  Psychology,
  EmojiEvents,
  AutoAwesome,
  Verified,
  KeyboardArrowDown,
  TrendingUp as AnimatedTrending,
  AutoAwesome as MagicIcon,
  FlashOn,
  Visibility,
} from "@mui/icons-material";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Usado no cursor customizado e efeitos magnéticos
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showLoader, setShowLoader] = useState(false);
  const [particles, setParticles] = useState([]);
  const [currentBg, setCurrentBg] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  // Usado para controlar a exibição das partículas
  const [showParticles, setShowParticles] = useState(false);
  const [magneticButtons, setMagneticButtons] = useState(new Set());
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  // eslint-disable-next-line no-unused-vars
  const y2 = useTransform(scrollY, [0, 300], [0, 50]);
  // eslint-disable-next-line no-unused-vars
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]); // Efeito de digitação
  const fullText = "Transforme suas finanças em um jogo divertido!";
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
  }, []);

  // Efeito de elementos flutuantes
  useEffect(() => {
    const timer = setTimeout(() => setShowFloatingElements(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Tracking do mouse para parallax
  useEffect(() => {
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
  }, [magneticButtons, setMousePosition]);

  // Sistema de Partículas Otimizado
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 15; i++) {
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

    setTimeout(generateParticles, 500);
  }, [setParticles, setShowParticles]);

  // Background Morphing Otimizado
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % 3);
    }, 8000);
    return () => clearInterval(interval);
  }, [setCurrentBg]);

  // Typing Animation Complete
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTypingComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [setIsTypingComplete]);

  return (
    <>
      {/* Loader Cinematográfico - Temporariamente desabilitado */}
      {
        <AnimatePresence>
          {showLoader && (
            <Backdrop
              open={showLoader}
              sx={{
                zIndex: 10000,
                background: "linear-gradient(45deg, #0f0f23, #1a1a2e, #16213e)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                  }}
                >
                  Preparando uma experiência incrível...
                </Typography>
              </motion.div>

              <motion.div
                animate={{
                  width: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  height: 4,
                  background:
                    "linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899)",
                  borderRadius: 2,
                  maxWidth: 200,
                }}
              />
            </Backdrop>
          )}
        </AnimatePresence>
      }

      {/* Cursor Personalizado */}
      <motion.div
        ref={cursorRef}
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
      />

      {/* Sistema de Partículas */}
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
      <motion.div
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
      />

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
                    color: "#64748b",
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
                    color: "#64748b",
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
                    color: "#64748b",
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
                    color: "#64748b",
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
                    color: "#64748b",
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
                  color: "white",
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
            pt: { xs: 6, sm: 8, md: 12 },
            pb: { xs: 4, sm: 6, md: 8 },
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: "auto", md: "60vh" },
          }}
        >
          {/* Elementos flutuantes de fundo */}
          <AnimatePresence>
            {showFloatingElements && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 0.1,
                    scale: 1,
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                  }}
                  style={{
                    position: "absolute",
                    top: "10%",
                    right: "10%",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    zIndex: 0,
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 0.1,
                    scale: 1,
                    x: [0, 30, 0],
                    rotate: [0, -180, -360],
                  }}
                  style={{
                    position: "absolute",
                    bottom: "20%",
                    left: "5%",
                    width: 80,
                    height: 80,
                    borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                    background: "linear-gradient(135deg, #ec4899, #f59e0b)",
                    zIndex: 0,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
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
                        color: "#0f1",
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
                            content: '""',
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
                          color: "#64748b",
                          mb: { xs: 3, sm: 3.5, md: 4 },
                          fontSize: {
                            xs: "0.875rem",
                            sm: "1rem",
                            md: "1.1rem",
                          },
                          lineHeight: { xs: 1.6, md: 1.6 },
                          minHeight: { xs: "auto", md: "2em" },
                          textAlign: { xs: "center", lg: "left" },
                          px: { xs: 1, sm: 0 },
                          maxWidth: { xs: "100%", lg: "90%" },
                        }}
                      >
                        {typedText}
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
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#64748b",
                          mb: 4,
                          fontSize: "1rem",
                          lineHeight: 1.6,
                        }}
                      >
                        O primeiro app de finanças pessoais com{" "}
                        <Box
                          component="span"
                          sx={{ fontWeight: 700, color: "#6366f1" }}
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
                              "linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)",
                            px: { xs: 3, sm: 4, md: 6 },
                            py: { xs: 2, sm: 2.5, md: 3 },
                            fontSize: {
                              xs: "0.95rem",
                              sm: "1.1rem",
                              md: "1.2rem",
                            },
                            fontWeight: 700,
                            width: { xs: "100%", sm: "auto" },
                            minWidth: { xs: "auto", sm: "200px" },
                            maxWidth: { xs: "100%", sm: "300px" },
                            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
                            borderRadius: { xs: 2, sm: 3 },
                            position: "relative",
                            overflow: "hidden",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            textTransform: "none",
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
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              top: -2,
                              left: -2,
                              right: -2,
                              bottom: -2,
                              background:
                                "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #f59e0b)",
                              borderRadius: "inherit",
                              zIndex: -1,
                              filter: "blur(10px)",
                              opacity: 0,
                              transition: "opacity 0.3s",
                            },
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 25px 50px rgba(99, 102, 241, 0.5)",
                              "&::before": {
                                left: "100%",
                              },
                              "&::after": {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          🚀 Criar Conta Mágica
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
                            borderColor: "#6366f1",
                            color: "#6366f1",
                            px: { xs: 2, sm: 3, md: 5 },
                            py: { xs: 2, sm: 2.5, md: 3 },
                            fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                              md: "1.1rem",
                            },
                            fontWeight: 600,
                            borderRadius: { xs: 2, sm: 3 },
                            borderWidth: 2,
                            background: "rgba(99, 102, 241, 0.05)",
                            backdropFilter: "blur(10px)",
                            width: { xs: "100%", sm: "auto" },
                            minWidth: { xs: "auto", sm: "180px" },
                            maxWidth: { xs: "100%", sm: "250px" },
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
                                "linear-gradient(45deg, transparent 30%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)",
                              transform: "translateX(-100%)",
                              transition: "transform 0.6s",
                            },
                            "&:hover": {
                              borderColor: "#8b5cf6",
                              color: "#8b5cf6",
                              bgcolor: "rgba(139, 92, 246, 0.1)",
                              boxShadow: "0 10px 25px rgba(139, 92, 246, 0.2)",
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
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mt: { xs: 4, lg: 0 },
                      px: { xs: 1, sm: 0 },
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: 4,
                        background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                        border: "1px solid #e2e8f0",
                        position: "relative",
                      }}
                    >
                      <Grid container spacing={3} mb={3}>
                        <Grid item xs={6}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #6366f1, #8b5cf6)",
                              color: "white",
                            }}
                          >
                            <Typography variant="h4" fontWeight={700}>
                              50.000+
                            </Typography>
                            <Typography variant="body2">
                              Usuários Ativos
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              bgcolor: "white",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="#10b981"
                            >
                              R$ 25M+
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                              Economizados
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              bgcolor: "white",
                              border: "1px solid #e2e8f0",
                            }}
                          >
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="#f59e0b"
                            >
                              4.9/5
                            </Typography>
                            <Typography variant="body2" color="#64748b">
                              Avaliação
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid item xs={6}>
                          <Paper
                            sx={{
                              p: 2,
                              textAlign: "center",
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, #ec4899, #be185d)",
                              color: "white",
                            }}
                          >
                            <Typography variant="h4" fontWeight={700}>
                              98%
                            </Typography>
                            <Typography variant="body2">Satisfação</Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    </Paper>
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
                        color="#0f172a"
                        mb={2}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="#64748b"
                        lineHeight={1.7}
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
                          color="#0f172a"
                          mb={1}
                        >
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="#64748b">
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
        <Box sx={{ bgcolor: "white", py: 12 }}>
          <Container maxWidth="lg">
            <Box textAlign="center" mb={8}>
              <Chip
                label="PREÇOS"
                sx={{
                  bgcolor: "rgba(245, 158, 11, 0.1)",
                  color: "#f59e0b",
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
                Comece grátis, evolua quando quiser
              </Typography>
              <Typography
                variant="h6"
                color="#64748b"
                sx={{ maxWidth: 600, mx: "auto" }}
              >
                Sem cartão de crédito. Sem compromisso. Cancele quando quiser.
              </Typography>
            </Box>

            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: "1px solid #e2e8f0",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Box textAlign="center" mb={4}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="#0f172a"
                      mb={1}
                    >
                      Free
                    </Typography>
                    <Typography variant="body2" color="#64748b" mb={3}>
                      Acesso para começar
                    </Typography>
                    <Typography variant="h2" fontWeight={800} color="#6366f1">
                      R$ 0
                      <Typography component="span" variant="h6" color="#64748b">
                        /sempre grátis
                      </Typography>
                    </Typography>
                  </Box>

                  <Stack spacing={2} mb={4}>
                    {[
                      "Até 50 transações/mês",
                      "1 meta ativa",
                      "Gráficos básicos",
                      "Níveis até 3",
                      "Dashboard simples",
                    ].map((feature, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                        <Typography variant="body2" color="#64748b">
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/register")}
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                      py: 1.5,
                      "&:hover": {
                        borderColor: "#6366f1",
                        color: "#6366f1",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      },
                    }}
                  >
                    Começar Grátis
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 4,
                    border: "2px solid #8b5cf6",
                    height: "100%",
                    position: "relative",
                    background: "linear-gradient(135deg, #faf5ff, #f3e8ff)",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "#8b5cf6",
                      color: "white",
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      fontSize: "0.875rem",
                      fontWeight: 700,
                    }}
                  >
                    Mais Popular
                  </Box>

                  <Box textAlign="center" mb={4}>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color="#0f172a"
                      mb={1}
                    >
                      Premium
                    </Typography>
                    <Typography variant="body2" color="#64748b" mb={3}>
                      Para quem quer o máximo
                    </Typography>
                    <Typography variant="h2" fontWeight={800} color="#8b5cf6">
                      R$ 19,90
                      <Typography component="span" variant="h6" color="#64748b">
                        /mês
                      </Typography>
                    </Typography>
                    <Typography
                      variant="body2"
                      color="#10b981"
                      fontWeight={600}
                    >
                      💰 Economize 38% no plano anual
                    </Typography>
                  </Box>

                  <Stack spacing={2} mb={4}>
                    {[
                      "Transações ilimitadas",
                      "Metas ilimitadas",
                      "XP avançado (2x)",
                      "Todos os 10 níveis",
                      "Conquistas raras",
                      "Ranking semanal",
                      "Relatórios PDF",
                      "Suporte prioritário",
                      "Avatar premium",
                      "Sem anúncios",
                    ].map((feature, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <CheckCircle sx={{ color: "#8b5cf6", fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          color="#0f172a"
                          fontWeight={500}
                        >
                          {feature}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => navigate("/register?plan=premium")}
                    sx={{
                      background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 35px rgba(139, 92, 246, 0.4)",
                      },
                    }}
                  >
                    Assinar Premium
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <Stack direction="row" justifyContent="center" spacing={3} mt={4}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                <Typography variant="body2" color="#64748b">
                  7 dias de garantia
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                <Typography variant="body2" color="#64748b">
                  Cancele quando quiser
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle sx={{ color: "#10b981", fontSize: 20 }} />
                <Typography variant="body2" color="#64748b">
                  Suporte dedicado
                </Typography>
              </Stack>
            </Stack>
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
                  color: "#0f172a",
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
                <Typography variant="h6" fontWeight={700} color="#0f172a">
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
                  name: "Pedro Oliveira",
                  role: "Desenvolvedor",
                  comment:
                    "Melhor app de finanças que já usei. O sistema de conquistas me motiva a economizar todo dia!",
                  avatar: "P",
                },
                {
                  name: "Julia Costa",
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
                        color="#0f172a"
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
                            color="#0f172a"
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="#64748b">
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
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#0f172a"
                        >
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
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          color="#0f172a"
                        >
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
                    color: "#6366f1",
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
                    color="#64748b"
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
                          color="#64748b"
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
                              <Email sx={{ color: "#6366f1" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                            bgcolor: "white",
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
                      color="#64748b"
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
                  <Typography variant="h6" fontWeight={700}>
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
                <Typography variant="h6" fontWeight={700} mb={3}>
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
                <Typography variant="h6" fontWeight={700} mb={3}>
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
                <Typography variant="h6" fontWeight={700} mb={3}>
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
      </Box>
    </>
  );
};

export default Landing;
