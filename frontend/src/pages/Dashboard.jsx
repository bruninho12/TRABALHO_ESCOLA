// src/pages/Dashboard.jsx
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
  ArrowForward as ArrowForwardIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Savings as SavingsIcon,
  MonetizationOn as MonetizationOnIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Lightbulb as InsightsIcon,
  TrendingUp as TrendingUpIcon,
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
import { keyframes } from "@mui/system";

import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../utils/format";
import GlassCard from "../components/common/GlassCard";
import InsightsPanel from "../components/InsightsPanel";
import { colors, gradients } from "../styles/designSystem";
import { useAuth } from "../contexts/AuthContext";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout";

// Responsive components
import {
  ResponsiveContainer,
  ResponsiveGrid,
  ResponsiveCard,
  ResponsiveStack,
  useResponsive,
} from "../components/ResponsiveComponents";

// register chart.js components
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

// Quadro-chave de rotação simples usado pelo ícone de atualização
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* =====================
   Subcomponentes (em linha)
   ===================== */

/* HeaderSection */
const HeaderSection = ({ navigate }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
      <Typography variant="h4" color="green" fontWeight={700}>
        💰 Dashboard Financeiro
      </Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        Visão completa das suas finanças
      </Typography>
    </motion.div>

    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<CreditCardIcon />}
          onClick={() => navigate("/dashboard/pricing")}
          sx={{
            fontWeight: 600,
            px: 3,
            py: 1.25,
            borderRadius: 2,
            borderWidth: 2,
          }}
        >
          Ver Planos Premium
        </Button>

        <Button
          variant="contained"
          startIcon={<InsightsIcon />}
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate("/dashboard/insights")}
          sx={{
            background: gradients.purpleBlue,
            color: "white",
            fontWeight: 600,
            px: 3,
            py: 1.25,
            borderRadius: 2,
          }}
        >
          Ver Insights com IA
        </Button>
      </Stack>
    </motion.div>
  </Box>
);

/* MainCards - compõe os 4 cards principais (Saldo, Receitas, e cartões secundários)
   Note: cada bloco retorna Grid item(s) para serem usados dentro de ResponsiveGrid
*/
const MainCards = ({ summary, computedMetrics, isMobile, isMobileSmall }) => {
  return (
    <>
      {/* Saldo Total */}
      <Grid item xs={12} md={2} lg={2}>
        <ResponsiveCard>
          <Box>
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
                  opacity: 0.75,
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
                  bgcolor: "rgba(99, 102, 241, 0.08)",
                  color: colors.primary.main,
                  fontWeight: 500,
                }}
              />
              {computedMetrics.savingsRate > 0 && (
                <Chip
                  label={`${computedMetrics.savingsRate.toFixed(1)}% economia`}
                  size="small"
                  color="success"
                />
              )}
            </Stack>
          </Box>
        </ResponsiveCard>
      </Grid>

      {/* Receitas do mês (card vertical) */}
      <Grid item xs={12} md={2} lg={2}>
        <ResponsiveCard>
          <Box>
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
              variant="h4"
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

              <Typography variant="body2" color="primary.main" fontWeight={600}>
                {(() => {
                  const currentIncome = summary?.income || 0;
                  const lastIncome = summary?.lastMonthIncome || 0;
                  if (lastIncome === 0) return "N/A";
                  const percentage = (currentIncome / lastIncome) * 100 - 100;
                  return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(
                    1
                  )}%`;
                })()}
              </Typography>
            </Box>
          </Box>
        </ResponsiveCard>
      </Grid>

      {/* Caixa com 4 pequenos indicadores (envl. em um item md=6 para manter alinhamento) */}
      <Grid item xs={12} md={6} lg={6}>
        <ResponsiveCard>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  bgcolor: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16,185,129,0.12)",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SavingsIcon sx={{ color: colors.success.main, mr: 1 }} />
                    <Typography
                      variant="body2"
                      color="primary.main"
                      fontWeight={600}
                    >
                      Taxa de Economia
                    </Typography>
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="success.main"
                  >
                    {computedMetrics.savingsRate?.toFixed(1) || 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  bgcolor: "rgba(99, 102, 241, 0.05)",
                  border: "1px solid rgba(99,102,241,0.12)",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
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
                    variant="h5"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {computedMetrics.financialHealth?.toFixed(0) || 0}/100
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  bgcolor: "rgba(139, 92, 246, 0.05)",
                  border: "1px solid rgba(139,92,246,0.12)",
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
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
                    variant="h5"
                    fontWeight={700}
                    color="secondary.main"
                  >
                    {computedMetrics.goalCompletionRate?.toFixed(0) || 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={6} sm={3}>
              <Card
                sx={{
                  bgcolor:
                    computedMetrics.expenseGrowth > 10
                      ? "rgba(239,68,68,0.05)"
                      : "rgba(245,158,11,0.05)",
                  border: `1px solid ${
                    computedMetrics.expenseGrowth > 10
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(245,158,11,0.12)"
                  }`,
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
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
                    variant="h5"
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
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </ResponsiveCard>
      </Grid>
    </>
  );
};

/* ChartsSection - contains Fluxo Mensal (Line) e Gastos por Categoria (Doughnut) */
const ChartsSection = ({
  monthlyChartData,
  categoryChartData,
  chartPeriod,
  setChartPeriod,
  refreshing,
  onRefresh,
}) => {
  return (
    <>
      <Grid item xs={12} md={6} lg={6}>
        <ResponsiveCard>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Box>
              <Typography variant="h6" color="primary.main" fontWeight={600}>
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
                sx={{ minWidth: 140 }}
              >
                <MenuItem value="6">Últimos 6 meses</MenuItem>
                <MenuItem value="12">Último ano</MenuItem>
              </Select>

              <IconButton size="small" color="primary" onClick={onRefresh}>
                <RefreshIcon
                  color="primary"
                  sx={{
                    ...(refreshing && {
                      animation: `${spin} 1s linear infinite`,
                    }),
                  }}
                />
              </IconButton>
            </Box>
          </Box>

          {/* Forçar a altura para evitar esticar outros cards */}
          <Box sx={{ height: 320 }}>
            <Line
              data={monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "top", labels: { usePointStyle: true } },
                },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </Box>
        </ResponsiveCard>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <ResponsiveCard>
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
              height: 320,
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
                    labels: { padding: 12, usePointStyle: true },
                  },
                },
              }}
            />
          </Box>
        </ResponsiveCard>
      </Grid>
    </>
  );
};

/* RecentTransactions */
const RecentTransactionsBloc = ({ recentTransactions }) => (
  <ResponsiveCard sx={{ width: "100%" }}>
    <Typography variant="h6" color="primary.main" gutterBottom fontWeight={600}>
      🕐 Transações Recentes
    </Typography>

    {recentTransactions && recentTransactions.length > 0 ? (
      recentTransactions.map((transaction, index) => (
        <Box
          key={transaction._id || index}
          sx={{
            py: 2,
            borderBottom:
              index < recentTransactions.length - 1 ? "1px solid" : "none",
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
      <Typography color="text.secondary">Nenhuma transação recente</Typography>
    )}
  </ResponsiveCard>
);

/* BudgetProgress */
const BudgetProgressBloc = ({ budgetProgress }) => (
  <ResponsiveCard sx={{ width: "100%" }}>
    <Typography variant="h6" color="primary.main" gutterBottom fontWeight={600}>
      💪 Progresso do Orçamento
    </Typography>

    {budgetProgress && budgetProgress.length > 0 ? (
      budgetProgress.map((budget, index) => (
        <Box key={budget._id || index} sx={{ mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {budget.category?.name || budget.category}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
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
  </ResponsiveCard>
);

/* Ações rápidas (flutuantes) */
const QuickActions = ({ show, navigate }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.6 }}
        style={{ position: "fixed", bottom: 120, right: 20, zIndex: 1100 }}
      >
        <Stack spacing={1}>
          <Tooltip title="Nova Transação" placement="left">
            <Fab
              size="small"
              color="success"
              onClick={() => navigate("/transactions")}
            >
              <MonetizationOnIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="Nova Meta" placement="left">
            <Fab
              size="small"
              color="secondary"
              onClick={() => navigate("/goals")}
            >
              <TimelineIcon />
            </Fab>
          </Tooltip>

          <Tooltip title="Ver Insights" placement="left">
            <Fab
              size="small"
              sx={{ bgcolor: colors.warning.main }}
              onClick={() => navigate("/insights")}
            >
              <InsightsIcon />
            </Fab>
          </Tooltip>
        </Stack>
      </motion.div>
    )}
  </AnimatePresence>
);

/* Botão flutuante de atualização */
const RefreshButton = ({ onClick, refreshing }) => (
  <Tooltip title={refreshing ? "Atualizando dados..." : "Atualizar dados"}>
    <span>
      <IconButton
        onClick={onClick}
        disabled={refreshing}
        sx={{
          position: "fixed",
          top: 100,
          right: 20,
          backgroundColor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
        }}
      >
        <RefreshIcon
          color="primary"
          sx={{
            ...(refreshing && { animation: `${spin} 1s linear infinite` }),
          }}
        />
      </IconButton>
    </span>
  </Tooltip>
);

/* =====================
   Dashboard main export
   ===================== */
export default function Dashboard() {
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

  // computed metrics
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

  // gráficos de formas de dados (defensivos)
  const monthlyChartData = useMemo(() => {
    if (!monthlyData) return { labels: [], datasets: [] };
    return {
      labels: monthlyData.labels || [],
      datasets: [
        {
          label: "Receitas",
          data: monthlyData.income || [],
          borderColor: colors.success.main,
          backgroundColor: "rgba(16,185,129,0.06)",
          tension: 0.3,
          fill: true,
        },
        {
          label: "Despesas",
          data: monthlyData.expenses || [],
          borderColor: colors.error.main,
          backgroundColor: "rgba(239,68,68,0.06)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [monthlyData]);

  const categoryChartData = useMemo(() => {
    if (!categoriesData) return { labels: [], datasets: [] };
    const labels = categoriesData.labels || [];
    const values = categoriesData.data || [];
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
          ].slice(0, labels.length),
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  }, [categoriesData]);

  // refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshData();
    } catch (err) {
      console.error("Erro ao atualizar dados do dashboard:", err);
    } finally {
      setRefreshing(false);
    }
  }, [refreshData]);

  // Loading state
  if (isLoading) {
    return (
      <ResponsiveContainer>
        <ResponsiveGrid spacing={2} columns={{ xs: 1, sm: 2, md: 2, lg: 3 }}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <ResponsiveCard>
                <Skeleton
                  variant="text"
                  width="60%"
                  height={isMobile ? 20 : 28}
                  sx={{ mb: 1 }}
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={isMobile ? 80 : 110}
                  sx={{ borderRadius: 2 }}
                />
              </ResponsiveCard>
            </Grid>
          ))}
        </ResponsiveGrid>
      </ResponsiveContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <ResponsiveContainer>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="body1" fontWeight={600}>
                Erro ao carregar dados do dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {error.message}
              </Typography>
            </Box>
            <Button onClick={handleRefresh}>Tentar Novamente</Button>
          </Box>
        </Alert>
      </ResponsiveContainer>
    );
  }

  // Main render
  return (
    <ResponsiveContainer maxWidth="xl">
      <HeaderSection navigate={navigate} />

      {user && <InsightsPanel userId={user._id || user.id} />}

      {/* SECTION 1: Main cards */}
      <ResponsiveGrid spacing={2} columns={{ xs: 1, sm: 2, md: 4, lg: 4 }}>
        {/* MainCards returns Grid items */}
        <MainCards
          summary={summary}
          computedMetrics={computedMetrics}
          isMobile={isMobile}
          isMobileSmall={isMobileSmall}
        />
      </ResponsiveGrid>

      {/* SECTION 2: Charts */}
      <ResponsiveGrid spacing={2} columns={{ xs: 1, sm: 2, md: 2 }}>
        <ChartsSection
          monthlyChartData={monthlyChartData}
          categoryChartData={categoryChartData}
          chartPeriod={chartPeriod}
          setChartPeriod={setChartPeriod}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </ResponsiveGrid>

      {/* SECTION 3: Recent Transactions & Budget */}
      <ResponsiveGrid spacing={2} columns={{ xs: 1, sm: 2, md: 2 }}>
        <Grid item xs={12} md={6}>
          <RecentTransactionsBloc recentTransactions={recentTransactions} />
        </Grid>

        <Grid item xs={12} md={6}>
          <BudgetProgressBloc budgetProgress={budgetProgress} />
        </Grid>
      </ResponsiveGrid>

      {/* ações flutuantes */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: gradients.purpleBlue,
          "&:hover": { transform: "scale(1.05)" },
        }}
        onClick={() => setShowQuickActions((s) => !s)}
      >
        <AddIcon />
      </Fab>

      <QuickActions show={showQuickActions} navigate={navigate} />

      <RefreshButton onClick={handleRefresh} refreshing={refreshing} />

      <MercadoPagoCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan="silver"
        onSuccess={() => {
          setCheckoutOpen(false);
          refreshData?.();
        }}
      />
    </ResponsiveContainer>
  );
}
