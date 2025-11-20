import React from "react";
import { Box, Typography, LinearProgress, Fade } from "@mui/material";
import { motion } from "framer-motion";
import { colors } from "../../styles/designSystem";

const LoginProgress = ({
  step,
  totalSteps = 3,
  message = "Processando...",
  show = false,
}) => {
  const progress = (step / totalSteps) * 100;

  const steps = [
    "Validando credenciais",
    "Verificando segurança",
    "Carregando dados do usuário",
  ];

  return (
    <Fade in={show}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          backdropFilter: "blur(5px)",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(20px)",
              borderRadius: 3,
              p: 4,
              minWidth: 320,
              textAlign: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* Ícone animado */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: `linear-gradient(135deg, ${colors.primary.main}, ${colors.secondary.main})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  fontSize: "1.5rem",
                }}
              >
                🔐
              </Box>
            </motion.div>

            <Typography
              variant="h6"
              sx={{
                color: "white",
                mb: 2,
                fontWeight: 600,
              }}
            >
              Autenticando
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                mb: 3,
              }}
            >
              {steps[step - 1] || message}
            </Typography>

            {/* Barra de progresso */}
            <Box sx={{ mb: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${colors.primary.main}, ${colors.secondary.main})`,
                  },
                }}
              />
            </Box>

            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {step} de {totalSteps} etapas concluídas
            </Typography>
          </Box>
        </motion.div>
      </Box>
    </Fade>
  );
};

export default LoginProgress;
