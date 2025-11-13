import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "Savings",
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const response = await axios.get(`${apiUrl}/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar metas:", error);
    }
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setEditingGoal(goal);
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
      category: "Savings",
    });
  };

  const handleSaveGoal = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const apiUrl =
        import.meta.env.VITE_API_URL || "http://localhost:3001/api";
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingGoal) {
        await axios.put(`${apiUrl}/goals/${editingGoal._id}`, formData, config);
      } else {
        await axios.post(`${apiUrl}/goals`, formData, config);
      }

      loadGoals();
      handleCloseDialog();
    } catch (error) {
      console.error("Erro ao salvar meta:", error);
    }
  };

  const handleDeleteGoal = async (id) => {
    if (window.confirm("Deseja excluir esta meta?")) {
      try {
        const token = localStorage.getItem("finance_flow_token");
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:3001/api";
        await axios.delete(`${apiUrl}/goals/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        loadGoals();
      } catch (error) {
        console.error("Erro ao excluir meta:", error);
      }
    }
  };

  const calculateProgress = (current, target) => {
    return target > 0 ? (current / target) * 100 : 0;
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
        {goals.map((goal) => (
          <Grid item xs={12} sm={6} md={4} key={goal._id}>
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
                  onClick={() => handleDeleteGoal(goal._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
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
