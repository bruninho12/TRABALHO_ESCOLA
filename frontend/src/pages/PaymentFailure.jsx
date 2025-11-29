/**
 * PaymentFailure - Página de Falha do Pagamento
 */

import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import { Cancel as CancelIcon, ArrowBack, Refresh } from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");

  const getStatusMessage = () => {
    switch (status) {
      case "rejected":
        return {
          title: "Pagamento Rejeitado",
          message:
            "Seu pagamento foi rejeitado. Verifique os dados do cartão e tente novamente.",
        };
      case "cancelled":
        return {
          title: "Pagamento Cancelado",
          message:
            "Você cancelou o processo de pagamento. Não se preocupe, pode tentar novamente quando quiser!",
        };
      default:
        return {
          title: "Erro no Pagamento",
          message:
            "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
        };
    }
  };

  const { title, message } = getStatusMessage();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Box
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 10px 40px rgba(245, 87, 108, 0.3)",
                  }}
                >
                  <CancelIcon sx={{ fontSize: 70, color: "white" }} />
                </Box>
              </motion.div>

              <Typography variant="h3" fontWeight={800} color="error.main">
                {title}
              </Typography>

              <Typography variant="body1" color="text.secondary" maxWidth={400}>
                {message}
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
                    ID da Tentativa
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
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/")}
                  startIcon={<ArrowBack />}
                  sx={{
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 700,
                    borderWidth: 2,
                    "&:hover": {
                      borderWidth: 2,
                    },
                  }}
                >
                  Voltar
                </Button>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/")}
                  endIcon={<Refresh />}
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
                  Tentar Novamente
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary" mt={2}>
                Precisa de ajuda? Entre em contato com nosso suporte.
              </Typography>
            </Stack>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PaymentFailure;
