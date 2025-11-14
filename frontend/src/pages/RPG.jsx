import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Badge,
} from "@mui/material";
import {
  EmojiEvents as AchievementIcon,
  Favorite as HealthIcon,
  Star as LevelIcon,
  ElectricBolt as AttackIcon,
  LocalFireDepartment as FireIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";

function RPGPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [battles, setBattles] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [worldMap, setWorldMap] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentBattle, setCurrentBattle] = useState(null);
  const [battleDialogOpen, setBattleDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [newAvatar, setNewAvatar] = useState({
    name: "",
    characterClass: "Knight",
    gender: "male",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  const token = localStorage.getItem("finance_flow_token");

  const loadRPGData = async () => {
    try {
      setLoading(true);

      if (!token) {
        console.warn("Token não encontrado. Usuário não autenticado.");
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [avatarRes, battlesRes, achievementsRes, mapRes, leaderboardRes] =
        await Promise.all([
          axios.get(`${apiUrl}/rpg/avatar`, { headers }).catch((error) => {
            console.error(
              "Erro ao carregar avatar:",
              error.response?.status,
              error.message
            );
            return { data: { data: { avatar: null } } };
          }),
          axios.get(`${apiUrl}/rpg/battles`, { headers }).catch((error) => {
            console.error("Erro ao carregar batalhas:", error.response?.status);
            return { data: { data: { battles: [] } } };
          }),
          axios
            .get(`${apiUrl}/rpg/achievements`, { headers })
            .catch((error) => {
              console.error(
                "Erro ao carregar achievements:",
                error.response?.status
              );
              return { data: { data: { achievements: [] } } };
            }),
          axios.get(`${apiUrl}/rpg/world-map`, { headers }).catch((error) => {
            console.error("Erro ao carregar mapa:", error.response?.status);
            return { data: { data: { map: null } } };
          }),
          axios.get(`${apiUrl}/rpg/leaderboard`, { headers }).catch((error) => {
            console.error(
              "Erro ao carregar leaderboard:",
              error.response?.status
            );
            return { data: { data: { leaderboard: [] } } };
          }),
        ]);

      setAvatar(avatarRes.data?.data?.avatar || null);
      setBattles(battlesRes.data?.data?.battles || []);
      setAchievements(achievementsRes.data?.data?.achievements || []);
      setWorldMap(mapRes.data?.data?.map || null);
      setLeaderboard(leaderboardRes.data?.data?.leaderboard || []);
    } catch (error) {
      console.error("Erro ao carregar dados RPG:", error);
      Swal.fire(
        "Erro!",
        "Erro ao carregar dados do RPG. Tente novamente.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAvatar = async () => {
    if (!newAvatar.name.trim()) {
      Swal.fire("Erro!", "Nome do avatar é obrigatório", "error");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(`${apiUrl}/rpg/avatar`, newAvatar, {
        headers,
      });

      setAvatar(response.data?.data?.avatar);
      setAvatarDialogOpen(false);
      setNewAvatar({ name: "", characterClass: "Knight", gender: "male" });
      Swal.fire("Sucesso!", "Avatar criado com sucesso!", "success");
    } catch (error) {
      Swal.fire(
        "Erro!",
        error.response?.data?.message || "Erro ao criar avatar",
        "error"
      );
    }
  };

  const handleStartBattle = async (cityNumber) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${apiUrl}/rpg/battle/start`,
        { cityNumber },
        { headers }
      );

      setCurrentBattle(response.data?.data?.battle);
      setBattleDialogOpen(true);
    } catch (error) {
      Swal.fire(
        "Erro!",
        error.response?.data?.message || "Erro ao iniciar batalha",
        "error"
      );
    }
  };

  const handleBattleAction = async (action) => {
    if (!currentBattle) return;

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${apiUrl}/rpg/battle/${currentBattle._id}/action`,
        { action },
        { headers }
      );

      const updatedBattle = response.data?.data?.battle;
      setCurrentBattle(updatedBattle);

      if (updatedBattle.result === "won" || updatedBattle.result === "lost") {
        const msg =
          updatedBattle.result === "won"
            ? "Batalha Completa! Você venceu! Parabéns!"
            : "Batalha finalizada! Você foi derrotado.";
        Swal.fire(
          "Resultado da Batalha",
          msg,
          updatedBattle.result === "won" ? "success" : "error"
        );
        setBattleDialogOpen(false);
        await loadRPGData();
      }
    } catch (error) {
      Swal.fire(
        "Erro!",
        error.response?.data?.message || "Erro na ação de batalha",
        "error"
      );
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Typography>Carregando dados RPG...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        🎮 Sistema RPG de Finanças
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Avatar" />
        <Tab label="Batalhas" />
        <Tab label="Mapa do Mundo" />
        <Tab label="Achievements" />
        <Tab label="Leaderboard" />
      </Tabs>

      {/* ABA 1: AVATAR */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {avatar ? (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {avatar.name}
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    <Chip
                      label={`Classe: ${avatar.characterClass}`}
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={`Nível: ${avatar.level || 1}`}
                      color="secondary"
                    />
                  </Box>
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Vida
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        ((avatar.stats?.health || 0) /
                          (avatar.stats?.maxHealth || 1)) *
                        100
                      }
                      sx={{ mb: 2 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip
                      icon={<HealthIcon />}
                      label={`HP: ${avatar.stats?.health || 0}/${
                        avatar.stats?.maxHealth || 0
                      }`}
                    />
                    <Chip
                      icon={<AttackIcon />}
                      label={`ATK: ${avatar.stats?.strength || 0}`}
                    />
                    <Chip
                      icon={<FireIcon />}
                      label={`DEF: ${avatar.stats?.constitution || 0}`}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{ mt: 3 }}
                    onClick={() => setAvatarDialogOpen(true)}
                  >
                    Recriar Avatar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Card sx={{ textAlign: "center", py: 4 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Nenhum Avatar Criado
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 3 }}>
                    Crie seu primeiro avatar para começar sua jornada financeira
                    épica!
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setAvatarDialogOpen(true)}
                  >
                    Criar Avatar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* ABA 2: BATALHAS */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Meus Histórico de Batalhas
            </Typography>
          </Grid>
          {battles && battles.length > 0 ? (
            battles.map((battle) => (
              <Grid
                item
                xs={12}
                md={6}
                key={battle._id || battle.createdAt || Math.random()}
              >
                <Card>
                  <CardContent>
                    <Typography variant="h6">{battle.enemyName}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      {new Date(battle.createdAt).toLocaleDateString("pt-BR")}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Chip
                        label={
                          battle.status === "completed" ? "Vitória" : "Derrota"
                        }
                        color={
                          battle.status === "completed" ? "success" : "error"
                        }
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2">
                      Recompensa: R$ {battle.reward}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary">
                Nenhuma batalha realizada ainda
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* ABA 3: MAPA DO MUNDO */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          {worldMap && worldMap.cities ? (
            worldMap.cities.map((city) => (
              <Grid item xs={12} md={6} key={city.cityNumber || city.name}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{city.name}</Typography>
                    <Typography color="textSecondary" variant="body2">
                      {city.description}
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      <Chip
                        label={city.isUnlocked ? "Desbloqueado ✓" : "Bloqueado"}
                        color={city.isUnlocked ? "success" : "default"}
                        size="small"
                      />
                    </Box>
                    {city.boss && (
                      <Typography variant="body2" color="error">
                        Boss: {city.boss.name} (HP: {city.boss.health})
                      </Typography>
                    )}
                    {city.isUnlocked && avatar && (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => handleStartBattle(city.cityNumber)}
                      >
                        Iniciar Batalha
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary">Mapa não disponível</Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* ABA 4: ACHIEVEMENTS */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          {achievements && achievements.length > 0 ? (
            achievements.map((achievement) => (
              <Grid
                item
                xs={12}
                md={6}
                key={achievement._id || achievement.name}
              >
                <Card sx={{ opacity: achievement.unlockedAt ? 1 : 0.6 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <AchievementIcon
                        sx={{
                          fontSize: 40,
                          color: achievement.unlockedAt ? "gold" : "gray",
                        }}
                      />
                      <Box>
                        <Typography variant="h6">{achievement.name}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {achievement.description}
                        </Typography>
                        {achievement.unlockedAt && (
                          <Typography variant="caption" color="success">
                            Desbloqueado em{" "}
                            {new Date(
                              achievement.unlockedAt
                            ).toLocaleDateString("pt-BR")}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography color="textSecondary">
                Nenhum achievement desbloqueado ainda
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      {/* ABA 5: LEADERBOARD */}
      {activeTab === 4 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Top 10 Jogadores
          </Typography>
          {leaderboard && leaderboard.length > 0 ? (
            <Box>
              {leaderboard.slice(0, 10).map((player, index) => (
                <Box
                  key={player._id || player.name || index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Badge badgeContent={index + 1} color="primary">
                      <Typography variant="h6">{player.name}</Typography>
                    </Badge>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Chip
                      icon={<LevelIcon />}
                      label={`Nível ${player.level}`}
                    />
                    <Typography variant="body2" color="success">
                      R$ {player.totalRewards}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="textSecondary">
              Nenhum jogador no leaderboard ainda
            </Typography>
          )}
        </Paper>
      )}

      {/* DIALOG: CRIAR/RECRIAR AVATAR */}
      <Dialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
      >
        <DialogTitle>Criar Avatar</DialogTitle>
        <DialogContent sx={{ minWidth: 400, py: 2 }}>
          <TextField
            fullWidth
            label="Nome do Avatar"
            value={newAvatar.name}
            onChange={(e) =>
              setNewAvatar({ ...newAvatar, name: e.target.value })
            }
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Classe</InputLabel>
            <Select
              value={newAvatar.characterClass}
              onChange={(e) =>
                setNewAvatar({ ...newAvatar, characterClass: e.target.value })
              }
              label="Classe"
            >
              <MenuItem value="Knight">Guerreiro</MenuItem>
              <MenuItem value="Mage">Mago</MenuItem>
              <MenuItem value="Rogue">Arqueiro</MenuItem>
              <MenuItem value="Paladin">Paladino</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Gênero</InputLabel>
            <Select
              value={newAvatar.gender}
              onChange={(e) =>
                setNewAvatar({ ...newAvatar, gender: e.target.value })
              }
              label="Gênero"
            >
              <MenuItem value="male">Masculino</MenuItem>
              <MenuItem value="female">Feminino</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancelar</Button>
          <Button
            onClick={handleCreateAvatar}
            variant="contained"
            color="primary"
          >
            Criar
          </Button>
        </DialogActions>
      </Dialog>

      {/* DIALOG: BATALHA */}
      <Dialog
        open={battleDialogOpen}
        onClose={() => setBattleDialogOpen(false)}
      >
        <DialogTitle>🗡️ Batalha</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          {currentBattle && (
            <Box>
              <Typography variant="h6">
                vs. {currentBattle.enemy?.name || "Inimigo desconhecido"}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2">Vida do inimigo</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    ((currentBattle.enemy?.health || 0) /
                      (currentBattle.enemy?.healthMax || 1)) *
                    100
                  }
                />
                <Typography variant="caption">
                  {currentBattle.enemy?.health || 0}/
                  {currentBattle.enemy?.healthMax || 0}
                </Typography>
              </Box>
              <Box sx={{ my: 2 }}>
                <Typography variant="body2">Sua vida</Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    ((avatar?.stats?.health || 0) /
                      (avatar?.stats?.maxHealth || 1)) *
                    100
                  }
                  color={avatar?.stats?.health > 30 ? "primary" : "error"}
                />
                <Typography variant="caption">
                  {avatar?.stats?.health || 0}/{avatar?.stats?.maxHealth || 0}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleBattleAction("attack")}
            variant="contained"
            color="error"
          >
            Atacar
          </Button>
          <Button
            onClick={() => handleBattleAction("defend")}
            variant="contained"
            color="primary"
          >
            Defender
          </Button>
          <Button
            onClick={() => handleBattleAction("heal")}
            variant="contained"
            color="success"
          >
            Curar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// Imports que faltam
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default RPGPage;
