import React, { useState, useMemo } from "react";
import {
  Container,
  Paper,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  ButtonGroup,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Avatar,
  IconButton,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Download as DownloadIcon,
  TrendingUp,
  TrendingDown,
  AccountBalanceWallet,
  Category as CategoryIcon,
  FilterList,
  Compare,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

import { format, parseISO, subMonths, isAfter, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useTransactions } from "../hooks/useTransactions";
import { useCategories } from "../hooks/useCategories";

// Registrar Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const ReportsPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState("6months");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { transactions, loading: loadingTransactions } = useTransactions();
  const { categories, loading: loadingCategories } = useCategories();

  const loading = loadingTransactions || loadingCategories;

  // Filtro de transações
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    let filtered = [...transactions];
    let now = new Date();
    let startDate = subMonths(now, 6);

    switch (timeRange) {
      case "1month":
        startDate = subMonths(now, 1);
        break;
      case "3months":
        startDate = subMonths(now, 3);
        break;
      case "1year":
        startDate = subMonths(now, 12);
        break;
      case "custom":
        if (dateRange.start) startDate = parseISO(dateRange.start);
    }

    filtered = filtered.filter((t) => {
      const d = parseISO(t.date);
      let ok = isAfter(d, startDate);

      if (timeRange === "custom" && dateRange.end)
        ok = ok && isBefore(d, parseISO(dateRange.end));

      return ok;
    });

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        selectedCategories.includes(t.categoryId)
      );
    }

    if (minAmount)
      filtered = filtered.filter((t) => Math.abs(t.amount) >= +minAmount);
    if (maxAmount)
      filtered = filtered.filter((t) => Math.abs(t.amount) <= +maxAmount);

    return filtered;
  }, [
    transactions,
    timeRange,
    selectedCategories,
    dateRange,
    minAmount,
    maxAmount,
  ]);

  // Dados do fluxo de caixa
  const cashFlowData = useMemo(() => {
    const monthly = {};

    filteredTransactions.forEach((t) => {
      const key = format(parseISO(t.date), "yyyy-MM");
      if (!monthly[key]) monthly[key] = { income: 0, expense: 0 };

      if (t.type === "income") monthly[key].income += t.amount;
      else monthly[key].expense += Math.abs(t.amount);
    });

    return Object.entries(monthly).map(([key, v]) => ({
      month: format(parseISO(key + "-01"), "MMM yyyy", { locale: ptBR }),
      ...v,
      net: v.income - v.expense,
    }));
  }, [filteredTransactions]);

  // Dados das categorias
  const categoryData = useMemo(() => {
    if (!categories || !filteredTransactions) return [];

    const map = {};

    filteredTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const c = categories.find((x) => x._id === t.categoryId);
        const name = c?.name || "Sem categoria";

        if (!map[name]) map[name] = { value: 0, color: c?.color || "#888" };

        map[name].value += Math.abs(t.amount);
      });

    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [filteredTransactions, categories]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    let income = 0,
      expense = 0;

    filteredTransactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += Math.abs(t.amount);
    });

    return {
      income,
      expense,
      balance: income - expense,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Componente de card de estatística
  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
          <Box>
            <Typography variant="subtitle2">{title}</Typography>
            <Typography variant="h5">
              R$ {value.toLocaleString("pt-BR")}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  // Função de exportação CSV
  const exportCSV = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      alert("Nenhuma transação para exportar");
      return;
    }

    const rows = filteredTransactions.map((t) => ({
      Data: t.date,
      Tipo: t.type,
      Valor: t.amount,
      Categoria:
        categories?.find((c) => c._id === t.categoryId)?.name ||
        "Sem categoria",
      Descrição: t.description || "",
    }));

    const header = Object.keys(rows[0]).join(";") + "\n";
    const body = rows.map((row) => Object.values(row).join(";")).join("\n");
    const csv = header + body;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = "relatorio.csv";
    a.click();

    setExportDialogOpen(false);
  };

  // Estado de loading
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <LinearProgress />
      </Container>
    );
  }

  // Renderização principal
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Relatórios e Análises
      </Typography>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Visão Geral" />
          <Tab label="Fluxo de Caixa" />
          <Tab label="Categorias" />
        </Tabs>
      </Paper>

      {/* FILTROS */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={timeRange}
                label="Período"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="1month">1 mês</MenuItem>
                <MenuItem value="3months">3 meses</MenuItem>
                <MenuItem value="6months">6 meses</MenuItem>
                <MenuItem value="1year">1 ano</MenuItem>
                <MenuItem value="custom">Personalizado</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {timeRange === "custom" && (
            <>
              <Grid item xs={6} md={3}>
                <TextField
                  type="date"
                  label="Início"
                  fullWidth
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  type="date"
                  label="Fim"
                  fullWidth
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categorias</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                label="Categorias"
                onChange={(e) => setSelectedCategories(e.target.value)}
              >
                {categories?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                )) || []}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              type="number"
              label="Valor Mínimo"
              fullWidth
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
            />
          </Grid>

          <Grid item xs={6} md={3}>
            <TextField
              type="number"
              label="Valor Máximo"
              fullWidth
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setExportDialogOpen(true)}
            >
              Exportar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Aba 0 - Visão Geral */}
      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Receitas"
              value={stats.income}
              color="green"
              icon={<TrendingUp />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              title="Despesas"
              value={stats.expense}
              color="red"
              icon={<TrendingDown />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              title="Saldo"
              value={stats.balance}
              color="blue"
              icon={<AccountBalanceWallet />}
            />
          </Grid>
        </Grid>
      )}

      {/* Aba 1 - Fluxo de Caixa */}
      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Evolução Mensal
          </Typography>

          {cashFlowData && cashFlowData.length > 0 ? (
            <Box height={400}>
              <Line
                data={{
                  labels: cashFlowData.map((x) => x.month),
                  datasets: [
                    {
                      label: "Receitas",
                      data: cashFlowData.map((x) => x.income),
                      borderColor: "green",
                      backgroundColor: "rgba(0, 255, 0, 0.1)",
                      fill: true,
                    },
                    {
                      label: "Despesas",
                      data: cashFlowData.map((x) => x.expense),
                      borderColor: "red",
                      backgroundColor: "rgba(255, 0, 0, 0.1)",
                      fill: true,
                    },
                    {
                      label: "Saldo Líquido",
                      data: cashFlowData.map((x) => x.net),
                      borderColor: "blue",
                      backgroundColor: "rgba(0, 0, 255, 0.1)",
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
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
          ) : (
            <Alert severity="info">
              Nenhum dado encontrado para o período selecionado.
            </Alert>
          )}
        </Paper>
      )}

      {/* Aba 2 - Categorias */}
      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Distribuição de Gastos
          </Typography>

          {categoryData && categoryData.length > 0 ? (
            <Box height={400}>
              <Doughnut
                data={{
                  labels: categoryData.map((c) => c.name),
                  datasets: [
                    {
                      data: categoryData.map((c) => c.value),
                      backgroundColor: categoryData.map((c) => c.color),
                      borderWidth: 2,
                      borderColor: "#fff",
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || "";
                          const value = context.parsed;
                          const total = context.dataset.data.reduce(
                            (a, b) => a + b,
                            0
                          );
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: R$ ${value.toLocaleString(
                            "pt-BR"
                          )} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </Box>
          ) : (
            <Alert severity="info">
              Nenhum gasto por categoria encontrado para o período selecionado.
            </Alert>
          )}
        </Paper>
      )}

      {/* Dialog de Exportação */}
      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      >
        <DialogTitle>Exportar Dados</DialogTitle>
        <DialogContent>
          <Typography>Escolha o formato para exportar seus dados:</Typography>
        </DialogContent>
        <DialogActions>
          <Button startIcon={<DownloadIcon />} onClick={exportCSV}>
            CSV
          </Button>
          <Button onClick={() => setExportDialogOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReportsPage;
