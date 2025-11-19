import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Avatar,
  Stack,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Shield as DefenseIcon,
  Speed as SpeedIcon,
  TrendingUp as ExpIcon,
  Store as ShopIcon,
  WorkspacePremium as PremiumIcon,
  SportsEsports as GameIcon,
  EmojiPeople as CharacterIcon,
  Military as WarriorIcon,
  AutoFixHigh as MagicIcon,
  Gavel as HammerIcon,
  Security as ArmorIcon,
  Psychology as WisdomIcon,
  FlashOn as LightningIcon,
  Whatshot as DragonIcon,
  Castle as CastleIcon,
  Forest as ForestIcon,
  Terrain as MountainIcon,
  Water as WaterIcon,
  ExpandMore as ExpandMoreIcon,
      <>
        <Dialog
          open={battleDialogOpen}
          onClose={() => setBattleDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
              color: "white",
              borderRadius: 4,
            },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", py: 3 }}>
            <Typography variant="h4" fontWeight={800}>
              ⚔️ Batalha Épica
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.8 }}>
              Round {currentBattle.round || 1}
            </Typography>
            {battlePhase === "combat" && (
              <Stack
                direction="row"
                spacing={1}
                justifyContent="center"
                mt={2}
                flexWrap="wrap"
              >
                <Chip
                  label={`Combo: ${comboCounter}`}
                  color={comboCounter >= 3 ? "secondary" : "default"}
                  size="small"
                />
                <Chip
                  label={`Tempo: ${battleTimer}s`}
                  size="small"
                  color={battleTimer < 10 ? "error" : "primary"}
                />
                {criticalHit && (
                  <Chip label="CRÍTICO!" color="warning" size="small" />
                )}
              </Stack>
            )}
          </DialogTitle>

          <DialogContent sx={{ px: 4, pb: 4 }}>
            <Grid container spacing={3} mb={4}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "#667eea",
                    }}
                  >
                    {characterClasses[avatar?.characterClass || "Knight"].icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    {avatar?.name || "Herói"}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={
                      (currentBattle.playerHealth /
                        currentBattle.playerMaxHealth) *
                      100
                    }
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      bgcolor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": { bgcolor: "#10b981" },
                    }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentBattle.playerHealth}/{currentBattle.playerMaxHealth} HP
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h1" sx={{ fontSize: "5rem" }} mb={1}>
                    {currentBattle.enemy.icon || "👹"}
                  </Typography>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    {currentBattle.enemy.name}
                  </Typography>
                  <motion.div
                    animate={shakeEffect ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <LinearProgress
                      variant="determinate"
                      value={
                        (currentBattle.enemy.currentHealth /
                          currentBattle.enemy.maxHealth) *
                        100
                      }
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: "rgba(255,255,255,0.2)",
                        "& .MuiLinearProgress-bar": { bgcolor: "#ef4444" },
                      }}
                    />
                  </motion.div>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {currentBattle.enemy.currentHealth}/{currentBattle.enemy.maxHealth} HP
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {battlePhase === "combat" && (
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => executeAttack("basic")}
                    sx={{
                      bgcolor: "#667eea",
                      py: 2,
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <AttackIcon />
                    <Typography variant="body2" fontWeight={600}>
                      Ataque Básico
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => executeAttack("special")}
                    sx={{
                      bgcolor: "#7c3aed",
                      py: 2,
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <MagicIcon />
                    <Typography variant="body2" fontWeight={600}>
                      Ataque Especial
                    </Typography>
                  </Button>
                </Grid>

                <Grid item xs={4}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={() => executeAttack("ultimate")}
                    disabled={comboCounter < 3}
                    sx={{
                      bgcolor: comboCounter >= 3 ? "#ef4444" : "#64748b",
                      py: 2,
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    <LightningIcon />
                    <Typography variant="body2" fontWeight={600}>
                      Ataque Final
                    </Typography>
                  </Button>
                </Grid>
              </Grid>
            )}
            {combatLog.length > 0 && (
              <Box mt={4}>
                <Typography variant="subtitle2" mb={1}>
                  📜 Log de Combate
                </Typography>
                <Stack spacing={1} sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {combatLog.slice(-10).map((entry) => (
                    <Paper
                      key={entry.id}
                      sx={{
                        p: 1.5,
                        bgcolor: entry.type === "player"
                          ? "rgba(16,185,129,0.15)"
                          : entry.type === "enemy"
                          ? "rgba(239,68,68,0.15)"
                          : entry.type === "victory"
                          ? "rgba(234,179,8,0.25)"
                          : entry.type === "defeat"
                          ? "rgba(107,114,128,0.25)"
                          : "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <Typography variant="caption" sx={{ fontSize: 12 }}>
                        {entry.message}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}
          </DialogContent>

          {battlePhase === "combat" && (
            <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
              <Button
                onClick={() => setBattleDialogOpen(false)}
                variant="outlined"
                sx={{ color: "white", borderColor: "white" }}
              >
                Fugir da Batalha
              </Button>
            </DialogActions>
          )}
        </Dialog>
        <AnimatePresence>
          {animatingBattle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                background: "rgba(0,0,0,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1300,
              }}
            >
              <Stack spacing={2} alignItems="center">
                <CircularProgress color="inherit" />
                <Typography variant="h6" color="white" fontWeight={600}>
                  Preparando batalha...
                </Typography>
              </Stack>
            </motion.div>
          )}
          {animatingReward && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                bottom: 24,
                right: 24,
                background: "linear-gradient(135deg, #FFD700, #ff6b6b)",
                color: "#1a202c",
                padding: "16px 24px",
                borderRadius: 12,
                boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                zIndex: 1300,
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                🎉 Recompensas Aplicadas!
              </Typography>
              <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
                Experiência e Gold adicionados ao seu avatar.
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </>
        return;
      }

      console.log("🎮 Carregando dados do RPG...");
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

      // Configurar dados ou usar mocks para demonstração
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

      setBattles(battlesRes.data.data?.battles || []);
      setAchievements(achievementsRes.data.data?.achievements || []);
      setWorldMap(mapRes.data.data?.map || null);
      setLeaderboard(leaderboardRes.data.data?.leaderboard || []);

      // Configurar dados mock para demonstração
      setShopItems(mockShopItems);
      setActiveQuests(mockQuests.filter((q) => !q.completed));
      setCompletedQuests(mockQuests.filter((q) => q.completed));
      setInventory([
        { id: 1, name: "Espada de Ferro", type: "weapon", equipped: true },
        { id: 2, name: "Armadura Básica", type: "armor", equipped: true },
      ]);

      // Mock do ranking semanal
      setWeeklyRanking([
        { rank: 1, name: "DragonSlayer99", level: 15, exp: 2500, gold: 1200 },
        { rank: 2, name: "GoldMaster", level: 12, exp: 1800, gold: 950 },
        { rank: 3, name: "EcoWarrior", level: 11, exp: 1650, gold: 800 },
        {
          rank: 4,
          name: avatar.name || "Você",
          level: avatar.level || 5,
          exp: avatar.experience || 750,
          gold: avatar.gold || 500,
        },
      ]);

      console.log("✅ Dados do RPG carregados com sucesso");
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
        setAnimatingBattle(true);
        setBattlePhase("preparation");
        setCombatLog([]);
        setComboCounter(0);

        const enhancedEnemy = {
          ...enemy,
          currentHealth: enemy.health,
          maxHealth: enemy.health,
          abilities: enemy.abilities || [
            "Ataque Básico",
            "Defesa",
            "Habilidade Especial",
          ],
        };

        setCurrentBattle({
          enemy: enhancedEnemy,
          playerHealth: avatar.health,
          playerMaxHealth: avatar.maxHealth,
          turn: "player",
          round: 1,
          combatEffects: [],
          battleScore: 0,
        });

        setBattleDialogOpen(true);
        setBattlePhase("combat");
        setBattleTimer(30);

        // Adicionar entrada no log de combate
        setCombatLog((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "system",
            message: `Batalha iniciada contra ${enemy.name}!`,
            timestamp: new Date(),
          },
        ]);
      } catch (error) {
        console.error("Erro ao iniciar batalha:", error);
      } finally {
        setAnimatingBattle(false);
      }
    },
    [avatar]
  );

  // Sistema de combate avançado
  const executeAttack = useCallback(
    async (attackType) => {
      if (!currentBattle || battlePhase !== "combat") return;

      try {
        const playerAttack = calculateAttackDamage(attackType);
        const isCritical = Math.random() < 0.15; // 15% chance de crítico
        const finalDamage = isCritical ? playerAttack * 1.5 : playerAttack;

        setCriticalHit(isCritical);
        if (isCritical) {
          setComboCounter((prev) => prev + 1);
          setShakeEffect(true);
          setTimeout(() => setShakeEffect(false), 500);
        }

        // Atualizar vida do inimigo
        const newEnemyHealth = Math.max(
          0,
          currentBattle.enemy.currentHealth - finalDamage
        );

        // Adicionar ao log de combate
        setCombatLog((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "player",
            message: `${
              isCritical ? "💥 CRÍTICO! " : ""
            }Você causou ${finalDamage} de dano!`,
            damage: finalDamage,
            critical: isCritical,
            timestamp: new Date(),
          },
        ]);

        if (newEnemyHealth <= 0) {
          // Vitória do jogador
          await handleBattleVictory();
        } else {
          // Ataque do inimigo
          const enemyAttack = Math.floor(Math.random() * 20) + 10;
          const newPlayerHealth = Math.max(
            0,
            currentBattle.playerHealth - enemyAttack
          );

          setCurrentBattle((prev) => ({
            ...prev,
            enemy: { ...prev.enemy, currentHealth: newEnemyHealth },
            playerHealth: newPlayerHealth,
            round: prev.round + 1,
            battleScore: prev.battleScore + (isCritical ? 200 : 100),
          }));

          setCombatLog((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              type: "enemy",
              message: `${currentBattle.enemy.name} causou ${enemyAttack} de dano!`,
              damage: enemyAttack,
              timestamp: new Date(),
            },
          ]);

          if (newPlayerHealth <= 0) {
            await handleBattleDefeat();
          }
        }
      } catch (error) {
        console.error("Erro durante o combate:", error);
      }
    },
    [
      currentBattle,
      battlePhase,
      calculateAttackDamage,
      handleBattleDefeat,
      handleBattleVictory,
    ]
  );

  const calculateAttackDamage = useCallback(
    (attackType) => {
      const baseAttack = avatar?.stats?.attack || 15;
      const classBonus =
        characterClasses[avatar?.characterClass]?.stats?.attack || 0;

      switch (attackType) {
        case "basic":
          return baseAttack + Math.floor(Math.random() * 10);
        case "special":
          return (
            Math.floor((baseAttack + classBonus) * 1.5) +
            Math.floor(Math.random() * 15)
          );
        case "ultimate":
          return (
            Math.floor((baseAttack + classBonus) * 2) +
            Math.floor(Math.random() * 20)
          );
        default:
          return baseAttack;
      }
    },
    [avatar, characterClasses]
  );

  const handleBattleVictory = useCallback(async () => {
    const expGained = 50 + currentBattle.round * 10 + comboCounter * 5;
    const goldGained = 25 + currentBattle.battleScore / 10;

    setBattlePhase("result");
    setAnimatingReward(true);

    setCombatLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "victory",
        message: `🎉 VITÓRIA! +${expGained} EXP, +${goldGained} Gold`,
        timestamp: new Date(),
      },
    ]);

    // Atualizar avatar com recompensas
    setAvatar((prev) => ({
      ...prev,
      experience: prev.experience + expGained,
      gold: prev.gold + goldGained,
    }));

    setTimeout(() => {
      setAnimatingReward(false);
      setBattleDialogOpen(false);
    }, 3000);
  }, [currentBattle, comboCounter]);

  const handleBattleDefeat = useCallback(async () => {
    setBattlePhase("result");

    setCombatLog((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: "defeat",
        message: `💀 Derrota... Tente novamente!`,
        timestamp: new Date(),
      },
    ]);

    setTimeout(() => {
      setBattleDialogOpen(false);
    }, 2000);
  }, []);

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
        // Simular compra
        setAvatar((prev) => ({
          ...prev,
          gold: prev.gold - item.price,
        }));

        setInventory((prev) => [
          ...prev,
          {
            ...item,
            id: Date.now(),
            purchasedAt: new Date(),
          },
        ]);

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
      console.log(
        "🎮 [DEBUG] handleStartBattle called with cityNumber:",
        cityNumber
      );

      const headers = { Authorization: `Bearer ${token}` };
      console.log(
        "🎮 [DEBUG] Enviando request para:",
        `${apiUrl}/rpg/battle/start`
      );
      console.log("🎮 [DEBUG] Body:", { cityNumber });

      const response = await axios.post(
        `${apiUrl}/rpg/battle/start`,
        { cityNumber },
        { headers }
      );

      console.log("✅ [DEBUG] Response:", response.data);
      setCurrentBattle(response.data?.data?.battle);
      setBattleDialogOpen(true);
    } catch (error) {
      console.error(
        "❌ [DEBUG] Error in handleStartBattle:",
        error.response?.data
      );
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
      {/* Cabeçalho Épico Premium */}
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
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="40" height="40" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="stars" width="40" height="40" patternUnits="userSpaceOnUse"%3E%3Cpolygon points="20,3 23,14 34,14 25,22 28,33 20,25 12,33 15,22 6,14 17,14" fill="rgba(255,255,255,0.1)"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23stars)"/%3E%3C/svg%3E")',
              opacity: 0.3,
            },
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
                  value={
                    ((avatar?.experience || 0) /
                      (avatar?.nextLevelExp || 1000)) *
                    100
                  }
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": {
                      background: "linear-gradient(90deg, #00ff88, #FFD700)",
                    },
                  }}
                />
                <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                  <Chip
                    label={`Batalhas: ${battles.length}`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
                  />
                  <Chip
                    label={`Conquistas: ${achievements.length}`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
                  />
                  {worldMap && (
                    <Chip
                      label={`Cidades: ${worldMap?.cities?.length || 0}`}
                      size="small"
                      sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
                    />
                  )}
                  <Chip
                    label={`Leaderboard: ${leaderboard.length}`}
                    size="small"
                    sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "white" }}
                  />
                </Stack>
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

      {/* Dialogs Premium */}
      {renderBattleDialog()}
      {renderShopDialog()}
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
      {
        id: 3,
        name: "Fantasma da Dívida",
        level: 5,
        health: 80,
        attack: 20,
        gold: 50,
        exp: 100,
        zone: "Castelo Assombrado",
        icon: "👻",
      },
      {
        id: 4,
        name: "Kraken dos Gastos",
        level: 10,
        health: 200,
        attack: 45,
        gold: 150,
        exp: 300,
        zone: "Oceano Profundo",
        icon: "🐙",
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
                  "&:hover": {
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  },
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

                  <Box
                    sx={{
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      p: 2,
                    }}
                  >
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Nível
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {enemy.level}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          Vida
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {enemy.health}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          🪙 Recompensa
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {enemy.gold} Gold
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          ⭐ EXP
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {enemy.exp} EXP
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      mt: 2,
                      bgcolor: "rgba(255,255,255,0.2)",
                      color: "white",
                      fontWeight: 600,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.3)",
                      },
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
    const categories = [
      { key: "weapons", label: "Armas", icon: "⚔️" },
      { key: "armor", label: "Armaduras", icon: "🛡️" },
      { key: "accessories", label: "Acessórios", icon: "💍" },
      { key: "consumables", label: "Consumíveis", icon: "🧪" },
    ];

    const filteredItems = shopItems.filter(
      (item) => shopCategory === "all" || item.category === shopCategory
    );

    return (
      <Box>
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700} color="#1a202c">
            🏪 Loja de Itens Mágicos
          </Typography>
          <Chip
            label={`${avatar?.gold || 0} Gold`}
            sx={{ bgcolor: "#FFD700", color: "#1a202c", fontWeight: 600 }}
          />
        </Stack>

        <Box mb={3}>
          <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
            <Button
              variant={shopCategory === "all" ? "contained" : "outlined"}
              onClick={() => setShopCategory("all")}
            >
              Todos
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.key}
                variant={shopCategory === cat.key ? "contained" : "outlined"}
                onClick={() => setShopCategory(cat.key)}
                startIcon={cat.icon}
              >
                {cat.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Grid container spacing={3}>
          {filteredItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card sx={{ height: "100%", position: "relative" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      zIndex: 1,
                    }}
                  >
                    <Chip
                      label={item.rarity}
                      size="small"
                      sx={{
                        bgcolor:
                          item.rarity === "legendary"
                            ? "#ff6b6b"
                            : item.rarity === "epic"
                            ? "#a855f7"
                            : item.rarity === "rare"
                            ? "#3b82f6"
                            : "#6b7280",
                        color: "white",
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <CardContent>
                    <Box textAlign="center" mb={2}>
                      <Typography variant="h1" sx={{ fontSize: "3rem" }}>
                        {item.icon}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={600}
                      textAlign="center"
                      mb={1}
                    >
                      {item.name}
                    </Typography>

                    <Box
                      sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 2, mb: 2 }}
                    >
                      {item.attack && (
                        <Typography variant="body2" color="#ef4444">
                          ⚔️ Ataque: +{item.attack}
                        </Typography>
                      )}
                      {item.defense && (
                        <Typography variant="body2" color="#3b82f6">
                          🛡️ Defesa: +{item.defense}
                        </Typography>
                      )}
                      {item.magic && (
                        <Typography variant="body2" color="#7c3aed">
                          🔮 Magia: +{item.magic}
                        </Typography>
                      )}
                      {item.health && (
                        <Typography variant="body2" color="#10b981">
                          ❤️ Vida: +{item.health}
                        </Typography>
                      )}
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => purchaseItem(item)}
                      disabled={avatar?.gold < item.price}
                      sx={{
                        bgcolor:
                          avatar?.gold >= item.price ? "#667eea" : "#gray",
                        fontWeight: 600,
                      }}
                    >
                      💰 {item.price} Gold
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Função para renderizar a aba de Missões
  function renderQuestsTab() {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3} color="#1a202c">
          🎯 Missões Épicas
        </Typography>

        <Tabs
          value={questFilter}
          onChange={(_, value) => setQuestFilter(value)}
          sx={{ mb: 3 }}
        >
          <Tab value="active" label="Ativas" />
          <Tab value="completed" label="Concluídas" />
          <Tab value="daily" label="Diárias" />
        </Tabs>

        <Grid container spacing={3}>
          {(questFilter === "active" ? activeQuests : completedQuests).map(
            (quest, index) => (
              <Grid item xs={12} md={6} key={quest.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      border: quest.completed
                        ? "2px solid #10b981"
                        : "2px solid #e5e7eb",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                      }}
                    >
                      <Chip
                        label={quest.difficulty}
                        size="small"
                        sx={{
                          bgcolor:
                            quest.difficulty === "hard"
                              ? "#ef4444"
                              : quest.difficulty === "medium"
                              ? "#f59e0b"
                              : "#10b981",
                          color: "white",
                        }}
                      />
                    </Box>

                    <CardContent>
                      <Typography variant="h6" fontWeight={600} mb={2} pr={8}>
                        {quest.title}
                      </Typography>

                      <Typography variant="body2" color="#64748b" mb={3}>
                        {quest.description}
                      </Typography>

                      {!quest.completed && (
                        <Box mb={3}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            mb={1}
                          >
                            <Typography variant="caption" color="#64748b">
                              Progresso
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                              {quest.progress}/{quest.maxProgress}
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={(quest.progress / quest.maxProgress) * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "#e5e7eb",
                              "& .MuiLinearProgress-bar": {
                                bgcolor:
                                  quest.progress === quest.maxProgress
                                    ? "#10b981"
                                    : "#667eea",
                              },
                            }}
                          />
                        </Box>
                      )}

                      <Box sx={{ bgcolor: "#f8fafc", borderRadius: 2, p: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} mb={1}>
                          🎁 Recompensas:
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          <Typography variant="body2">
                            🪙 {quest.reward.gold} Gold
                          </Typography>
                          <Typography variant="body2">
                            ⭐ {quest.reward.exp} EXP
                          </Typography>
                          <Typography variant="body2">
                            🎁 {quest.reward.item}
                          </Typography>
                        </Stack>

                        {quest.deadline && !quest.completed && (
                          <Typography
                            variant="caption"
                            color="#ef4444"
                            mt={1}
                            display="block"
                          >
                            ⏰ Expira em:{" "}
                            {formatDistanceToNow(quest.deadline, {
                              locale: ptBR,
                            })}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )
          )}
        </Grid>
      </Box>
    );
  }

  // Função para renderizar a aba de Rankings
  function renderRankingsTab() {
    return (
      <Box>
        <Typography variant="h5" fontWeight={700} mb={3} color="#1a202c">
          🏆 Rankings Globais
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight={600}>
                    🏆 Ranking Semanal
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={leaderboardFilter}
                      onChange={(e) => setLeaderboardFilter(e.target.value)}
                    >
                      <MenuItem value="weekly">Semanal</MenuItem>
                      <MenuItem value="monthly">Mensal</MenuItem>
                      <MenuItem value="allTime">Todos os Tempos</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

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
                        <TableRow
                          key={player.rank}
                          sx={{
                            bgcolor:
                              player.name === (avatar?.name || "Você")
                                ? "rgba(99, 102, 241, 0.1)"
                                : "transparent",
                          }}
                        >
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Typography variant="h6" fontWeight={600}>
                                {player.rank === 1
                                  ? "🥇"
                                  : player.rank === 2
                                  ? "🥈"
                                  : player.rank === 3
                                  ? "🥉"
                                  : player.rank}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: "#667eea",
                                  width: 32,
                                  height: 32,
                                }}
                              >
                                {player.name.charAt(0)}
                              </Avatar>
                              <Typography fontWeight={600}>
                                {player.name}
                                {player.name === (avatar?.name || "Você") && (
                                  <Chip
                                    label="Você"
                                    size="small"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600}>
                              Nível {player.level}
                            </Typography>
                          </TableCell>
                          <TableCell>{player.exp} EXP</TableCell>
                          <TableCell>{player.gold} 🪙</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    📊 Suas Estatísticas
                  </Typography>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="#64748b">
                        Batalhas Vencidas
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#10b981">
                        47
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="#64748b">
                        Economia Total
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#667eea">
                        R$ 2.450
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="#64748b">
                        Dias Consecutivos
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="#f59e0b">
                        15
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} mb={2}>
                    🎖️ Conquistas Recentes
                  </Typography>
                  <Stack spacing={2}>
                    {[
                      {
                        name: "Primeiro Milhão",
                        desc: "Economize R$ 1000",
                        icon: "🏆",
                      },
                      {
                        name: "Guerreiro Sem Medo",
                        desc: "Vença 50 batalhas",
                        icon: "⚔️",
                      },
                      {
                        name: "Mestre da Economia",
                        desc: "15 dias consecutivos",
                        icon: "💎",
                      },
                    ].map((achievement, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Typography variant="h5">{achievement.icon}</Typography>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {achievement.name}
                          </Typography>
                          <Typography variant="caption" color="#64748b">
                            {achievement.desc}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
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

              <Chip
                label={
                  characterClasses[avatar?.characterClass || "Knight"].name
                }
                sx={{
                  bgcolor:
                    characterClasses[avatar?.characterClass || "Knight"].color,
                  color: "white",
                  fontWeight: 600,
                  mb: 2,
                }}
              />

              <Typography variant="body1" color="#64748b" mb={3}>
                {
                  characterClasses[avatar?.characterClass || "Knight"]
                    .description
                }
              </Typography>

              <Button
                variant="contained"
                startIcon={<CharacterIcon />}
                onClick={() => setAvatarDialogOpen(true)}
                sx={{
                  background: `linear-gradient(135deg, ${
                    characterClasses[avatar?.characterClass || "Knight"].color
                  }, #ff6b6b)`,
                  fontWeight: 600,
                }}
              >
                Editar Avatar
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
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
                        <Typography
                          variant="h4"
                          fontWeight={700}
                          color="#667eea"
                        >
                          {value}
                        </Typography>
                        <Typography
                          variant="caption"
                          textTransform="capitalize"
                          color="#64748b"
                        >
                          {stat === "attack"
                            ? "⚔️ Ataque"
                            : stat === "defense"
                            ? "🛡️ Defesa"
                            : stat === "magic"
                            ? "🔮 Magia"
                            : "⚡ Velocidade"}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={3}>
                  🎒 Inventário
                </Typography>

                {inventory.length === 0 ? (
                  <Typography color="#64748b" textAlign="center" py={4}>
                    Inventário vazio. Visite a loja para comprar itens!
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {inventory.map((item, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Paper
                          sx={{
                            p: 2,
                            textAlign: "center",
                            border: item.equipped
                              ? "2px solid #10b981"
                              : "1px solid #e5e7eb",
                          }}
                        >
                          <Typography variant="h4" mb={1}>
                            {item.icon ||
                              (item.type === "weapon"
                                ? "⚔️"
                                : item.type === "armor"
                                ? "🛡️"
                                : "💍")}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {item.name}
                          </Typography>
                          {item.equipped && (
                            <Chip
                              label="Equipado"
                              size="small"
                              color="success"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    );
  }

  // Função para renderizar diálogo de batalha avançado
  function renderBattleDialog() {
    if (!currentBattle) return null;

    return (
      <Dialog
        open={battleDialogOpen}
        onClose={() => setBattleDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #1a202c 0%, #2d3748 100%)",
            color: "white",
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="h4" fontWeight={800}>
            ⚔️ Batalha Épica
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Round {currentBattle.round || 1}
          </Typography>
          {battlePhase === "combat" && (
            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              mt={2}
              flexWrap="wrap"
            >
              <Chip
                label={`Combo: ${comboCounter}`}
                color={comboCounter >= 3 ? "secondary" : "default"}
                size="small"
              />
              <Chip
                label={`Tempo: ${battleTimer}s`}
                size="small"
                color={battleTimer < 10 ? "error" : "primary"}
              />
              {criticalHit && (
                <Chip label="CRÍTICO!" color="warning" size="small" />
              )}
            </Stack>
          )}
        </DialogTitle>

        <DialogContent sx={{ px: 4, pb: 4 }}>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mx: "auto",
                    mb: 2,
                    bgcolor: "#667eea",
                  }}
                >
                  {characterClasses[avatar?.characterClass || "Knight"].icon}
                </Avatar>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  {avatar?.name || "Herói"}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    (currentBattle.playerHealth /
                      currentBattle.playerMaxHealth) *
                    100
                  }
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": { bgcolor: "#10b981" },
                  }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {currentBattle.playerHealth}/{currentBattle.playerMaxHealth}{" "}
                  HP
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h1" sx={{ fontSize: "5rem" }} mb={1}>
                  {currentBattle.enemy.icon || "👹"}
                </Typography>
                <Typography variant="h6" fontWeight={600} mb={1}>
                  {currentBattle.enemy.name}
                </Typography>
                <motion.div
                  animate={shakeEffect ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <LinearProgress
                  variant="determinate"
                  value={
                    (currentBattle.enemy.currentHealth /
                      currentBattle.enemy.maxHealth) *
                    100
                  }
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    bgcolor: "rgba(255,255,255,0.2)",
                    "& .MuiLinearProgress-bar": { bgcolor: "#ef4444" },
                  }}
                  />
                </motion.div>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {currentBattle.enemy.currentHealth}/
                  {currentBattle.enemy.maxHealth} HP
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {battlePhase === "combat" && (
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => executeAttack("basic")}
                  sx={{
                    bgcolor: "#667eea",
                    py: 2,
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <AttackIcon />
                  <Typography variant="body2" fontWeight={600}>
                    Ataque Básico
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => executeAttack("special")}
                  sx={{
                    bgcolor: "#7c3aed",
                    py: 2,
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <MagicIcon />
                  <Typography variant="body2" fontWeight={600}>
                    Ataque Especial
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => executeAttack("ultimate")}
                  disabled={comboCounter < 3}
                  sx={{
                    bgcolor: comboCounter >= 3 ? "#ef4444" : "#64748b",
                    py: 2,
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <LightningIcon />
                  <Typography variant="body2" fontWeight={600}>
                    Ataque Final
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          )}
          {/* Log de Combate */}
          {combatLog.length > 0 && (
            <Box mt={4}>
              <Typography variant="subtitle2" mb={1}>
                📜 Log de Combate
              </Typography>
              <Stack spacing={1} sx={{ maxHeight: 200, overflowY: "auto" }}>
                {combatLog.slice(-10).map((entry) => (
                  <Paper
                    key={entry.id}
                    sx={{
                      p: 1.5,
                      bgcolor:
                        entry.type === "player"
                          ? "rgba(16,185,129,0.15)"
                          : entry.type === "enemy"
                          ? "rgba(239,68,68,0.15)"
                          : entry.type === "victory"
                          ? "rgba(234,179,8,0.25)"
                          : entry.type === "defeat"
                          ? "rgba(107,114,128,0.25)"
                          : "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      {entry.message}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}
        </DialogContent>

        {battlePhase === "combat" && (
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              onClick={() => setBattleDialogOpen(false)}
              variant="outlined"
              sx={{ color: "white", borderColor: "white" }}
            >
              Fugir da Batalha
            </Button>
          </DialogActions>
        )}
      </Dialog>
      {/* Overlay animação de início de batalha */}
      <AnimatePresence>
        {animatingBattle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1300,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <CircularProgress color="inherit" />
              <Typography variant="h6" color="white" fontWeight={600}>
                Preparando batalha...
              </Typography>
            </Stack>
          </motion.div>
        )}
        {animatingReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              background: "linear-gradient(135deg, #FFD700, #ff6b6b)",
              color: "#1a202c",
              padding: "16px 24px",
              borderRadius: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              zIndex: 1300,
            }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              🎉 Recompensas Aplicadas!
            </Typography>
            <Typography variant="caption" display="block" sx={{ opacity: 0.85 }}>
              Experiência e Gold adicionados ao seu avatar.
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
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
        <DialogTitle>
          <Typography variant="h5" fontWeight={700}>
            ✨ Criar/Editar Avatar
          </Typography>
        </DialogTitle>

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
                  variant="outlined"
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
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography>{cls.icon}</Typography>
                          <Box>
                            <Typography fontWeight={600}>{cls.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {cls.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Gênero</InputLabel>
                  <Select
                    value={newAvatar.gender}
                    label="Gênero"
                    onChange={(e) =>
                      setNewAvatar((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="male">Masculino</MenuItem>
                    <MenuItem value="female">Feminino</MenuItem>
                    <MenuItem value="other">Outro</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f8fafc" }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
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

                <Typography variant="h6" fontWeight={600} mb={1}>
                  {newAvatar.name || "Nome do Herói"}
                </Typography>

                <Chip
                  label={characterClasses[newAvatar.characterClass].name}
                  sx={{
                    bgcolor: characterClasses[newAvatar.characterClass].color,
                    color: "white",
                    fontWeight: 600,
                    mb: 2,
                  }}
                />

                <Typography variant="body2" color="#64748b">
                  {characterClasses[newAvatar.characterClass].description}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAvatarDialogOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateAvatar}
            sx={{
              background: `linear-gradient(135deg, ${
                characterClasses[newAvatar.characterClass].color
              }, #ff6b6b)`,
              fontWeight: 600,
            }}
          >
            {avatar ? "Atualizar Avatar" : "Criar Avatar"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // Placeholder para diálogo da loja
  function renderShopDialog() {
    return null;
  }
}

export default RPGPage;
