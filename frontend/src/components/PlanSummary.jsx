/**
 * @fileoverview Componente PlanSummary
 * Card mostrando plano atual, limites e CTA de upgrade
 */

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  LinearProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { colors, gradients } from "../styles/designSystem";

export function PlanSummary({
  plan = "free",
  monthlyCount = 0,
  onUpgrade,
  isLoading = false,
}) {
  const planInfo = {
    free: {
      label: "Plano Gratuito",
      color: "default",
      limit: 50,
      emoji: "🎯",
      features: [
        "Até 50 transações/mês",
        "Categorias básicas",
        "Score financeiro",
      ],
    },
    premium: {
      label: "Premium",
      color: "primary",
      emoji: "💎",
      features: ["Transações ilimitadas", "Metas avançadas", "Exportação PDF"],
    },
    anual: {
      label: "Anual",
      color: "info",
      emoji: "📅",
      features: ["Transações ilimitadas", "Tudo do Premium", "32% economia"],
    },
    vitalicio: {
      label: "Vitalício",
      color: "success",
      emoji: "⭐",
      features: [
        "Acesso ilimitado",
        "Suporte prioritário",
        "Futuras melhorias",
      ],
    },
  };

  const info = planInfo[plan] || planInfo.free;
  const showProgress = plan === "free" && monthlyCount > 0;
  const progressPercent = plan === "free" ? (monthlyCount / 50) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          background:
            plan === "free" ? "background.paper" : gradients.purpleBlue,
          color: plan === "free" ? "text.primary" : "white",
          borderRadius: 2,
          boxShadow:
            plan === "free"
              ? "0 4px 12px rgba(0,0,0,0.08)"
              : "0 8px 24px rgba(99, 102, 241, 0.3)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box>
              <Typography variant="body2" opacity={0.8}>
                {info.emoji} Seu plano
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {info.label}
              </Typography>
            </Box>
            <Chip
              label={plan.charAt(0).toUpperCase() + plan.slice(1)}
              color={info.color}
              size="small"
              variant={plan === "free" ? "outlined" : "filled"}
            />
          </Stack>

          {/* Progresso (só para Free) */}
          {showProgress && (
            <Box mb={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
              >
                <Typography variant="caption" color="text.secondary">
                  Transações este mês
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color={
                    progressPercent >= 80 ? "error.main" : "text.secondary"
                  }
                >
                  {monthlyCount}/50
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min(progressPercent, 100)}
                sx={{
                  height: 6,
                  borderRadius: 4,
                  bgcolor: "rgba(0, 0, 0, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    bgcolor:
                      progressPercent >= 80
                        ? colors.error.main
                        : colors.primary.main,
                  },
                }}
              />
            </Box>
          )}

          {/* Features */}
          <Box mb={3}>
            {info.features.map((feature, idx) => (
              <Typography
                key={idx}
                variant="body2"
                sx={{ mb: 0.8, display: "flex", alignItems: "center" }}
              >
                <span style={{ marginRight: 8 }}>✓</span>
                {feature}
              </Typography>
            ))}
          </Box>

          {/* CTA */}
          {plan === "free" && (
            <Button
              fullWidth
              variant="contained"
              onClick={onUpgrade}
              disabled={isLoading}
              sx={{
                background: gradients.purpleBlue,
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(99, 102, 241, 0.3)",
                },
              }}
            >
              {isLoading ? "Atualizando..." : "Fazer Upgrade"}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default PlanSummary;
