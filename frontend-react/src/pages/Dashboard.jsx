import { useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Box,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
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
import { useDashboardData } from "../hooks/useDashboardData";
import { formatCurrency } from "../utils/format";

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
        borderColor: "rgba(40, 167, 69, 0.8)",
        backgroundColor: "rgba(40, 167, 69, 0.2)",
        tension: 0.4,
      },
      {
        label: "Despesas",
        data: monthlyData?.expenses || [],
        borderColor: "rgba(220, 53, 69, 0.8)",
        backgroundColor: "rgba(220, 53, 69, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: categoriesData?.labels || [],
    datasets: [
      {
        data: categoriesData?.values || [],
        backgroundColor: [
          "#667eea",
          "#764ba2",
          "#10b981",
          "#ef4444",
          "#f59e0b",
          "#8b5cf6",
        ],
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Cartões de resumo */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
            }}
          >
            <Typography color="textSecondary" gutterBottom>
              Saldo Total
            </Typography>
            <Typography variant="h4" component="div">
              {formatCurrency(summary?.balance || 0)}
            </Typography>
            <Typography color="textSecondary" sx={{ flex: 1 }}>
              em {new Date().toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "success.light",
            }}
          >
            <Typography color="white" gutterBottom>
              Receitas do Mês
            </Typography>
            <Typography variant="h4" component="div" color="white">
              {formatCurrency(summary?.income || 0)}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 140,
              bgcolor: "error.light",
            }}
          >
            <Typography color="white" gutterBottom>
              Despesas do Mês
            </Typography>
            <Typography variant="h4" component="div" color="white">
              {formatCurrency(summary?.expenses || 0)}
            </Typography>
          </Paper>
        </Grid>

        {/* Gráfico de linha */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">Fluxo Mensal</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Select
                  size="small"
                  value={chartPeriod}
                  onChange={(e) => setChartPeriod(e.target.value)}
                >
                  <MenuItem value="6">Últimos 6 meses</MenuItem>
                  <MenuItem value="12">Último ano</MenuItem>
                </Select>
                <IconButton size="small">
                  <RefreshIcon />
                </IconButton>
              </Box>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line
                data={monthlyChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Gráfico de categorias */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Despesas por Categoria
            </Typography>
            <Box sx={{ height: 300 }}>
              <Doughnut
                data={categoryChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Transações recentes */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Transações Recentes
            </Typography>
            {recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <Box
                  key={transaction.id || transaction._id}
                  sx={{
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography>{transaction.description}</Typography>
                    <Typography
                      color={
                        transaction.type === "income"
                          ? "success.main"
                          : "error.main"
                      }
                    >
                      {transaction.type === "income" ? "+" : "-"}{" "}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {transaction.category?.name} •{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nenhuma transação recente
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Progresso do orçamento */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Orçamentos
            </Typography>
            {budgetProgress && budgetProgress.length > 0 ? (
              budgetProgress.map((budget) => {
                const percentage = (budget.spent / budget.limit) * 100;
                return (
                  <Box key={budget.id || budget._id} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>{budget.category?.name}</Typography>
                      <Typography>
                        {formatCurrency(budget.spent)} /{" "}
                        {formatCurrency(budget.limit)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(percentage, 100)}
                      color={
                        percentage > 90
                          ? "error"
                          : percentage > 70
                          ? "warning"
                          : "success"
                      }
                    />
                  </Box>
                );
              })
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nenhum orçamento cadastrado
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
