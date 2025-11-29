# 🇧🇷 Configuração do MercadoPago

Guia completo para configurar pagamentos com MercadoPago (PIX, Boleto, Cartão) no DespFinancee.

---

## 📋 Pré-requisitos

1. Conta no [MercadoPago](https://www.mercadopago.com.br/)
2. Aplicação criada no [Painel de Desenvolvedores](https://www.mercadopago.com.br/developers/panel)
3. Credenciais de teste e produção

---

## 🔑 Passo 1: Obter Credenciais

### 1.1. Acesse o Painel de Desenvolvedores

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Faça login com sua conta MercadoPago
3. Clique em "Suas aplicações" → "Criar aplicação"

### 1.2. Criar Aplicação

1. **Nome da aplicação**: `DespFinancee` (ou nome de sua escolha)
2. **Modelo de integração**: `Pagamentos online`
3. **Produtos**: Marque todas as opções disponíveis
4. Clique em "Criar aplicação"

### 1.3. Copiar Credenciais

Na página da aplicação, você encontrará:

#### 🧪 Credenciais de TESTE (para desenvolvimento):

- **Public Key**: `APP_USR-xxxxxxxx-xxxxxx` (começa com TEST-)
- **Access Token**: `APP_USR-xxxxxxxx-xxxxxx` (começa com TEST-)

#### 🚀 Credenciais de PRODUÇÃO (para uso real):

- **Public Key**: `APP_USR-xxxxxxxx-xxxxxx`
- **Access Token**: `APP_USR-xxxxxxxx-xxxxxx`

---

## ⚙️ Passo 2: Configurar Variáveis de Ambiente

### 2.1. Editar arquivo `.env`

No arquivo `backend/.env`, adicione:

```bash
# MercadoPago (PIX, Transferência, Crédito)
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-seu_access_token_aqui
MERCADO_PAGO_PUBLIC_KEY=APP_USR-seu_public_key_aqui
MERCADO_PAGO_WEBHOOK_SECRET=seu_webhook_secret_opcional

# URLs de retorno
MERCADO_PAGO_SUCCESS_URL=http://localhost:5173/payment/success
MERCADO_PAGO_FAILURE_URL=http://localhost:5173/payment/failure
MERCADO_PAGO_PENDING_URL=http://localhost:5173/payment/pending
MERCADO_PAGO_NOTIFICATION_URL=http://localhost:3001/api/payments/webhook/mercadopago
```

### 2.2. Exemplo com Credenciais de Teste

```bash
# ATENÇÃO: Use credenciais de TESTE para desenvolvimento
MERCADO_PAGO_ACCESS_TOKEN=TEST-1234567890-abcdef-1234567890abcdef1234567890abcdef-123456789
MERCADO_PAGO_PUBLIC_KEY=TEST-abc123-def456-789ghi-012jkl
```

---

## 🔔 Passo 3: Configurar Webhooks

### 3.1. O que são Webhooks?

Webhooks são notificações automáticas que o MercadoPago envia quando um pagamento é criado, aprovado, rejeitado, etc.

### 3.2. Configurar URL do Webhook

1. No painel da aplicação, vá em **"Webhooks"**
2. Clique em **"Adicionar URL de notificação"**
3. Adicione a URL: `https://seu-dominio.com/api/payments/webhook/mercadopago`

#### Para desenvolvimento local (usando ngrok):

```bash
# Instalar ngrok (se não tiver)
npm install -g ngrok

# Expor servidor local
ngrok http 3001

# Copiar URL gerada (exemplo: https://abc123.ngrok.io)
# Usar: https://abc123.ngrok.io/api/payments/webhook/mercadopago
```

### 3.3. Eventos a Monitorar

Marque os seguintes eventos:

- ✅ `payment` - Notificações de pagamento
- ✅ `merchant_order` - Notificações de pedido

---

## 💰 Passo 4: Criar Planos de Assinatura

### 4.1. Estrutura dos Planos

```javascript
// Bronze - Grátis (Trial 30 dias)
{
  plan: 'bronze',
  price: 0,
  duration: 30
}

// Silver - R$ 9,90/mês
{
  plan: 'silver',
  price: 9.90,
  duration: 30
}

// Gold - R$ 19,90/mês
{
  plan: 'gold',
  price: 19.90,
  duration: 30
}
```

### 4.2. Não é necessário criar produtos no MercadoPago

Diferente do Stripe, o MercadoPago aceita pagamentos avulsos. Você cria a preferência de pagamento dinamicamente no código.

---

## 🧪 Passo 5: Testar Integração

### 5.1. Rodar Script de Teste

```bash
cd backend
node scripts/test-mercadopago.js
```

### 5.2. Cartões de Teste

Use os seguintes cartões para testar:

#### ✅ **Aprovado**:

- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Validade**: Qualquer data futura
- **Nome**: `APRO`

#### ❌ **Rejeitado**:

- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Validade**: Qualquer data futura
- **Nome**: `OCHO`

#### ⏳ **Pendente**:

- **Número**: `5031 4332 1540 6351`
- **CVV**: `123`
- **Validade**: Qualquer data futura
- **Nome**: `CONT`

### 5.3. Testar PIX (Teste)

Para testar PIX em modo sandbox:

1. Crie uma preferência de pagamento
2. Escolha PIX como método
3. O QR Code gerado será automaticamente aprovado após alguns segundos

---

## 🚀 Passo 6: Endpoints da API

### 6.1. Criar Preferência de Pagamento

```http
POST /api/payments/mercadopago/create-preference
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "silver",
  "paymentType": "subscription"
}
```

**Resposta**:

```json
{
  "success": true,
  "preferenceId": "123456789-abc-def",
  "initPoint": "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789",
  "sandboxInitPoint": "https://sandbox.mercadopago.com.br/checkout/v1/redirect?pref_id=123456789"
}
```

### 6.2. Criar Pagamento PIX

```http
POST /api/payments/mercadopago/create-pix
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "gold",
  "amount": 19.90
}
```

**Resposta**:

```json
{
  "success": true,
  "paymentId": 123456789,
  "qrCode": "00020126....",
  "qrCodeBase64": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "ticketUrl": "https://www.mercadopago.com.br/payments/123456789"
}
```

### 6.3. Processar Pagamento (Cartão)

```http
POST /api/payments/mercadopago/process-payment
Authorization: Bearer {token}
Content-Type: application/json

{
  "plan": "silver",
  "amount": 9.90,
  "paymentMethodId": "master",
  "token": "card_token_gerado_pelo_frontend",
  "installments": 1,
  "payer": {
    "email": "user@example.com"
  }
}
```

### 6.4. Webhook (Notificação)

```http
POST /api/payments/webhook/mercadopago
Content-Type: application/json

{
  "action": "payment.created",
  "data": {
    "id": "123456789"
  }
}
```

---

## 📱 Passo 7: Integração no Frontend

### 7.1. Instalar SDK

```bash
npm install @mercadopago/sdk-react
```

### 7.2. Exemplo de Checkout

```jsx
import { MercadoPagoCheckout } from "@mercadopago/sdk-react";

function PaymentPage() {
  const [preferenceId, setPreferenceId] = useState("");

  const createPreference = async (plan) => {
    const response = await fetch(
      "/api/payments/mercadopago/create-preference",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      }
    );

    const data = await response.json();
    setPreferenceId(data.preferenceId);
  };

  return (
    <div>
      <button onClick={() => createPreference("silver")}>
        Assinar Silver - R$ 9,90
      </button>

      {preferenceId && (
        <MercadoPagoCheckout
          publicKey="SEU_PUBLIC_KEY"
          preferenceId={preferenceId}
        />
      )}
    </div>
  );
}
```

---

## 🔒 Segurança

### ✅ Boas Práticas

1. **Nunca exponha o Access Token** no frontend
2. **Use HTTPS** em produção
3. **Valide webhooks** verificando a origem
4. **Implemente rate limiting** nas rotas de pagamento
5. **Log todas as transações** para auditoria
6. **Use credenciais de teste** em desenvolvimento

---

## 🐛 Troubleshooting

### Erro: "Invalid credentials"

- Verifique se o Access Token está correto
- Certifique-se de usar credenciais de TESTE em desenvolvimento
- Verifique se não há espaços extras na variável de ambiente

### Webhook não está funcionando

- Verifique se a URL está acessível publicamente
- Use ngrok para testar localmente
- Verifique os logs do servidor

### Pagamento aprovado mas não atualiza no sistema

- Verifique se o webhook está configurado
- Verifique os logs do endpoint `/webhook/mercadopago`
- Confirme se o paymentId está sendo salvo corretamente

---

## 📚 Documentação Oficial

- [MercadoPago Developers](https://www.mercadopago.com.br/developers/pt)
- [Checkout Pro API](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing)
- [PIX](https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix)
- [Webhooks](https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/your-integrations/notifications/webhooks)

---

## ✅ Checklist de Implementação

- [ ] Criar conta no MercadoPago
- [ ] Criar aplicação no painel de desenvolvedores
- [ ] Copiar credenciais de teste
- [ ] Adicionar credenciais no `.env`
- [ ] Configurar URLs de retorno
- [ ] Testar criação de preferência
- [ ] Testar pagamento com cartão de teste
- [ ] Testar PIX
- [ ] Configurar webhook com ngrok
- [ ] Validar recebimento de notificações
- [ ] Testar fluxo completo de assinatura
- [ ] Documentar endpoints customizados
- [ ] Obter credenciais de produção
- [ ] Configurar domínio real para webhooks
- [ ] Deploy e testes finais

---

**Criado em**: 28/11/2025  
**Versão**: 1.0  
**Autor**: DespFinancee Team
