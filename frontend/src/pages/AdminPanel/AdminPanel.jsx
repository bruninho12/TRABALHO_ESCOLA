/**
 * Painel Administrativo - Dashboard Principal
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  CircularProgress,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { adminApi } from "../../services/adminApi";

// Componente principal do painel administrativo
const AdminPanel = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Carregar estatísticas do dashboard
  const loadDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      setDashboardStats(response.data);
    } catch (error) {
      showSnackbar("Erro ao carregar estatísticas", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.isAdmin) {
      loadDashboardStats();
    }
  }, [user?.isAdmin, loadDashboardStats]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Verificar se o usuário é admin
  if (!user?.isAdmin) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Alert severity="error">
          Acesso negado. Você não tem permissões de administrador.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          Painel Administrativo
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadDashboardStats}
          disabled={loading}
        >
          Atualizar
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab icon={<DashboardIcon />} label="Dashboard" />
          <Tab icon={<PeopleIcon />} label="Usuários" />
          <Tab icon={<ReportIcon />} label="Relatórios" />
          <Tab icon={<SettingsIcon />} label="Sistema" />
        </Tabs>
      </Box>

      {/* Conteúdo das tabs */}
      {activeTab === 0 && (
        <DashboardTab
          stats={dashboardStats}
          loading={loading}
          showSnackbar={showSnackbar}
        />
      )}
      {activeTab === 1 && <UsersTab showSnackbar={showSnackbar} />}
      {activeTab === 2 && <ReportsTab />}
      {activeTab === 3 && <SystemTab />}

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Tab do Dashboard
const DashboardTab = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  const statCards = [
    {
      title: "Usuários Totais",
      value: stats.users.total,
      subtitle: `${stats.users.active} ativos`,
      icon: <PeopleIcon />,
      color: "#1976d2",
    },
    {
      title: "Usuários Premium",
      value: stats.users.premium,
      subtitle: `${stats.users.conversionRate}% conversão`,
      icon: <CheckCircleIcon />,
      color: "#2e7d32",
    },
    {
      title: "Receita Mensal",
      value: `R$ ${stats.payments.monthlyRevenue.toFixed(2)}`,
      subtitle: `${stats.payments.revenueGrowth > 0 ? "+" : ""}${
        stats.payments.revenueGrowth
      }%`,
      icon: <MoneyIcon />,
      color: "#ed6c02",
    },
    {
      title: "Transações",
      value: stats.transactions.total,
      subtitle: "Total processadas",
      icon: <TrendingUpIcon />,
      color: "#9c27b0",
    },
  ];

  return (
    <Grid container spacing={3}>
      {/* Cards de estatísticas */}
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: card.color, mr: 1 }}>{card.icon}</Avatar>
                <Typography variant="h6">{card.title}</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {card.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {card.subtitle}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}

      {/* Saúde do sistema */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Saúde do Sistema
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Banco de Dados</Typography>
                <Chip
                  label={stats.system.database}
                  color={
                    stats.system.database === "healthy" ? "success" : "error"
                  }
                  size="small"
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Uptime</Typography>
                <Typography>{stats.system.uptime}h</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Memória</Typography>
                <Typography>
                  {stats.system.memory.used}MB / {stats.system.memory.total}MB
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Usuários bloqueados */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" mb={2}>
              Alertas
            </Typography>
            {stats.users.blocked > 0 && (
              <Alert severity="warning" sx={{ mb: 1 }}>
                {stats.users.blocked} usuário(s) bloqueado(s)
              </Alert>
            )}
            {stats.payments.pending > 0 && (
              <Alert severity="info">
                {stats.payments.pending} pagamento(s) pendente(s)
              </Alert>
            )}
            {stats.users.blocked === 0 && stats.payments.pending === 0 && (
              <Alert severity="success">Nenhum alerta ativo</Alert>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

// Tab de usuários
const UsersTab = ({ showSnackbar }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    search: "",
    plan: "all",
    status: "all",
    isBlocked: "all",
  });
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [editDialog, setEditDialog] = useState(false);

  // Carregar usuários
  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers({
        ...filters,
        page: pagination.page,
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      showSnackbar("Erro ao carregar usuários", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setPagination({ ...pagination, page: 1 });
  };

  // const handleUserEdit = (user) => {
  //   setSelectedUser(user);
  //   setEditDialog(true);
  // };

  const handleUserBlock = async (userId, currentBlockedStatus) => {
    try {
      // Definimos a ação oposta ao status ATUAL do usuário
      const willBlock = !currentBlockedStatus;
      const reason = willBlock ? "Bloqueio administrativo" : "";

      await adminApi.toggleUserBlock(userId, { reason });

      showSnackbar(
        `Usuário ${willBlock ? "bloqueado" : "desbloqueado"} com sucesso`,
        "success"
      );

      // Recarrega a lista para buscar os dados atualizados do MongoDB
      loadUsers();
    } catch (error) {
      showSnackbar("Erro ao alterar status do usuário", "error");
    }
  };

  const getPlanChip = (plan) => {
    const colors = {
      free: "default",
      silver: "info",
      gold: "warning",
      platinum: "success",
    };
    return <Chip label={plan} color={colors[plan] || "default"} size="small" />;
  };

  return (
    <Box>
      {/* Filtros */}
      <Box display="flex" gap={2} mb={3}>
        <TextField
          placeholder="Buscar usuários..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Plano</InputLabel>
          <Select
            value={filters.plan}
            label="Plano"
            onChange={(e) => handleFilterChange("plan", e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="silver">Silver</MenuItem>
            <MenuItem value="gold">Gold</MenuItem>
            <MenuItem value="platinum">Platinum</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="active">Ativo</MenuItem>
            <MenuItem value="inactive">Inativo</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={() =>
            showSnackbar(
              "Funcionalidade de exportação em desenvolvimento",
              "info"
            )
          }
        >
          Exportar
        </Button>
      </Box>

      {/* Tabela de usuários */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Usuário</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Criado</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar>{user.username?.charAt(0).toUpperCase()}</Avatar>
                      <Box>
                        <Typography variant="body1">{user.username}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {user.fullName}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {getPlanChip(user.subscription?.plan || "free")}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" flexDirection="column" gap={0.5}>
                      <Chip
                        label={user.isActive ? "Ativo" : "Inativo"}
                        color={user.isActive ? "success" : "default"}
                        size="small"
                      />
                      {user.isBlocked && (
                        <Chip label="Bloqueado" color="error" size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color={user.isBlocked ? "success" : "error"}
                        onClick={() =>
                          handleUserBlock(user._id, user.isBlocked)
                        } // PASSE O VALOR ATUAL
                        title={
                          user.isBlocked
                            ? "Desbloquear usuário"
                            : "Bloquear usuário"
                        }
                      >
                        {user.isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginação */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Button
          disabled={pagination.page <= 1}
          onClick={() =>
            setPagination({ ...pagination, page: pagination.page - 1 })
          }
        >
          Anterior
        </Button>
        <Typography sx={{ mx: 2, alignSelf: "center" }}>
          Página {pagination.page} de {pagination.pages}
        </Typography>
        <Button
          disabled={pagination.page >= pagination.pages}
          onClick={() =>
            setPagination({ ...pagination, page: pagination.page + 1 })
          }
        >
          Próxima
        </Button>
      </Box>
    </Box>
  );
};

// Tab de relatórios (placeholder)
const ReportsTab = () => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Relatórios Financeiros
      </Typography>
      <Alert severity="info">
        Funcionalidade de relatórios detalhados em desenvolvimento.
      </Alert>
    </Box>
  );
};

// Tab do sistema (placeholder)
const SystemTab = () => {
  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Configurações do Sistema
      </Typography>
      <Alert severity="info">
        Configurações avançadas do sistema em desenvolvimento.
      </Alert>
    </Box>
  );
};

export default AdminPanel;
