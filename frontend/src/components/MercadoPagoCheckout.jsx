/**
 * MercadoPagoCheckout - Componente de Checkout MercadoPago
 * Integração completa com PIX, Cartão e Checkout Pro
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  TextField,
  Stack,
  Chip,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  Pix as PixIcon,
  CreditCard as CardIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import api from "../services/api";

const MercadoPagoCheckout = ({ open, onClose, plan = "silver", amount }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [pixData, setPixData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState("");

  // Informações dos planos
  const planInfo = {
    bronze: { name: "Bronze", price: 0, color: "#cd7f32", icon: "🥉" },
    silver: { name: "Silver", price: 9.9, color: "#c0c0c0", icon: "🥈" },
    gold: { name: "Gold", price: 19.9, color: "#ffd700", icon: "🥇" },
  };

  const currentPlan = planInfo[plan] || planInfo.silver;
  const finalAmount = amount || currentPlan.price;

  // Criar pagamento PIX
  const handlePixPayment = async () => {
    setLoading(true);
    setError("");
    setPixData(null);

    try {
      const response = await api.post(
        "/payments/mercadopago/create-pix",
        {
          plan,
          amount: finalAmount,
        },
        {
          timeout: 30000, // 30 segundos para criação de pagamento
        }
      );

      if (response.data.success) {
        setPixData(response.data);
      } else {
        setError("Erro ao gerar QR Code PIX");
      }
    } catch (err) {
      console.error("Erro ao criar pagamento PIX:", err);

      // Mensagem de erro mais específica
      if (err.code === "ECONNABORTED") {
        setError("Tempo de espera excedido. Tente novamente.");
      } else if (err.response?.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
      } else {
        setError(
          err.response?.data?.message || "Erro ao processar pagamento PIX"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Criar preferência de checkout
  const handleCheckoutPro = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.post(
        "/payments/mercadopago/create-preference",
        {
          amount: finalAmount,
          planType: plan,
          type: "subscription",
        },
        {
          timeout: 30000, // 30 segundos para criação de preferência
        }
      );

      console.log("Response completa:", response.data);

      // Novo formato: response.data.id, response.data.sandboxInitPoint, response.data.initPoint
      const preferenceId = response.data.id;
      const url =
        import.meta.env.MODE === "development"
          ? response.data.sandboxInitPoint
          : response.data.initPoint;

      // Validação extra para garantir que preferenceId e URL existem
      if (
        !preferenceId ||
        !(response.data.sandboxInitPoint || response.data.initPoint)
      ) {
        console.error("Preference ou URL nula!", response.data);
        setError("Erro ao criar preferência de pagamento. Tente novamente.");
        return;
      }

      console.log("PreferenceId recebido:", preferenceId);
      console.log("URL do checkout:", url);
      setCheckoutUrl(url);

      if (url) {
        window.open(url, "_blank");
      } else {
        setError("URL de checkout não disponível");
      }
      // Opcional: polling para verificar se pagamento foi aprovado
      // startPaymentPolling(preferenceId);
    } catch (err) {
      console.error("Erro ao criar preferência:", err);
      // Mensagem de erro mais específica
      if (err.code === "ECONNABORTED") {
        setError("Tempo de espera excedido. Tente novamente.");
      } else if (err.response?.status === 401) {
        setError("Sessão expirada. Faça login novamente.");
      } else {
        setError(err.response?.data?.message || "Erro ao criar checkout");
      }
    } finally {
      setLoading(false);
    }
  };

  // Copiar código PIX
  const handleCopyPix = () => {
    if (pixData?.pixCopyPaste) {
      navigator.clipboard.writeText(pixData.pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mudar aba
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError("");
    setPixData(null);
    setCheckoutUrl("");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h5" fontWeight={700}>
              {currentPlan.icon} Assinar {currentPlan.name}
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Chip
            label={`R$ ${finalAmount.toFixed(2)}/mês`}
            sx={{
              bgcolor: currentPlan.color,
              color: plan === "bronze" ? "white" : "#0f172a",
              fontWeight: 700,
              fontSize: "1rem",
              px: 2,
              py: 2.5,
            }}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab icon={<PixIcon />} label="PIX" iconPosition="start" />
          <Tab
            icon={<CardIcon />}
            label="Cartão / Outros"
            iconPosition="start"
          />
        </Tabs>

        {/* ABA PIX */}
        {activeTab === 0 && (
          <Box>
            {!pixData && !loading && (
              <Stack spacing={2} alignItems="center">
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                >
                  Pague com PIX de forma instantânea e segura
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handlePixPayment}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(135deg, #00bcb4, #009688)",
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    "&:hover": {
                      background: "linear-gradient(135deg, #009688, #00897b)",
                    },
                  }}
                >
                  Gerar QR Code PIX
                </Button>
              </Stack>
            )}

            {loading && (
              <Box textAlign="center" py={4}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" mt={2}>
                  Gerando QR Code...
                </Typography>
              </Box>
            )}

            {pixData && (
              <Stack spacing={3} alignItems="center">
                <Alert severity="success" sx={{ width: "100%" }}>
                  <Typography variant="body2" fontWeight={600}>
                    QR Code gerado com sucesso!
                  </Typography>
                  <Typography variant="caption">
                    Escaneie com o app do seu banco ou copie o código abaixo
                  </Typography>
                </Alert>

                {/* QR Code */}
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                  }}
                >
                  <QRCodeSVG
                    value={pixData.qrCode || pixData.pixCopyPaste}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </Paper>

                {/* Código Copia e Cola */}
                <Box sx={{ width: "100%" }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Código PIX (Copia e Cola):
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: "#f5f5f5",
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                        fontSize: "0.75rem",
                        pr: 5,
                      }}
                    >
                      {pixData.pixCopyPaste}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleCopyPix}
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: copied ? "#4caf50" : "white",
                        "&:hover": {
                          bgcolor: copied ? "#4caf50" : "#f0f0f0",
                        },
                      }}
                    >
                      {copied ? (
                        <CheckIcon sx={{ color: "white" }} />
                      ) : (
                        <CopyIcon />
                      )}
                    </IconButton>
                  </Paper>
                  {copied && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ mt: 1, display: "block" }}
                    >
                      ✓ Código copiado!
                    </Typography>
                  )}
                </Box>

                <Alert severity="info" sx={{ width: "100%" }}>
                  <Typography variant="caption">
                    <strong>⏱️ Importante:</strong> O pagamento PIX expira em 30
                    minutos. Após o pagamento, seu plano será ativado
                    automaticamente.
                  </Typography>
                </Alert>
              </Stack>
            )}
          </Box>
        )}

        {/* ABA CARTÃO / CHECKOUT PRO */}
        {activeTab === 1 && (
          <Stack spacing={2}>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Pague com cartão de crédito, débito ou outros métodos
            </Typography>

            {!checkoutUrl && (
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleCheckoutPro}
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <CardIcon />
                }
                sx={{
                  background: "linear-gradient(135deg, #009ee3, #0073bb)",
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  "&:hover": {
                    background: "linear-gradient(135deg, #0073bb, #005a8c)",
                  },
                }}
              >
                {loading ? "Abrindo checkout..." : "Ir para Checkout Seguro"}
              </Button>
            )}

            {checkoutUrl && (
              <Alert severity="success">
                <Typography variant="body2" fontWeight={600}>
                  Checkout aberto em nova janela!
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Se a janela não abrir,{" "}
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    clique aqui
                  </a>
                </Typography>
              </Alert>
            )}

            <Box sx={{ mt: 2, p: 2, bgcolor: "#f9fafb", borderRadius: 2 }}>
              <Typography variant="caption" color="text.secondary">
                <strong>💳 Métodos aceitos:</strong>
                <br />
                • Cartão de Crédito (Visa, Mastercard, Elo, etc.)
                <br />
                • Cartão de Débito
                <br />
                • Boleto Bancário
                <br />• Parcelamento em até 12x
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MercadoPagoCheckout;
