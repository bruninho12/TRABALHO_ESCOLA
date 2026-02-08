import React, { useCallback } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Skeleton,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Assessment as AssessmentIcon,
  ShowChart as ShowChartIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

// ------------------ Helpers & Small Utils ------------------
const safeToFixed = (val) => {
  if (val == null || Number.isNaN(val)) return "0.00";
  try {
    return Number(val).toFixed(2);
  } catch {
    return "0.00";
  }
};

const validateProgressValue = (v) => {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(100, v));
};

const colors = {
  primary: { main: "#6366F1" },
  success: { main: "#10B981", light: "rgba(16,185,129,0.15)" },
  warning: { main: "#F59E0B" },
  error: { main: "#EF4444" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ------------------ Service (internal, but easy to extract) ------------------
const fetchInsights = async (apiUrl, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const base =
    apiUrl || (import.meta?.env?.VITE_API_URL ?? "http://localhost:3001/api");
  const endpoints = [
    `${base}/insights/score`,
    `${base}/insights/trends`,
    `${base}/insights/patterns`,
    `${base}/insights/suggestions`,
    `${base}/insights/prediction`,
  ];

  // Run in parallel and normalize responses
  const [scoreRes, trendsRes, patternsRes, suggestionsRes, predictionRes] =
    await Promise.all(
      endpoints.map((e) => axios.get(e, config).then((r) => r.data))
    );

  return {
    score: scoreRes,
    trends: trendsRes?.trends ?? trendsRes ?? [],
    patterns: patternsRes?.patterns ?? patternsRes ?? [],
    suggestions: suggestionsRes?.suggestions ?? suggestionsRes ?? [],
    prediction: predictionRes,
  };
};

// ------------------ Small Presentational Components (memoized) ------------------
const ScoreCard = React.memo(function ScoreCard({ score }) {
  const getScoreLabel = useCallback((s) => {
    if (s >= 80) return "Excelente";
    if (s >= 60) return "Bom";
    if (s >= 40) return "Regular";
    return "Precisa melhorar";
  }, []);

  if (!score) {
    return (
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="50%" height={38} />
          <Skeleton variant="rectangular" height={16} sx={{ mt: 1, mb: 1 }} />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-30%",
          width: "150%",
          height: "150%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
      component={motion.div}
      initial="hidden"
      animate="show"
      variants={fadeUp}
    >
      <CardContent sx={{ position: "relative", zIndex: 1, p: 0 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              p: 1.5,
              mr: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            <StarIcon
              sx={{
                fontSize: 32,
                color: "white",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
              aria-hidden
            />
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: "0.01em",
            }}
          >
            Score Financeiro
          </Typography>
        </Box>

        <Box display="flex" alignItems="baseline" mb={2}>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              textShadow: "0 3px 6px rgba(0,0,0,0.4)",
              letterSpacing: "-0.02em",
            }}
          >
            {score.score}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              ml: 1,
              opacity: 0.9,
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            / 100
          </Typography>
        </Box>

        <Chip
          label={getScoreLabel(score.score)}
          sx={{
            bgcolor: "rgba(255,255,255,0.25)",
            color: "white",
            fontWeight: 700,
            mb: 2,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            "& .MuiChip-label": {
              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
            },
          }}
          aria-label={`Classificação: ${getScoreLabel(score.score)}`}
        />

        <LinearProgress
          variant="determinate"
          value={validateProgressValue(score.score || 0)}
          sx={{
            height: 12,
            borderRadius: 6,
            mb: 2,
            bgcolor: "rgba(255,255,255,0.2)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "rgba(255,255,255,0.9)",
              borderRadius: 6,
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            },
          }}
          aria-valuenow={validateProgressValue(score.score || 0)}
          role="progressbar"
        />

        <Typography
          variant="body2"
          sx={{
            opacity: 0.95,
            lineHeight: 1.5,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          {score.message ??
            "Continue assim para melhorar sua saúde financeira!"}
        </Typography>
      </CardContent>
    </Card>
  );
});

const PredictionCard = React.memo(function PredictionCard({ prediction }) {
  if (!prediction) {
    return (
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Skeleton variant="text" width="40%" height={38} />
          <Skeleton variant="rectangular" height={16} sx={{ mt: 1, mb: 1 }} />
          <Skeleton variant="text" width="70%" />
        </CardContent>
      </Card>
    );
  }

  const isUp = prediction.trend === "up";

  return (
    <Card
      sx={{
        p: 3,
        height: "100%",
        background: isUp
          ? "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          : "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        color: "white",
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
      component={motion.div}
      initial="hidden"
      animate="show"
      variants={fadeUp}
    >
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              p: 1.5,
              mr: 2,
              backdropFilter: "blur(10px)",
            }}
          >
            <ShowChartIcon
              sx={{
                fontSize: 32,
                color: "white",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              letterSpacing: "0.01em",
            }}
          >
            Previsão Próximo Mês
          </Typography>
        </Box>

        <Typography
          variant="h4"
          fontWeight={800}
          sx={{
            mb: 2,
            textShadow: "0 3px 6px rgba(0,0,0,0.4)",
            letterSpacing: "-0.02em",
          }}
        >
          R$ {safeToFixed(prediction.predictedAmount)}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            bgcolor: "rgba(255,255,255,0.2)",
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            width: "fit-content",
          }}
        >
          {isUp ? (
            <TrendingUpIcon sx={{ mr: 0.5, fontSize: 20 }} aria-hidden />
          ) : (
            <TrendingDownIcon sx={{ mr: 0.5, fontSize: 20 }} aria-hidden />
          )}
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {prediction.changePercentage > 0 ? "+" : ""}
            {prediction.changePercentage ?? 0}% vs. média
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            opacity: 0.95,
            lineHeight: 1.5,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          Baseado em {prediction.dataPoints ?? 0} transações analisadas
        </Typography>
      </CardContent>
    </Card>
  );
});

const TrendCard = React.memo(function TrendCard({ trend }) {
  const isUp = trend.trend === "up";

  return (
    <Card
      sx={{
        p: 2.5,
        height: "100%",
        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
        border: `2px solid ${isUp ? colors.error.main : colors.success.main}`,
        borderRadius: 2.5,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 24px rgba(${
            isUp ? "239,68,68" : "16,185,129"
          }, 0.15)`,
        },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${
            isUp ? colors.error.main : colors.success.main
          }, ${isUp ? "#fca5a5" : "#6ee7b7"})`,
        },
      }}
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      elevation={2}
    >
      <CardContent sx={{ p: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: "rgba(0,0,0,0.7)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            mb: 1.5,
          }}
        >
          {trend.category?.name ?? trend.category}
        </Typography>
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{
            color: "rgba(0,0,0,0.9)",
            mb: 2,
            lineHeight: 1.2,
          }}
        >
          R$ {safeToFixed(trend.amount)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: isUp ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
            borderRadius: 2,
            px: 1.5,
            py: 1,
            width: "fit-content",
          }}
        >
          {isUp ? (
            <TrendingUpIcon
              fontSize="small"
              sx={{ color: colors.error.main, mr: 0.5 }}
              aria-hidden
            />
          ) : (
            <TrendingDownIcon
              fontSize="small"
              sx={{ color: colors.success.main, mr: 0.5 }}
              aria-hidden
            />
          )}
          <Typography
            variant="body2"
            sx={{
              color: isUp ? colors.error.main : colors.success.main,
              fontWeight: 700,
              fontSize: "0.875rem",
            }}
          >
            {trend.change ?? "0%"}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
});

const PatternItem = React.memo(function PatternItem({ pattern }) {
  return (
    <Box
      mb={2}
      p={3}
      sx={{
        background: "linear-gradient(145deg, #fff7ed 0%, #ffffff 100%)",
        borderRadius: 2.5,
        border: "1px solid rgba(245,158,11,0.2)",
        borderLeft: `4px solid ${colors.warning.main}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(245,158,11,0.15)",
          borderColor: "rgba(245,158,11,0.3)",
        },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "10px",
          left: "15px",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          bgcolor: colors.warning.main,
          boxShadow: `0 0 0 3px rgba(245,158,11,0.2)`,
        },
      }}
    >
      <Box sx={{ ml: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            color: "rgba(0,0,0,0.9)",
            mb: 0.5,
            lineHeight: 1.4,
          }}
        >
          {pattern.description}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(0,0,0,0.6)",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              bgcolor: colors.warning.main,
              opacity: 0.7,
            }}
          />
          Frequência: {pattern.frequency ?? "—"}
        </Typography>
      </Box>
    </Box>
  );
});

const SuggestionItem = React.memo(function SuggestionItem({ suggestion }) {
  return (
    <Box
      mb={2}
      p={3}
      sx={{
        background: "linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)",
        borderRadius: 2.5,
        border: "1px solid rgba(16,185,129,0.2)",
        borderLeft: `4px solid ${colors.success.main}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(16,185,129,0.15)",
          borderColor: "rgba(16,185,129,0.3)",
        },
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "10px",
          left: "15px",
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          bgcolor: colors.success.main,
          boxShadow: `0 0 0 3px rgba(16,185,129,0.2)`,
        },
      }}
    >
      <Box sx={{ ml: 2 }}>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            color: "rgba(0,0,0,0.9)",
            mb: 0.5,
            lineHeight: 1.4,
          }}
        >
          {suggestion.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "rgba(0,0,0,0.6)",
            fontWeight: 400,
            mb: typeof suggestion.potentialSavings === "number" ? 1.5 : 0,
            lineHeight: 1.5,
          }}
        >
          {suggestion.description}
        </Typography>
        {typeof suggestion.potentialSavings === "number" && (
          <Chip
            label={`💰 Economia: R$ ${safeToFixed(
              suggestion.potentialSavings
            )}`}
            size="small"
            sx={{
              bgcolor: colors.success.main,
              color: "white",
              fontWeight: 600,
              fontSize: "0.75rem",
              "& .MuiChip-label": {
                px: 1.5,
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
});

// ------------------ COMPONENTE MAIN ------------------
function Insights() {
  const token = localStorage.getItem("finance_flow_token");
  const apiUrl = import.meta?.env?.VITE_API_URL ?? "http://localhost:3001/api";
  const [lastUpdate, setLastUpdate] = React.useState(null);

  const {
    data: insights,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery(
    ["insights"],
    async () => {
      const result = await fetchInsights(apiUrl, token);
      setLastUpdate(new Date());
      return result;
    },
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 15,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );

  // Exportar insights em JSON
  const handleExport = () => {
    if (!insights) return;
    const blob = new Blob([JSON.stringify(insights, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `insights_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box
          sx={{
            mb: 4,
            p: 3,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: 3,
            color: "white",
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
                "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><defs><pattern id=%22grain%22 width=%222%22 height=%222%22 patternUnits=%22userSpaceOnUse%22><circle cx=%221%22 cy=%221%22 r=%220.5%22 fill=%22%23ffffff%22 opacity=%220.1%22/></pattern></defs><rect width=%22100%22 height=%22100%22 fill=%22url(%23grain)%22/></svg>')",
              opacity: 0.3,
            },
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    mb: 1,
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  💡 Insights Financeiros
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 0.95,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: "600px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  Análises, previsões e sugestões com IA — reorganizando sua
                  performance e legibilidade.
                </Typography>
                {lastUpdate && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1,
                      opacity: 0.8,
                      fontSize: "0.75rem",
                      textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    }}
                  >
                    Última atualização: {lastUpdate.toLocaleString("pt-BR")}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                {isFetching && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress
                      size={20}
                      sx={{ color: "rgba(255,255,255,0.8)" }}
                    />
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Atualizando...
                    </Typography>
                  </Box>
                )}
                <Tooltip title="Recarregar insights">
                  <IconButton
                    onClick={() => refetch()}
                    aria-label="Recarregar insights"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exportar insights">
                  <IconButton
                    onClick={handleExport}
                    aria-label="Exportar insights"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {isLoading ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={180} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={180} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={220} />
          </Grid>
        </Grid>
      ) : isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" color="error" fontWeight={500}>
            Erro ao carregar insights, usuário não é Premium. Caso seja Premium,
            tente novamente. Se o problema persistir, entre em contato com o
            suporte.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {error?.message ??
              "Tente novamente. Se o problema persistir, entre em contato com o suporte."}
          </Typography>
          <Box mt={1} display="flex" gap={1}>
            <Button
              variant="contained"
              onClick={() => refetch()}
              startIcon={<RefreshIcon />}
            >
              Tentar novamente
            </Button>
            <Button
              variant="outlined"
              color="error"
              href="mailto:despfinance@gmail.com?subject=Erro Insights"
              target="_blank"
            >
              Suporte
            </Button>
          </Box>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ScoreCard score={insights.score} />
          </Grid>

          <Grid item xs={12} md={6}>
            <PredictionCard prediction={insights.prediction} />
          </Grid>

          <Grid item xs={12}>
            <Card
              sx={{
                p: 3,
                background: "linear-gradient(145deg, #ffffff 0%, #f8fffe 100%)",
                borderRadius: 3,
                border: "1px solid rgba(99,102,241,0.1)",
                boxShadow: "0 4px 12px rgba(99,102,241,0.08)",
              }}
              component={motion.div}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <CardContent sx={{ p: 0 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Box
                    sx={{
                      bgcolor: "rgba(99,102,241,0.1)",
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <AssessmentIcon
                      sx={{ fontSize: 28, color: colors.primary.main }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.9)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    📈 Tendências de Gastos
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {Array.isArray(insights.trends) &&
                  insights.trends.length === 0 ? (
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          textAlign: "center",
                          py: 4,
                          px: 2,
                          bgcolor: "rgba(99,102,241,0.05)",
                          borderRadius: 2,
                          border: "1px dashed rgba(99,102,241,0.2)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "rgba(0,0,0,0.6)",
                            mb: 1,
                            fontWeight: 500,
                          }}
                        >
                          📉 Nenhuma tendência disponível
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "rgba(0,0,0,0.5)" }}
                        >
                          Adicione mais transações para ver padrões de gastos
                        </Typography>
                      </Box>
                    </Grid>
                  ) : Array.isArray(insights.trends) ? (
                    insights.trends.map((t, i) => (
                      <Grid item xs={12} sm={6} md={4} key={t.id ?? i}>
                        <TrendCard trend={t} />
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography color="error">
                        Erro: dados de tendências inválidos.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                background: "linear-gradient(145deg, #fffbeb 0%, #ffffff 100%)",
                borderRadius: 3,
                border: "1px solid rgba(245,158,11,0.1)",
                boxShadow: "0 4px 12px rgba(245,158,11,0.08)",
                height: "100%",
              }}
              component={motion.div}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <CardContent
                sx={{
                  p: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Box
                    sx={{
                      bgcolor: "rgba(245,158,11,0.1)",
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <ShowChartIcon
                      sx={{ fontSize: 28, color: colors.warning.main }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.9)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    🔍 Padrões Detectados
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {Array.isArray(insights.patterns) &&
                  insights.patterns.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        px: 2,
                        bgcolor: "rgba(245,158,11,0.05)",
                        borderRadius: 2,
                        border: "1px dashed rgba(245,158,11,0.2)",
                        height: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "rgba(0,0,0,0.6)",
                          mb: 1,
                          fontWeight: 500,
                        }}
                      >
                        🔎 Nenhum padrão detectado
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        Continue usando o app para identificarmos seus hábitos
                      </Typography>
                    </Box>
                  ) : Array.isArray(insights.patterns) ? (
                    insights.patterns.map((p, i) => (
                      <PatternItem key={p.id ?? i} pattern={p} />
                    ))
                  ) : (
                    <Typography color="error">
                      Erro: dados de padrões inválidos.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                background: "linear-gradient(145deg, #f0fdf4 0%, #ffffff 100%)",
                borderRadius: 3,
                border: "1px solid rgba(16,185,129,0.1)",
                boxShadow: "0 4px 12px rgba(16,185,129,0.08)",
                height: "100%",
              }}
              component={motion.div}
              initial="hidden"
              animate="show"
              variants={fadeUp}
            >
              <CardContent
                sx={{
                  p: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box display="flex" alignItems="center" mb={3}>
                  <Box
                    sx={{
                      bgcolor: "rgba(16,185,129,0.1)",
                      borderRadius: 2,
                      p: 1.5,
                      mr: 2,
                    }}
                  >
                    <LightbulbIcon
                      sx={{ fontSize: 28, color: colors.success.main }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "rgba(0,0,0,0.9)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    💡 Sugestões Inteligentes
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {Array.isArray(insights.suggestions) &&
                  insights.suggestions.length === 0 ? (
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        px: 2,
                        bgcolor: "rgba(16,185,129,0.05)",
                        borderRadius: 2,
                        border: "1px dashed rgba(16,185,129,0.2)",
                        height: "200px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "rgba(0,0,0,0.6)",
                          mb: 1,
                          fontWeight: 500,
                        }}
                      >
                        🤔 Nenhuma sugestão no momento
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(0,0,0,0.5)" }}
                      >
                        Nossa IA está analisando seus dados para gerar insights
                      </Typography>
                    </Box>
                  ) : Array.isArray(insights.suggestions) ? (
                    insights.suggestions.map((s, i) => (
                      <Box key={s.id ?? i}>
                        <SuggestionItem suggestion={s} />
                        {typeof s.potentialSavings === "number" &&
                          s.potentialSavings > 0 && (
                            <Chip
                              label={`Economia potencial: R$ ${safeToFixed(
                                s.potentialSavings
                              )}`}
                              color="success"
                              sx={{ mt: 1, fontWeight: 700 }}
                            />
                          )}
                      </Box>
                    ))
                  ) : (
                    <Typography color="error">
                      Erro: dados de sugestões inválidos.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Insights;
