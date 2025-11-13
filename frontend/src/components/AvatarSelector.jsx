/**
 * AvatarSelector - Componente para seleção e customização de Avatar RPG
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
  Shield as ShieldIcon,
  Zap as ZapIcon,
  Heart as HeartIcon,
  Sword as SwordIcon,
  Speed as SpeedIcon,
} from "@mui/icons-material";

const AvatarSelector = ({
  avatar = null,
  onSave,
  onDelete,
  loading = false,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: avatar?.name || "",
    class: avatar?.class || "warrior",
    gender: avatar?.gender || "male",
    showStats: true,
  });

  useEffect(() => {
    if (avatar) {
      setFormData({
        name: avatar.name || "",
        class: avatar.class || "warrior",
        gender: avatar.gender || "male",
        showStats: true,
      });
    }
  }, [avatar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Nome do avatar é obrigatório");
      return;
    }

    await onSave(formData);
    setOpenDialog(false);
  };

  // Obter cor da classe
  const getClassColor = (classType) => {
    const colors = {
      warrior: "#FF6B6B",
      mage: "#4ECDC4",
      rogue: "#45B7D1",
      paladin: "#FFA07A",
      ranger: "#98D8C8",
    };
    return colors[classType] || "#95E1D3";
  };

  // Obter ícone da classe
  const getClassIcon = (classType) => {
    const icons = {
      warrior: "⚔️",
      mage: "🔮",
      rogue: "🗡️",
      paladin: "⛑️",
      ranger: "🏹",
    };
    return icons[classType] || "👤";
  };

  // Atributos por classe
  const classStats = {
    warrior: { strength: 18, defense: 16, speed: 8, health: 20 },
    mage: { strength: 10, defense: 8, speed: 12, health: 14 },
    rogue: { strength: 14, defense: 10, speed: 18, health: 12 },
    paladin: { strength: 16, defense: 18, speed: 10, health: 22 },
    ranger: { strength: 14, defense: 12, speed: 16, health: 15 },
  };

  const stats = classStats[formData.class] || classStats.warrior;
  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);

  if (!avatar) {
    return (
      <Card sx={{ textAlign: "center", p: 4 }}>
        <PersonIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Nenhum avatar criado
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Crie seu primeiro avatar para começar sua jornada RPG
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          startIcon={<PersonIcon />}
        >
          Criar Avatar
        </Button>

        {/* Dialog para criar avatar */}
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Criar Novo Avatar</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Digite o nome do seu avatar"
              margin="normal"
            />

            <TextField
              fullWidth
              select
              label="Classe"
              name="class"
              value={formData.class}
              onChange={handleChange}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="warrior">Guerreiro ⚔️</option>
              <option value="mage">Mago 🔮</option>
              <option value="rogue">Assassino 🗡️</option>
              <option value="paladin">Paladino ⛑️</option>
              <option value="ranger">Ranger 🏹</option>
            </TextField>

            <TextField
              fullWidth
              select
              label="Gênero"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              margin="normal"
              SelectProps={{
                native: true,
              }}
            >
              <option value="male">Masculino ♂️</option>
              <option value="female">Feminino ♀️</option>
              <option value="other">Outro</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Criando..." : "Criar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }

  return (
    <Card>
      {/* Cabeçalho do Avatar */}
      <CardContent>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Box
            sx={{
              fontSize: 80,
              mb: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {getClassIcon(avatar.class || formData.class)}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {avatar.name || "Avatar"}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 2 }}
          >
            <Chip
              label={`Nível ${avatar.level || 1}`}
              color="primary"
              variant="filled"
              size="small"
            />
            <Chip
              label={
                avatar.class === "warrior"
                  ? "Guerreiro"
                  : avatar.class === "mage"
                  ? "Mago"
                  : avatar.class === "rogue"
                  ? "Assassino"
                  : avatar.class === "paladin"
                  ? "Paladino"
                  : "Ranger"
              }
              style={{ backgroundColor: getClassColor(avatar.class) }}
              textColor="white"
              size="small"
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Status de Saúde e Mana */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <HeartIcon sx={{ color: "error.main", fontSize: 20 }} />
                Saúde
              </Typography>
              <Typography variant="caption">
                {avatar.health || 100} / {avatar.maxHealth || 100}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((avatar.health || 100) / (avatar.maxHealth || 100)) * 100}
              sx={{ height: 8, borderRadius: 4, backgroundColor: "#ffcccc" }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <ZapIcon sx={{ color: "warning.main", fontSize: 20 }} />
                Mana
              </Typography>
              <Typography variant="caption">
                {avatar.mana || 50} / {avatar.maxMana || 50}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={((avatar.mana || 50) / (avatar.maxMana || 50)) * 100}
              sx={{ height: 8, borderRadius: 4, backgroundColor: "#cce5ff" }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Atributos */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Atributos
        </Typography>

        <Grid container spacing={1.5} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={4}>
            <Paper sx={{ p: 1.5, textAlign: "center", background: "#fff3e0" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                <SwordIcon sx={{ color: "#FF6B6B" }} />
              </Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                Força
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.strength}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Paper sx={{ p: 1.5, textAlign: "center", background: "#e3f2fd" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                <ShieldIcon sx={{ color: "#4ECDC4" }} />
              </Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                Defesa
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.defense}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Paper sx={{ p: 1.5, textAlign: "center", background: "#f3e5f5" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                <SpeedIcon sx={{ color: "#BA68C8" }} />
              </Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                Velocidade
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.speed}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Paper sx={{ p: 1.5, textAlign: "center", background: "#e8f5e9" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                <HeartIcon sx={{ color: "#66BB6A" }} />
              </Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                Saúde
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.health}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Paper sx={{ p: 1.5, textAlign: "center", background: "#fce4ec" }}>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}>
                <ZapIcon sx={{ color: "#FFA726" }} />
              </Box>
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {totalStats}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Experiência */}
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Experiência
            </Typography>
            <Typography variant="caption">
              {avatar.experience || 0} / {avatar.nextLevelExp || 1000}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={
              ((avatar.experience || 0) / (avatar.nextLevelExp || 1000)) * 100
            }
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      </CardContent>

      {/* Ações */}
      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button
          variant="outlined"
          color="error"
          onClick={() => onDelete?.()}
          disabled={loading}
        >
          Deletar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          disabled={loading}
        >
          Editar Avatar
        </Button>
      </CardActions>

      {/* Dialog para editar */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Avatar</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default AvatarSelector;
