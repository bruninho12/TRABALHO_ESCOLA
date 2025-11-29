# 🇧🇷 Configuração MercadoPago - DespFinance

## 📋 Pré-requisitos

1. **Conta MercadoPago**: [Criar conta](https://www.mercadopago.com.br)
2. **Aplicação criada**: Acesse [Developers](https://www.mercadopago.com.br/developers/)

## 🔧 Configuração Inicial

### 1. Criar Aplicação MercadoPago

1. Acesse [MercadoPago Developers](https://www.mercadopago.com.br/developers/)
2. Vá em **"Suas integrações"** > **"Criar aplicação"**
3. Escolha:
   - **Nome**: DespFinance
   - **Modelo de negócio**: Marketplace
   - **Produto**: Checkout Pro + API

### 2. Obter Credenciais

1. Na sua aplicação, vá em **"Credenciais"**
2. Copie as chaves:

#### 🧪 Sandbox (Teste)

```bash
# Público
MERCADO_PAGO_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Privado
MERCADO_PAGO_ACCESS_TOKEN=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### 🚀 Produção

```bash
# Público
MERCADO_PAGO_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Privado
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

### 3. Configurar .env

```bash
# MercadoPago Configuration
MERCADO_PAGO_ACCESS_TOKEN=TEST-sua_chave_aqui
MERCADO_PAGO_PUBLIC_KEY=TEST-sua_public_key_aqui
MERCADO_PAGO_WEBHOOK_SECRET=seu_webhook_secret

# URLs
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

## 🔗 Configurar Webhooks

### 1. URL do Webhook

```
https://seu-dominio.com/api/payments/webhook/mercadopago
```

### 2. Eventos a Configurar

- ✅ **payment**: Pagamentos (aprovados, rejeitados, etc.)
- ✅ **preapproval**: Assinaturas
- ✅ **refund**: Reembolsos

### 3. Configurar no Painel

1. Vá em **"Webhooks"** na sua aplicação
2. Adicione a URL: `https://seu-backend.com/api/payments/webhook/mercadopago`
3. Selecione os eventos acima

## 🧪 Testar Integração

### 1. Rodar Script de Teste

```bash
cd backend
npm install
node scripts/test-mercadopago.js
```

### 2. Testar Endpoints

#### Criar Preferência (Checkout Pro)

```bash
curl -X POST http://localhost:3001/api/payments/mercadopago/preference \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 9.90,
    "description": "Plano Silver - Teste",
    "planType": "silver",
    "type": "subscription"
  }'
```

#### Criar Pagamento PIX

```bash
curl -X POST http://localhost:3001/api/payments/mercadopago/direct \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 19.90,
    "description": "Plano Gold - PIX",
    "paymentMethodId": "pix",
    "planType": "gold",
    "type": "subscription"
  }'
```

## 💳 Métodos de Pagamento Disponíveis

### PIX

- **ID**: `pix`
- **Prazo**: 30 minutos
- **Resposta**: QR Code + Copia e Cola

### Cartão de Crédito

- **Visa**: `visa`
- **Mastercard**: `master`
- **Elo**: `elo`
- **Hipercard**: `hipercard`

### Outros

- **Boleto**: `boleto`
- **Transferência**: `account_money`

## 📊 Dados de Teste

### Cartões de Teste (Sandbox)

```
Aprovado: 5031 4332 1540 6351
Rejeitado: 5031 7557 3453 0604
CVV: 123
Validade: 11/25
```

### CPF de Teste

```
Aprovado: 12345678909
Rejeitado: 12345678901
```

## 🔄 Fluxo de Pagamento

### 1. Checkout Pro (Redirect)

```
Frontend → API → MercadoPago → Checkout → Webhook → Confirmação
```

### 2. Pagamento Direto (PIX)

```
Frontend → API → MercadoPago → QR Code → Pagamento → Webhook
```

## 🚨 Troubleshooting

### Erro: Credenciais inválidas

- ✅ Verificar se ACCESS_TOKEN está correto
- ✅ Verificar se está usando TEST para sandbox
- ✅ Verificar se a aplicação está ativa

### Webhook não funciona

- ✅ URL deve ser HTTPS em produção
- ✅ Endpoint deve retornar status 200
- ✅ Verificar logs do servidor

### Pagamento não aprova

- ✅ Usar dados de teste corretos
- ✅ Verificar se está em sandbox
- ✅ Verificar logs do MercadoPago

## 📚 Documentação Oficial

- [MercadoPago Developers](https://www.mercadopago.com.br/developers/)
- [API Reference](https://www.mercadopago.com.br/developers/pt/reference)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/guides/notifications/webhooks)
- [Checkout Pro](https://www.mercadopago.com.br/developers/pt/guides/checkout-pro/landing)

## 🎯 Próximos Passos

1. ✅ Configurar credenciais
2. ✅ Testar endpoints
3. ✅ Configurar webhooks
4. ✅ Testar fluxo completo
5. 🚀 Deploy em produção
