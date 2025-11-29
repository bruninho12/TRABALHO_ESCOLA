/**
 * PaymentSuccess - Página de Sucesso do Pagamento
 */

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  CircularProgress,
} from "@mui/material";
import { CheckCircle as CheckIcon, ArrowForward } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular verificação do pagamento
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const paymentId = searchParams.get("payment_id");
  const preferenceId = searchParams.get("preference_id");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
            {loading ? (
              <Stack spacing={3} alignItems="center">
                <CircularProgress size={60} />
                <Typography variant="h6" color="text.secondary">
                  Verificando seu pagamento...
                </Typography>
              </Stack>
            ) : (
              <Stack spacing={3} alignItems="center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Box
                    sx={{
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 10px 40px rgba(56, 239, 125, 0.3)",
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 70, color: "white" }} />
                  </Box>
                </motion.div>

                <Typography variant="h3" fontWeight={800} color="success.main">
                  Pagamento Aprovado!
                </Typography>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  maxWidth={400}
                >
                  Seu pagamento foi processado com sucesso. Seu plano premium
                  será ativado em instantes!
                </Typography>

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
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentSuccess;
