import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Alert,
  Skeleton,
  useTheme,
  alpha,
  Tooltip,
  Fade,
  Zoom,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Warning,
  EmojiEvents,
  Info,
  Close,
  Refresh,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { getInsights } from "../services/insightsApi";
import "./InsightsPanel.css";

/**
 * 🤖 Painel de Insights Inteligentes
 * Exibe análises automáticas e recomendações personalizadas
 */
const InsightsPanel = ({ userId }) => {
  const theme = useTheme();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedInsights, setDismissedInsights] = useState([]);

  useEffect(() => {
    loadInsights();

    // Recarrega insights a cada 5 minutos
    const interval = setInterval(loadInsights, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userId]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await getInsights();
      setInsights(data.data || []);
    } catch (error) {
      console.error("Erro ao carregar insights:", error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const dismissInsight = (insightId) => {
    setDismissedInsights([...dismissedInsights, insightId]);
  };

  const getInsightIcon = (type) => {
    const icons = {
      spending_trend: <TrendingUp />,
      budget_alert: <Warning />,
      savings_opportunity: <Lightbulb />,
      category_pattern: <Info />,
      goal_prediction: <TrendingUp />,
      unusual_expense: <Warning />,
      achievement: <EmojiEvents />,
    };
    return icons[type] || <Info />;
  };

  const getInsightColor = (impact) => {
    const colors = {
      positive: {
        bg: alpha(theme.palette.success.main, 0.1),
        border: theme.palette.success.main,
        icon: theme.palette.success.main,
      },
      negative: {
        bg: alpha(theme.palette.error.main, 0.1),
        border: theme.palette.error.main,
        icon: theme.palette.error.main,
      },
      neutral: {
        bg: alpha(theme.palette.info.main, 0.1),
        border: theme.palette.info.main,
        icon: theme.palette.info.main,
      },
    };
    return colors[impact] || colors.neutral;
  };

  const visibleInsights = insights.filter(
    (insight) => !dismissedInsights.includes(insight.id)
  );

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          🤖 Insights Inteligentes
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} md={4} key={i}>
              <Skeleton variant="rectangular" height={150} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (visibleInsights.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6">🤖 Insights Inteligentes</Typography>
          <Tooltip title="Recarregar insights">
            <IconButton size="small" onClick={loadInsights}>
              <Refresh fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Alert severity="info" icon={<Lightbulb />}>
          Continue registrando suas transações para receber insights
          personalizados!
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6">🤖 Insights Inteligentes</Typography>
        <Chip
          label={visibleInsights.length}
          size="small"
          color="primary"
          sx={{ fontWeight: "bold" }}
        />
        <Tooltip title="Recarregar insights">
          <IconButton size="small" onClick={loadInsights}>
            <Refresh fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2}>
        <AnimatePresence>
          {visibleInsights.slice(0, 6).map((insight, index) => {
            const colors = getInsightColor(insight.impact);

            return (
              <Grid item xs={12} md={6} lg={4} key={insight.id || index}>
                <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className="insight-card"
                      sx={{
                        position: "relative",
                        background: `linear-gradient(135deg, ${
                          colors.bg
                        } 0%, ${alpha(colors.bg, 0.3)} 100%)`,
                        borderLeft: `4px solid ${colors.border}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: `0 8px 24px ${alpha(colors.border, 0.2)}`,
                        },
                      }}
                    >
                      <CardContent>
                        {/* Header com ícone e botão de dispensar */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              bgcolor: alpha(colors.icon, 0.15),
                              color: colors.icon,
                              flexShrink: 0,
                            }}
                          >
                            {getInsightIcon(insight.type)}
                          </Box>

                          <Box sx={{ flex: 1 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: "bold",
                                color: colors.icon,
                                mb: 0.5,
                              }}
                            >
                              {insight.title}
                            </Typography>
                          </Box>

                          <IconButton
                            size="small"
                            onClick={() => dismissInsight(insight.id)}
                            sx={{
                              opacity: 0.5,
                              "&:hover": { opacity: 1 },
                            }}
                          >
                            <Close fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Mensagem principal */}
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            lineHeight: 1.5,
                            mb: 2,
                          }}
                        >
                          {insight.message}
                        </Typography>

                        {/* Dados adicionais (se disponíveis) */}
                        {insight.data && (
                          <Box sx={{ mt: 2 }}>
                            {insight.data.difference && (
                              <Chip
                                label={`R$ ${Math.abs(
                                  insight.data.difference
                                ).toFixed(2)}`}
                                size="small"
                                sx={{
                                  mr: 1,
                                  bgcolor: alpha(colors.icon, 0.1),
                                  color: colors.icon,
                                  fontWeight: "bold",
                                }}
                              />
                            )}
                            {insight.data.percentChange && (
                              <Chip
                                icon={
                                  insight.data.percentChange > 0 ? (
                                    <TrendingUp fontSize="small" />
                                  ) : (
                                    <TrendingDown fontSize="small" />
                                  )
                                }
                                label={`${Math.abs(
                                  insight.data.percentChange
                                ).toFixed(0)}%`}
                                size="small"
                                sx={{
                                  bgcolor: alpha(colors.icon, 0.1),
                                  color: colors.icon,
                                  fontWeight: "bold",
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </CardContent>

                      {/* Indicador de prioridade */}
                      {insight.priority >= 8 && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: theme.palette.error.main,
                            animation: "pulse 2s infinite",
                          }}
                        />
                      )}
                    </Card>
                  </motion.div>
                </Zoom>
              </Grid>
            );
          })}
        </AnimatePresence>
      </Grid>

      {/* Mostrar mais insights */}
      {visibleInsights.length > 6 && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            +{visibleInsights.length - 6} insights adicionais disponíveis
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default InsightsPanel;
