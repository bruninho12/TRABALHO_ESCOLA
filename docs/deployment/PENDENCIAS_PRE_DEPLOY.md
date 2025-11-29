# 📋 Pendências Pré-Deploy - DespFinancee v2.0

> **Status Atual:** 95% pronto para deploy  
> **Data da Análise:** 25 de novembro de 2025  
> **Tempo Estimado para Conclusão:** 4-6 horas

---

## 🔴 CRÍTICO (Bloqueia Deploy)

### 1. Sistema de Pagamentos - Integração Real

**Status:** ⚠️ Parcialmente Implementado (Apenas Simulado)

**Problema:**

- `paymentService.js` é apenas uma simulação
- `mercadoPagoService.js` existe mas não está integrado aos controllers
- Falta integração real com Stripe
- TODO no `paymentController.js` linha 140: "Adicionar lógica de processamento"

**O que precisa:**

```javascript
// ❌ Atual (paymentController.js)
payment.markSuccess(externalId, data);
await payment.save();
// TODO: Adicionar lógica de processamento (créditos, assinatura, etc)

// ✅ Necessário
payment.markSuccess(externalId, data);
await payment.save();

// Processar assinatura
if (payment.type === 'subscription') {
  await subscriptionService.activatePremium(userId, payment.item);
}

// Processar compra de moedas
if (payment.type === 'purchase' && payment.item.type === 'coins_pack') {
  await userService.addCoins(userId, payment.item.quantity);
}

// Notificar usuário
await notificationService.createNotification(userId, 'payment_success', ...);
await emailService.sendPaymentConfirmation(user.email, payment);
```

**Arquivos afetados:**

- `backend/src/controllers/paymentController.js`
- `backend/src/utils/paymentService.js` (precisa ser real, não simulado)
- `backend/src/utils/mercadoPagoService.js` (já existe, mas precisa integrar)
- `backend/src/routes/paymentRoutes.js` (precisa webhook handlers)

**Ações necessárias:**

1. ✅ Criar serviço real de integração Stripe
2. ✅ Integrar MercadoPago existente com controllers
3. ✅ Implementar webhook handlers (Stripe + MercadoPago)
4. ✅ Implementar lógica de ativação de assinatura Premium
5. ✅ Implementar lógica de compra de moedas/coins
6. ✅ Conectar com notificationService para confirmar pagamentos

**Estimativa:** 2-3 horas

---

### 2. Sistema de Notificações - Envio Real

**Status:** ⚠️ Implementado mas não funcional

**Problema:**

- `notificationService.js` tem TODO na linha 40: "Implementar integração com serviço de push notifications"
- Apenas cria registros no banco, não envia push real
- EmailService existe mas pode não estar configurado

**O que precisa:**

```javascript
// ❌ Atual (notificationService.js)
static async sendPushNotification(userId, title, message, data = {}) {
  // TODO: Implementar integração com serviço de push notifications
  logger.info(`Push notification para ${userId}: ${title}`);
  return await this.createNotification(userId, "push", title, message, data);
}

// ✅ Necessário (opções)
// Opção 1: Firebase Cloud Messaging (FCM)
static async sendPushNotification(userId, title, message, data = {}) {
  const user = await User.findById(userId);
  if (user.fcmToken) {
    await firebaseAdmin.messaging().send({
      token: user.fcmToken,
      notification: { title, body: message },
      data: data
    });
  }
  return await this.createNotification(userId, "push", title, message, data);
}

// Opção 2: OneSignal (mais fácil)
static async sendPushNotification(userId, title, message, data = {}) {
  const user = await User.findById(userId);
  if (user.oneSignalId) {
    await oneSignalClient.createNotification({
      include_player_ids: [user.oneSignalId],
      headings: { en: title },
      contents: { en: message },
      data: data
    });
  }
  return await this.createNotification(userId, "push", title, message, data);
}
```

**Arquivos afetados:**

- `backend/src/services/notificationService.js`
- `backend/src/models/User.js` (adicionar campo fcmToken ou oneSignalId)
- `frontend/src/` (adicionar registro de push token)

**Decisão necessária:**

- [ ] Usar Firebase Cloud Messaging (FCM)?
- [ ] Usar OneSignal (recomendado - mais fácil)?
- [ ] Usar outro serviço?
- [ ] **Ou deixar apenas notificações in-app por enquanto?** (recomendado para MVP)

**Ações necessárias:**

1. 🔄 **DECISÃO:** Escolher serviço de push ou deixar apenas in-app
2. Se escolher push: Configurar Firebase/OneSignal
3. Se escolher push: Adicionar token ao User model
4. Se escolher push: Implementar registro de token no frontend
5. ✅ Garantir que EmailService está configurado e funcional

**Estimativa:**

- Apenas in-app: 0 horas (já funciona)
- Com push notifications: 1-2 horas

---

## 🟡 IMPORTANTE (Recomendado antes do deploy)

### 3. Email Service - Validação e Testes

**Status:** ⚠️ Implementado mas não testado

**Problema:**

- `emailService.js` existe mas precisa validar se está funcional
- Precisa testar envio real de emails
- Variáveis de ambiente podem não estar configuradas

**Checklist de validação:**

```bash
# Verificar variáveis de ambiente necessárias
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=senha_app_gmail  # Não é senha normal!
EMAIL_FROM_NAME=DespFinance
EMAIL_FROM_EMAIL=noreply@despfinance.com
```

**Ações necessárias:**

1. ✅ Configurar Gmail App Password ou SMTP
2. ✅ Testar envio de email de boas-vindas
3. ✅ Testar email de recuperação de senha
4. ✅ Testar email de confirmação de pagamento
5. ✅ Adicionar tratamento de erro se email falhar

**Estimativa:** 30 minutos

---

### 4. Webhooks de Pagamento - Segurança

**Status:** ❌ Não implementado

**Problema:**

- Stripe e MercadoPago enviam webhooks para confirmar pagamentos
- Sem webhooks, pagamentos podem não ser confirmados automaticamente
- Precisa validar assinatura dos webhooks (segurança)

**O que precisa:**

```javascript
// backend/src/routes/paymentRoutes.js
router.post('/webhook/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    await processPaymentSuccess(paymentIntent);
  }

  res.json({received: true});
});

router.post('/webhook/mercadopago', async (req, res) => {
  // Validar IP do MercadoPago
  const validIPs = ['209.225.49.69', '216.33.197.78', ...];
  if (!validIPs.includes(req.ip)) {
    return res.status(403).send('Forbidden');
  }

  const { type, data } = req.body;
  if (type === 'payment') {
    await processM mercadoPagoPayment(data.id);
  }

  res.status(200).send('OK');
});
```

**Ações necessárias:**

1. ✅ Criar rota `/api/payments/webhook/stripe`
2. ✅ Criar rota `/api/payments/webhook/mercadopago`
3. ✅ Validar assinatura do Stripe
4. ✅ Validar IP do MercadoPago
5. ✅ Implementar processamento de eventos
6. ✅ Configurar webhooks no dashboard Stripe/MercadoPago

**Estimativa:** 1 hora

---

### 5. Assinatura Premium - Lógica de Negócio

**Status:** ❌ Não implementado

**Problema:**

- Não há lógica para ativar recursos Premium após pagamento
- Não há verificação se usuário é Premium nas rotas protegidas
- Não há lógica de expiração de assinatura

**O que precisa:**

```javascript
// backend/src/models/User.js - Adicionar campos
subscription: {
  plan: { type: String, enum: ['free', 'bronze', 'silver', 'gold'], default: 'free' },
  status: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  currentPeriodEnd: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String
}

// backend/src/middleware/checkPremium.js - Criar middleware
const checkPremium = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (user.subscription.plan === 'free') {
    return res.status(403).json({
      success: false,
      error: 'Recurso disponível apenas para usuários Premium'
    });
  }

  if (new Date() > user.subscription.currentPeriodEnd) {
    user.subscription.status = 'expired';
    await user.save();
    return res.status(403).json({
      success: false,
      error: 'Assinatura expirada'
    });
  }

  next();
};

// Usar em rotas premium
router.get('/api/insights/advanced', authenticate, checkPremium, insightsController.getAdvanced);
```

**Ações necessárias:**

1. ✅ Adicionar campos de subscription ao User model
2. ✅ Criar middleware `checkPremium`
3. ✅ Implementar `activatePremium` após pagamento
4. ✅ Implementar verificação de expiração (cron job)
5. ✅ Identificar quais rotas/features são Premium
6. ✅ Aplicar middleware nas rotas Premium

**Estimativa:** 1-1.5 horas

---

## 🟢 MELHORIAS (Pode ser pós-deploy)

### 6. Transações Recorrentes - Processamento Automático

**Status:** ✅ Implementado mas não testado

**Problema:**

- `recurringTransactionProcessor.js` existe
- Usa cron jobs para processar transações automáticas
- Precisa testar se está funcionando corretamente

**Ações necessárias:**

1. ✅ Testar criação de transação recorrente
2. ✅ Verificar se cron job está rodando
3. ✅ Testar processamento automático
4. ✅ Adicionar logs de debug

**Estimativa:** 30 minutos

---

### 7. RPG System - Recompensas e Achievements

**Status:** ✅ Implementado (parece completo)

**Observações:**

- Sistema RPG parece bem implementado
- Tem avatar, batalhas, world map, quests
- Precisa apenas validar se está tudo funcionando

**Ações necessárias:**

1. ✅ Teste funcional completo
2. ✅ Verificar se XP está sendo calculado corretamente
3. ✅ Verificar se conquistas estão sendo desbloqueadas

**Estimativa:** 30 minutos (apenas testes)

---

### 8. Insights Engine - Análises Avançadas

**Status:** ✅ Implementado

**Observações:**

- `insightsEngine.js` parece completo
- Gera análises automáticas de gastos
- Pode ser melhorado com mais insights

**Ações necessárias:**

1. ✅ Validar cálculos de insights
2. 🔄 (Opcional) Adicionar mais tipos de insights

**Estimativa:** 0 horas (funcional) ou 1-2 horas (melhorias)

---

## 📊 Resumo de Prioridades

| Prioridade | Item                             | Status            | Tempo  | Bloqueia Deploy? |
| ---------- | -------------------------------- | ----------------- | ------ | ---------------- |
| 🔴 **P0**  | Integração Real de Pagamentos    | ⚠️ Parcial        | 2-3h   | ✅ **SIM**       |
| 🔴 **P0**  | Webhooks de Pagamento            | ❌ Falta          | 1h     | ✅ **SIM**       |
| 🔴 **P0**  | Lógica de Assinatura Premium     | ❌ Falta          | 1-1.5h | ✅ **SIM**       |
| 🟡 **P1**  | Notificações Push (ou só in-app) | ⚠️ Decisão        | 0-2h   | ❌ Não           |
| 🟡 **P1**  | Validação EmailService           | ⚠️ Precisa testar | 30min  | ❌ Não           |
| 🟢 **P2**  | Testes de Transações Recorrentes | ✅ OK             | 30min  | ❌ Não           |
| 🟢 **P2**  | Testes do Sistema RPG            | ✅ OK             | 30min  | ❌ Não           |

---

## ⏱️ Tempo Total Estimado

### Cenário Mínimo (Deploy Básico)

**4-5 horas** - Apenas P0 (pagamentos + webhooks + premium)

### Cenário Recomendado (Deploy Completo)

**6-8 horas** - P0 + P1 (incluindo testes de email e decisão sobre push)

### Cenário Ideal (Deploy Polido)

**8-10 horas** - P0 + P1 + P2 (tudo testado e validado)

---

## 🎯 Plano de Ação Recomendado

### Fase 1: CRÍTICO (Bloqueia Deploy) - 4-5 horas

```bash
1. [ ] Implementar integração real Stripe (1.5h)
2. [ ] Integrar MercadoPago aos controllers (1h)
3. [ ] Criar webhooks Stripe + MercadoPago (1h)
4. [ ] Implementar lógica de assinatura Premium (1-1.5h)
```

### Fase 2: IMPORTANTE (Recomendado) - 1-2 horas

```bash
5. [ ] Validar e testar EmailService (30min)
6. [ ] DECIDIR: Push notifications ou apenas in-app? (0-2h)
```

### Fase 3: TESTES (Opcional mas recomendado) - 1-2 horas

```bash
7. [ ] Testar transações recorrentes (30min)
8. [ ] Testar sistema RPG completo (30min)
9. [ ] Testar fluxo completo de pagamento (30min)
10. [ ] Testes de integração E2E (30min)
```

---

## 📝 Notas Importantes

### Sobre Pagamentos

- **Stripe:** Precisa criar conta e obter API keys
- **MercadoPago:** Precisa criar conta e obter access token
- **Ambiente de testes:** Usar sandbox/test keys primeiro
- **Webhooks:** Configurar no dashboard após deploy

### Sobre Notificações

- **Opção 1 (Rápida):** Deixar apenas in-app notifications (já funciona)
- **Opção 2 (Completa):** Implementar OneSignal (fácil de integrar)
- **Opção 3 (Avançada):** Firebase Cloud Messaging (mais trabalho)

### Sobre Emails

- **Gmail:** Precisa criar App Password (não é senha normal)
- **SMTP:** Ou usar serviço como SendGrid, Mailgun, AWS SES
- **Templates:** Já existem em `backend/templates/emails/`

---

## ✅ O que JÁ está pronto

- ✅ Sistema de autenticação completo
- ✅ CRUD de transações
- ✅ Sistema de categorias
- ✅ Orçamentos (budgets)
- ✅ Metas (goals)
- ✅ Sistema RPG (avatar, batalhas, quests)
- ✅ Insights financeiros
- ✅ Exportação de relatórios (PDF/Excel)
- ✅ Transações recorrentes (implementado)
- ✅ Frontend responsivo e moderno
- ✅ Build de produção funcionando
- ✅ 0 vulnerabilidades críticas
- ✅ ESLint quase 100% limpo

---

## 🚀 Após completar tudo

Quando terminar as pendências P0 e P1:

1. ✅ Atualizar `.env.example` com todas as variáveis necessárias
2. ✅ Executar `npm run build` no frontend
3. ✅ Testar localmente com ambiente de produção
4. ✅ Seguir `DEPLOY_VPS_HOSTINGER.md` para deploy
5. ✅ Configurar webhooks no Stripe/MercadoPago após deploy
6. ✅ Testar pagamentos em produção com sandbox

---

**Próximo passo:** Diga quais pendências você quer que eu implemente primeiro! 🎯
