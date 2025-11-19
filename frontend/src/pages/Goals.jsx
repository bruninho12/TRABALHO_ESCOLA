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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "savings",
  });

  const loadGoals = useCallback(async (retryCount = 0) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("finance_flow_token");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await axios.get(`${apiUrl}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

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
        category: goal.category,
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
    });
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

  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(Math.max(progress || 0, 0), 100);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          🎯 Minhas Metas
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Meta
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography>Carregando metas...</Typography>
            </Box>
          </Grid>
        ) : goals.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography color="textSecondary">
                Nenhuma meta criada ainda. Clique em &quot;Nova Meta&quot; para
                começar!
              </Typography>
            </Box>
          </Grid>
        ) : (
          goals.map((goal) => {
            const goalId = goal._id || goal.id;
            return (
              <Grid item xs={12} sm={6} md={4} key={goalId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {goal.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {goal.description}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">
                          R$ {goal.currentAmount?.toFixed(2) || "0.00"}
                        </Typography>
                        <Typography variant="body2">
                          R$ {goal.targetAmount?.toFixed(2) || "0.00"}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateProgress(
                          goal.currentAmount,
                          goal.targetAmount
                        )}
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {calculateProgress(
                        goal.currentAmount,
                        goal.targetAmount
                      ).toFixed(0)}
                      % concluído
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(goal)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteGoal(goalId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>{editingGoal ? "Editar Meta" : "Nova Meta"}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={2}
          />
          <TextField
            fullWidth
            label="Valor Alvo"
            type="number"
            value={formData.targetAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                targetAmount: parseFloat(e.target.value),
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Valor Atual"
            type="number"
            value={formData.currentAmount}
            onChange={(e) =>
              setFormData({
                ...formData,
                currentAmount: parseFloat(e.target.value),
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Data Limite"
            type="date"
            value={formData.deadline}
            onChange={(e) =>
              setFormData({ ...formData, deadline: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveGoal} variant="contained" color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GoalsPage;
