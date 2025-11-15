import React, { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Box,
  Select,
  MenuItem,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as InsightsIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../utils/format";
import GlassCard from "../components/common/GlassCard";
import { colors, gradients } from "../styles/designSystem";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    summary,
    monthlyData,
    categoriesData,
    recentTransactions,
    budgetProgress,
    isLoading,
  } = useDashboardData();
  const [chartPeriod, setChartPeriod] = useState("6");

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  const monthlyChartData = {
    labels: monthlyData?.labels || [],
    datasets: [
      {
        label: "Receitas",
        data: monthlyData?.income || [],
        borderColor: colors.success.main,
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Despesas",
        data: monthlyData?.expenses || [],
        borderColor: colors.error.main,
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryChartData = {
    labels: categoriesData?.labels || [],
    datasets: [
      {
        data: categoriesData?.values || [],
        backgroundColor: [
          colors.primary.main,
          colors.secondary.main,
          colors.success.main,
          colors.error.main,
          colors.warning.main,
          colors.info.main,
        ],
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header com Insights */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography variant="h4" fontWeight={700}>
            💰 Dashboard Financeiro
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Visão completa das suas finanças
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="contained"
            startIcon={<InsightsIcon />}
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/insights")}
            sx={{
              background: gradients.purpleBlue,
              color: "white",
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 12px 28px rgba(99, 102, 241, 0.4)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Ver Insights com IA
          </Button>
        </motion.div>
      </Box>

      <Grid container spacing={3}>
        {/* Cartões de resumo com GlassCard Premium */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard variant="default" blur={15} opacity={0.12}>
              <Box p={3}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  gutterBottom
                  fontWeight={600}
                >
                  💵 Saldo Total
                </Typography>
                <Typography
                  variant="h3"
                  component="div"
                  fontWeight={700}
                  color="primary.main"
                  my={1}
                >
                  {formatCurrency(summary?.balance || 0)}
                </Typography>
                <Chip
                  label={`Atualizado em ${new Date().toLocaleDateString()}`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    color: colors.primary.main,
                  }}
                />
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="success" blur={15} opacity={0.15}>
              <Box p={3}>
                <Typography
                  variant="body2"
                  color="white"
                  gutterBottom
                  fontWeight={600}
                >
                  📈 Receitas do Mês
                </Typography>
                <Typography
                  variant="h3"
                  component="div"
                  color="white"
                  fontWeight={700}
                  my={1}
                >
                  {formatCurrency(summary?.income || 0)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <TrendingUpIcon
                    sx={{ fontSize: 18, color: "white", mr: 0.5 }}
                  />
                  <Typography variant="caption" color="white">
                    Comparado ao mês anterior
                  </Typography>
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: gradients.sunset,
                color: "white",
                borderRadius: 2,
                boxShadow: "0 8px 20px rgba(239, 68, 68, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(239, 68, 68, 0.4)",
                },
              }}
            >
              <Typography variant="body2" gutterBottom fontWeight={600}>
                📉 Despesas do Mês
              </Typography>
              <Typography variant="h3" component="div" fontWeight={700} my={1}>
                {formatCurrency(summary?.expenses || 0)}
              </Typography>
              <Typography variant="caption">Gerencie seus gastos</Typography>
            </Paper>
          </motion.div>
        </Grid>

        {/* Gráfico de Fluxo Mensal */}
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    📊 Fluxo Mensal
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receitas vs Despesas
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Select
                    size="small"
                    value={chartPeriod}
                    onChange={(e) => setChartPeriod(e.target.value)}
                    sx={{ minWidth: 150 }}
                  >
                    <MenuItem value="6">Últimos 6 meses</MenuItem>
                    <MenuItem value="12">Último ano</MenuItem>
                  </Select>
                  <IconButton size="small" color="primary">
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Box>
              <Box sx={{ height: 350 }}>
                <Line
                  data={monthlyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top",
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Gráfico de Categorias */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                🎯 Gastos por Categoria
              </Typography>
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Doughnut
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                        labels: {
                          padding: 15,
                          usePointStyle: true,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Transações Recentes */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                🕐 Transações Recentes
              </Typography>
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <Box
                    key={transaction._id || index}
                    sx={{
                      py: 2,
                      borderBottom:
                        index < recentTransactions.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {transaction.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.category} •{" "}
                        {new Date(transaction.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color:
                          transaction.type === "income"
                            ? colors.success.main
                            : colors.error.main,
                      }}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(Math.abs(transaction.amount))}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  Nenhuma transação recente
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>

        {/* Progresso do Orçamento */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                💪 Progresso do Orçamento
              </Typography>
              {budgetProgress && budgetProgress.length > 0 ? (
                budgetProgress.map((budget, index) => (
                  <Box key={budget._id || index} sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        {budget.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(budget.spent)} /{" "}
                        {formatCurrency(budget.limit)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((budget.spent / budget.limit) * 100, 100)}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "rgba(0, 0, 0, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          bgcolor:
                            budget.spent > budget.limit
                              ? colors.error.main
                              : budget.spent > budget.limit * 0.8
                              ? colors.warning.main
                              : colors.success.main,
                        },
                      }}
                    />
                    {budget.spent > budget.limit && (
                      <Typography
                        variant="caption"
                        color="error"
                        sx={{ mt: 0.5, display: "block" }}
                      >
                        ⚠️ Orçamento excedido em{" "}
                        {formatCurrency(budget.spent - budget.limit)}
                      </Typography>
                    )}
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">
                  Nenhum orçamento cadastrado
                </Typography>
              )}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
