import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import axios from "axios";

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    description: "",
    paymentMethod: "credit_card",
  });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  useEffect(() => {
    loadPayments();
    loadSubscription();
  }, []);

  const loadPayments = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const response = await axios.get(`${apiUrl}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPayments(response.data.data || []);
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
    }
  };

  const loadSubscription = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      const response = await axios.get(`${apiUrl}/payments/subscription`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscription(response.data.data);
    } catch (error) {
      console.error("Erro ao carregar assinatura:", error);
    }
  };

  const handleMakePayment = async () => {
    try {
      const token = localStorage.getItem("finance_flow_token");
      await axios.post(`${apiUrl}/payments/confirm`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      loadPayments();
      setOpenDialog(false);
      setPaymentData({
        amount: "",
        description: "",
        paymentMethod: "credit_card",
      });
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        💳 Pagamentos
      </Typography>

      {subscription && (
        <Card sx={{ mb: 4, bgcolor: "primary.light" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✅ Assinatura Ativa
            </Typography>
            <Typography variant="body2">Plano: {subscription.plan}</Typography>
            <Typography variant="body2">
              Próxima cobrança:{" "}
              {new Date(subscription.nextBillingDate).toLocaleDateString(
                "pt-BR"
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Gerenciar Assinatura</Button>
          </CardActions>
        </Card>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <PaymentIcon
                sx={{ fontSize: 40, color: "success.main", mb: 1 }}
              />
              <Typography variant="h6">Fazer Pagamento</Typography>
              <Typography color="textSecondary">Transação única</Typography>
            </CardContent>
            <CardActions>
              <Button onClick={() => setOpenDialog(true)}>Pagar Agora</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <CreditCardIcon
                sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
              />
              <Typography variant="h6">Métodos de Pagamento</Typography>
              <Typography color="textSecondary">Cartões cadastrados</Typography>
            </CardContent>
            <CardActions>
              <Button>Gerenciar Cartões</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Histórico de Pagamentos
        </Typography>
        <List>
          {payments.map((payment) => (
            <ListItem key={payment._id}>
              <ListItemText
                primary={`R$ ${payment.amount?.toFixed(2) || "0.00"}`}
                secondary={`${payment.description} - ${new Date(
                  payment.date
                ).toLocaleDateString("pt-BR")}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Fazer Pagamento</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Valor (R$)"
            type="number"
            value={paymentData.amount}
            onChange={(e) =>
              setPaymentData({
                ...paymentData,
                amount: parseFloat(e.target.value),
              })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Descrição"
            value={paymentData.description}
            onChange={(e) =>
              setPaymentData({ ...paymentData, description: e.target.value })
            }
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleMakePayment}
            variant="contained"
            color="primary"
          >
            Processar Pagamento
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentsPage;
