/**
 * @fileoverview Landing Page - DespFinancee
 * Página de apresentação profissional do produto
 */

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
} from "@mui/material";
import {
  Psychology,
  SportsEsports,
  Security,
  Analytics,
  CloudDownload,
  EmojiEvents,
  ArrowForward,
  CheckCircle,
  Verified,
  Lock,
  GitHub,
  ExpandMore,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Link,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { colors, gradients } from "../styles/designSystem";
import GlassCard from "../components/common/GlassCard";

const Landing = () => {
  const navigate = useNavigate();

  const advantages = [
    {
      icon: <Psychology sx={{ fontSize: 36 }} />,
      title: "IA que trabalha por você",
      points: [
        "Prevê despesas do mês e alerta desvios",
        "Detecta desperdícios automaticamente",
        "Sugestões de economia em 1 clique",
      ],
      color: colors.primary.main,
    },
    {
      icon: <SportsEsports sx={{ fontSize: 36 }} />,
      title: "Gamificação que engaja",
      points: [
        "Níveis, avatares e recompensas reais",
        "Missões semanais para criar hábitos",
        "Economizar virou jogo (e é divertido)",
      ],
      color: colors.secondary.main,
    },
    {
      icon: <Analytics sx={{ fontSize: 36 }} />,
      title: "Score financeiro acionável",
      points: [
        "Nota de 0 a 100 transparente",
        "Entenda o porquê da sua pontuação",
        "Dicas práticas para subir seu score",
      ],
      color: colors.success.main,
    },
    {
      icon: <CloudDownload sx={{ fontSize: 36 }} />,
      title: "Exportação e liberdade de dados",
      points: [
        "PDF, Excel, CSV e JSON",
        "Sem lock‑in: seus dados são seus",
        "Backup completo em segundos",
      ],
      color: colors.info.main,
    },
    {
      icon: <Security sx={{ fontSize: 36 }} />,
      title: "Segurança de verdade",
      points: [
        "JWT com blacklist + rate limiting",
        "Criptografia ponta a ponta",
        "Boas práticas auditáveis",
      ],
      color: colors.error.main,
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 36 }} />,
      title: "Open source e 100% grátis",
      points: [
        "Sem paywall, sem anúncios",
        "Comunidade e transparência",
        "Colabore e evolua com a gente",
      ],
      color: colors.warning.main,
    },
  ];

  const stats = [
    { value: "8+", label: "Endpoints de IA" },
    { value: "100%", label: "Gratuito" },
    { value: "10+", label: "Features Premium" },
    { value: "24/7", label: "Disponível" },
  ];

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Announcement Bar */}
      <Box
        sx={{
          bgcolor: "rgba(99,102,241,0.12)",
          borderBottom: `1px solid ${colors.primary.main}22`,
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
            py={1.2}
          >
            <Typography variant="body2" color="text.secondary">
              Open source MIT • Transparente • Comunidade ativa
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                variant="text"
                startIcon={<GitHub />}
                onClick={() =>
                  window.open(
                    "https://github.com/bruninho12/despfinancee",
                    "_blank"
                  )
                }
              >
                GitHub
              </Button>
              <Button
                size="small"
                variant="text"
                onClick={() => window.open("/api-docs", "_blank")}
              >
                Swagger
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: gradients.purpleBlue,
          color: "white",
          pt: 12,
          pb: 8,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Chip
                  label="🚀 Lançamento 2025"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    color: "white",
                    mb: 2,
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h1"
                  fontWeight={800}
                  gutterBottom
                  sx={{ fontSize: { xs: "2.5rem", md: "4rem" } }}
                >
                  DespFinancee
                </Typography>
                <Typography variant="h5" sx={{ mb: 3, opacity: 0.95 }}>
                  Controle financeiro com{" "}
                  <strong>Inteligência Artificial</strong> e{" "}
                  <strong>Gamificação</strong>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, opacity: 0.9, fontSize: "1.1rem" }}
                >
                  A primeira plataforma brasileira que transforma gestão
                  financeira em uma experiência divertida, inteligente e
                  completamente gratuita.
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate("/register")}
                    sx={{
                      bgcolor: "white",
                      color: colors.primary.main,
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.9)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s",
                    }}
                    aria-label="Criar conta grátis"
                  >
                    Começar Grátis
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/login")}
                    sx={{
                      borderColor: "white",
                      color: "white",
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Stack>
                {/* Trust Badges */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  mt={3}
                >
                  <Chip
                    icon={<Verified />}
                    label="Open Source (MIT)"
                    color="default"
                    sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }}
                  />
                  <Chip
                    icon={<Lock />}
                    label="Segurança JWT"
                    color="default"
                    sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }}
                  />
                  <Chip
                    icon={<CheckCircle />}
                    label="100% Gratuito"
                    color="default"
                    sx={{ bgcolor: "rgba(255,255,255,0.12)", color: "white" }}
                  />
                </Stack>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: "relative",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{ fontSize: "8rem", opacity: 0.1 }}
                    aria-hidden
                    role="presentation"
                  >
                    💰
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "6rem",
                      position: "absolute",
                      top: "30%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                    aria-hidden
                    role="presentation"
                  >
                    🤖
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: "5rem",
                      position: "absolute",
                      bottom: "20%",
                      left: "30%",
                    }}
                    aria-hidden
                    role="presentation"
                  >
                    🎮
                  </Typography>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container
        maxWidth="lg"
        sx={{ mt: -4, position: "relative", zIndex: 10 }}
      >
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard blur={20} opacity={0.15}>
                  <Box p={3} textAlign="center">
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      color="primary.main"
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Advantages Section */}
      <Box sx={{ bgcolor: "background.paper", py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight={700}
              fontSize="1rem"
            >
              DIFERENCIAIS EXCLUSIVOS
            </Typography>
            <Typography variant="h2" fontWeight={700} gutterBottom>
              Mais que recursos — resultados reais
            </Typography>
            <Typography variant="body1" color="text.secondary">
              O que só o DespFinancee entrega na prática
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {advantages.map((item, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      p: 1,
                      border: `1px solid ${item.color}22`,
                      boxShadow: `0 8px 24px ${item.color}22`,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        mb={2}
                      >
                        <Avatar
                          sx={{ bgcolor: `${item.color}15`, color: item.color }}
                        >
                          {item.icon}
                        </Avatar>
                        <Typography variant="h5" fontWeight={700}>
                          {item.title}
                        </Typography>
                      </Stack>
                      <Stack spacing={1.2}>
                        {item.points.map((p, i) => (
                          <Stack
                            key={i}
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <CheckCircle sx={{ color: colors.success.main }} />
                            <Typography variant="body2" color="text.secondary">
                              {p}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box textAlign="center" mb={4}>
          <Typography
            variant="overline"
            color="primary"
            fontWeight={700}
            fontSize="1rem"
          >
            DEPOIMENTOS
          </Typography>
          <Typography variant="h3" fontWeight={700}>
            Quem usa, recomenda
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Experiências reais com economia e clareza
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {[
            {
              name: "Ana P.",
              role: "Autônoma",
              quote:
                "Transformei meus gastos em metas claras. Meu score subiu 18 pontos em 2 meses!",
            },
            {
              name: "Lucas R.",
              role: "Estudante",
              quote:
                "As missões semanais me fizeram criar o hábito de guardar todo mês.",
            },
            {
              name: "Mariana S.",
              role: "Analista",
              quote:
                "Exporto tudo pro Excel e comparo com meu planejamento. Transparente e leve.",
            },
          ].map((t, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    mb={1.5}
                  >
                    <Avatar>{t.name.split(" ")[0][0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>{t.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t.role}
                      </Typography>
                    </Box>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    “{t.quote}”
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Box textAlign="center" mb={2}>
          <Typography
            variant="overline"
            color="primary"
            fontWeight={700}
            fontSize="1rem"
          >
            FAQ
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Perguntas frequentes
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight={700}>É realmente gratuito?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Sim. Open source, sem anúncios e sem paywall. Você controla
                  seus dados.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight={700}>
                  Como meus dados ficam seguros?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Usamos JWT com blacklist, rate limiting e boas práticas de
                  criptografia, além de exportação total.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12} md={6}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight={700}>Consigo exportar tudo?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Sim. PDF, Excel, CSV e JSON em poucos cliques.
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography fontWeight={700}>Tem documentação?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  Acesse o Swagger em{" "}
                  <Link href="/api-docs" target="_blank" rel="noopener">
                    /api-docs
                  </Link>{" "}
                  e o código no{" "}
                  <Link
                    href="https://github.com/bruninho12/despfinancee"
                    target="_blank"
                    rel="noopener"
                  >
                    GitHub
                  </Link>
                  .
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Container>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <GlassCard variant="primary" blur={20} opacity={0.15}>
          <Box p={6} textAlign="center">
            <EmojiEvents
              sx={{ fontSize: 80, color: colors.warning.main, mb: 2 }}
            />
            <Typography variant="h3" fontWeight={700} gutterBottom>
              Pronto para revolucionar suas finanças?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: "auto" }}
            >
              Junte-se a milhares de usuários que já estão economizando de forma
              inteligente e divertida
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => navigate("/register")}
                sx={{
                  background: gradients.purpleBlue,
                  px: 5,
                  py: 2,
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(99,102,241,0.4)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Criar Conta Grátis
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() =>
                  window.open(
                    "https://github.com/bruninho12/despfinancee",
                    "_blank"
                  )
                }
                sx={{
                  borderColor: colors.primary.main,
                  color: colors.primary.main,
                  px: 5,
                  py: 2,
                  fontSize: "1.2rem",
                  "&:hover": {
                    borderColor: colors.primary.dark,
                    bgcolor: "rgba(99,102,241,0.05)",
                  },
                }}
              >
                Ver no GitHub
              </Button>
            </Stack>
          </Box>
        </GlassCard>
      </Container>

      {/* Footer */}
      <Box
        sx={{ bgcolor: "background.paper", py: 4, borderTop: "1px solid #eee" }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={700}>
                💰 DespFinancee
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestão financeira inteligente e divertida
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} textAlign={{ xs: "left", md: "right" }}>
              <Typography variant="body2" color="text.secondary">
                © 2025 DespFinancee. Todos os direitos reservados.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Feito com ❤️ no Brasil
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
