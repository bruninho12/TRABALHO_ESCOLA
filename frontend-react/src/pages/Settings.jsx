import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import Swal from "sweetalert2";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    theme: "light",
    language: "pt-BR",
    notifications: true,
    emailNotifications: true,
    currency: "BRL",
    timezone: "America/Sao_Paulo",
  });
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const response = await axios.get(`${apiUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      await axios.put(
        `${apiUrl}/auth/profile`,
        { preferences: settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        title: "Sucesso!",
        text: "Configurações salvas com sucesso",
        icon: "success",
      });
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Erro ao salvar configurações",
        icon: "error",
      });
    }
  };

  const handleChangePassword = async () => {
    if (password.new !== password.confirm) {
      Swal.fire({
        title: "Erro!",
        text: "As senhas não coincidem",
        icon: "error",
      });
      return;
    }

    try {
      const token = localStorage.getItem("finance_flow_token");
      await axios.post(
        `${apiUrl}/auth/change-password`,
        {
          currentPassword: password.current,
          newPassword: password.new,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire({
        title: "Sucesso!",
        text: "Senha alterada com sucesso",
        icon: "success",
      });
      setPassword({ current: "", new: "", confirm: "" });
    } catch (error) {
      Swal.fire({
        title: "Erro!",
        text: "Erro ao alterar senha",
        icon: "error",
      });
    }
  };

  if (!user) {
    return (
      <Container>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ⚙️ Configurações
      </Typography>

      {/* Informações Pessoais */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          👤 Informações Pessoais
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome"
              value={user.name || ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={user.email || ""}
              disabled
            />
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Preferências */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🎨 Preferências
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Tema</InputLabel>
              <Select
                value={settings.theme}
                onChange={(e) => handleSettingChange("theme", e.target.value)}
                label="Tema"
              >
                <MenuItem value="light">Claro</MenuItem>
                <MenuItem value="dark">Escuro</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Idioma</InputLabel>
              <Select
                value={settings.language}
                onChange={(e) =>
                  handleSettingChange("language", e.target.value)
                }
                label="Idioma"
              >
                <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                <MenuItem value="en-US">English (USA)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Moeda</InputLabel>
              <Select
                value={settings.currency}
                onChange={(e) =>
                  handleSettingChange("currency", e.target.value)
                }
                label="Moeda"
              >
                <MenuItem value="BRL">Real (R$)</MenuItem>
                <MenuItem value="USD">Dólar (US$)</MenuItem>
                <MenuItem value="EUR">Euro (€)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fuso Horário</InputLabel>
              <Select
                value={settings.timezone}
                onChange={(e) =>
                  handleSettingChange("timezone", e.target.value)
                }
                label="Fuso Horário"
              >
                <MenuItem value="America/Sao_Paulo">São Paulo (GMT-3)</MenuItem>
                <MenuItem value="America/New_York">Nova York (GMT-5)</MenuItem>
                <MenuItem value="Europe/London">Londres (GMT+0)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Notificações */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔔 Notificações
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={settings.notifications}
              onChange={(e) =>
                handleSettingChange("notifications", e.target.checked)
              }
            />
          }
          label="Notificações no aplicativo"
        />
        <FormControlLabel
          control={
            <Switch
              checked={settings.emailNotifications}
              onChange={(e) =>
                handleSettingChange("emailNotifications", e.target.checked)
              }
            />
          }
          label="Notificações por email"
        />
        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
          >
            Salvar Preferências
          </Button>
        </Box>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {/* Alterar Senha */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔐 Alterar Senha
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Senha Atual"
              type="password"
              value={password.current}
              onChange={(e) =>
                setPassword({ ...password, current: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nova Senha"
              type="password"
              value={password.new}
              onChange={(e) =>
                setPassword({ ...password, new: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Confirmar Senha"
              type="password"
              value={password.confirm}
              onChange={(e) =>
                setPassword({ ...password, confirm: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
            >
              Alterar Senha
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
