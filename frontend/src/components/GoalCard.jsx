/**
 * GoalCard - Componente de Card para exibição de metas
 * Mostra informações da meta, progresso, e ações rápidas
 */

import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  LinearProgress,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";

const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onComplete,
  onContribute,
  sx = {},
}) => {
  // Calcular progresso em percentual
  const progress = goal?.targetAmount
    ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
    : 0;

  // Calcular dias restantes
  const getDaysRemaining = () => {
    if (!goal?.dueDate) return null;
    const dueDate = new Date(goal.dueDate);
    const today = new Date();
    const days = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  // Determinar status baseado no progresso
  const getStatusColor = () => {
    if (progress >= 100) return "success";
    if (progress >= 75) return "primary";
    if (progress >= 50) return "info";
    if (progress >= 25) return "warning";
    return "error";
  };

  // Determinar se está atrasado
  const isOverdue = daysRemaining !== null && daysRemaining < 0;
  const isExpiringSoon =
    daysRemaining !== null && daysRemaining <= 7 && daysRemaining >= 0;

  // Calcular quanto falta
  const remaining = Math.max(0, goal?.targetAmount - goal?.currentAmount || 0);

  // Calcular velocidade de progresso (por dia)
  const getProgressSpeed = () => {
    if (!goal?.createdAt || !goal?.dueDate) return 0;
    const created = new Date(goal.createdAt);
    const due = new Date(goal.dueDate);
    const totalDays = Math.max(1, (due - created) / (1000 * 60 * 60 * 24));
    return (goal.currentAmount / totalDays).toFixed(2);
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
        ...sx,
      }}
    >
      {/* Cabeçalho do Card */}
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Título e Ações Rápidas */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                color: isOverdue ? "error.main" : "text.primary",
                mb: 0.5,
              }}
            >
              {goal?.title || "Meta Sem Título"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {goal?.description}
            </Typography>
          </Box>

          {/* Status Badges */}
          <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
            {progress >= 100 && (
              <Tooltip title="Meta Concluída">
                <Chip
                  label="✓"
                  color="success"
                  variant="filled"
                  size="small"
                  icon={<CheckIcon />}
                />
              </Tooltip>
            )}
            {isOverdue && (
              <Tooltip title="Atrasado">
                <Chip
                  label="Atrasado"
                  color="error"
                  variant="filled"
                  size="small"
                />
              </Tooltip>
            )}
            {isExpiringSoon && !isOverdue && (
              <Tooltip title="Vencimento próximo">
                <Chip
                  label="Expirando"
                  color="warning"
                  variant="filled"
                  size="small"
                />
              </Tooltip>
            )}
          </Box>
        </Box>

        {/* Valores */}
        <Box sx={{ mb: 2.5 }}>
          <Grid container spacing={1} sx={{ mb: 1.5 }}>
            <Grid item xs={6}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Progresso
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {goal?.currentAmount?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}{" "}
                  /{" "}
                  {goal?.targetAmount?.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Faltam
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "warning.main" }}
                >
                  {remaining.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Barra de Progresso */}
          <LinearProgress
            variant="determinate"
            value={progress}
            color={getStatusColor()}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {progress.toFixed(0)}% concluído
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Velocidade: R$ {getProgressSpeed()}/dia
            </Typography>
          </Box>
        </Box>

        {/* Datas e Informações Adicionais */}
        <Box sx={{ mb: 1.5, pt: 1.5, borderTop: 1, borderColor: "divider" }}>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={12} md={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Data Limite
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {goal?.dueDate
                  ? new Date(goal.dueDate).toLocaleDateString("pt-BR")
                  : "Sem data"}
              </Typography>
            </Grid>

            <Grid item xs={6} sm={12} md={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Dias Restantes
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 500,
                  color: daysRemaining
                    ? daysRemaining <= 0
                      ? "error.main"
                      : "success.main"
                    : "text.secondary",
                }}
              >
                {daysRemaining !== null
                  ? daysRemaining > 0
                    ? `${daysRemaining} dias`
                    : `${Math.abs(daysRemaining)} dias atrás`
                  : "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Categoria/Tag */}
        {goal?.category && (
          <Box sx={{ mt: 1 }}>
            <Chip
              label={goal.category}
              size="small"
              variant="outlined"
              icon={<TrendingIcon />}
            />
          </Box>
        )}
      </CardContent>

      {/* Ações */}
      <CardActions
        sx={{
          pt: 0,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          gap: 0.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 0.5 }}>
          {progress < 100 && (
            <Tooltip title="Contribuir">
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => onContribute?.(goal._id)}
                sx={{ textTransform: "none" }}
              >
                Contribuir
              </Button>
            </Tooltip>
          )}

          {progress >= 100 && (
            <Tooltip title="Marcar como concluída">
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => onComplete?.(goal._id)}
                startIcon={<CheckIcon />}
                sx={{ textTransform: "none" }}
              >
                Concluir
              </Button>
            </Tooltip>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              onClick={() => onEdit?.(goal)}
              sx={{ color: "primary.main" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Deletar">
            <IconButton
              size="small"
              onClick={() => onDelete?.(goal._id)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

export default GoalCard;
