import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  Grid,
  CircularProgress,
  Snackbar,
  TextField,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  Pix as PixIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { useSubscription } from "../hooks/useSubscription";
import paymentApi from "../services/paymentApi";
import { formatCurrency } from "../utils/format";

const PaymentSettings = () => {
  const {
    subscription,
    currentPlan,
    loading: subscriptionLoading,
    error: subscriptionError,
    cancelSubscription,
  } = useSubscription();

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados dos diálogos
  const [cancelDialog, setCancelDialog] = useState(false);
  const [addCardDialog, setAddCardDialog] = useState(false);

  // Estados dos formulários
  const [cardForm, setCardForm] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [autoRenewal, setAutoRenewal] = useState(true);

  // Carregar dados
  useEffect(() => {
    loadPaymentData();
  }, []);

  const loadPaymentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [methodsResponse, historyResponse] = await Promise.all([
        paymentApi.getPaymentMethods(),
        paymentApi.getTransactionHistory(),
      ]);

      setPaymentMethods(methodsResponse.data || []);
      setBillingHistory(historyResponse.data || []);
    } catch (err) {
      setError("Erro ao carregar dados de pagamento");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar assinatura
  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      await cancelSubscription();
      setSuccess("Assinatura cancelada com sucesso");
      setCancelDialog(false);
    } catch (err) {
      setError("Erro ao cancelar assinatura");
    } finally {
      setLoading(false);
    }
  };

  // Adicionar cartão
  const handleAddCard = async () => {
    try {
      setLoading(true);
      await paymentApi.addPaymentMethod(cardForm);
      setSuccess("Cartão adicionado com sucesso");
      setAddCardDialog(false);
      setCardForm({ number: "", name: "", expiry: "", cvv: "" });
      await loadPaymentData();
    } catch (err) {
      setError("Erro ao adicionar cartão");
    } finally {
      setLoading(false);
    }
  };

  // Remover cartão
  const handleRemoveCard = async (cardId) => {
    try {
      setLoading(true);
      await paymentApi.removePaymentMethod(cardId);
      setSuccess("Cartão removido com sucesso");
      await loadPaymentData();
    } catch (err) {
      setError("Erro ao remover cartão");
    } finally {
      setLoading(false);
    }
  };

  // Definir cartão padrão
  const handleSetDefaultCard = async (cardId) => {
    try {
      setLoading(true);
      await paymentApi.setDefaultPaymentMethod(cardId);
      setSuccess("Cartão padrão definido com sucesso");
      await loadPaymentData();
    } catch (err) {
      setError("Erro ao definir cartão padrão");
    } finally {
      setLoading(false);
    }
  };

  // Atualizar renovação automática
  const handleAutoRenewalChange = async (enabled) => {
    try {
      setLoading(true);
      await paymentApi.updateAutoRenewal(enabled);
      setAutoRenewal(enabled);
      setSuccess(`Renovação automática ${enabled ? "ativada" : "desativada"}`);
    } catch (err) {
      setError("Erro ao atualizar renovação automática");
    } finally {
      setLoading(false);
    }
  };

  // Obter ícone do status
  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircleIcon sx={{ color: "success.main" }} />;
      case "cancelled":
        return <CancelIcon sx={{ color: "error.main" }} />;
      case "expired":
        return <WarningIcon sx={{ color: "warning.main" }} />;
      default:
        return <ErrorIcon sx={{ color: "grey.500" }} />;
    }
  };

  if (subscriptionLoading || loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={400}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: "flex", alignItems: "center", gap: 1 }}
      >
        <PaymentIcon />
        Configurações de Pagamento
      </Typography>

      {/* Alertas de erro */}
      {(error || subscriptionError) && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => {
            setError(null);
          }}
        >
          {error || subscriptionError}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Assinatura Atual */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Plano Atual
              </Typography>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Typography variant="h4">{currentPlan.icon}</Typography>
                <Box>
                  <Typography variant="h6">{currentPlan.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(currentPlan.price)}/mês
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                {getStatusIcon(subscription?.status)}
                <Chip
                  label={
                    subscription?.status === "active" ? "Ativo" : "Inativo"
                  }
                  color={
                    subscription?.status === "active" ? "success" : "default"
                  }
                  size="small"
                />
              </Box>

              {subscription && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Próxima cobrança:{" "}
                    {new Date(subscription.nextBilling).toLocaleDateString(
                      "pt-BR"
                    )}
                  </Typography>
                </Box>
              )}

              <FormControlLabel
                control={
                  <Switch
                    checked={autoRenewal}
                    onChange={(e) => handleAutoRenewalChange(e.target.checked)}
                    disabled={loading}
                  />
                }
                label="Renovação automática"
              />

              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Button variant="outlined" href=".\Pricing.jsx" fullWidth>
                  Alterar Plano
                </Button>
                {subscription?.status === "active" && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setCancelDialog(true)}
                    fullWidth
                  >
                    Cancelar
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Métodos de Pagamento */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Métodos de Pagamento</Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setAddCardDialog(true)}
                  size="small"
                >
                  Adicionar
                </Button>
              </Box>

              {paymentMethods.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Nenhum método de pagamento cadastrado
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {paymentMethods.map((method) => (
                    <Paper key={method.id} variant="outlined" sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        {method.type === "card" ? (
                          <CreditCardIcon />
                        ) : (
                          <PixIcon />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1">
                            {method.type === "card"
                              ? `•••• ${method.last4}`
                              : "PIX"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.brand} {method.isDefault && "(Padrão)"}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {!method.isDefault && (
                            <Button
                              size="small"
                              onClick={() => handleSetDefaultCard(method.id)}
                            >
                              Definir Padrão
                            </Button>
                          )}
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleRemoveCard(method.id)}
                          >
                            Remover
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Histórico de Pagamentos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Histórico de Pagamentos
              </Typography>

              {billingHistory.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  Nenhuma transação encontrada
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {billingHistory.map((transaction) => (
                    <Paper
                      key={transaction.id}
                      variant="outlined"
                      sx={{ p: 2 }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box>
                          <Typography variant="body1">
                            {formatCurrency(transaction.amount)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(transaction.date).toLocaleDateString(
                              "pt-BR"
                            )}{" "}
                            - {transaction.description}
                          </Typography>
                        </Box>
                        <Chip
                          label={
                            transaction.status === "paid" ? "Pago" : "Pendente"
                          }
                          color={
                            transaction.status === "paid"
                              ? "success"
                              : "warning"
                          }
                          size="small"
                        />
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de Cancelamento */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle>Cancelar Assinatura</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja cancelar sua assinatura? Você perderá acesso
            às funcionalidades premium.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>
            Manter Assinatura
          </Button>
          <Button
            onClick={handleCancelSubscription}
            color="error"
            variant="contained"
          >
            Cancelar Assinatura
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Adicionar Cartão */}
      <Dialog
        open={addCardDialog}
        onClose={() => setAddCardDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Cartão</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Número do Cartão"
              value={cardForm.number}
              onChange={(e) =>
                setCardForm({ ...cardForm, number: e.target.value })
              }
              placeholder="0000 0000 0000 0000"
              fullWidth
            />
            <TextField
              label="Nome no Cartão"
              value={cardForm.name}
              onChange={(e) =>
                setCardForm({ ...cardForm, name: e.target.value })
              }
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Validade"
                value={cardForm.expiry}
                onChange={(e) =>
                  setCardForm({ ...cardForm, expiry: e.target.value })
                }
                placeholder="MM/AA"
                fullWidth
              />
              <TextField
                label="CVV"
                value={cardForm.cvv}
                onChange={(e) =>
                  setCardForm({ ...cardForm, cvv: e.target.value })
                }
                placeholder="000"
                fullWidth
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddCardDialog(false)}>Cancelar</Button>
          <Button onClick={handleAddCard} variant="contained">
            Adicionar Cartão
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de sucesso */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success" onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PaymentSettings;
