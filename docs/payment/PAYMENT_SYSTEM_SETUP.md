# 💳 Sistema de Pagamentos - Guia de Configuração

## 📋 Visão Geral

Sistema completo de pagamentos com suporte a **Stripe** (cartões internacionais) e **MercadoPago** (PIX, cartões, boleto).

### ✅ Funcionalidades Implementadas

- ✅ Integração completa com Stripe API
- ✅ Integração completa com MercadoPago API
- ✅ Webhooks automáticos para ambos os gateways
- ✅ Sistema de assinaturas Premium (Bronze, Silver, Gold)
- ✅ Processamento de pagamentos únicos (moedas/coins)
- ✅ Middleware de controle de acesso Premium
- ✅ Histórico de pagamentos no perfil do usuário
- ✅ Notificações de pagamento e renovação
- ✅ Suporte a reembolsos

---

## 🔐 Configuração de Variáveis de Ambiente

### 1. Stripe

Acesse [Stripe Dashboard](https://dashboard.stripe.com/) e obtenha suas chaves:

```env
# Chaves de API do Stripe
STRIPE_SECRET_KEY=sk_test_... # Chave secreta (test ou live)
STRIPE_PUBLISHABLE_KEY=pk_test_... # Chave pública
STRIPE_WEBHOOK_SECRET=whsec_... # Secret do webhook

# IDs dos Planos Stripe (criar produtos e prices no dashboard)
STRIPE_BRONZE_PRICE_ID=price_...
STRIPE_SILVER_PRICE_ID=price_...
STRIPE_GOLD_PRICE_ID=price_...
```

#### Como criar os Planos no Stripe:

1. Acesse **Products** no dashboard
2. Crie 3 produtos:
   - **DespFinance Bronze** - R$ 9,99/mês
   - **DespFinance Silver** - R$ 19,99/mês
   - **DespFinance Gold** - R$ 29,99/mês
3. Para cada produto, crie um **Price** com recorrência mensal
4. Copie os `price_id` gerados e cole nas variáveis de ambiente

#### Configurar Webhook no Stripe:

1. Acesse **Developers → Webhooks** no dashboard
2. Clique em **Add endpoint**
3. URL do webhook: `https://seu-dominio.com/api/payments/webhook/stripe`
4. Selecione os eventos:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `charge.refunded`
5. Copie o **Signing secret** e adicione em `STRIPE_WEBHOOK_SECRET`

---

### 2. MercadoPago

Acesse [MercadoPago Developers](https://www.mercadopago.com.br/developers/) e obtenha suas credenciais:

```env
# Chaves de API do MercadoPago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-... # Access Token (test ou production)
MERCADO_PAGO_PUBLIC_KEY=APP_USR-... # Public Key
```

#### Configurar Webhook no MercadoPago:

1. Acesse **Suas integrações** no painel do desenvolvedor
2. Selecione sua aplicação
3. Vá em **Webhooks**
4. Adicione a URL: `https://seu-dominio.com/api/payments/webhook/mercadopago`
5. Selecione os eventos:
   - `payment` - Notificações de pagamento
   - `subscription` - Notificações de assinatura

---

### 3. URLs da Aplicação

```env
# URLs do Frontend e Backend
FRONTEND_URL=https://seu-dominio.com # URL do frontend (sem barra no final)
BACKEND_URL=https://api.seu-dominio.com # URL da API (sem barra no final)
```

---

## 📦 Dependências NPM

Certifique-se de que as seguintes dependências estão instaladas:

```bash
npm install stripe axios
```

---

## 🛣️ Rotas Implementadas

### Pagamentos (Autenticadas)

```
GET    /api/payments              - Listar pagamentos do usuário
GET    /api/payments/stats        - Estatísticas de pagamentos
GET    /api/payments/subscription - Status da assinatura
GET    /api/payments/:id          - Detalhes de um pagamento
POST   /api/payments              - Criar novo pagamento
POST   /api/payments/confirm      - Confirmar pagamento manual
POST   /api/payments/:id/refund   - Solicitar reembolso
DELETE /api/payments/:id          - Cancelar pagamento
```

### Webhooks (Públicas - Sem Autenticação)

```
POST   /api/payments/webhook/stripe       - Webhook do Stripe
POST   /api/payments/webhook/mercadopago  - Webhook do MercadoPago
```

---

## 🔒 Rotas Protegidas por Premium

As seguintes rotas agora exigem assinatura Premium ativa:

### Insights (Premium)

```
GET /api/insights/trends           - Análise de tendências
GET /api/insights/patterns         - Detecção de padrões
GET /api/insights/prediction       - Previsão de gastos
GET /api/insights/suggestions      - Sugestões de economia
GET /api/insights/budget-comparison - Comparação de orçamentos
GET /api/insights/report           - Relatório completo
```

### Exportações (Premium parcial)

```
GET /api/export/transactions/csv   - CSV (FREE)
GET /api/export/transactions/excel - Excel (PREMIUM)
GET /api/export/report/monthly     - Relatório mensal (PREMIUM)
GET /api/export/goals/pdf          - PDF de metas (PREMIUM)
GET /api/export/backup             - Backup completo (PREMIUM)
```

---

## 💻 Como Usar no Frontend

### 1. Criar Checkout com Stripe

```javascript
const createStripeCheckout = async (plan) => {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: "subscription",
      paymentMethod: "stripe",
      amount: plan.price,
      item: {
        name: plan.name, // 'bronze', 'silver', 'gold'
        type: "subscription",
      },
    }),
  });

  const { data } = await response.json();

  // Redirecionar para checkout do Stripe
  window.location.href = data.checkoutUrl;
};
```

### 2. Criar Pagamento PIX com MercadoPago

```javascript
const createPixPayment = async (plan) => {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      type: "subscription",
      paymentMethod: "mercadopago",
      amount: plan.price,
      item: {
        name: plan.name,
        type: "subscription",
      },
    }),
  });

  const { data } = await response.json();

  // Exibir QR Code PIX
  setPixQrCode(data.qrCodeBase64);
  setPixCopyPaste(data.pixCopyPaste);
};
```

### 3. Verificar Status Premium

```javascript
const checkPremiumStatus = async () => {
  const response = await fetch("/api/payments/subscription", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { subscription } = await response.json();

  return {
    isPremium: subscription.plan !== "free" && subscription.status === "active",
    plan: subscription.plan, // 'free', 'bronze', 'silver', 'gold'
    expiresAt: subscription.currentPeriodEnd,
  };
};
```

### 4. Cancelar Assinatura

```javascript
const cancelSubscription = async (immediate = false) => {
  const response = await fetch("/api/payments/subscription", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ immediate }),
  });

  return await response.json();
};
```

---

## 🧪 Testando o Sistema

### Cartões de Teste do Stripe

```
Sucesso: 4242 4242 4242 4242
Falha:   4000 0000 0000 0002
3D Secure: 4000 0027 6000 3184

CVV: Qualquer 3 dígitos
Data: Qualquer data futura
```

### PIX de Teste do MercadoPago

No modo sandbox do MercadoPago, o QR Code PIX é gerado mas não processa pagamento real. Use a interface de testes do MercadoPago para simular aprovação.

---

## 🔔 Notificações Automáticas

O sistema envia notificações automáticas para:

- ✅ Assinatura ativada
- 🔄 Assinatura renovada
- ⚠️ Pagamento falhou
- ❌ Assinatura cancelada
- ⏰ Assinatura expirada
- 💰 Moedas adicionadas
- 💸 Reembolso processado

---

## 📊 Planos Disponíveis

| Plano         | Preço/mês | Benefícios                                                  |
| ------------- | --------- | ----------------------------------------------------------- |
| **Free**      | R$ 0,00   | Funcionalidades básicas, orçamentos limitados               |
| **Bronze** 🥉 | R$ 9,99   | Insights avançados, exportações, até 10 orçamentos          |
| **Silver** 🥈 | R$ 19,99  | Tudo do Bronze + Previsões, 20 orçamentos                   |
| **Gold** 🥇   | R$ 29,99  | Tudo do Silver + Suporte prioritário, orçamentos ilimitados |

---

## 🛠️ Middleware de Verificação Premium

### Uso no Backend

```javascript
const { checkPremium, checkPlan } = require("../middleware/checkPremium");

// Verificar qualquer plano Premium
router.get("/premium-feature", authenticate, checkPremium, controller);

// Verificar plano específico
router.get("/gold-feature", authenticate, checkPlan("gold"), controller);
```

### Resposta de Erro (403)

Quando um usuário Free tenta acessar rota Premium:

```json
{
  "success": false,
  "error": "Este recurso é exclusivo para assinantes Premium",
  "upgrade": true,
  "currentPlan": "free",
  "availablePlans": [
    { "name": "bronze", "price": 9.99 },
    { "name": "silver", "price": 19.99 },
    { "name": "gold", "price": 29.99 }
  ]
}
```

---

## 🔄 Fluxo de Pagamento

### Stripe (Cartão de Crédito)

1. **Frontend**: Usuário escolhe plano → Clica em "Assinar"
2. **Backend**: Cria checkout session → Retorna URL
3. **Frontend**: Redireciona para Stripe Checkout
4. **Stripe**: Usuário insere dados do cartão → Confirma
5. **Stripe**: Envia webhook → Backend processa
6. **Backend**: Ativa Premium → Notifica usuário
7. **Frontend**: Usuário retorna → Vê plano ativo

### MercadoPago (PIX)

1. **Frontend**: Usuário escolhe plano → Seleciona PIX
2. **Backend**: Cria pagamento PIX → Retorna QR Code
3. **Frontend**: Exibe QR Code + Código "Copiar e Colar"
4. **Usuário**: Abre app do banco → Paga PIX
5. **MercadoPago**: Recebe pagamento → Envia webhook
6. **Backend**: Processa webhook → Ativa Premium → Notifica
7. **Frontend**: Atualiza status (via polling ou websocket)

---

## ⚙️ Configuração de Testes Locais

### 1. Instalar Stripe CLI

```bash
# Windows (via Scoop)
scoop install stripe

# Mac (via Homebrew)
brew install stripe/stripe-cli/stripe

# Linux
wget https://github.com/stripe/stripe-cli/releases/download/v1.19.4/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
```

### 2. Fazer Login no Stripe

```bash
stripe login
```

### 3. Testar Webhooks Localmente

```bash
stripe listen --forward-to localhost:3001/api/payments/webhook/stripe
```

Isso irá gerar um webhook secret temporário. Use-o para testes locais.

---

## 📈 Próximos Passos

- [ ] Criar interface de gerenciamento de assinatura no frontend
- [ ] Adicionar página de comparação de planos
- [ ] Implementar cupons de desconto
- [ ] Adicionar suporte a trial gratuito (7 dias)
- [ ] Criar dashboard de métricas de vendas (admin)
- [ ] Implementar sistema de afiliados
- [ ] Adicionar notificações de renovação 3 dias antes

---

## 🐛 Troubleshooting

### Webhook não está sendo recebido

1. Verifique se a URL está correta e acessível publicamente
2. Teste com `ngrok` ou `localtunnel` em desenvolvimento
3. Confirme que os eventos estão selecionados no dashboard
4. Verifique logs do servidor para erros de parsing

### Assinatura não ativa após pagamento

1. Verifique os logs do webhook
2. Confirme que o `stripeCustomerId` foi salvo no usuário
3. Verifique se o `priceId` corresponde ao configurado no `.env`
4. Teste manualmente o endpoint `/api/payments/confirm`

### Erro 400 no webhook Stripe

O Stripe precisa do `raw body` para validar assinatura. Confirme que o middleware está configurado corretamente no `index.js`:

```javascript
app.use(
  "/api/payments/webhook/stripe",
  express.raw({ type: "application/json" })
);
```

---

## 📞 Suporte

- **Stripe**: https://support.stripe.com
- **MercadoPago**: https://www.mercadopago.com.br/developers/pt/support

---

**Sistema implementado com sucesso! 🎉**

_Última atualização: 2024_
