/**
 * PaymentPending - Página de Pagamento Pendente
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  LinearProgress,
} from "@mui/material";
import {
  HourglassEmpty as PendingIcon,
  ArrowForward,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const paymentId = searchParams.get("payment_id");
  const paymentType = searchParams.get("payment_type_id");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffa751 0%, #ffe259 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={10}
            sx={{
              p: 5,
              borderRadius: 4,
              textAlign: "center",
            }}
          >
            <Stack spacing={3} alignItems="center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #ffa751 0%, #ffe259 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 40px rgba(255, 167, 81, 0.3)",
                  }}
                >
                  <PendingIcon sx={{ fontSize: 70, color: "white" }} />
                </Box>
              </motion.div>

              <Typography variant="h3" fontWeight={800} color="warning.main">
                Pagamento Pendente
              </Typography>

              <Typography variant="body1" color="text.secondary" maxWidth={400}>
                {paymentType === "pix"
                  ? "Estamos aguardando a confirmação do seu pagamento PIX. Isso pode levar alguns minutos."
                  : "Seu pagamento está sendo processado. Você receberá uma notificação em breve!"}
              </Typography>

              <Box sx={{ width: "100%", mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "rgba(255, 167, 81, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      background:
                        "linear-gradient(135deg, #ffa751 0%, #ffe259 100%)",
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              {paymentId && (
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: "#f5f5f5",
                    borderRadius: 2,
                    width: "100%",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    ID do Pagamento
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    fontFamily="monospace"
                  >
                    {paymentId}
                  </Typography>
                </Paper>
              )}

              <Paper
                sx={{
                  p: 2,
                  bgcolor: "#fff3e0",
                  borderRadius: 2,
                  width: "100%",
                  border: "1px solid #ffb74d",
                }}
              >
                <Typography
                  variant="body2"
                  color="warning.dark"
                  fontWeight={500}
                >
                  💡 <strong>Dica:</strong> Você pode fechar esta página. Te
                  notificaremos por e-mail quando o pagamento for confirmado!
                </Typography>
              </Paper>

              <Stack direction="row" spacing={2} width="100%" mt={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/dashboard")}
                  endIcon={<ArrowForward />}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                    },
                  }}
                >
                  Ir para Dashboard
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentPending;
