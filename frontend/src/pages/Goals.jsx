import React, { useState, useEffect, useCallback } from "react";
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
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Pause as PauseIcon,
  Cancel as CancelIcon,
  Timeline as TimelineIcon,
  Flag as FlagIcon,
  CalendarToday as CalendarTodayIcon,
  MoneyOff as MoneyOffIcon,
} from "@mui/icons-material";
import axios from "axios";

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
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
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

  const loadGoals = useCallback(
    async (retryCount = 0) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("finance_flow_token");
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3001/api";

        // Buscar metas
        const response = await axios.get(`${apiUrl}/goals`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ...filters,
            sortBy,
            sortOrder,
          },
        });

        // Buscar resumo (tentar, mas não falhar se der erro)
        let summaryResponse = null;
        try {
          summaryResponse = await axios.get(`${apiUrl}/goals/summary`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (summaryError) {
          console.warn("Erro ao buscar resumo das metas:", summaryError);
          // Continuar sem o resumo, não falhar toda a operação
        }
        console.log("Resposta completa da API:", response.data);

        // Tentar extrair os dados de várias formas possíveis
        let goalsData = [];
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          goalsData = response.data.data;
        } else if (Array.isArray(response.data)) {
          goalsData = response.data;
        } else if (
          response.data?.data &&
          Array.isArray(response.data.data.goals)
        ) {
          goalsData = response.data.data.goals;
        }

        console.log("Metas extraídas:", goalsData, "Total:", goalsData.length);

        // Se receber array vazio e este for a primeira tentativa, fazer retry
        if (goalsData.length === 0 && retryCount < 2) {
          console.log("Array vazio recebido. Tentando novamente...");
          await new Promise((resolve) => setTimeout(resolve, 300));
          return loadGoals(retryCount + 1);
        }

        setGoals(goalsData);

        // Definir resumo
        if (summaryResponse.data?.success && summaryResponse.data.data) {
          setSummary(summaryResponse.data.data);
        }
      } catch (error) {
        console.error("Erro ao carregar metas:", error);
        setGoals([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, sortBy, sortOrder]
  );

  useEffect(() => {
    loadGoals();
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

  const getStatusColor = (goal) => {
    const daysRemaining = getDaysRemaining(goal.deadline);
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);

    if (goal.status === "completed") return "#4caf50";
    if (goal.status === "cancelled") return "#f44336";
    if (goal.status === "paused") return "#ff9800";
    if (daysRemaining < 0) return "#f44336";
    if (daysRemaining <= 7) return "#ff9800";
    if (progress >= 90) return "#4caf50";
    return "#2196f3";
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

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

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
      const token = localStorage.getItem("finance_flow_token");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const config = { headers: { Authorization: `Bearer ${token}` } };

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
        await axios.put(
          `${apiUrl}/goals/${editingGoal._id}`,
          dataToSend,
          config
        );
      } else {
        console.log("Criando nova meta:", dataToSend);
        const response = await axios.post(
          `${apiUrl}/goals`,
          dataToSend,
          config
        );
        console.log("Resposta da criação:", response.data);
      }

      console.log("Meta salva com sucesso. Fechando diálogo...");
      // Apenas fechar o diálogo - o useEffect cuidará de recarregar as metas
      handleCloseDialog();
    } catch (error) {
      console.error(
        "Erro ao salvar meta:",
        error.response?.data || error.message
      );
      alert(
        "Erro ao salvar meta: " +
          (error.response?.data?.details ||
            error.response?.data?.error ||
            error.message)
      );
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Deseja excluir esta meta?")) {
      try {
        const token = localStorage.getItem("finance_flow_token");
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3001/api";
        console.log("Deletando meta com ID:", id);
        await axios.delete(`${apiUrl}/goals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Meta deletada com sucesso");
        loadGoals();
      } catch (error) {
        console.error("Erro ao excluir meta:", error);
        alert("Erro ao excluir meta: " + error.message);
      }
    }
  };

  const handleAddContribution = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (
        !contributionData.amount ||
        parseFloat(contributionData.amount) <= 0
      ) {
        alert("Por favor, insira um valor positivo");
        return;
      }

      await axios.post(
        `${apiUrl}/goals/${contributingGoal._id}/add-value`,
        {
          amount: parseFloat(contributionData.amount),
          description: contributionData.description,
        },
        config
      );

      console.log("Contribuição adicionada com sucesso");
      handleCloseContributionDialog();
      loadGoals();
    } catch (error) {
      console.error("Erro ao adicionar contribuição:", error);
      alert("Erro ao adicionar contribuição: " + error.message);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Cabeçalho */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" color="primary.main" component="h1">
          🎯 Minhas Metas
        </Typography>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => handleOpenDialog()}
          sx={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}
        >
          <AddIcon />
        </Fab>
      </Box>

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

      {/* Dashboard de Resumo */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ bgcolor: "#2196f3", mr: 2 }}>
                  <FlagIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {summary.totalGoals}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Total de Metas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ bgcolor: "#4caf50", mr: 2 }}>
                  <CheckCircleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {summary.completedGoals}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Concluídas
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ bgcolor: "#ff9800", mr: 2 }}>
                  <AttachMoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    R$ {summary.totalCurrentAmount?.toFixed(2) || "0,00"}
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Valor Atual
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Avatar sx={{ bgcolor: "#9c27b0", mr: 2 }}>
                  <TimelineIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="div">
                    {summary.progressPercentage || 0}%
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Progresso Geral
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barra de Filtros e Busca */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Buscar metas..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoria</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                label="Categoria"
              >
                <MenuItem value="">Todas</MenuItem>
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

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                {Object.entries(statusConfig).map(([key, config]) => (
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

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Prioridade</InputLabel>
              <Select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
                label="Prioridade"
              >
                <MenuItem value="">Todas</MenuItem>
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

          <Grid item xs={12} sm={6} md={3}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSort("deadline")}
                startIcon={<CalendarTodayIcon />}
              >
                Prazo
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSort("targetAmount")}
                startIcon={<AttachMoneyIcon />}
              >
                Valor
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleSort("progress")}
                startIcon={<TimelineIcon />}
              >
                Progresso
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Lista de Metas */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography>Carregando metas...</Typography>
            </Box>
          </Grid>
        ) : filteredGoals.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography color="textSecondary">
                {goals.length === 0
                  ? 'Nenhuma meta criada ainda. Clique no botão "+" para começar!'
                  : "Nenhuma meta corresponde aos filtros aplicados."}
              </Typography>
            </Box>
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
                  elevation={3}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                    border: `2px solid ${getStatusColor(goal)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      elevation: 6,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: categoryInfo.color,
                          color: "white",
                        }}
                      >
                        {categoryInfo.icon}
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
                        }}
                      >
                        <Chip
                          size="small"
                          label={categoryInfo.label}
                          sx={{
                            bgcolor: categoryInfo.lightColor,
                            color: categoryInfo.color,
                            fontWeight: "bold",
                          }}
                        />
                        <Chip
                          size="small"
                          label={priorityInfo.label}
                          sx={{
                            bgcolor: priorityInfo.color,
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    }
                    action={
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Chip
                          icon={statusInfo.icon}
                          label={statusInfo.label}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: statusInfo.color,
                            color: statusInfo.color,
                          }}
                        />
                      </Box>
                    }
                  />

                  <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                    {goal.description && (
                      <Typography
                        color="textSecondary"
                        variant="body2"
                        sx={{ mb: 2, minHeight: "40px" }}
                      >
                        {goal.description}
                      </Typography>
                    )}

                    {/* Informações de Progresso */}
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Progresso
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {progress.toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "#e0e0e0",
                          "& .MuiLinearProgress-bar": {
                            bgcolor: getStatusColor(goal),
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>

                    {/* Valores */}
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="textSecondary">
                          Atual
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          Meta
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="h6" color="primary">
                          R$ {goal.currentAmount?.toFixed(2) || "0,00"}
                        </Typography>
                        <Typography variant="h6" color="textSecondary">
                          R$ {goal.targetAmount?.toFixed(2) || "0,00"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Prazo */}
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarTodayIcon
                        sx={{ mr: 1, fontSize: 16 }}
                        color="action"
                      />
                      <Typography variant="body2" color="textSecondary">
                        Prazo:{" "}
                        {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                      </Typography>
                    </Box>

                    {daysRemaining >= 0 ? (
                      <Typography
                        variant="body2"
                        color={daysRemaining <= 7 ? "error" : "textSecondary"}
                        sx={{
                          fontWeight: daysRemaining <= 7 ? "bold" : "normal",
                        }}
                      >
                        {daysRemaining === 0
                          ? "Vence hoje!"
                          : daysRemaining === 1
                          ? "Vence amanhã!"
                          : `${daysRemaining} dias restantes`}
                      </Typography>
                    ) : (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{ fontWeight: "bold" }}
                      >
                        ⚠️ Atrasada há {Math.abs(daysRemaining)} dias
                      </Typography>
                    )}

                    {/* Milestones */}
                    {goal.milestones && goal.milestones.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          Marcos:
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {goal.milestones.map((milestone, index) => (
                            <Chip
                              key={index}
                              size="small"
                              label={`R$ ${milestone.targetAmount}`}
                              color={milestone.achieved ? "success" : "default"}
                              variant={
                                milestone.achieved ? "filled" : "outlined"
                              }
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>

                  <Divider />

                  <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                    <Box>
                      <Tooltip title="Adicionar Contribuição">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleOpenContributionDialog(goal)}
                          disabled={goal.status !== "active"}
                        >
                          <AttachMoneyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar Meta">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenDialog(goal)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Tooltip title="Excluir Meta">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteGoal(goalId)}
                      >
                        <DeleteIcon />
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
          <Typography variant="h5">
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
          <Typography variant="h6">💰 Adicionar Contribuição</Typography>
          <Typography variant="body2" color="textSecondary">
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
    </Container>
  );
};

export default GoalsPage;
