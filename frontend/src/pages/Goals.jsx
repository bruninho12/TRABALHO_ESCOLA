import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Container,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Grid,
  LinearProgress,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardHeader,
  Divider,
  Stack,
  Paper,
  Badge,
  Tooltip,
  InputAdornment,
  Fab,
  Zoom,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  School as SchoolIcon,
  Flight as FlightIcon,
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalHospital as EmergencyIcon,
  SavingsOutlined as SavingsIcon,
  AttachMoney as AttachMoneyIcon,
  ClearAll as ClearAllIcon,
  AutorenewOutlined as AutorenewIcon,
  InsightsOutlined as InsightsIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarTodayIcon,
  MoneyOff as MoneyOffIcon,
} from "@mui/icons-material";
import api from "../services/api";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openContributionDialog, setOpenContributionDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [contributingGoal, setContributingGoal] = useState(null);
  const [summary, setSummary] = useState({
    totalGoals: 0,
    activeGoals: 0,
    completedGoals: 0,
    totalTargetAmount: 0,
    totalCurrentAmount: 0,
    progressPercentage: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    priority: "",
  });
  const debounceRef = useRef();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "savings",
    priority: "medium",
    milestones: [],
  });
  const [contributionData, setContributionData] = useState({
    amount: "",
    description: "",
  });

  // Configurações de categorias com cores e ícones
  const categoryConfig = {
    emergency: {
      icon: <EmergencyIcon />,
      color: "#f44336",
      label: "Emergência",
      lightColor: "#ffebee",
    },
    savings: {
      icon: <SavingsIcon />,
      color: "#4caf50",
      label: "Poupança",
      lightColor: "#e8f5e9",
    },
    investment: {
      icon: <TrendingUpIcon />,
      color: "#2196f3",
      label: "Investimento",
      lightColor: "#e3f2fd",
    },
    purchase: {
      icon: <ShoppingCartIcon />,
      color: "#ff9800",
      label: "Compra",
      lightColor: "#fff3e0",
    },
    travel: {
      icon: <FlightIcon />,
      color: "#9c27b0",
      label: "Viagem",
      lightColor: "#f3e5f5",
    },
    education: {
      icon: <SchoolIcon />,
      color: "#3f51b5",
      label: "Educação",
      lightColor: "#e8eaf6",
    },
    home: {
      icon: <HomeIcon />,
      color: "#795548",
      label: "Casa",
      lightColor: "#efebe9",
    },
    other: {
      icon: <AccountBalanceIcon />,
      color: "#607d8b",
      label: "Outros",
      lightColor: "#eceff1",
    },
  };

  // Configurações de prioridade
  const priorityConfig = {
    low: { color: "#4caf50", label: "Baixa" },
    medium: { color: "#ff9800", label: "Média" },
    high: { color: "#f44336", label: "Alta" },
    critical: { color: "#e91e63", label: "Crítica" },
  };

  // Configurações de status
  const statusConfig = {
    active: { icon: <TimelineIcon />, color: "#2196f3", label: "Ativa" },
    paused: { icon: <PauseIcon />, color: "#ff9800", label: "Pausada" },
    completed: {
      icon: <CheckCircleIcon />,
      color: "#4caf50",
      label: "Concluída",
    },
    cancelled: { icon: <CancelIcon />, color: "#f44336", label: "Cancelada" },
  };

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Carregando metas...", { filters, sortBy, sortOrder });

      // Buscar metas
      const response = await api.get(`/goals`, {
        params: {
          ...filters,
          sortBy,
          sortOrder,
        },
      });

      console.log("✅ Resposta da API recebida:", response);
      console.log("📊 Status:", response.status);
      console.log("📊 Data completa:", response.data);
      console.log("📋 Success:", response.data?.success);
      console.log("🎯 Metas (data.data):", response.data?.data);
      console.log("📦 Meta (se houver):", response.data?.meta);

      // Buscar resumo (tentar, mas não falhar se der erro)
      let summaryResponse = null;
      try {
        summaryResponse = await api.get(`/goals/summary`);
      } catch (summaryError) {
        console.warn("Erro ao buscar resumo das metas:", summaryError);
      }
      console.log("Resposta completa da API:", response.data);

      // Extrair os dados (backend retorna em response.data.data)
      let goalsData = [];
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        goalsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        goalsData = response.data;
      }

      console.log("Metas extraídas:", goalsData, "Total:", goalsData.length);

      setGoals(goalsData);
      console.log("✅ State 'goals' atualizado com", goalsData.length, "metas");

      // Definir resumo
      if (summaryResponse?.data?.success && summaryResponse.data.data) {
        setSummary(summaryResponse.data.data);
      }
    } catch (error) {
      console.error("❌ ERRO ao carregar metas:", error);
      console.error("📋 Error name:", error.name);
      console.error("📋 Error response:", error.response);
      console.error("📋 Error message:", error.message);
      console.error("📋 Error status:", error.response?.status);
      console.error("📋 Error data:", error.response?.data);

      if (error.name === "AbortError" || error.name === "CanceledError") {
        console.error("⏱️ Timeout: A requisição demorou mais de 10 segundos");
        alert(
          "A busca de metas está demorando muito. Verifique sua conexão ou tente novamente."
        );
      } else if (error.response?.status === 429) {
        alert(
          "Muitas requisições! Aguarde alguns segundos antes de tentar novamente."
        );
      } else if (error.response?.status === 401) {
        console.error("🔐 Erro de autenticação - token pode estar inválido");
        alert("Sessão expirada. Faça login novamente.");
      } else if (!error.response) {
        console.error("🌐 Erro de rede - servidor pode estar offline");
        alert("Não foi possível conectar ao servidor. Verifique sua conexão.");
      }
      setGoals([]);
    } finally {
      setLoading(false);
      console.log("🏁 loadGoals finalizado");
    }
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadGoals();
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [loadGoals]);

  // Funções auxiliares
  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress || 0, 0), 100);
  };

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
      goal.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory =
      !filters.category || goal.category === filters.category;
    const matchesStatus = !filters.status || goal.status === filters.status;
    const matchesPriority =
      !filters.priority || goal.priority === filters.priority;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  // Função para gerar alertas
  const getGoalAlerts = () => {
    const alerts = [];
    const today = new Date();

    goals.forEach((goal) => {
      const daysRemaining = getDaysRemaining(goal.deadline);
      const progress = calculateProgress(goal.currentAmount, goal.targetAmount);

      // Alertas de prazo
      if (goal.status === "active") {
        if (daysRemaining < 0) {
          alerts.push({
            type: "error",
            message: `Meta "${goal.title}" está atrasada há ${Math.abs(
              daysRemaining
            )} dias!`,
            action: () => handleOpenDialog(goal),
          });
        } else if (daysRemaining <= 3) {
          alerts.push({
            type: "warning",
            message: `Meta "${goal.title}" vence ${
              daysRemaining === 0
                ? "hoje"
                : daysRemaining === 1
                ? "amanhã"
                : `em ${daysRemaining} dias`
            }!`,
            action: () => handleOpenContributionDialog(goal),
          });
        }

        // Alertas de progresso
        if (progress >= 90 && progress < 100) {
          alerts.push({
            type: "info",
            message: `Meta "${
              goal.title
            }" está quase concluída (${progress.toFixed(
              0
            )}%)! Falta apenas R$ ${(
              goal.targetAmount - goal.currentAmount
            ).toFixed(2)}.`,
            action: () => handleOpenContributionDialog(goal),
          });
        }
      }

      // Meta concluída recentemente
      if (goal.status === "completed" && goal.completionDate) {
        const completionDate = new Date(goal.completionDate);
        const daysSinceCompletion = Math.floor(
          (today - completionDate) / (1000 * 60 * 60 * 24)
        );
        if (daysSinceCompletion <= 3) {
          alerts.push({
            type: "success",
            message: `🎉 Parabéns! Meta "${goal.title}" foi concluída ${
              daysSinceCompletion === 0
                ? "hoje"
                : `há ${daysSinceCompletion} dias`
            }!`,
            action: null,
          });
        }
      }
    });

    return alerts.slice(0, 3); // Máximo 3 alertas por vez
  };

  const alerts = getGoalAlerts();

  // Função para mostrar notificações
  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Log para debug
  console.log(
    "🎨 Renderizando componente. Goals state:",
    goals,
    "Length:",
    goals.length,
    "Loading:",
    loading
  );

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      // Usar _id ou id, o que estiver disponível
      const goalId = goal._id || goal.id;
      setEditingGoal({ ...goal, _id: goalId });
      setFormData({
        title: goal.title,
        description: goal.description,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        category: goal.category || "savings",
        priority: goal.priority || "medium",
        milestones: goal.milestones || [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGoal(null);
    setFormData({
      title: "",
      description: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
      category: "savings",
      priority: "medium",
      milestones: [],
    });
  };

  const handleOpenContributionDialog = (goal) => {
    setContributingGoal(goal);
    setContributionData({ amount: "", description: "" });
    setOpenContributionDialog(true);
  };

  const handleCloseContributionDialog = () => {
    setOpenContributionDialog(false);
    setContributingGoal(null);
    setContributionData({ amount: "", description: "" });
  };

  const handleSaveGoal = async () => {
    try {
      // Validar dados obrigatórios
      if (!formData.title.trim()) {
        alert("Por favor, preencha o título");
        return;
      }
      if (!formData.targetAmount || formData.targetAmount <= 0) {
        alert("Por favor, preencha o valor alvo com um número positivo");
        return;
      }
      if (!formData.deadline) {
        alert("Por favor, preencha a data limite");
        return;
      }

      const dataToSend = {
        title: formData.title,
        description: formData.description,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline, // Formato: YYYY-MM-DD
        category: formData.category || "savings",
        priority: formData.priority || "medium",
        milestones: formData.milestones || [],
      };

      console.log("Dados a serem enviados:", dataToSend);

      if (editingGoal) {
        console.log("Atualizando meta:", editingGoal._id, dataToSend);
        await api.put(`/goals/${editingGoal._id}`, dataToSend);
        console.log("Meta atualizada com sucesso");
        showNotification("✅ Meta atualizada com sucesso!", "success");
      } else {
        console.log("Criando nova meta:", dataToSend);
        const response = await api.post("/goals", dataToSend);
        console.log("Meta criada com sucesso:", response.data);
        showNotification("🎯 Nova meta criada com sucesso!", "success");
      }

      handleCloseDialog();
      // Recarregar as metas
      await loadGoals();
    } catch (error) {
      console.error(
        "Erro ao salvar meta:",
        error.response?.data || error.message
      );
      showNotification(
        "❌ Erro ao salvar meta: " +
          (error.response?.data?.details ||
            error.response?.data?.error ||
            error.message),
        "error"
      );
    }
  };

  const handleDeleteGoal = async (id) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        console.log("Deletando meta com ID:", id);
        await api.delete(`/goals/${id}`);
        console.log("Meta deletada com sucesso");
        showNotification("🗑️ Meta excluída com sucesso!", "info");
        await loadGoals();
      } catch (error) {
        console.error("Erro ao excluir meta:", error);
        showNotification(
          "❌ Erro ao excluir meta: " +
            (error.response?.data?.message || error.message),
          "error"
        );
      }
    }
  };

  const handleAddContribution = async () => {
    try {
      if (
        !contributionData.amount ||
        parseFloat(contributionData.amount) <= 0
      ) {
        showNotification("⚠️ Por favor, insira um valor positivo", "warning");
        return;
      }

      await api.post(`/goals/${contributingGoal._id}/add-value`, {
        amount: parseFloat(contributionData.amount),
        description: contributionData.description,
      });

      console.log("Contribuição adicionada com sucesso");
      showNotification(
        `💰 Contribuição de R$ ${parseFloat(contributionData.amount).toFixed(
          2
        )} adicionada com sucesso!`,
        "success"
      );
      handleCloseContributionDialog();
      await loadGoals();
    } catch (error) {
      console.error("Erro ao adicionar contribuição:", error);
      showNotification(
        "❌ Erro ao adicionar contribuição: " + error.message,
        "error"
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho com estatísticas rápidas */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" color="primary.main" component="h1">
            🎯 Minhas Metas
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <Chip
              icon={<TrophyIcon />}
              label={`${summary.totalGoals} Total`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<AutorenewIcon />}
              label={`${summary.activeGoals} Ativas`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<CheckCircleIcon />}
              label={`${summary.completedGoals} Concluídas`}
              color="info"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Botão de adicionar com animação */}
        <Zoom in={true}>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => handleOpenDialog()}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              zIndex: 1000,
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <AddIcon />
          </Fab>
        </Zoom>
      </Box>

      {/* Barra de ferramentas avançada */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          background: "primary.light",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Campo de busca*/}
          <TextField
            placeholder="Buscar metas..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "rgba(0,0,0,0.6)" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: 300,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "rgba(255,255,255,0.9)",
                borderRadius: 2,
                "& input": {
                  color: "rgba(0,0,0,0.87)",
                  fontWeight: 500,
                },
                "& input::placeholder": {
                  color: "rgba(0,0,0,0.6)",
                  opacity: 1,
                },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,1)",
                },
                "&.Mui-focused": {
                  backgroundColor: "rgba(255,255,255,1)",
                },
              },
            }}
            size="small"
          />

          {/* Toggle de filtros */}
          <Tooltip title="Mostrar/Ocultar Filtros">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? "primary" : "default"}
              sx={{
                transition: "all 0.3s ease",
                transform: showFilters ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>

          {/* Botão de limpar filtros */}
          {(filters.search ||
            filters.category ||
            filters.status ||
            filters.priority) && (
            <Tooltip title="Limpar Filtros">
              <IconButton
                onClick={() =>
                  setFilters({
                    search: "",
                    category: "",
                    status: "",
                    priority: "",
                  })
                }
                color="error"
                size="small"
              >
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Indicador de metas filtradas */}
          {filteredGoals.length !== goals.length && (
            <Chip
              icon={<InsightsIcon />}
              label={`${filteredGoals.length} de ${goals.length} metas`}
              color="secondary"
              size="small"
            />
          )}
        </Box>

        {/* Painel de filtros expansível */}
        {showFilters && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: 1,
              borderColor: "divider",
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filters.category}
                label="Categoria"
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                sx={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: 1,
                  "& .MuiSelect-select": {
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.87)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,1)",
                  },
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                {Object.entries(categoryConfig).map(([key, config]) => (
                  <MenuItem key={key} value={key}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {config.icon}
                      {config.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                sx={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: 1,
                  "& .MuiSelect-select": {
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.87)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,1)",
                  },
                }}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="active">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AutorenewIcon fontSize="small" />
                    Ativo
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon fontSize="small" />
                    Concluída
                  </Box>
                </MenuItem>
                <MenuItem value="paused">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PauseIcon fontSize="small" />
                    Pausada
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={filters.priority}
                label="Prioridade"
                onChange={(e) =>
                  setFilters({ ...filters, priority: e.target.value })
                }
                sx={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: 1,
                  "& .MuiSelect-select": {
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.87)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,1)",
                  },
                }}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="high">🔴 Alta</MenuItem>
                <MenuItem value="medium">🟡 Média</MenuItem>
                <MenuItem value="low">🟢 Baixa</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                value={sortBy}
                label="Ordenar por"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.95)",
                  borderRadius: 1,
                  "& .MuiSelect-select": {
                    fontWeight: 500,
                    color: "rgba(0,0,0,0.87)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,1)",
                  },
                }}
              >
                <MenuItem value="createdAt">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CalendarTodayIcon fontSize="small" />
                    Data de Criação
                  </Box>
                </MenuItem>
                <MenuItem value="deadline">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <ScheduleIcon fontSize="small" />
                    Prazo
                  </Box>
                </MenuItem>
                <MenuItem value="progress">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUpIcon fontSize="small" />
                    Progresso
                  </Box>
                </MenuItem>
                <MenuItem value="targetAmount">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <AttachMoneyIcon fontSize="small" />
                    Valor
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={sortOrder === "asc" ? "Crescente" : "Decrescente"}>
              <IconButton
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                color="primary"
                size="small"
              >
                <SortIcon
                  sx={{
                    transform:
                      sortOrder === "asc" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>

      {/* Alertas e Notificações */}
      {alerts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🔔 Notificações
          </Typography>
          <Stack spacing={1}>
            {alerts.map((alert, index) => (
              <Alert
                key={index}
                severity={alert.type}
                action={
                  alert.action && (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={alert.action}
                      sx={{ fontWeight: "bold" }}
                    >
                      Ação
                    </Button>
                  )
                }
                sx={{
                  "& .MuiAlert-message": {
                    display: "flex",
                    alignItems: "center",
                    fontWeight: 500,
                  },
                }}
              >
                {alert.message}
              </Alert>
            ))}
          </Stack>
        </Box>
      )}

      {/* Dashboard de Resumo Melhorado */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {summary.totalGoals}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 1,
                      fontWeight: 500,
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Total de Metas
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <FlagIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {summary.activeGoals}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 1,
                      fontWeight: 500,
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Metas Ativas
                  </Typography>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <AutorenewIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {summary.completedGoals}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 1,
                      fontWeight: 500,
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Concluídas
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <TrophyIcon fontSize="small" />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {summary.totalGoals > 0
                        ? `${(
                            (summary.completedGoals / summary.totalGoals) *
                            100
                          ).toFixed(0)}% de sucesso`
                        : "0% de sucesso"}
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <CheckCircleIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
              color: "white",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    R${" "}
                    {(summary.totalCurrentAmount || 0).toLocaleString("pt-BR", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      opacity: 1,
                      fontWeight: 500,
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Valor Acumulado
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <TrendingUpIcon fontSize="small" />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 600,
                        textShadow: "0 1px 2px rgba(0,0,0,0.15)",
                        fontSize: "0.75rem",
                      }}
                    >
                      {summary.totalTargetAmount > 0
                        ? `${(
                            (summary.totalCurrentAmount /
                              summary.totalTargetAmount) *
                            100
                          ).toFixed(1)}% do objetivo`
                        : "Meta: R$ 0"}
                    </Typography>
                  </Box>
                </Box>
                <Avatar
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    width: 56,
                    height: 56,
                  }}
                >
                  <AttachMoneyIcon fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Card de Progresso Geral */}
        <Grid item xs={12}>
          <Card
            elevation={3}
            sx={{
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  📊 Progresso Geral das Metas
                </Typography>
                <Chip
                  icon={<InsightsIcon />}
                  label={`${(summary.progressPercentage || 0).toFixed(
                    1
                  )}% completo`}
                  color="primary"
                  variant="filled"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={summary.progressPercentage || 0}
                sx={{
                  height: 10,
                  borderRadius: 1,
                  backgroundColor: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    background:
                      "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 1,
                  },
                }}
              />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography variant="body2" color="primay.main">
                  R$ {(summary.totalCurrentAmount || 0).toLocaleString("pt-BR")}
                </Typography>
                <Typography variant="body2" color="primay.main">
                  Meta: R${" "}
                  {(summary.totalTargetAmount || 0).toLocaleString("pt-BR")}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Lista de Metas */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                py: 8,
                px: 4,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    border: "4px solid rgba(255,255,255,0.3)",
                    borderTop: "4px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  🎯 Carregando suas metas...
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    opacity: 1,
                    fontWeight: 400,
                    color: "text.secondary",
                  }}
                >
                  Preparando seus objetivos financeiros
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ) : filteredGoals.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                py: 8,
                px: 4,
                textAlign: "center",
                borderRadius: 3,
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Typography variant="h2" sx={{ fontSize: "4rem" }}>
                  🎯
                </Typography>
                <Typography
                  variant="h5"
                  color="text.primary"
                  sx={{ fontWeight: "bold" }}
                >
                  {goals.length === 0
                    ? "Suas metas começam aqui!"
                    : "Nenhuma meta encontrada"}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="body1"
                  sx={{ maxWidth: 400 }}
                >
                  {goals.length === 0
                    ? "Transforme seus sonhos em objetivos concretos. Clique no botão + para criar sua primeira meta financeira!"
                    : "Nenhuma meta corresponde aos filtros aplicados. Tente ajustar os critérios de busca."}
                </Typography>
                {goals.length === 0 && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleOpenDialog()}
                    sx={{
                      mt: 2,
                      px: 4,
                      py: 1.5,
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                        transform: "translateY(-2px)",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    ✨ Criar Primeira Meta
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        ) : (
          filteredGoals.map((goal) => {
            const goalId = goal._id || goal.id;
            const progress = calculateProgress(
              goal.currentAmount,
              goal.targetAmount
            );
            const daysRemaining = getDaysRemaining(goal.deadline);
            const categoryInfo =
              categoryConfig[goal.category] || categoryConfig.other;
            const priorityInfo =
              priorityConfig[goal.priority] || priorityConfig.medium;
            const statusInfo = statusConfig[goal.status] || statusConfig.active;

            return (
              <Grid item xs={12} sm={6} md={4} key={goalId}>
                <Card
                  elevation={4}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    borderRadius: 3,
                    background:
                      "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                    border: `3px solid ${categoryInfo.color}`,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      elevation: 8,
                      transform: "translateY(-8px) scale(1.02)",
                      border: `3px solid ${categoryInfo.color}`,
                      boxShadow: `0 20px 40px rgba(${categoryInfo.color
                        .replace("#", "")
                        .match(/.{2}/g)
                        .map((hex) => parseInt(hex, 16))
                        .join(", ")}, 0.3)`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${categoryInfo.color}, ${categoryInfo.lightColor})`,
                      borderRadius: "12px 12px 0 0",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: categoryInfo.color,
                          color: "white",
                          width: 48,
                          height: 48,
                          boxShadow: `0 4px 14px rgba(${categoryInfo.color
                            .replace("#", "")
                            .match(/.{2}/g)
                            .map((hex) => parseInt(hex, 16))
                            .join(", ")}, 0.4)`,
                        }}
                      >
                        {categoryInfo.icon}
                      </Avatar>
                    }
                    title={
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "rgba(0,0,0,0.87)",
                          textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {goal.title}
                      </Typography>
                    }
                    subheader={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Chip
                          size="small"
                          label={categoryInfo.label}
                          sx={{
                            bgcolor: categoryInfo.color,
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            boxShadow: 2,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            "& .MuiChip-label": {
                              letterSpacing: "0.02em",
                            },
                          }}
                        />
                        <Chip
                          size="small"
                          label={priorityInfo.label}
                          sx={{
                            bgcolor: priorityInfo.color,
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            boxShadow: 2,
                            textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            "& .MuiChip-label": {
                              letterSpacing: "0.02em",
                            },
                          }}
                        />
                        <Chip
                          icon={statusInfo.icon}
                          label={statusInfo.label}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: statusInfo.color,
                            borderWidth: 2,
                            color: statusInfo.color,
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            "& .MuiChip-label": {
                              letterSpacing: "0.02em",
                              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                            },
                          }}
                        />
                      </Box>
                    }
                  />

                  <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    {goal.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          mb: 2,
                          minHeight: "40px",
                          fontStyle: "italic",
                          color: "rgba(0,0,0,0.7)",
                          fontWeight: 400,
                          lineHeight: 1.5,
                          textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                        }}
                      >
                        {goal.description}
                      </Typography>
                    )}

                    {/* Card de Progresso Melhorado */}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${categoryInfo.lightColor} 0%, #ffffff 100%)`,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <TrendingUpIcon fontSize="small" color="primary" />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(0,0,0,0.8)",
                              fontWeight: 600,
                              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                            }}
                          >
                            Progresso
                          </Typography>
                        </Box>
                        <Chip
                          label={`${progress.toFixed(0)}%`}
                          size="small"
                          color="primary"
                          sx={{
                            fontWeight: 700,
                            "& .MuiChip-label": {
                              color: "white",
                              textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                              letterSpacing: "0.01em",
                            },
                          }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 10,
                          borderRadius: 5,
                          bgcolor: "rgba(0,0,0,0.1)",
                          "& .MuiLinearProgress-bar": {
                            background: `linear-gradient(90deg, ${categoryInfo.color}, ${priorityInfo.color})`,
                            borderRadius: 5,
                            boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3)`,
                          },
                        }}
                      />
                    </Paper>

                    {/* Valores Melhorados */}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background:
                          "linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "rgba(0,0,0,0.7)",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                            }}
                          >
                            Atual
                          </Typography>
                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                              fontWeight: 700,
                              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                            }}
                          >
                            R${" "}
                            {(goal.currentAmount || 0).toLocaleString("pt-BR")}
                          </Typography>
                        </Box>
                        <Box sx={{ mx: 2 }}>
                          <Typography
                            variant="h4"
                            sx={{
                              color: "rgba(0,0,0,0.4)",
                              fontWeight: 300,
                            }}
                          >
                            /
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: "center", flex: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              color: "rgba(0,0,0,0.7)",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                            }}
                          >
                            Meta
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: "rgba(0,0,0,0.8)",
                              fontWeight: 700,
                              textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                            }}
                          >
                            R${" "}
                            {(goal.targetAmount || 0).toLocaleString("pt-BR")}
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    {/* Informações de Prazo Melhoradas */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor:
                          daysRemaining < 7
                            ? "error.light"
                            : daysRemaining < 30
                            ? "warning.light"
                            : "info.light",
                        color:
                          daysRemaining < 7
                            ? "error.dark"
                            : daysRemaining < 30
                            ? "warning.dark"
                            : "info.dark",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarTodayIcon fontSize="small" />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            textShadow: "0 1px 2px rgba(255,255,255,0.7)",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        {daysRemaining >= 0 ? (
                          <>
                            <ScheduleIcon fontSize="small" />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                textShadow: "0 1px 2px rgba(255,255,255,0.7)",
                                letterSpacing: "0.01em",
                              }}
                            >
                              {daysRemaining === 0
                                ? "Hoje!"
                                : daysRemaining === 1
                                ? "1 dia"
                                : `${daysRemaining} dias`}
                            </Typography>
                          </>
                        ) : (
                          <>
                            <WarningIcon fontSize="small" />
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                textShadow: "0 1px 2px rgba(255,255,255,0.7)",
                                letterSpacing: "0.01em",
                              }}
                            >
                              {Math.abs(daysRemaining)} dias atrasada
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Milestones Melhoradas */}
                    {goal.milestones && goal.milestones.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "rgba(0,0,0,0.8)",
                            fontWeight: 600,
                            textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                          }}
                        >
                          <FlagIcon fontSize="small" />
                          Marcos ({goal.milestones.length}):
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {goal.milestones
                            .slice(0, 3)
                            .map((milestone, index) => (
                              <Chip
                                key={index}
                                size="small"
                                label={milestone.title || `Marco ${index + 1}`}
                                variant="outlined"
                                sx={{
                                  fontSize: "0.7rem",
                                  fontWeight: 600,
                                  bgcolor: milestone.achieved
                                    ? "success.light"
                                    : "grey.100",
                                  color: milestone.achieved
                                    ? "success.dark"
                                    : "rgba(0,0,0,0.8)",
                                  borderColor: milestone.achieved
                                    ? "success.main"
                                    : "grey.400",
                                  borderWidth: 2,
                                  "& .MuiChip-label": {
                                    textShadow: milestone.achieved
                                      ? "0 1px 2px rgba(255,255,255,0.8)"
                                      : "0 1px 2px rgba(255,255,255,0.5)",
                                  },
                                }}
                              />
                            ))}
                          {goal.milestones.length > 3 && (
                            <Chip
                              size="small"
                              label={`+${goal.milestones.length - 3}`}
                              variant="outlined"
                              sx={{ fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      </Box>
                    )}
                  </CardContent>

                  {/* Botões de Ação Melhorados */}
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      p: 2,
                      bgcolor: "grey.50",
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="Adicionar Contribuição">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenContributionDialog(goal)}
                          sx={{
                            bgcolor: "success.light",
                            color: "success.dark",
                            "&:hover": {
                              bgcolor: "success.main",
                              color: "white",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <AttachMoneyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar Meta">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(goal)}
                          sx={{
                            bgcolor: "primary.light",
                            color: "primary.dark",
                            "&:hover": {
                              bgcolor: "primary.main",
                              color: "white",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Tooltip title="Excluir Meta">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteGoal(goalId)}
                        sx={{
                          bgcolor: "error.light",
                          color: "error.dark",
                          "&:hover": {
                            bgcolor: "error.main",
                            color: "white",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Diálogo de Criação/Edição de Meta */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h5" component="div">
            {editingGoal ? "✏️ Editar Meta" : "🎯 Nova Meta"}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título da Meta"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                variant="outlined"
                required
                error={formData.title.length > 100}
                helperText={
                  formData.title.length > 100 ? "Máximo 100 caracteres" : ""
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                variant="outlined"
                multiline
                rows={3}
                error={formData.description.length > 500}
                helperText={`${formData.description.length}/500 caracteres`}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor Alvo"
                type="number"
                value={formData.targetAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAmount: e.target.value,
                  })
                }
                variant="outlined"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor Atual"
                type="number"
                value={formData.currentAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentAmount: e.target.value,
                  })
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">R$</InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  label="Categoria"
                >
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {config.icon}
                        <Typography sx={{ ml: 1 }}>{config.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  label="Prioridade"
                >
                  {Object.entries(priorityConfig).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Chip
                        size="small"
                        label={config.label}
                        sx={{ bgcolor: config.color, color: "white" }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Data Limite"
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                variant="outlined"
                required
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split("T")[0] }}
              />
            </Grid>

            {/* Preview do Card */}
            {formData.title && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  📋 Preview da Meta
                </Typography>
                <Card variant="outlined" sx={{ maxWidth: 400 }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor:
                            categoryConfig[formData.category]?.color || "#grey",
                          color: "white",
                        }}
                      >
                        {categoryConfig[formData.category]?.icon || (
                          <FlagIcon />
                        )}
                      </Avatar>
                    }
                    title={formData.title}
                    subheader={
                      <Chip
                        size="small"
                        label={
                          priorityConfig[formData.priority]?.label || "Média"
                        }
                        sx={{
                          bgcolor:
                            priorityConfig[formData.priority]?.color ||
                            "#ff9800",
                          color: "white",
                          mt: 1,
                        }}
                      />
                    }
                  />
                  <CardContent>
                    {formData.description && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mb: 2 }}
                      >
                        {formData.description}
                      </Typography>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2">
                        R$ {parseFloat(formData.currentAmount || 0).toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        R$ {parseFloat(formData.targetAmount || 0).toFixed(2)}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={calculateProgress(
                        parseFloat(formData.currentAmount || 0),
                        parseFloat(formData.targetAmount || 1)
                      )}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSaveGoal}
            variant="contained"
            color="primary"
            disabled={
              !formData.title || !formData.targetAmount || !formData.deadline
            }
          >
            {editingGoal ? "Atualizar Meta" : "Criar Meta"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Contribuição */}
      <Dialog
        open={openContributionDialog}
        onClose={handleCloseContributionDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Typography variant="h6" component="div">
            💰 Adicionar Contribuição
          </Typography>
          <Typography variant="body2" color="textSecondary" component="div">
            Meta: {contributingGoal?.title}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {contributingGoal && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Progresso Atual
              </Typography>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">
                  R$ {contributingGoal.currentAmount?.toFixed(2) || "0,00"}
                </Typography>
                <Typography variant="body2">
                  R$ {contributingGoal.targetAmount?.toFixed(2) || "0,00"}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={calculateProgress(
                  contributingGoal.currentAmount,
                  contributingGoal.targetAmount
                )}
                sx={{ height: 8, borderRadius: 4, mb: 2 }}
              />
            </Box>
          )}

          <TextField
            autoFocus
            fullWidth
            label="Valor da Contribuição"
            type="number"
            value={contributionData.amount}
            onChange={(e) =>
              setContributionData({
                ...contributionData,
                amount: e.target.value,
              })
            }
            variant="outlined"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            }}
            inputProps={{ min: 0, step: 0.01 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Descrição (Opcional)"
            value={contributionData.description}
            onChange={(e) =>
              setContributionData({
                ...contributionData,
                description: e.target.value,
              })
            }
            variant="outlined"
            multiline
            rows={2}
            placeholder="Ex: Salário de novembro, economia do mês..."
          />

          {/* Preview do novo valor */}
          {contributionData.amount && contributingGoal && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "primary.50", borderRadius: 1 }}>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                Após esta contribuição:
              </Typography>
              <Typography variant="h6" color="primary">
                R${" "}
                {(
                  contributingGoal.currentAmount +
                  parseFloat(contributionData.amount || 0)
                ).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {calculateProgress(
                  contributingGoal.currentAmount +
                    parseFloat(contributionData.amount || 0),
                  contributingGoal.targetAmount
                ).toFixed(1)}
                % concluído
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseContributionDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAddContribution}
            variant="contained"
            color="primary"
            disabled={
              !contributionData.amount ||
              parseFloat(contributionData.amount) <= 0
            }
          >
            Adicionar Contribuição
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sistema de Notificações */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <MuiAlert
          onClose={closeNotification}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            "& .MuiAlert-message": {
              fontSize: "0.9rem",
              fontWeight: "medium",
            },
          }}
        >
          {notification.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default GoalsPage;
