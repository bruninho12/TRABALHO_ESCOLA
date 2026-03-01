/**
 * Pricing Page - Página de Planos Premium
 * Interface completa para gerenciar assinaturas
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Check as CheckIcon,
  Star as StarIcon,
  Upgrade as UpgradeIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import paymentApi from "../services/paymentApi";
import MercadoPagoCheckout from "../components/MercadoPagoCheckout";

// Configuração dos planos
const plans = {
  bronze: {
    name: "Bronze",
    price: 0,
    icon: "🥉",
    color: "#CD7F32",
    gradient: "linear-gradient(135deg, #CD7F32, #B8860B)",
    features: [
      "Dashboard básico",
      "Até 3 categorias",
      "Relatórios simples",
      "1 objetivo financeiro",
      "Suporte por email",
    ],
    limitations: [
      "Sem insights avançados",
      "Sem gamificação",
      "Exports limitados",
    ],
  },
  silver: {
    name: "Silver",
    price: 9.9,
    icon: "🥈",
    color: "#C0C0C0",
    gradient: "linear-gradient(135deg, #C0C0C0, #A8A8A8)",
    popular: false,
    features: [
      "Tudo do Bronze +",
      "Dashboard avançado",
      "Até 10 categorias",
      "Insights com IA",
      "Até 3 objetivos",
      "Gamificação básica",
      "Export CSV",
      "Suporte prioritário",
    ],
  },
  gold: {
    name: "Gold",
    price: 19.9,
    icon: "🥇",
    color: "#FFD700",
    gradient: "linear-gradient(135deg, #FFD700, #FFA500)",
    popular: true,
    features: [
      "Tudo do Silver +",
      "Categorias ilimitadas",
      "Insights avançados",
      "Objetivos ilimitados",
      "Sistema RPG completo",
      "Export PDF/Excel",
      "Análise preditiva",
      "Suporte 24/7",
    ],
  },
  platinum: {
    name: "Platinum",
    price: 29.9,
    icon: "💎",
    color: "#E5E4E2",
    gradient: "linear-gradient(135deg, #E5E4E2, #D3D3D3)",
    features: [
      "Tudo do Gold +",
      "Consultoria financeira",
      "Relatórios personalizados",
      "API de integração",
      "Backup automático",
      "Suporte exclusivo",
      "Beta features",
    ],
  },
};

const PricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    action: "",
    plan: "",
  });

  // Carregar assinatura atual
  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const response = await paymentApi.getSubscription();
      setSubscription(response.data);
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
    } finally {
      setLoading(false);
    }
  };

  // Abrir checkout para upgrade
  const handleUpgrade = (planKey) => {
    setSelectedPlan(planKey);
    setCheckoutOpen(true);
  };

  // Confirmar downgrade/cancelamento
  const handlePlanChange = (action, planKey = "") => {
    setConfirmDialog({ open: true, action, plan: planKey });
  };

  // Executar mudança de plano
  const executePlanChange = async () => {
    const { action, plan } = confirmDialog;

    try {
      setLoading(true);

      if (action === "cancel") {
        await paymentApi.cancelSubscription();
      } else if (action === "downgrade") {
        await paymentApi.updateSubscription(plan);
      }

      await loadSubscription();
      setConfirmDialog({ open: false, action: "", plan: "" });
    } catch (error) {
      console.error("Erro ao alterar plano:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = subscription?.plan || "bronze";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            💎 Escolha seu Plano
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Desbloqueie todo o potencial do DespFinancee
          </Typography>

          {subscription && (
            <Alert
              severity="info"
              sx={{ maxWidth: 600, mx: "auto", mb: 3 }}
              icon={<InfoIcon />}
            >
              <Typography variant="body2">
                <strong>Plano atual:</strong> {plans[currentPlan]?.name}
                {subscription.status && ` • Status: ${subscription.status}`}
              </Typography>
            </Alert>
          )}
        </Box>

        {/* Grade de Planos */}
        <Grid container spacing={3} justifyContent="center">
          {Object.entries(plans).map(([key, plan]) => {
            const isCurrent = key === currentPlan;
            const isUpgrade = plans[key].price > plans[currentPlan].price;

            return (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card
                    sx={{
                      height: "100%",
                      position: "relative",
                      border: isCurrent ? 3 : 1,
                      borderColor: isCurrent ? "primary.main" : "divider",
                      background: plan.gradient,
                      color: "white",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.2s",
                      },
                    }}
                  >
                    {plan.popular && (
                      <Chip
                        label="MAIS POPULAR"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -10,
                          left: "50%",
                          transform: "translateX(-50%)",
                          bgcolor: "success.main",
                          color: "white",
                          fontWeight: 700,
                          zIndex: 1,
                        }}
                      />
                    )}

                    {isCurrent && (
                      <Chip
                        label="PLANO ATUAL"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: 16,
                          bgcolor: "primary.main",
                          color: "white",
                          fontWeight: 700,
                          zIndex: 1,
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 3 }}>
                      {/* Header do Plano */}
                      <Box textAlign="center" mb={3}>
                        <Typography variant="h2" mb={1}>
                          {plan.icon}
                        </Typography>
                        <Typography variant="h5" fontWeight={700}>
                          {plan.name}
                        </Typography>
                        <Box mt={1}>
                          <Typography variant="h3" fontWeight={800}>
                            R$ {plan.price.toFixed(2)}
                          </Typography>
                          <Typography variant="caption">
                            {plan.price === 0 ? "Grátis para sempre" : "/mês"}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Features */}
                      <List dense sx={{ mb: 3 }}>
                        {plan.features.map((feature, index) => (
                          <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon sx={{ minWidth: 30 }}>
                              <CheckIcon
                                sx={{ color: "white", fontSize: 20 }}
                              />
                            </ListItemIcon>
                            <ListItemText
                              primary={feature}
                              sx={{
                                "& .MuiTypography-root": {
                                  fontSize: "0.875rem",
                                  color: "white",
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>

                      {/* Botão de Ação */}
                      <Box mt="auto">
                        {isCurrent ? (
                          <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{
                              borderColor: "white",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            Plano Ativo
                          </Button>
                        ) : isUpgrade ? (
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={() => handleUpgrade(key)}
                            startIcon={<UpgradeIcon />}
                            sx={{
                              bgcolor: "white",
                              color: "text.primary",
                              fontWeight: 700,
                              "&:hover": {
                                bgcolor: "grey.100",
                              },
                            }}
                          >
                            Fazer Upgrade
                          </Button>
                        ) : (
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handlePlanChange("downgrade", key)}
                            sx={{
                              borderColor: "white",
                              color: "white",
                              fontWeight: 600,
                              "&:hover": {
                                bgcolor: "rgba(255,255,255,0.1)",
                              },
                            }}
                          >
                            {key === "bronze"
                              ? "Cancelar Assinatura"
                              : "Fazer Downgrade"}
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>

        {/* Informações Adicionais */}
        <Box mt={6}>
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>
              🔒 Pagamento Seguro com MercadoPago
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Aceita PIX, Cartão de Crédito, Débito e Boleto • Cancele a
              qualquer momento
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="center"
              flexWrap="wrap"
            >
              <Chip label="🏦 PIX Instantâneo" variant="outlined" />
              <Chip label="💳 Cartões" variant="outlined" />
              <Chip label="📄 Boleto" variant="outlined" />
              <Chip label="🔐 SSL Seguro" variant="outlined" />
            </Stack>
          </Paper>
        </Box>

        {/* Comparação de Features */}
        {currentPlan === "bronze" && (
          <Box mt={6}>
            <Paper sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
                textAlign="center"
              >
                🚀 Veja o que você está perdendo
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="error.main"
                    mb={2}
                  >
                    ❌ Limitações do Plano Bronze:
                  </Typography>
                  <List dense>
                    {plans.bronze.limitations?.map((limitation, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CancelIcon
                            sx={{ color: "error.main", fontSize: 20 }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={limitation} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="success.main"
                    mb={2}
                  >
                    ✅ Benefícios dos Planos Premium:
                  </Typography>
                  <List dense>
                    {[
                      "Insights com IA",
                      "Sistema RPG completo",
                      "Relatórios avançados",
                      "Suporte prioritário",
                    ].map((benefit, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <StarIcon
                            sx={{ color: "success.main", fontSize: 20 }}
                          />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}
      </motion.div>

      {/* Modal de Confirmação */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, action: "", plan: "" })}
      >
        <DialogTitle>
          {confirmDialog.action === "cancel"
            ? "Cancelar Assinatura"
            : "Alterar Plano"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {confirmDialog.action === "cancel"
              ? "Tem certeza que deseja cancelar sua assinatura? Você perderá acesso aos recursos premium."
              : `Deseja alterar para o plano ${
                  plans[confirmDialog.plan]?.name
                }? Esta alteração será efetivada imediatamente.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, action: "", plan: "" })
            }
            color="inherit"
          >
            Cancelar
          </Button>
          <Button
            onClick={executePlanChange}
            color={confirmDialog.action === "cancel" ? "error" : "primary"}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Checkout */}
      <MercadoPagoCheckout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        plan={selectedPlan}
        onSuccess={() => {
          setCheckoutOpen(false);
          loadSubscription();
        }}
      />
    </Container>
  );
};

export default PricingPage;
