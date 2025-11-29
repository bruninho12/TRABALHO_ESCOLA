import React, { useState, useMemo, useCallback } from "react";
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
  Card,
  CardContent,
  Fab,
  Tooltip,
  Alert,
  Skeleton,
  Stack,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Lightbulb as InsightsIcon,
  ArrowForward as ArrowForwardIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon,
  MonetizationOn as MonetizationOnIcon,
  Speed as SpeedIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../utils/format";
import GlassCard from "../components/common/GlassCard";
import InsightsPanel from "../components/InsightsPanel";
import { colors, gradients } from "../styles/designSystem";
import { useAuth } from "../contexts/AuthContext";
import { validateProgressValue } from "../utils/progressValidation";
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  useResponsive,
} from "../components/ResponsiveComponents";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  Filler
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isMobile, isMobileSmall } = useResponsive();
  const {
    summary,
    monthlyData,
    categoriesData,
    recentTransactions,
    budgetProgress,
    isLoading,
    error,
    refreshData,
  } = useDashboardData();
  const [chartPeriod, setChartPeriod] = useState("6");
  const [refreshing, setRefreshing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("silver");

  // Dados computados com memoização
  const computedMetrics = useMemo(() => {
    if (!summary)
      return {
        savingsRate: 0,
        expenseGrowth: 0,
        goalCompletionRate: 0,
        financialHealth: 0,
      };

    const income = summary.income || 0;
    const expenses = summary.expenses || 0;
    const lastMonthExpenses = summary.lastMonthExpenses || 0;
    const totalGoals = summary.totalGoals || 0;
    const completedGoals = summary.completedGoals || 0;

    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const expenseGrowth =
      lastMonthExpenses > 0
        ? ((expenses - lastMonthExpenses) / lastMonthExpenses) * 100
        : 0;
    const goalCompletionRate =
      totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
      savingsRate: Math.max(0, Math.min(100, savingsRate)),
      expenseGrowth,
      goalCompletionRate,
      financialHealth: Math.max(
        0,
        Math.min(100, (savingsRate + goalCompletionRate) / 2)
      ),
    };
  }, [summary]);

  // Dados dos gráficos com memoização
  const monthlyChartData = useMemo(
    () => ({
      labels: monthlyData?.labels || [],
      datasets: [
        {
          label: "Receitas",
          data: monthlyData?.income || [],
          borderColor: colors.success.main,
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.success.main,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: "Despesas",
          data: monthlyData?.expenses || [],
          borderColor: colors.error.main,
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          tension: 0.4,
          fill: true,
          pointBackgroundColor: colors.error.main,
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    }),
    [monthlyData]
  );

  const categoryChartData = useMemo(() => {
    const labels = categoriesData?.labels || [];
    const values = categoriesData?.values || [];

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            colors.primary.main,
            colors.secondary.main,
            colors.success.main,
            colors.error.main,
            colors.warning.main,
            colors.info.main,
          ].slice(0, labels.length), // Garantir que temos cores suficientes
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  }, [categoriesData]);

  // Função de refresh com feedback visual
  const handleRefresh = useCallback(async () => {
    if (!refreshData) {
      console.warn("Função refreshData não disponível");
      return;
    }

    setRefreshing(true);
    try {
      await refreshData();
    } catch (error) {
      console.error("Erro ao atualizar dados do dashboard:", {
        message: error?.message || "Erro desconhecido",
        stack: error?.stack,
      });
    } finally {
      setRefreshing(false);
    }
  }, [refreshData]);

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <ResponsiveGrid
          columns={{ xs: 1, sm: 2, md: 2, lg: 3 }}
          spacing={{ xs: 1, sm: 1.5, md: 2 }}
        >
          {[...Array(6)].map((_, index) => (
            <ResponsiveCard key={index} elevation={1}>
              <Skeleton
                variant="text"
                width="60%"
                height={isMobile ? 24 : 32}
                sx={{ mb: 1 }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={isMobile ? 18 : 24}
                sx={{ mb: 1 }}
              />
              <Skeleton
                variant="rectangular"
                width="100%"
                height={isMobile ? 80 : 100}
                sx={{ borderRadius: 2 }}
              />
            </ResponsiveCard>
          ))}
        </ResponsiveGrid>
      </ResponsiveContainer>
    );
  }

  if (error) {
    return (
      <ResponsiveContainer>
        <Alert
          severity="error"
          sx={{
            borderRadius: 3,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            "& .MuiAlert-message": {
              width: "100%",
            },
            "& .MuiAlert-action": {
              pl: { xs: 0, sm: 2 },
              pt: { xs: 1, sm: 0 },
              alignSelf: { xs: "stretch", sm: "center" },
            },
          }}
          action={
            <Button
              color="inherit"
              size={isMobile ? "small" : "medium"}
              onClick={handleRefresh}
              fullWidth={isMobile}
              sx={{
                minHeight: { xs: 44, sm: "auto" },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
              }}
            >
              Tentar Novamente
            </Button>
          }
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              gap: { xs: 1, sm: 0 },
            }}
          >
            <Typography
              variant={isMobile ? "body2" : "body1"}
              sx={{ fontWeight: 500 }}
            >
              Erro ao carregar dados do dashboard
            </Typography>
            {!isMobile && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                {error.message}
              </Typography>
            )}
          </Box>
        </Alert>
      </ResponsiveContainer>
    );
  }

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
          <Typography variant="h4" color="green" fontWeight={700}>
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
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<CreditCardIcon />}
              onClick={() => {
                setSelectedPlan("silver");
                setCheckoutOpen(true);
              }}
              sx={{
                fontWeight: 600,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                  transform: "translateY(-2px)",
                },
              }}
            >
              Testar Pagamento
            </Button>
            <Button
              variant="contained"
              startIcon={<InsightsIcon />}
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("./insights")}
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
          </Stack>
        </motion.div>
      </Box>

      {/* Painel de Insights Inteligentes */}
      {user && <InsightsPanel userId={user._id || user.id} />}

      {/* Cards Principais - Responsivos */}
      <ResponsiveGrid
        columns={{ xs: 1, sm: 2, md: 3, lg: 3 }}
        spacing={{ xs: 1.5, sm: 2, md: 3 }}
      >
        {/* Cartão de Saldo Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard variant="default" blur={15} opacity={0.12}>
            <Box p={{ xs: 2, sm: 2.5, md: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography
                  variant={isMobile ? "caption" : "body2"}
                  color="text.secondary"
                  gutterBottom
                  fontWeight={600}
                  sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
                >
                  💵 Saldo Total
                </Typography>
                <AccountBalanceIcon
                  sx={{
                    color: colors.primary.main,
                    opacity: 0.7,
                    fontSize: { xs: 20, sm: 24 },
                  }}
                />
              </Box>
              <Typography
                variant={isMobileSmall ? "h5" : isMobile ? "h4" : "h3"}
                component="div"
                fontWeight={700}
                color="primary.main"
                my={1}
                sx={{
                  background: gradients.purpleBlue,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1.2,
                }}
              >
                {formatCurrency(summary?.balance || 0)}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={`Atualizado agora`}
                  size="small"
                  sx={{
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    color: colors.primary.main,
                    fontWeight: 500,
                  }}
                />
                {computedMetrics.savingsRate > 0 && (
                  <Chip
                    label={`${computedMetrics.savingsRate.toFixed(
                      1
                    )}% economia`}
                    size="small"
                    color="success"
                  />
                )}
              </Stack>
            </Box>
          </GlassCard>
        </motion.div>

        {/* Cartão de Receitas - Melhorado */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard variant="success" blur={15} opacity={0.15}>
              <Box p={3}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography
                    variant="body2"
                    color="primary.main"
                    gutterBottom
                    fontWeight={600}
                  >
                    📈 Receitas do Mês
                  </Typography>
                  <MonetizationOnIcon
                    sx={{ color: "primary.main", opacity: 0.9 }}
                  />
                </Box>
                <Typography
                  variant="h3"
                  component="div"
                  color="primary.main"
                  fontWeight={700}
                  my={1}
                >
                  {formatCurrency(summary?.income || 0)}
                </Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center">
                    <TrendingUpIcon
                      sx={{ fontSize: 18, color: "primary.main", mr: 0.5 }}
                    />
                    <Typography variant="caption" color="primary.main">
                      vs. mês anterior
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body2"
                    color="primary.main"
                    fontWeight={600}
                  >
                    {(() => {
                      const currentIncome = summary?.income || 0;
                      const lastIncome = summary?.lastMonthIncome || 0;
                      if (lastIncome === 0) return "N/A";
                      const percentage =
                        (currentIncome / lastIncome) * 100 - 100;
                      return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(
                        1
                      )}%`;
                    })()}
                  </Typography>
                </Box>
              </Box>
            </GlassCard>
          </motion.div>
        </Grid>

        {/* Cartão de Despesas - Melhorado */}
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
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 12px 28px rgba(239, 68, 68, 0.4)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "50%",
                  transform: "translate(30%, -30%)",
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="body2" gutterBottom fontWeight={600}>
                  📉 Despesas do Mês
                </Typography>
                <CreditCardIcon sx={{ color: "white", opacity: 0.9 }} />
              </Box>
              <Typography variant="h3" component="div" fontWeight={700} my={1}>
                {formatCurrency(summary?.expenses || 0)}
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="caption">Gerencie seus gastos</Typography>
                {computedMetrics.expenseGrowth && (
                  <Stack direction="row" alignItems="center">
                    {computedMetrics.expenseGrowth > 0 ? (
                      <TrendingUpIcon sx={{ fontSize: 16, color: "white" }} />
                    ) : (
                      <TrendingDownIcon sx={{ fontSize: 16, color: "white" }} />
                    )}
                    <Typography variant="caption" ml={0.5}>
                      {Math.abs(computedMetrics.expenseGrowth).toFixed(1)}%
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        {/* Nova Seção: Métricas Avançadas */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
              <Typography
                variant="h6"
                color="primary.main"
                fontWeight={600}
                mb={3}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <SpeedIcon sx={{ mr: 1, color: colors.primary.main }} />
                🎯 Métricas de Performance Financeira
              </Typography>

              <Grid container spacing={3}>
                {/* Taxa de Poupança */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      bgcolor: "rgba(16, 185, 129, 0.05)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <SavingsIcon
                          sx={{ color: colors.success.main, mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight={600}
                        >
                          Taxa de Economia
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="success.main"
                      >
                        {computedMetrics.savingsRate?.toFixed(1) || 0}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          Math.max(computedMetrics.savingsRate || 0, 0),
                          100
                        )}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "rgba(16, 185, 129, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: colors.success.main,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Saúde Financeira */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      bgcolor: "rgba(99, 102, 241, 0.05)",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <AssessmentIcon
                          sx={{ color: colors.primary.main, mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="primary.main"
                          fontWeight={600}
                        >
                          Saúde Financeira
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="primary.main"
                      >
                        {computedMetrics.financialHealth?.toFixed(0) || 0}/100
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={validateProgressValue(
                          computedMetrics.financialHealth || 0
                        )}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "rgba(99, 102, 241, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: colors.primary.main,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Progresso de Metas */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      bgcolor: "rgba(139, 92, 246, 0.05)",
                      border: "1px solid rgba(139, 92, 246, 0.2)",
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <TimelineIcon
                          sx={{ color: colors.secondary.main, mr: 1 }}
                        />
                        <Typography
                          variant="body2"
                          color="secondary.main"
                          fontWeight={600}
                        >
                          Progresso de Metas
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        color="secondary.main"
                      >
                        {computedMetrics.goalCompletionRate?.toFixed(0) || 0}%
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          Math.max(computedMetrics.goalCompletionRate || 0, 0),
                          100
                        )}
                        sx={{
                          mt: 1,
                          height: 6,
                          borderRadius: 3,
                          bgcolor: "rgba(139, 92, 246, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: colors.secondary.main,
                            borderRadius: 3,
                          },
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Crescimento de Despesas */}
                <Grid item xs={12} sm={6} md={3}>
                  <Card
                    sx={{
                      bgcolor:
                        computedMetrics.expenseGrowth > 10
                          ? "rgba(239, 68, 68, 0.05)"
                          : "rgba(245, 158, 11, 0.05)",
                      border: `1px solid ${
                        computedMetrics.expenseGrowth > 10
                          ? "rgba(239, 68, 68, 0.2)"
                          : "rgba(245, 158, 11, 0.2)"
                      }`,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <BarChartIcon
                          sx={{
                            color:
                              computedMetrics.expenseGrowth > 10
                                ? colors.error.main
                                : colors.warning.main,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="body2"
                          color={
                            computedMetrics.expenseGrowth > 10
                              ? "error.main"
                              : "warning.main"
                          }
                          fontWeight={600}
                        >
                          Crescimento Gastos
                        </Typography>
                      </Box>
                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{
                          color:
                            computedMetrics.expenseGrowth > 10
                              ? colors.error.main
                              : colors.warning.main,
                        }}
                      >
                        {computedMetrics.expenseGrowth?.toFixed(1) || 0}%
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            computedMetrics.expenseGrowth > 10
                              ? colors.error.main
                              : colors.warning.main,
                        }}
                      >
                        vs. mês anterior
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
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
                  <Typography
                    variant="h6"
                    color="primary.main"
                    fontWeight={600}
                  >
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
              <Typography
                variant="h6"
                color="primary.main"
                gutterBottom
                fontWeight={600}
              >
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
              <Typography
                variant="h6"
                color="primary.main"
                gutterBottom
                fontWeight={600}
              >
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
                        {transaction.category?.name || transaction.category} •{" "}
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
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
            <Typography
              variant="h6"
              color="primary.main"
              gutterBottom
              fontWeight={600}
            >
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
                      {budget.category?.name || budget.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatCurrency(budget.spent)} /{" "}
                      {formatCurrency(budget.limit)}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      Math.max((budget.spent / (budget.limit || 1)) * 100, 0),
                      100
                    )}
                    aria-label={`Progresso do orçamento para ${
                      budget.category?.name || budget.category
                    }`}
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
      </ResponsiveGrid>

      {/* Botão Flutuante de Ações Rápidas */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: gradients.purpleBlue,
          "&:hover": {
            transform: "scale(1.1)",
            boxShadow: "0 8px 25px rgba(99, 102, 241, 0.4)",
          },
          transition: "all 0.3s ease",
        }}
        onClick={() => setShowQuickActions(!showQuickActions)}
      >
        <AddIcon />
      </Fab>

      {/* Menu de Ações Rápidas */}
      <AnimatePresence>
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: "fixed",
              bottom: 100,
              right: 20,
              zIndex: 1000,
            }}
          >
            <Stack spacing={1}>
              <Tooltip title="Nova Transação" placement="left">
                <Fab
                  size="small"
                  color="success"
                  onClick={() => navigate("/transactions")}
                  sx={{ "&:hover": { transform: "scale(1.1)" } }}
                >
                  <MonetizationOnIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Nova Meta" placement="left">
                <Fab
                  size="small"
                  color="secondary"
                  onClick={() => navigate("/goals")}
                  sx={{ "&:hover": { transform: "scale(1.1)" } }}
                >
                  <TimelineIcon />
                </Fab>
              </Tooltip>
              <Tooltip title="Ver Insights" placement="left">
                <Fab
                  size="small"
                  color="warning"
                  onClick={() => navigate("/insights")}
                  sx={{ "&:hover": { transform: "scale(1.1)" } }}
                >
                  <InsightsIcon />
                </Fab>
              </Tooltip>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão de Refresh */}
      <Tooltip title={refreshing ? "Atualizando dados..." : "Atualizar dados"}>
        <span>
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              position: "fixed",
              top: 100,
              right: 20,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
              ...(refreshing && {
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }),
            }}
          >
            <RefreshIcon color="primary" />
          </IconButton>
        </span>
      </Tooltip>

      {/* Modal de Checkout MercadoPago */}
      <MercadoPagoCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={selectedPlan}
        onSuccess={() => {
          setCheckoutOpen(false);
          refreshData();
        }}
      />
    </Box>
  );
};

export default Dashboard;
