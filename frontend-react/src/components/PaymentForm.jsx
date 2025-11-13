/**
 * PaymentForm - Componente de Formulário para Pagamentos
 * Gerencia criação e edição de pagamentos com validação
 */

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useState as useStateCustom } from "react";

const PaymentForm = ({
  payment = null,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    amount: payment?.amount || "",
    description: payment?.description || "",
    method: payment?.method || "card",
    category: payment?.category || "utilities",
    status: payment?.status || "pending",
    dueDate: payment?.dueDate || "",
    recurring: payment?.recurring || false,
    recurringPeriod: payment?.recurringPeriod || "monthly",
    notes: payment?.notes || "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Valor deve ser maior que 0";
    }

    if (!formData.description || formData.description.trim().length < 3) {
      newErrors.description = "Descrição deve ter pelo menos 3 caracteres";
    }

    if (!formData.method) {
      newErrors.method = "Método de pagamento é obrigatório";
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = "Data de vencimento não pode ser no passado";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Lidar com mudanças no formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Limpar erro do campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSuccess(false);
      await onSubmit(formData);
      setSuccess(true);
      // Limpar formulário
      setFormData({
        amount: "",
        description: "",
        method: "card",
        category: "utilities",
        status: "pending",
        dueDate: "",
        recurring: false,
        recurringPeriod: "monthly",
        notes: "",
      });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    }
  };

  // Calcular juros estimados
  const estimatedFees = {
    card: formData.amount * 0.029 + 0.99,
    pix: 0,
    boleto: 3.99,
    transfer: 0,
  };

  const totalWithFee =
    parseFloat(formData.amount || 0) + (estimatedFees[formData.method] || 0);

  return (
    <Card sx={{ maxWidth: 600, mx: "auto" }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {payment ? "Editar Pagamento" : "Novo Pagamento"}
        </Typography>

        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess(false)}
          >
            Pagamento processado com sucesso!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Valor */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor (R$)"
                name="amount"
                type="number"
                inputProps={{ step: "0.01", min: "0" }}
                value={formData.amount}
                onChange={handleChange}
                error={!!errors.amount}
                helperText={errors.amount}
                variant="outlined"
              />
            </Grid>

            {/* Método de Pagamento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Método"
                name="method"
                value={formData.method}
                onChange={handleChange}
                error={!!errors.method}
                helperText={errors.method}
                variant="outlined"
              >
                <MenuItem value="card">Cartão de Crédito</MenuItem>
                <MenuItem value="pix">PIX</MenuItem>
                <MenuItem value="boleto">Boleto</MenuItem>
                <MenuItem value="transfer">Transferência Bancária</MenuItem>
              </TextField>
            </Grid>

            {/* Descrição */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={
                  errors.description || "Ex: Conta de água, Aluguel, etc"
                }
                variant="outlined"
                multiline
                rows={2}
              />
            </Grid>

            {/* Categoria */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Categoria"
                name="category"
                value={formData.category}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="utilities">Utilidades</MenuItem>
                <MenuItem value="subscriptions">Assinaturas</MenuItem>
                <MenuItem value="shopping">Compras</MenuItem>
                <MenuItem value="food">Alimentação</MenuItem>
                <MenuItem value="transport">Transporte</MenuItem>
                <MenuItem value="healthcare">Saúde</MenuItem>
                <MenuItem value="entertainment">Entretenimento</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </TextField>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                variant="outlined"
              >
                <MenuItem value="pending">Pendente</MenuItem>
                <MenuItem value="processing">Processando</MenuItem>
                <MenuItem value="completed">Concluído</MenuItem>
                <MenuItem value="failed">Falhou</MenuItem>
                <MenuItem value="cancelled">Cancelado</MenuItem>
              </TextField>
            </Grid>

            {/* Data de Vencimento */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data de Vencimento"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                error={!!errors.dueDate}
                helperText={errors.dueDate}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Recorrente */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Frequência"
                name="recurringPeriod"
                value={formData.recurringPeriod}
                onChange={handleChange}
                disabled={!formData.recurring}
                variant="outlined"
              >
                <MenuItem value="daily">Diária</MenuItem>
                <MenuItem value="weekly">Semanal</MenuItem>
                <MenuItem value="monthly">Mensal</MenuItem>
                <MenuItem value="quarterly">Trimestral</MenuItem>
                <MenuItem value="yearly">Anual</MenuItem>
              </TextField>
            </Grid>

            {/* Checkbox Recorrente */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="recurring"
                    checked={formData.recurring}
                    onChange={handleChange}
                  />
                }
                label="Pagamento Recorrente"
              />
            </Grid>

            {/* Notas */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notas (Opcional)"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={2}
                placeholder="Informações adicionais sobre este pagamento..."
              />
            </Grid>

            {/* Resumo de Custos */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2">Valor:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  R$ {parseFloat(formData.amount || 0).toFixed(2)}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  Taxa ({formData.method}):
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  R$ {estimatedFees[formData.method]?.toFixed(2) || "0.00"}
                </Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Total:
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "primary.main" }}
                >
                  R$ {totalWithFee.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>

      {/* Ações */}
      <CardActions
        sx={{
          justifyContent: "flex-end",
          gap: 1,
          p: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading
            ? "Processando..."
            : payment
            ? "Atualizar"
            : "Criar Pagamento"}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PaymentForm;
