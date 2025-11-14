/**
 * @fileoverview Página de Insights Financeiros com IA
 * Mostra análises, previsões e sugestões inteligentes
 */

import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as LightbulbIcon,
  Assessment as AssessmentIcon,
  ShowChart as ShowChartIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import GlassCard from "../components/common/GlassCard";
import { colors } from "../styles/designSystem";
import axios from "axios";

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [financialScore, setFinancialScore] = useState(null);
  const [trends, setTrends] = useState([]);
  const [patterns, setPatterns] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    loadAllInsights();
  }, []);

  const loadAllInsights = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("finance_flow_token");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Carregar todos os insights em paralelo
      const [scoreRes, trendsRes, patternsRes, suggestionsRes, predictionRes] =
        await Promise.all([
          axios.get(`${apiUrl}/insights/score`, config),
          axios.get(`${apiUrl}/insights/trends`, config),
          axios.get(`${apiUrl}/insights/patterns`, config),
          axios.get(`${apiUrl}/insights/suggestions`, config),
          axios.get(`${apiUrl}/insights/prediction`, config),
        ]);

      setFinancialScore(scoreRes.data);
      setTrends(trendsRes.data.trends || []);
      setPatterns(patternsRes.data.patterns || []);
      setSuggestions(suggestionsRes.data.suggestions || []);
      setPrediction(predictionRes.data);

      setError(null);
    } catch (err) {
      console.error("Erro ao carregar insights:", err);
      setError("Não foi possível carregar os insights. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return colors.success.main;
    if (score >= 60) return colors.warning.main;
    return colors.error.main;
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    if (score >= 40) return "Regular";
    return "Precisa melhorar";
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            💡 Insights Financeiros
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análise inteligente com IA das suas finanças
          </Typography>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Score Financeiro */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard variant="primary" blur={15} opacity={0.15} padding={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <StarIcon
                  sx={{ fontSize: 40, color: colors.warning.main, mr: 2 }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Score Financeiro
                </Typography>
              </Box>

              {financialScore && (
                <>
                  <Box display="flex" alignItems="baseline" mb={2}>
                    <Typography
                      variant="h2"
                      fontWeight={700}
                      sx={{ color: getScoreColor(financialScore.score) }}
                    >
                      {financialScore.score}
                    </Typography>
                    <Typography variant="h5" color="text.secondary" ml={1}>
                      / 100
                    </Typography>
                  </Box>

                  <Chip
                    label={getScoreLabel(financialScore.score)}
                    sx={{
                      bgcolor: getScoreColor(financialScore.score),
                      color: "white",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  />

                  <LinearProgress
                    variant="determinate"
                    value={financialScore.score}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "rgba(0,0,0,0.1)",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getScoreColor(financialScore.score),
                      },
                    }}
                  />

                  <Typography variant="body2" color="text.secondary" mt={2}>
                    {financialScore.message ||
                      "Continue assim para melhorar sua saúde financeira!"}
                  </Typography>
                </>
              )}
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Previsão de Despesas */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="success" blur={15} opacity={0.15} padding={3}>
              <Box display="flex" alignItems="center" mb={2}>
                <ShowChartIcon
                  sx={{ fontSize: 40, color: colors.primary.main, mr: 2 }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Previsão Próximo Mês
                </Typography>
              </Box>

              {prediction && (
                <>
                  <Typography
                    variant="h3"
                    fontWeight={700}
                    color="primary.main"
                    mb={1}
                  >
                    R$ {prediction.predictedAmount?.toFixed(2) || "0.00"}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    {prediction.trend === "up" ? (
                      <TrendingUpIcon
                        sx={{ color: colors.error.main, mr: 1 }}
                      />
                    ) : (
                      <TrendingDownIcon
                        sx={{ color: colors.success.main, mr: 1 }}
                      />
                    )}
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          prediction.trend === "up"
                            ? colors.error.main
                            : colors.success.main,
                      }}
                    >
                      {prediction.changePercentage > 0 ? "+" : ""}
                      {prediction.changePercentage}% vs. média
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Baseado em {prediction.dataPoints || 0} transações
                    analisadas
                  </Typography>
                </>
              )}
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Tendências de Gastos */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard blur={15} opacity={0.1} padding={3}>
              <Box display="flex" alignItems="center" mb={3}>
                <AssessmentIcon
                  sx={{ fontSize: 32, color: colors.primary.main, mr: 2 }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Tendências de Gastos
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {trends.map((trend, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        bgcolor: "rgba(99, 102, 241, 0.05)",
                        height: "100%",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                          {trend.category}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="primary.main"
                          fontWeight={700}
                        >
                          R$ {trend.amount?.toFixed(2)}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={1}>
                          {trend.trend === "up" ? (
                            <TrendingUpIcon
                              fontSize="small"
                              sx={{ color: colors.error.main }}
                            />
                          ) : (
                            <TrendingDownIcon
                              fontSize="small"
                              sx={{ color: colors.success.main }}
                            />
                          )}
                          <Typography
                            variant="body2"
                            ml={0.5}
                            sx={{
                              color:
                                trend.trend === "up"
                                  ? colors.error.main
                                  : colors.success.main,
                            }}
                          >
                            {trend.change}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Padrões Detectados */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard blur={15} opacity={0.1} padding={3}>
              <Box display="flex" alignItems="center" mb={3}>
                <ShowChartIcon
                  sx={{ fontSize: 32, color: colors.warning.main, mr: 2 }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Padrões Detectados
                </Typography>
              </Box>

              {patterns.map((pattern, index) => (
                <Box
                  key={index}
                  mb={2}
                  p={2}
                  sx={{
                    bgcolor: "rgba(245, 158, 11, 0.05)",
                    borderRadius: 2,
                    borderLeft: `4px solid ${colors.warning.main}`,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {pattern.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Frequência: {pattern.frequency}
                  </Typography>
                </Box>
              ))}
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Sugestões Inteligentes */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <GlassCard variant="success" blur={15} opacity={0.1} padding={3}>
              <Box display="flex" alignItems="center" mb={3}>
                <LightbulbIcon
                  sx={{ fontSize: 32, color: colors.success.main, mr: 2 }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Sugestões Inteligentes
                </Typography>
              </Box>

              {suggestions.map((suggestion, index) => (
                <Box
                  key={index}
                  mb={2}
                  p={2}
                  sx={{
                    bgcolor: "rgba(16, 185, 129, 0.05)",
                    borderRadius: 2,
                    borderLeft: `4px solid ${colors.success.main}`,
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {suggestion.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    {suggestion.description}
                  </Typography>
                  {suggestion.potentialSavings && (
                    <Chip
                      label={`Economia: R$ ${suggestion.potentialSavings.toFixed(
                        2
                      )}`}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: colors.success.light,
                        color: "white",
                      }}
                    />
                  )}
                </Box>
              ))}
            </GlassCard>
          </motion.div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Insights;
