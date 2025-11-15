/**
 * @fileoverview Landing Page - DespFinancee
 */

import React from "react";
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
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #e2e8f0",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            py={2}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
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
              <Typography variant="h6" fontWeight={700} color="#1e293b">
                DespFinance
              </Typography>
            </Stack>

            <Stack direction="row" spacing={3} alignItems="center">
              <Typography
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#1e293b" },
                }}
              >
                Recursos
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#1e293b" },
                }}
              >
                Gamificação
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#1e293b" },
                }}
              >
                Preços
              </Typography>
              <Typography
                sx={{
                  color: "#64748b",
                  cursor: "pointer",
                  "&:hover": { color: "#1e293b" },
                }}
              >
                Depoimentos
              </Typography>
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
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
                sx={{
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
                  },
                }}
              >
                Começar Grátis
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Announcement Bar */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #10b981, #059669)",
          py: 1.5,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="center">
            <Chip
              label="🚀 +50.000 usuários economizando jogando"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "white",
                fontWeight: 600,
              }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ pt: 12, pb: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: "2.5rem", md: "3.5rem" },
                    fontWeight: 800,
                    color: "#0f172a",
                    lineHeight: 1.1,
                    mb: 2,
                  }}
                >
                  Controle financeiro{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(135deg, #6366f1, #ec4899)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    que te faz economizar
                  </Box>{" "}
                  <Box
                    component="span"
                    sx={{
                      background: "linear-gradient(135deg, #f59e0b, #f97316)",
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
                  sx={{
                    color: "#64748b",
                    mb: 4,
                    fontSize: "1.1rem",
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
                  . Ganhe XP, suba níveis, desbloqueie conquistas e economize
                  mais do que nunca.
                </Typography>

                <Stack direction="row" spacing={2} mb={4}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/register")}
                    sx={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      px: 4,
                      py: 2,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      boxShadow: "0 8px 25px rgba(99, 102, 241, 0.3)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 12px 35px rgba(99, 102, 241, 0.4)",
                      },
                      transition: "all 0.3s",
                    }}
                  >
                    📱 Criar Conta Grátis
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "#e2e8f0",
                      color: "#64748b",
                      px: 4,
                      py: 2,
                      fontSize: "1.1rem",
                      "&:hover": {
                        borderColor: "#6366f1",
                        color: "#6366f1",
                        bgcolor: "rgba(99, 102, 241, 0.04)",
                      },
                    }}
                  >
                    Ver Planos
                  </Button>
                </Stack>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ position: "relative" }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
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
                icon: <DashboardIcon sx={{ fontSize: 48, color: "#6366F1" }} />,
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
                icon: <SecurityIcon sx={{ fontSize: 48, color: "#06B6D4" }} />,
                title: "Segurança Bancária",
                description:
                  "Seus dados protegidos com criptografia de nível militar e backup automático.",
              },
              {
                icon: <AnalyticsIcon sx={{ fontSize: 48, color: "#8B5CF6" }} />,
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
                color: "#0f172a",
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
                      <Typography variant="h2" sx={{ fontSize: "3rem", mb: 2 }}>
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
                  <Typography variant="body2" color="#10b981" fontWeight={600}>
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
                {["Recursos", "Gamificação", "Preços", "Central de Ajuda"].map(
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
    </Box>
  );
};

export default Landing;
