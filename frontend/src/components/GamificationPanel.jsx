/**
 * GamificationPanel - Painel de gamificação
 * Exibe pontos, níveis, conquistas e sistema de recompensas
 */

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  LinearProgress,
  Chip,
  Typography,
  Button,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from "@mui/material";
import {
  EmojiEvents as TrophyIcon,
  Star as StarIcon,
  TrendingUp as LevelIcon,
  Favorite as HeartIcon,
  LocalFireDepartment as FireIcon,
  AutoAwesome as RewardIcon,
} from "@mui/icons-material";
import { safePercentage } from "../utils/progressValidation";

const GamificationPanel = ({ userStats = {} }) => {
  const [openAchievements, setOpenAchievements] = useState(false);
  const [openRewards, setOpenRewards] = useState(false);

  // Dados padrão
  const stats = {
    level: userStats.level || 5,
    points: userStats.points || 2450,
    nextLevelPoints: 5000,
    health: userStats.health || 85,
    streak: userStats.streak || 12,
    achievements: userStats.achievements || [
      {
        id: 1,
        name: "Primeiro Passo",
        description: "Primeira transação registrada",
        icon: "🎯",
        unlocked: true,
      },
      {
        id: 2,
        name: "Economizador",
        description: "Economizar R$ 1000",
        icon: "💰",
        unlocked: true,
      },
      {
        id: 3,
        name: "Streak Iniciante",
        description: "Manter 7 dias de streak",
        icon: "🔥",
        unlocked: true,
      },
      {
        id: 4,
        name: "Meta Alcançada",
        description: "Completar uma meta",
        icon: "🏆",
        unlocked: false,
      },
      {
        id: 5,
        name: "Investidor",
        description: "Realizar 10 transações",
        icon: "📈",
        unlocked: false,
      },
      {
        id: 6,
        name: "Guru Financeiro",
        description: "Atingir nível 10",
        icon: "👑",
        unlocked: false,
      },
    ],
    rewards: userStats.rewards || [
      {
        id: 1,
        name: "Desconto 10%",
        type: "discount",
        value: "10%",
        available: true,
      },
      {
        id: 2,
        name: "+100 Pontos",
        type: "points",
        value: "100",
        available: true,
      },
      {
        id: 3,
        name: "Cashback 5%",
        type: "cashback",
        value: "5%",
        available: false,
      },
    ],
    badges: userStats.badges || ["Bronze", "Silver", "Gold"],
  };

  const progressPercent = safePercentage(stats.points, stats.nextLevelPoints);

  return (
    <>
      {/* Card Principal */}
      <Card>
        <CardHeader
          title="Gamificação"
          subheader="Sistema de Recompensas e Progressão"
          avatar={<Box sx={{ fontSize: 28 }}>🎮</Box>}
        />

        <CardContent>
          {/* Nível e Experiência */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: 2,
              color: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Box>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  Seu Nível
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {stats.level}
                </Typography>
              </Box>
              <Box sx={{ fontSize: 60 }}>⭐</Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={Math.min(Math.max(progressPercent || 0, 0), 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                background: "rgba(255,255,255,0.2)",
                "& .MuiLinearProgress-bar": {
                  background: "#fff",
                },
              }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Typography variant="caption">
                {stats.points} / {stats.nextLevelPoints} pontos
              </Typography>
              <Typography variant="caption">
                {Math.min(progressPercent, 100).toFixed(0)}%
              </Typography>
            </Box>
          </Box>

          {/* Estatísticas Principais */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Saúde */}
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{ p: 1.5, textAlign: "center", background: "#ffebee" }}
              >
                <Tooltip title="Saúde do usuário">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                  >
                    <HeartIcon sx={{ color: "#FF6B6B" }} />
                  </Box>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Saúde
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#FF6B6B" }}
                >
                  {stats.health}%
                </Typography>
              </Paper>
            </Grid>

            {/* Pontos */}
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{ p: 1.5, textAlign: "center", background: "#e8f5e9" }}
              >
                <Tooltip title="Pontos acumulados">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                  >
                    <StarIcon sx={{ color: "#FFC107" }} />
                  </Box>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Pontos
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#66BB6A" }}
                >
                  {stats.points}
                </Typography>
              </Paper>
            </Grid>

            {/* Streak */}
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{ p: 1.5, textAlign: "center", background: "#fff3e0" }}
              >
                <Tooltip title="Dias em sequência">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                  >
                    <FireIcon sx={{ color: "#FFA726" }} />
                  </Box>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Streak
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#FFA726" }}
                >
                  {stats.streak} dias
                </Typography>
              </Paper>
            </Grid>

            {/* Nível */}
            <Grid item xs={6} sm={3}>
              <Paper
                sx={{ p: 1.5, textAlign: "center", background: "#e0f2f1" }}
              >
                <Tooltip title="Nível atual">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 0.5 }}
                  >
                    <LevelIcon sx={{ color: "#00897B" }} />
                  </Box>
                </Tooltip>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Nível
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#00897B" }}
                >
                  Lvl {stats.level}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Badges */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Insígnias
            </Typography>
            <Stack direction="row" spacing={1}>
              {stats.badges.map((badge, index) => (
                <Chip
                  key={index}
                  label={badge}
                  icon={<TrophyIcon />}
                  color={
                    badge === "Gold"
                      ? "warning"
                      : badge === "Silver"
                      ? "default"
                      : "default"
                  }
                  variant="outlined"
                />
              ))}
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Botões de Ação */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<TrophyIcon />}
              onClick={() => setOpenAchievements(true)}
              fullWidth
            >
              Conquistas
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<RewardIcon />}
              onClick={() => setOpenRewards(true)}
              fullWidth
            >
              Recompensas
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Dialog - Conquistas */}
      <Dialog
        open={openAchievements}
        onClose={() => setOpenAchievements(false)}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>Conquistas</DialogTitle>
        <DialogContent>
          <List>
            {stats.achievements.map((achievement, index) => (
              <React.Fragment key={achievement.id}>
                <ListItem
                  sx={{
                    opacity: achievement.unlocked ? 1 : 0.5,
                    background: achievement.unlocked
                      ? "#f5f5f5"
                      : "transparent",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <Badge
                      badgeContent={achievement.unlocked ? "✓" : "?"}
                      color={achievement.unlocked ? "success" : "default"}
                    >
                      <Box sx={{ fontSize: 24 }}>{achievement.icon}</Box>
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={achievement.name}
                    secondary={achievement.description}
                    primaryTypographyProps={{
                      sx: { fontWeight: achievement.unlocked ? 600 : 400 },
                    }}
                  />
                </ListItem>
                {index < stats.achievements.length - 1 && (
                  <Divider component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Dialog - Recompensas */}
      <Dialog
        open={openRewards}
        onClose={() => setOpenRewards(false)}
        maxWidth="sm"
        fullWidth
        disableEnforceFocus
        disableRestoreFocus
      >
        <DialogTitle>Recompensas Disponíveis</DialogTitle>
        <DialogContent>
          <List>
            {stats.rewards.map((reward, index) => (
              <React.Fragment key={reward.id}>
                <ListItem
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: reward.available ? 1 : 0.5,
                    background: reward.available ? "#f5f5f5" : "transparent",
                    borderRadius: 1,
                    mb: 1,
                    p: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {reward.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {reward.type === "discount" && "🏷️ Desconto"}
                      {reward.type === "points" && "⭐ Bônus de Pontos"}
                      {reward.type === "cashback" && "💵 Cashback"}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: reward.available ? "#66BB6A" : "#999",
                      }}
                    >
                      {reward.value}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={!reward.available}
                      sx={{ mt: 0.5 }}
                    >
                      {reward.available ? "Usar" : "Bloqueado"}
                    </Button>
                  </Box>
                </ListItem>
                {index < stats.rewards.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GamificationPanel;
