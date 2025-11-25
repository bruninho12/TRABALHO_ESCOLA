import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Paper,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  Avatar,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  ButtonGroup,
} from "@mui/material";
import {
  EmojiEvents as AchievementIcon,
  Favorite as HealthIcon,
  Star as LevelIcon,
  ElectricBolt as AttackIcon,
  LocalFireDepartment as FireIcon,
  Store as ShopIcon,
  SportsEsports as GameIcon,
  EmojiPeople as CharacterIcon,
  AutoFixHigh as MagicIcon,
  FlashOn as LightningIcon,
  Assessment as StatsIcon,
} from "@mui/icons-material";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { safeHealthProgress } from "../utils/progressValidation";

function RPGPage() {
  // Estados principais
  const [activeTab, setActiveTab] = useState(0);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentBattle, setCurrentBattle] = useState(null);

  // Estados de diálogos
  const [battleDialogOpen, setBattleDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);

  // Estados avançados
  const [shopItems, setShopItems] = useState([]);
  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [weeklyRanking, setWeeklyRanking] = useState([]);

  // Estados de batalha avançados
  const [battlePhase, setBattlePhase] = useState("preparation");

  // Estados do avatar customizado
  const [newAvatar, setNewAvatar] = useState({
    name: "",
    characterClass: "Knight",
    gender: "male",
    appearance: {
      hair: "brown",
      skin: "light",
      eyes: "blue",
      outfit: "default",
    },
  });

  // Estados de filtros e busca
  const [questFilter] = useState("active");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  const token = localStorage.getItem("finance_flow_token");

  // Dados mock para demonstração de funcionalidades premium
  const mockShopItems = useMemo(
    () => [
      {
        id: 1,
        name: "Espada Flamejante",
        category: "weapons",
        price: 150,
        attack: 25,
        rarity: "epic",
        icon: "⚔️",
      },
      {
        id: 2,
        name: "Armadura de Dragão",
        category: "armor",
        price: 200,
        defense: 30,
        rarity: "legendary",
        icon: "🛡️",
      },
      {
        id: 3,
        name: "Anel da Fortuna",
        category: "accessories",
        price: 100,
        luck: 15,
        rarity: "rare",
        icon: "💍",
      },
      {
        id: 4,
        name: "Poção de Vida",
        category: "consumables",
        price: 25,
        health: 50,
        rarity: "common",
        icon: "🧪",
      },
    ],
    []
  );

  const mockQuests = useMemo(
    () => [
      {
        id: 1,
        title: "Mestre da Economia",
        description: "Economize R$ 500 este mês",
        progress: 65,
        maxProgress: 100,
        reward: { gold: 100, exp: 250, item: "Medalha de Ouro" },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        difficulty: "hard",
      },
      {
        id: 2,
        title: "Guerreiro das Finanças",
        description: "Registre 10 transações consecutivas",
        progress: 3,
        maxProgress: 10,
        reward: { gold: 50, exp: 100, item: "Escudo do Guardião" },
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        difficulty: "medium",
      },
    ],
    []
  );

  // Classes de personagem expandidas
  const characterClasses = useMemo(
    () => ({
      Knight: {
        name: "Cavaleiro",
        description: "Especialista em defesa e proteção financeira",
        stats: { attack: 15, defense: 25, magic: 5, speed: 10 },
        color: "#2563eb",
        icon: "🛡️",
      },
      Mage: {
        name: "Mago",
        description: "Mestre em análises e previsões financeiras",
        stats: { attack: 10, defense: 10, magic: 30, speed: 15 },
        color: "#7c3aed",
        icon: "🧙‍♂️",
      },
      Rogue: {
        name: "Ladino",
        description: "Especialista em encontrar oportunidades e economias",
        stats: { attack: 20, defense: 8, magic: 12, speed: 25 },
        color: "#059669",
        icon: "🗡️",
      },
      Paladin: {
        name: "Paladino",
        description: "Equilibrio perfeito entre economia e investimento",
        stats: { attack: 18, defense: 18, magic: 18, speed: 18 },
        color: "#dc2626",
        icon: "⚡",
      },
    }),
    []
  );

  // Calculadora de poder total do avatar
  const calculateAvatarPower = useCallback(
    (avatarData) => {
      if (!avatarData) return 0;
      const baseStats = characterClasses[avatarData.characterClass]?.stats || {
        attack: 10,
        defense: 10,
        magic: 10,
        speed: 10,
      };
      const levelBonus = (avatarData.level || 1) * 5;
      const equipmentBonus = (avatarData.equipment?.length || 0) * 10;

      return (
        Object.values(baseStats).reduce((sum, stat) => sum + stat, 0) +
        levelBonus +
        equipmentBonus
      );
    },
    [characterClasses]
  );

  // Carregar dados do RPG quando a página é montada
  useEffect(() => {
    loadRPGData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRPGData = async () => {
    try {
      setLoading(true);

      if (!token) {
        console.warn("Token não encontrado. Usuário não autenticado.");
        setLoading(false);
        return;
      }

      console.log("🎮 Carregando dados do RPG...");
      const headers = { Authorization: `Bearer ${token}` };

      const [avatarRes] = await Promise.all([
        axios.get(`${apiUrl}/rpg/avatar`, { headers }).catch(() => ({
          data: {
            data: {
              avatar: {
                name: "Herói Anônimo",
                level: 5,
                experience: 750,
                nextLevelExp: 1000,
                characterClass: "Knight",
                health: 100,
                maxHealth: 100,
                gold: 500,
                equipment: [],
                stats: characterClasses.Knight.stats,
              },
            },
          },
        })),
      ]);

      // Configurar dados
      setAvatar(
        avatarRes.data.data?.avatar || {
          name: "Herói Anônimo",
          level: 5,
          experience: 750,
          nextLevelExp: 1000,
          characterClass: "Knight",
          health: 100,
          maxHealth: 100,
          gold: 500,
          equipment: [],
          stats: characterClasses.Knight.stats,
        }
      );

      // Configurar dados mock
      setShopItems(mockShopItems);
      setActiveQuests(mockQuests.filter((q) => !q.completed));
      setCompletedQuests(mockQuests.filter((q) => q.completed));

      // Mock do ranking semanal
      setWeeklyRanking([
        { rank: 1, name: "DragonSlayer99", level: 15, exp: 2500, gold: 1200 },
        { rank: 2, name: "GoldMaster", level: 12, exp: 1800, gold: 950 },
        { rank: 3, name: "EcoWarrior", level: 11, exp: 1650, gold: 800 },
      ]);
    } catch (error) {
      console.error("❌ Erro ao carregar dados do RPG:", error);
      Swal.fire({
        icon: "error",
        title: "Erro ao carregar RPG",
        text: "Não foi possível carregar os dados do sistema RPG.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função avançada de batalha com mecânicas premium
  const startAdvancedBattle = useCallback(
    async (enemy) => {
      try {
        setBattlePhase("preparation");

        const enhancedEnemy = {
          ...enemy,
          currentHealth: enemy.health,
          maxHealth: enemy.health,
        };

        setCurrentBattle({
          enemy: enhancedEnemy,
          playerHealth: avatar.health,
          playerMaxHealth: avatar.maxHealth,
          turn: "player",
          round: 1,
          battleScore: 0,
        });

        setBattleDialogOpen(true);
        setBattlePhase("combat");
      } catch (error) {
        console.error("Erro ao iniciar batalha:", error);
      }
    },
    [avatar]
  );

  // Sistema de combate avançado
  const executeAttack = useCallback(
    async (attackType) => {
      if (!currentBattle || battlePhase !== "combat") return;

      try {
        setLoading(true);

        // Mapear tipos de ataque para ações da API
        const actionMap = {
          basic: "attack",
          special: "special",
          ultimate: "ultimate",
          defend: "defend",
          heal: "heal",
        };

        const action = actionMap[attackType] || "attack";
        console.log(`Executando ação: ${action}`);
      } catch (error) {
        console.error("Erro na batalha:", error);
      } finally {
        setLoading(false);
      }
    },
    [currentBattle, battlePhase]
  );

  // Sistema de shop avançado
  const purchaseItem = useCallback(
    async (item) => {
      if (!avatar || avatar.gold < item.price) {
        Swal.fire({
          icon: "warning",
          title: "Gold Insuficiente",
          text: `Você precisa de ${item.price} gold para comprar este item.`,
        });
        return;
      }

      try {
        setAvatar((prev) => ({
          ...prev,
          gold: prev.gold - item.price,
        }));

        Swal.fire({
          icon: "success",
          title: "Item Adquirido!",
          text: `${item.name} foi adicionado ao seu inventário.`,
          showConfirmButton: false,
          timer: 2000,
        });
      } catch (error) {
        console.error("Erro ao comprar item:", error);
      }
    },
    [avatar]
  );

  const handleCreateAvatar = async () => {
    if (!newAvatar.name.trim()) {
      Swal.fire("Erro!", "Nome do avatar é obrigatório", "error");
      return;
    }

    try {
      setAvatar({
        ...newAvatar,
        level: 1,
        experience: 0,
        nextLevelExp: 1000,
        health: 100,
        maxHealth: 100,
        gold: 100,
        stats: characterClasses[newAvatar.characterClass].stats,
      });

      setAvatarDialogOpen(false);
      Swal.fire("Sucesso!", "Avatar criado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao criar avatar:", error);
      Swal.fire("Erro!", "Erro ao criar avatar", "error");
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
      {/* Cabeçalho Premium */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Paper
          elevation={0}
          sx={{
            background:
              "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%)",
            borderRadius: 4,
            color: "white",
            p: 4,
            mb: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Grid
            container
            spacing={3}
            alignItems="center"
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Grid item xs={12} md={6}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    background: `linear-gradient(135deg, ${
                      characterClasses[avatar?.characterClass || "Knight"].color
                    }, #ff6b6b)`,
                    fontSize: "2rem",
                  }}
                >
                  {characterClasses[avatar?.characterClass || "Knight"].icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} mb={1}>
                    {avatar?.name || "Herói Anônimo"}
                  </Typography>
                  <Chip
                    label={
                      characterClasses[avatar?.characterClass || "Knight"].name
                    }
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      mb: 1,
                    }}
                  />
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Nível {avatar?.level || 1} • Poder Total:{" "}
                    {calculateAvatarPower(avatar)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight={800} color="#FFD700">
                      {avatar?.gold || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      🪙 Gold
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box textAlign="center">
                    <Typography variant="h3" fontWeight={800} color="#00ff88">
                      {avatar?.experience || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      ⭐ Experiência
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box mt={2}>
                <Typography variant="body2" mb={1} sx={{ opacity: 0.8 }}>
                  Progresso para o próximo nível
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={safeHealthProgress(
                    avatar?.experience || 0,
                    avatar?.nextLevelExp || 1000
                  )}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #00ff88, #FFD700)",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* Tabs Premium */}
      <Paper elevation={0} sx={{ borderRadius: 3, mb: 3, overflow: "hidden" }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            bgcolor: "#f8fafc",
            "& .MuiTab-root": {
              fontWeight: 600,
              minHeight: 64,
              textTransform: "none",
              fontSize: "1rem",
            },
            "& .Mui-selected": {
              bgcolor: "white",
              color: "#667eea",
            },
          }}
        >
          <Tab
            label={
              <Stack direction="row" spacing={1}>
                <GameIcon />
                <span>Aventuras</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1}>
                <ShopIcon />
                <span>Loja</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1}>
                <AchievementIcon />
                <span>Missões</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1}>
                <StatsIcon />
                <span>Rankings</span>
              </Stack>
            }
          />
          <Tab
            label={
              <Stack direction="row" spacing={1}>
                <CharacterIcon />
                <span>Perfil</span>
              </Stack>
            }
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das Abas */}
      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="adventures"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderAdventuresTab()}
          </motion.div>
        )}

        {activeTab === 1 && (
          <motion.div
            key="shop"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderShopTab()}
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            key="quests"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderQuestsTab()}
          </motion.div>
        )}

        {activeTab === 3 && (
          <motion.div
            key="rankings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderRankingsTab()}
          </motion.div>
        )}

        {activeTab === 4 && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderProfileTab()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialogs */}
      {renderBattleDialog()}
      {renderAvatarDialog()}
    </Container>
  );

  // Função para renderizar a aba de Aventuras
  function renderAdventuresTab() {
    const mockEnemies = [
      {
        id: 1,
        name: "Orc Ladrão",
        level: 3,
        health: 60,
        attack: 15,
        gold: 30,
        exp: 50,
        zone: "Floresta Sombria",
        icon: "👹",
      },
      {
        id: 2,
        name: "Dragão Ganancioso",
        level: 8,
        health: 150,
        attack: 35,
        gold: 100,
        exp: 200,
        zone: "Montanha do Fogo",
        icon: "🐲",
      },
    ];

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight={700} mb={3} color="#1a202c">
            🗺️ Mapa de Aventuras
          </Typography>
        </Grid>

        {mockEnemies.map((enemy, index) => (
          <Grid item xs={12} sm={6} md={4} key={enemy.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card
                sx={{
                  height: "100%",
                  background: `linear-gradient(135deg, ${
                    index % 2 === 0 ? "#667eea" : "#f093fb"
                  } 0%, ${index % 2 === 0 ? "#764ba2" : "#f5576c"} 100%)`,
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => startAdvancedBattle(enemy)}
              >
                <CardContent>
                  <Box textAlign="center" mb={2}>
                    <Typography variant="h2" sx={{ fontSize: "3rem" }}>
                      {enemy.icon}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    mb={1}
                    textAlign="center"
                  >
                    {enemy.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    textAlign="center"
                    mb={2}
                    sx={{ opacity: 0.8 }}
                  >
                    📍 {enemy.zone}
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                    }}
                  >
                    ⚔️ Iniciar Batalha
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Função para renderizar a aba da Loja
  function renderShopTab() {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3}>
          🏪 Loja de Itens Mágicos
        </Typography>
        <Grid container spacing={3}>
          {shopItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" textAlign="center">
                    {item.icon} {item.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Preço: {item.price} Gold
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => purchaseItem(item)}
                    sx={{ mt: 2 }}
                  >
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Função para renderizar a aba de Missões
  function renderQuestsTab() {
    const quests = questFilter === "active" ? activeQuests : completedQuests;

    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3}>
          🎯 Missões Épicas
        </Typography>
        <Grid container spacing={3}>
          {quests.map((quest) => (
            <Grid item xs={12} md={6} key={quest.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{quest.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {quest.description}
                  </Typography>
                  <Box mt={2}>
                    <LinearProgress
                      variant="determinate"
                      value={(quest.progress / quest.maxProgress) * 100}
                    />
                    <Typography variant="caption">
                      {quest.progress}/{quest.maxProgress}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Função para renderizar a aba de Rankings
  function renderRankingsTab() {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3}>
          🏆 Rankings Globais
        </Typography>
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Posição</TableCell>
                    <TableCell>Jogador</TableCell>
                    <TableCell>Nível</TableCell>
                    <TableCell>EXP</TableCell>
                    <TableCell>Gold</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weeklyRanking.map((player) => (
                    <TableRow key={player.rank}>
                      <TableCell>{player.rank}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell>{player.level}</TableCell>
                      <TableCell>{player.exp}</TableCell>
                      <TableCell>{player.gold}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Função para renderizar a aba de Perfil
  function renderProfileTab() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mx: "auto",
                  mb: 2,
                  background: `linear-gradient(135deg, ${
                    characterClasses[avatar?.characterClass || "Knight"].color
                  }, #ff6b6b)`,
                  fontSize: "3rem",
                }}
              >
                {characterClasses[avatar?.characterClass || "Knight"].icon}
              </Avatar>

              <Typography variant="h5" fontWeight={600} mb={1}>
                {avatar?.name || "Herói Anônimo"}
              </Typography>

              <Button
                variant="contained"
                startIcon={<CharacterIcon />}
                onClick={() => setAvatarDialogOpen(true)}
              >
                Editar Avatar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={3}>
                ⚡ Atributos do Personagem
              </Typography>

              <Grid container spacing={3}>
                {Object.entries(
                  characterClasses[avatar?.characterClass || "Knight"].stats
                ).map(([stat, value]) => (
                  <Grid item xs={6} sm={3} key={stat}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight={700} color="#667eea">
                        {value}
                      </Typography>
                      <Typography variant="caption" textTransform="capitalize">
                        {stat}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }

  // Função para renderizar diálogo de batalha
  function renderBattleDialog() {
    if (!currentBattle) return null;

    return (
      <Dialog
        open={battleDialogOpen}
        onClose={() => setBattleDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>⚔️ Batalha Épica</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h6">{avatar?.name || "Herói"}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={safeHealthProgress(
                    currentBattle.playerHealth,
                    currentBattle.playerMaxHealth
                  )}
                />
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h6">{currentBattle.enemy.name}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={safeHealthProgress(
                    currentBattle.enemy.currentHealth,
                    currentBattle.enemy.maxHealth
                  )}
                />
              </Box>
            </Grid>
          </Grid>

          {battlePhase === "combat" && (
            <Grid container spacing={2} mt={2}>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => executeAttack("basic")}
                >
                  Ataque Básico
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => executeAttack("special")}
                >
                  Ataque Especial
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => executeAttack("ultimate")}
                >
                  Ataque Final
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    );
  }

  // Função para renderizar diálogo de criação de avatar
  function renderAvatarDialog() {
    return (
      <Dialog
        open={avatarDialogOpen}
        onClose={() => setAvatarDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>✨ Criar Avatar</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Nome do Herói"
                  value={newAvatar.name}
                  onChange={(e) =>
                    setNewAvatar((prev) => ({ ...prev, name: e.target.value }))
                  }
                />

                <FormControl fullWidth>
                  <InputLabel>Classe</InputLabel>
                  <Select
                    value={newAvatar.characterClass}
                    label="Classe"
                    onChange={(e) =>
                      setNewAvatar((prev) => ({
                        ...prev,
                        characterClass: e.target.value,
                      }))
                    }
                  >
                    {Object.entries(characterClasses).map(([key, cls]) => (
                      <MenuItem key={key} value={key}>
                        {cls.icon} {cls.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box textAlign="center">
                <Typography variant="h6" mb={2}>
                  Preview do Avatar
                </Typography>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 2,
                    background: `linear-gradient(135deg, ${
                      characterClasses[newAvatar.characterClass].color
                    }, #ff6b6b)`,
                    fontSize: "3rem",
                  }}
                >
                  {characterClasses[newAvatar.characterClass].icon}
                </Avatar>
                <Typography variant="h6">
                  {newAvatar.name || "Nome do Herói"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateAvatar}>
            {avatar ? "Atualizar Avatar" : "Criar Avatar"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default RPGPage;
