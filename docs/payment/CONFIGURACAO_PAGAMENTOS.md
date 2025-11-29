# 🚀 Guia Rápido: Configuração de Pagamentos

Você já tem contas no Stripe e MercadoPago. Agora vamos configurar!

## ⏱️ Tempo Estimado: 15-20 minutos

---

## 📋 Checklist Rápido

- [ ] **Passo 1**: Criar produtos no Stripe (5 min)
- [ ] **Passo 2**: Obter chaves do Stripe (2 min)
- [ ] **Passo 3**: Obter chaves do MercadoPago (2 min)
- [ ] **Passo 4**: Configurar variáveis de ambiente (3 min)
- [ ] **Passo 5**: Configurar webhooks (5 min)
- [ ] **Passo 6**: Testar sistema (3 min)

---

## 🔵 PASSO 1: Criar Produtos no Stripe

### 1.1 Acesse o Dashboard

1. Entre em: https://dashboard.stripe.com/
2. Vá em **Products** no menu lateral

### 1.2 Criar 3 Produtos

**Bronze - R$ 9,99/mês:**

```
Nome: DespFinance Bronze
Descrição: Plano Bronze - Recursos básicos premium
Preço: R$ 9,99 (ou 9.99 BRL)
Tipo: Recorrente
Período: Mensal
```

**Silver - R$ 19,99/mês:**

```
Nome: DespFinance Silver
Descrição: Plano Silver - Recursos avançados
Preço: R$ 19,99 (ou 19.99 BRL)
Tipo: Recorrente
Período: Mensal
```

**Gold - R$ 29,99/mês:**

```
Nome: DespFinance Gold
Descrição: Plano Gold - Todos os recursos
Preço: R$ 29,99 (ou 29.99 BRL)
Tipo: Recorrente
Período: Mensal
```

### 1.3 Copiar Price IDs

Após criar cada produto, você verá um **Price ID** (começa com `price_`).

✅ Copie os 3 Price IDs, você vai precisar deles!

---

## 🔑 PASSO 2: Obter Chaves do Stripe

### 2.1 API Keys

1. Vá em **Developers → API keys**
2. Copie:
   - ✅ **Publishable key** (começa com `pk_test_`)
   - ✅ **Secret key** (clique em "Reveal" e copie, começa com `sk_test_`)

### 2.2 Webhook Secret (configurar depois)

Vamos fazer isso no Passo 5.

---

## 🟢 PASSO 3: Obter Chaves do MercadoPago

### 3.1 Acessar Dashboard

1. Entre em: https://www.mercadopago.com.br/developers/
2. Vá em **Suas integrações**
3. Crie uma nova aplicação ou selecione uma existente

### 3.2 Credenciais

1. Clique na sua aplicação
2. Vá em **Credenciais de teste** (para desenvolvimento)
3. Copie:
   - ✅ **Public Key** (começa com `APP_USR-` ou `TEST-`)
   - ✅ **Access Token** (começa com `APP_USR-` ou `TEST-`)

> **Produção**: Use "Credenciais de produção" quando for publicar

---

## ⚙️ PASSO 4: Configurar Variáveis de Ambiente

### 4.1 Backend

Abra o arquivo `backend/.env` e **ADICIONE** estas linhas:

```env
# ============================================
# 💳 Payment Gateways
# ============================================

# Stripe
STRIPE_SECRET_KEY=sk_test_COLE_SUA_CHAVE_AQUI
STRIPE_PUBLISHABLE_KEY=pk_test_COLE_SUA_CHAVE_AQUI
STRIPE_WEBHOOK_SECRET=whsec_DEIXE_VAZIO_POR_ENQUANTO

# Stripe Price IDs
STRIPE_BRONZE_PRICE_ID=price_COLE_O_ID_DO_BRONZE
STRIPE_SILVER_PRICE_ID=price_COLE_O_ID_DO_SILVER
STRIPE_GOLD_PRICE_ID=price_COLE_O_ID_DO_GOLD

# MercadoPago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR_COLE_SEU_TOKEN
MERCADO_PAGO_PUBLIC_KEY=APP_USR_COLE_SUA_PUBLIC_KEY

# URLs (já devem estar configuradas, verifique)
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### 4.2 Frontend

Abra (ou crie) o arquivo `frontend/.env` e **ADICIONE**:

```env
# Chaves públicas (seguro para frontend)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_MESMA_DO_BACKEND
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR_MESMA_DO_BACKEND

# URL da API (já deve estar configurada)
VITE_API_URL=http://localhost:3001
```

### 4.3 Reiniciar Servidores

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 🔗 PASSO 5: Configurar Webhooks

### 5.1 Stripe Webhook (Localhost com Stripe CLI)

**Para testes locais**, use o Stripe CLI:

```bash
# Instalar Stripe CLI (Windows com Scoop)
scoop install stripe

# Fazer login
stripe login

# Escutar webhooks (deixar rodando)
stripe listen --forward-to localhost:3001/api/payments/webhook/stripe
```

Isso vai gerar um **webhook secret** temporário. Copie e adicione no `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_O_SECRET_GERADO_AQUI
```

**Para produção**, configure no dashboard:

1. Dashboard Stripe → Developers → Webhooks
2. Add endpoint: `https://seu-dominio.com/api/payments/webhook/stripe`
3. Eventos: `payment_intent.*`, `customer.subscription.*`, `invoice.*`, `charge.refunded`

### 5.2 MercadoPago Webhook

**Localhost**: Use ngrok ou similar

```bash
# Instalar ngrok
scoop install ngrok

# Criar túnel
ngrok http 3001

# Copie a URL gerada (https://xxxxx.ngrok.io)
```

**Configurar no dashboard:**

1. Dashboard MercadoPago → Webhooks
2. URL: `https://xxxxx.ngrok.io/api/payments/webhook/mercadopago` (ou produção)
3. Eventos: `payment`, `subscription`

---

## 🧪 PASSO 6: Testar Sistema

### 6.1 Verificar Configuração

```bash
cd backend
node -e "
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
console.log('✅ Stripe configurado:', !!stripe);
console.log('✅ Price IDs:', {
  bronze: process.env.STRIPE_BRONZE_PRICE_ID,
  silver: process.env.STRIPE_SILVER_PRICE_ID,
  gold: process.env.STRIPE_GOLD_PRICE_ID
});
"
```

### 6.2 Teste de Pagamento Stripe

**Cartão de teste:**

```
Número: 4242 4242 4242 4242
Data: 12/34 (qualquer data futura)
CVV: 123 (qualquer 3 dígitos)
CEP: 12345
```

### 6.3 Teste de PIX (MercadoPago)

No sandbox do MercadoPago, o QR Code será gerado mas não processará pagamento real.
Use a interface de testes do MercadoPago para simular aprovação.

### 6.4 Verificar Webhook

Com o Stripe CLI rodando, faça um pagamento teste e veja se aparece:

```
✅ Webhook Stripe recebido: payment_intent.succeeded
✅ Assinatura bronze ativada para usuário xxx
```

---

## 🎯 Resultado Esperado

Após configurar tudo:

✅ Backend inicia sem erros  
✅ Frontend conecta com sucesso  
✅ Produtos aparecem no dashboard Stripe  
✅ Variáveis de ambiente carregadas  
✅ Webhook Stripe recebe eventos  
✅ Pagamento teste ativa Premium

---

## 🆘 Problemas Comuns

### Erro: "Stripe key not found"

**Solução**: Verifique se as variáveis estão no `.env` e reinicie o servidor

### Webhook não funciona

**Solução**:

- Localhost: Use Stripe CLI (`stripe listen`)
- Produção: Verifique se URL é HTTPS e está acessível

### Price ID inválido

**Solução**: Confirme que copiou o ID correto do Stripe Dashboard (começa com `price_`)

### MercadoPago não gera QR Code

**Solução**: Verifique se o Access Token está correto e é de teste/produção adequado

---

## 📚 Próximos Passos

Após configurar:

1. ✅ **Testar fluxo completo** de pagamento
2. ✅ **Criar interface** de planos no frontend
3. ✅ **Testar cancelamento** de assinatura
4. ✅ **Validar notificações** automáticas
5. ✅ **Deploy em staging** para testes finais

---

## 📞 Recursos

- 📖 **Documentação Completa**: `docs/PAYMENT_SYSTEM_SETUP.md`
- 🔵 **Stripe Dashboard**: https://dashboard.stripe.com/
- 🟢 **MercadoPago Dashboard**: https://www.mercadopago.com.br/developers/
- 🧪 **Stripe Test Cards**: https://stripe.com/docs/testing
- 📝 **Resumo da Implementação**: `docs/PAYMENT_IMPLEMENTATION_SUMMARY.md`

---

## ✅ Checklist Final

Antes de considerar completo:

- [ ] 3 produtos criados no Stripe
- [ ] 8 variáveis de ambiente configuradas (backend)
- [ ] 3 variáveis de ambiente configuradas (frontend)
- [ ] Stripe CLI configurado e rodando
- [ ] Webhook MercadoPago configurado
- [ ] Teste de pagamento Stripe aprovado
- [ ] Webhook recebe eventos corretamente
- [ ] Premium ativa após pagamento teste
- [ ] Notificação enviada ao usuário

---

**🎉 Pronto! Sistema de pagamentos 100% configurado!**

_Se tiver dúvidas, consulte a documentação completa ou abra uma issue._
