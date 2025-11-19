import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  Chip,
  Avatar,
  IconButton,
  Alert,
  AlertTitle,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Skeleton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Snackbar,
  CardHeader,
  Switch,
  FormControlLabel,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  CreditCard as CreditCardIcon,
  Payment as PaymentIcon,
  AccountBalance as BankIcon,
  QrCode as PixIcon,
  Receipt as BoletoIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  ExpandMore as ExpandMoreIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Dashboard as DashboardIcon,
  MonetizationOn as MonetizationOnIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import axios from "axios";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

// Interface customizada para TabPanel
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Componente de estatísticas
function StatsCard({ title, value, icon, color, trend, trendValue }) {
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {trend && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {trend === "up" ? (
                  <TrendingUpIcon color="success" fontSize="small" />
                ) : (
                  <TrendingDownIcon color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend === "up" ? "success.main" : "error.main"}
                >
                  {trendValue}
                </Typography>
              </Stack>
            )}
          </Box>
          <Avatar sx={{ bgcolor: `${color}20`, color }}>{icon}</Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Componente de método de pagamento
function PaymentMethodCard({ method, isSelected, onSelect, onEdit }) {
  const getMethodIcon = (type) => {
    switch (type) {
      case "credit_card":
        return <CreditCardIcon />;
      case "debit_card":
        return <CreditCardIcon />;
      case "pix":
        return <PixIcon />;
      case "boleto":
        return <BoletoIcon />;
      case "bank_transfer":
        return <BankIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const getMethodColor = (type) => {
    switch (type) {
      case "credit_card":
        return "#1976d2";
      case "debit_card":
        return "#388e3c";
      case "pix":
        return "#00695c";
      case "boleto":
        return "#f57c00";
      case "bank_transfer":
        return "#5e35b1";
      default:
        return "#757575";
    }
  };

  return (
    <Card
      sx={{
        border: isSelected ? "2px solid #1976d2" : "1px solid #e0e0e0",
        cursor: "pointer",
        transition: "all 0.2s ease",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-1px)",
        },
      }}
      onClick={onSelect}
    >
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: getMethodColor(method.type) }}>
              {getMethodIcon(method.type)}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="medium">
                {method.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {method.description}
              </Typography>
            </Box>
          </Stack>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit(method);
            }}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
}

// Dados mockados para desenvolvimento (fora do componente para evitar re-criação)
const mockPayments = [
  {
    _id: "1",
    amount: 29.9,
    description: "Assinatura Premium",
    status: "completed",
    paymentMethod: "credit_card",
    date: new Date().toISOString(),
    type: "subscription",
  },
  {
    _id: "2",
    amount: 15.0,
    description: "Compra de créditos",
    status: "pending",
    paymentMethod: "pix",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: "purchase",
  },
  {
    _id: "3",
    amount: 50.0,
    description: "Upgrade de conta",
    status: "completed",
    paymentMethod: "boleto",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: "upgrade",
  },
];

const PaymentsPage = () => {
  // Estados principais
  const [tabValue, setTabValue] = useState(0);
  const [payments, setPayments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  // Estados de filtros
  const [filters, setFilters] = useState({
    status: "",
    paymentMethod: "",
    startDate: null,
    endDate: null,
    search: "",
  });

  // Estados de paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Estados de diálogos
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [openMethodDialog, setOpenMethodDialog] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);

  // Estados de formulários
  const [paymentData, setPaymentData] = useState({
    amount: "",
    description: "",
    paymentMethod: "credit_card",
    type: "purchase",
  });

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "credit_card",
      name: "Cartão de Crédito",
      description: "Visa **** 1234",
      isDefault: true,
    },
    {
      id: "2",
      type: "pix",
      name: "PIX",
      description: "Chave: usuario@email.com",
      isDefault: false,
    },
    {
      id: "3",
      type: "boleto",
      name: "Boleto Bancário",
      description: "Vencimento em 3 dias úteis",
      isDefault: false,
    },
  ]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("1");
  const [newMethodData, setNewMethodData] = useState({
    type: "credit_card",
    name: "",
    description: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  // Carregar dados
  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("finance_flow_token");
      const response = await axios.get(`${apiUrl}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, page: page + 1, limit: rowsPerPage },
      });
      setPayments(response.data.data || mockPayments);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
      setPayments(mockPayments);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, filters, page, rowsPerPage]);

  const loadSubscription = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const response = await axios.get(`${apiUrl}/payments/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscription(
        response.data.data || {
          plan: "Premium",
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: "active",
          amount: 29.9,
        }
      );
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
      setSubscription({
        plan: "Premium",
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "active",
        amount: 29.9,
      });
    }
  }, [apiUrl]);

  const loadPaymentStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const response = await axios.get(`${apiUrl}/payments/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const stats = response.data.data || [];

      // Calcular estatísticas
      const total = stats.reduce((sum, stat) => sum + stat.total, 0);
      const thisMonth = stats[stats.length - 1]?.total || 94.9;
      const lastMonth = stats[stats.length - 2]?.total || 79.9;
      const pending = payments.filter((p) => p.status === "pending").length;

      setPaymentStats({ total, thisMonth, lastMonth, pending });
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
      // Mock data
      setPaymentStats({
        total: 3250.8,
        thisMonth: 94.9,
        lastMonth: 79.9,
        pending: 1,
      });
    }
  }, [apiUrl, payments]);

  // Effect para carregar dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("finance_flow_token");

        // Carregar pagamentos com filtros e paginação apenas do estado atual
        try {
          const paymentsResponse = await axios.get(`${apiUrl}/payments`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { page: 1, limit: 10 }, // Valores iniciais fixos
          });
          setPayments(paymentsResponse.data.data || mockPayments);
        } catch (error) {
          console.error("Erro ao carregar pagamentos:", error);
          setPayments(mockPayments);
        }

        // Carregar assinatura
        try {
          const subscriptionResponse = await axios.get(
            `${apiUrl}/payments/subscription`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setSubscription(
            subscriptionResponse.data.data || {
              plan: "Premium",
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
              status: "active",
              amount: 29.9,
            }
          );
        } catch (error) {
          console.error("Erro ao carregar assinatura:", error);
          setSubscription({
            plan: "Premium",
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: "active",
            amount: 29.9,
          });
        }

        // Carregar estatísticas
        try {
          const statsResponse = await axios.get(`${apiUrl}/payments/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const stats = statsResponse.data.data || [];
          setPaymentStats({
            total:
              stats.reduce((sum, stat) => sum + (stat.total || 0), 0) || 3250.8,
            thisMonth: stats[stats.length - 1]?.total || 94.9,
            lastMonth: stats[stats.length - 2]?.total || 79.9,
            pending: 1,
          });
        } catch (error) {
          console.error("Erro ao carregar estatísticas:", error);
          setPaymentStats({
            total: 3250.8,
            thisMonth: 94.9,
            lastMonth: 79.9,
            pending: 1,
          });
        }
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [apiUrl]); // Apenas a dependência da API

  // Effect separado para carregar pagamentos quando filtros/paginação mudam
  useEffect(() => {
    const loadFilteredPayments = async () => {
      try {
        const token = localStorage.getItem("finance_flow_token");
        const paymentsResponse = await axios.get(`${apiUrl}/payments`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { ...filters, page: page + 1, limit: rowsPerPage },
        });
        setPayments(paymentsResponse.data.data || mockPayments);
      } catch (error) {
        console.error("Erro ao carregar pagamentos filtrados:", error);
        setPayments(mockPayments);
      }
    };

    // Só executa se não estiver carregando dados iniciais
    if (!loading) {
      loadFilteredPayments();
    }
  }, [apiUrl, filters, page, rowsPerPage, loading]); // Inclui todas as dependências necessárias

  // Handlers
  const handleMakePayment = useCallback(async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      await axios.post(`${apiUrl}/payments/confirm`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        message: "Pagamento processado com sucesso!",
        severity: "success",
      });

      // Recarregar apenas se necessário
      const paymentsResponse = await axios.get(`${apiUrl}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { ...filters, page: page + 1, limit: rowsPerPage },
      });
      setPayments(paymentsResponse.data.data || mockPayments);

      setOpenPaymentDialog(false);
      setPaymentData({
        amount: "",
        description: "",
        paymentMethod: "credit_card",
        type: "purchase",
      });
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setSnackbar({
        open: true,
        message: "Erro ao processar pagamento",
        severity: "error",
      });
    }
  }, [apiUrl, paymentData, filters, page, rowsPerPage]);

  const handleExport = useCallback(
    async (format) => {
      try {
        const dataToExport = payments.map((payment) => ({
          Data: format(new Date(payment.date), "yyyy-MM-dd"),
          Descrição: payment.description,
          Valor: `R$ ${payment.amount.toFixed(2)}`,
          Método: payment.paymentMethod,
          Status: payment.status,
          Tipo: payment.type,
        }));

        if (format === "csv") {
          const csv = [
            Object.keys(dataToExport[0]).join(","),
            ...dataToExport.map((row) => Object.values(row).join(",")),
          ].join("\n");

          const blob = new Blob([csv], { type: "text/csv" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `pagamentos_${format(new Date(), "yyyy-MM-dd", {
            locale: ptBR,
          })}.csv`;
          a.click();
        }

        setSnackbar({
          open: true,
          message: "Exportação realizada com sucesso!",
          severity: "success",
        });

        setOpenExportDialog(false);
      } catch (error) {
        console.error("Erro ao exportar:", error);
        setSnackbar({
          open: true,
          message: "Erro ao exportar dados",
          severity: "error",
        });
      }
    },
    [payments]
  );

  // Filtros aplicados
  const filteredPayments = payments.filter((payment) => {
    if (filters.status && payment.status !== filters.status) return false;
    if (
      filters.paymentMethod &&
      payment.paymentMethod !== filters.paymentMethod
    )
      return false;
    if (
      filters.search &&
      !payment.description.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false;
    return true;
  });

  // Dados dos gráficos
  const chartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Pagamentos",
        data: [65, 78, 90, 81, 56, 94],
        borderColor: "#1976d2",
        backgroundColor: "rgba(25, 118, 210, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: ["Cartão de Crédito", "PIX", "Boleto", "Transferência"],
    datasets: [
      {
        data: [45, 30, 15, 10],
        backgroundColor: ["#1976d2", "#00695c", "#f57c00", "#5e35b1"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            💳 Pagamentos
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => {
                Promise.all([
                  loadPayments(),
                  loadSubscription(),
                  loadPaymentStats(),
                ]);
              }}
            >
              Atualizar
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={() => setOpenExportDialog(true)}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenPaymentDialog(true)}
            >
              Novo Pagamento
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body1" color="text.secondary">
          Gerencie seus pagamentos, métodos e assinaturas de forma segura e
          eficiente
        </Typography>
      </Box>

      {/* Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Gasto"
            value={`R$ ${paymentStats.total.toFixed(2)}`}
            icon={<MonetizationOnIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Este Mês"
            value={`R$ ${paymentStats.thisMonth.toFixed(2)}`}
            icon={<TrendingUpIcon />}
            color="#2e7d32"
            trend="up"
            trendValue="+18.8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Mês Anterior"
            value={`R$ ${paymentStats.lastMonth.toFixed(2)}`}
            icon={<AttachMoneyIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pendentes"
            value={paymentStats.pending.toString()}
            icon={<ScheduleIcon />}
            color="#d32f2f"
          />
        </Grid>
      </Grid>

      {/* Assinatura Ativa */}
      {subscription && (
        <Alert
          severity="success"
          sx={{
            mb: 4,
            "& .MuiAlert-message": { width: "100%" },
          }}
        >
          <AlertTitle>✅ Assinatura Premium Ativa</AlertTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="body2">
                <strong>Plano:</strong> {subscription.plan} •{" "}
                <strong>Valor:</strong> R$ {subscription.amount?.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                <strong>Próxima cobrança:</strong>{" "}
                {format(
                  new Date(subscription.nextBillingDate),
                  "dd 'de' MMMM 'de' yyyy",
                  { locale: ptBR }
                )}
              </Typography>
            </Box>
            <Button variant="outlined" size="small">
              Gerenciar Assinatura
            </Button>
          </Stack>
        </Alert>
      )}

      {/* Tabs de Navegação */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<DashboardIcon />} />
          <Tab label="Histórico" icon={<HistoryIcon />} />
          <Tab label="Métodos de Pagamento" icon={<CreditCardIcon />} />
          <Tab label="Segurança" icon={<SecurityIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Panel - Dashboard */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={4}>
          {/* Gráficos */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                📈 Evolução dos Pagamentos
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `R$ ${value}`,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🥧 Métodos Utilizados
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut
                  data={doughnutData}
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
        </Grid>

        {/* Ações Rápidas */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => setOpenPaymentDialog(true)}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <PaymentIcon
                  sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Fazer Pagamento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Processe um novo pagamento
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => setTabValue(2)}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <CreditCardIcon
                  sx={{ fontSize: 48, color: "success.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Métodos de Pagamento
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gerencie seus cartões e contas
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => setOpenExportDialog(true)}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <FileDownloadIcon
                  sx={{ fontSize: 48, color: "info.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Exportar Dados
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Baixe relatórios em CSV/PDF
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => setTabValue(3)}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <SecurityIcon
                  sx={{ fontSize: 48, color: "warning.main", mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Segurança
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Configure autenticação 2FA
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Panel - Histórico */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          {/* Filtros */}
          <Accordion sx={{ mb: 3 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" startIcon={<FilterIcon />}>
                🔍 Filtros Avançados
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Buscar"
                    placeholder="Descrição do pagamento..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filters.status}
                      label="Status"
                      onChange={(e) =>
                        setFilters({ ...filters, status: e.target.value })
                      }
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="pending">Pendente</MenuItem>
                      <MenuItem value="completed">Concluído</MenuItem>
                      <MenuItem value="cancelled">Cancelado</MenuItem>
                      <MenuItem value="refunded">Reembolsado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Método</InputLabel>
                    <Select
                      value={filters.paymentMethod}
                      label="Método"
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          paymentMethod: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                      <MenuItem value="debit_card">Cartão de Débito</MenuItem>
                      <MenuItem value="pix">PIX</MenuItem>
                      <MenuItem value="boleto">Boleto</MenuItem>
                      <MenuItem value="bank_transfer">Transferência</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() =>
                      setFilters({
                        status: "",
                        paymentMethod: "",
                        startDate: null,
                        endDate: null,
                        search: "",
                      })
                    }
                    sx={{ height: 56 }}
                  >
                    Limpar Filtros
                  </Button>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Tabela de Pagamentos */}
          <Typography variant="h6" gutterBottom>
            📊 Histórico de Pagamentos
          </Typography>

          {loading ? (
            <Box>
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rectangular"
                  height={60}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Método</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPayments
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((payment) => (
                      <TableRow key={payment._id} hover>
                        <TableCell>
                          {format(new Date(payment.date), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </TableCell>
                        <TableCell>{payment.description}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight="medium"
                            color="primary"
                          >
                            R$ {payment.amount.toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.paymentMethod.replace("_", " ")}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            size="small"
                            color={
                              payment.status === "completed"
                                ? "success"
                                : payment.status === "pending"
                                ? "warning"
                                : "error"
                            }
                            icon={
                              payment.status === "completed" ? (
                                <CheckCircleIcon />
                              ) : payment.status === "pending" ? (
                                <ScheduleIcon />
                              ) : (
                                <CancelIcon />
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <ReceiptIcon />
                          </IconButton>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPayments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            labelRowsPerPage="Itens por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </Paper>
      </TabPanel>

      {/* Tab Panel - Métodos de Pagamento */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <Typography variant="h6">
                  💳 Seus Métodos de Pagamento
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenMethodDialog(true)}
                >
                  Adicionar Método
                </Button>
              </Stack>

              <Stack spacing={2}>
                {paymentMethods.map((method) => (
                  <PaymentMethodCard
                    key={method.id}
                    method={method}
                    isSelected={selectedPaymentMethod === method.id}
                    onSelect={() => setSelectedPaymentMethod(method.id)}
                    onEdit={(method) => console.log("Editar:", method)}
                  />
                ))}
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                🔒 Segurança dos Pagamentos
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Notificações de pagamento"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Confirmação por SMS"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Autenticação biométrica"
                />
              </Stack>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📱 PIX
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure suas chaves PIX para pagamentos instantâneos.
              </Typography>
              <Button variant="outlined" fullWidth>
                Gerenciar Chaves PIX
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab Panel - Segurança */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🔐 Autenticação de Dois Fatores (2FA)
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Adicione uma camada extra de segurança aos seus pagamentos.
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch />}
                  label="Ativar 2FA para pagamentos"
                />
                <Button variant="contained" disabled>
                  Configurar Authenticator
                </Button>
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                🔔 Notificações de Segurança
              </Typography>
              <Stack spacing={2}>
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Login de novo dispositivo"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Tentativas de pagamento negadas"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Alterações no perfil"
                />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                📊 Atividade Recente de Segurança
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Login realizado com sucesso"
                    secondary={`Hoje às ${format(new Date(), "HH:mm", {
                      locale: ptBR,
                    })} • Chrome/Windows`}
                  />
                  <Chip label="Normal" color="success" size="small" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Pagamento processado"
                    secondary="Ontem às 14:30 • R$ 29,90"
                  />
                  <Chip label="Aprovado" color="success" size="small" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Tentativa de login bloqueada"
                    secondary="02/11 às 03:45 • IP não reconhecido"
                  />
                  <Chip label="Bloqueado" color="error" size="small" />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dialog - Adicionar Método de Pagamento */}
      <Dialog
        open={openMethodDialog}
        onClose={() => setOpenMethodDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Método de Pagamento</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Configure um novo método de pagamento para suas transações.
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={newMethodData.type}
                label="Tipo"
                onChange={(e) =>
                  setNewMethodData({ ...newMethodData, type: e.target.value })
                }
              >
                <MenuItem value="credit_card">Cartão de Crédito</MenuItem>
                <MenuItem value="debit_card">Cartão de Débito</MenuItem>
                <MenuItem value="pix">PIX</MenuItem>
                <MenuItem value="boleto">Boleto</MenuItem>
                <MenuItem value="bank_transfer">Transferência</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Nome"
              value={newMethodData.name}
              onChange={(e) =>
                setNewMethodData({ ...newMethodData, name: e.target.value })
              }
            />
            <TextField
              fullWidth
              label="Descrição"
              value={newMethodData.description}
              onChange={(e) =>
                setNewMethodData({
                  ...newMethodData,
                  description: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMethodDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => {
              const newMethod = {
                id: String(paymentMethods.length + 1),
                ...newMethodData,
                isDefault: false,
              };
              setPaymentMethods([...paymentMethods, newMethod]);
              setOpenMethodDialog(false);
              setNewMethodData({
                type: "credit_card",
                name: "",
                description: "",
              });
              setSnackbar({
                open: true,
                message: "Método de pagamento adicionado com sucesso!",
                severity: "success",
              });
            }}
          >
            Adicionar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Exportar Dados */}
      <Dialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Exportar Pagamentos</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Selecione o formato de exportação dos seus dados de pagamentos.
          </Typography>
          <Stack spacing={2}>
            <Button variant="outlined" onClick={() => handleExport("csv")}>
              Exportar como CSV
            </Button>
            <Button variant="outlined" onClick={() => handleExport("pdf")}>
              Exportar como PDF
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExportDialog(false)}>Cancelar</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Novo Pagamento */}
      <Dialog
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <PaymentIcon />
            <Typography variant="h6">Fazer Novo Pagamento</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor (R$)"
                type="number"
                value={paymentData.amount}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    amount: parseFloat(e.target.value) || "",
                  })
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Pagamento</InputLabel>
                <Select
                  value={paymentData.type}
                  label="Tipo de Pagamento"
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, type: e.target.value })
                  }
                >
                  <MenuItem value="purchase">Compra</MenuItem>
                  <MenuItem value="subscription">Assinatura</MenuItem>
                  <MenuItem value="upgrade">Upgrade</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={paymentData.description}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    description: e.target.value,
                  })
                }
                placeholder="Descreva o pagamento..."
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Método de Pagamento:
              </Typography>
              <Grid container spacing={2}>
                {paymentMethods.map((method) => (
                  <Grid item xs={12} sm={6} key={method.id}>
                    <PaymentMethodCard
                      method={method}
                      isSelected={paymentData.paymentMethod === method.type}
                      onSelect={() =>
                        setPaymentData({
                          ...paymentData,
                          paymentMethod: method.type,
                        })
                      }
                      onEdit={() => {}}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenPaymentDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleMakePayment}
            variant="contained"
            disabled={!paymentData.amount || !paymentData.description}
            startIcon={<PaymentIcon />}
          >
            Processar Pagamento
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentsPage;
