# 🚀 Guia Rápido de Deploy - DespFinancee

## ⚡ Deploy em 30 Minutos

Este guia mostra como colocar o DespFinancee no ar rapidamente usando plataformas gratuitas.

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta no MongoDB Atlas (grátis)
- [ ] Conta no Vercel (grátis)
- [ ] Conta no Render (grátis)

---

## 🗄️ PASSO 1: MongoDB Atlas (Banco de Dados)

### 1.1. Criar Conta

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Cadastre-se gratuitamente
3. Verifique seu email

### 1.2. Criar Cluster

1. Clique em "Build a Database"
2. Escolha **M0 FREE** (512MB grátis)
3. Escolha a região mais próxima (ex: São Paulo)
4. Nome do cluster: `despfinancee-cluster`
5. Clique em "Create Cluster"

### 1.3. Configurar Acesso

1. **Database Access** → Add New Database User

   - Username: `despfinancee-admin`
   - Password: Gerar senha segura (SALVE!)
   - Role: `Read and write to any database`

2. **Network Access** → Add IP Address
   - Escolha: `Allow Access from Anywhere` (0.0.0.0/0)
   - Confirme

### 1.4. Obter String de Conexão

1. Clique em "Connect" no seu cluster
2. Escolha "Connect your application"
3. Copie a string de conexão:
   ```
   mongodb+srv://despfinancee-admin:<password>@despfinancee-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Substitua `<password>` pela senha real
5. **SALVE ESSA STRING!**

---

## 🎨 PASSO 2: Vercel (Frontend)

### 2.1. Deploy do Frontend

1. Acesse: https://vercel.com
2. Login com GitHub
3. Clique em "Add New..." → "Project"
4. Importe o repositório `TRABALHO_ESCOLA`

### 2.2. Configurar Build

```
Framework Preset: Vite
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: npm install
```

### 2.3. Variáveis de Ambiente

Clique em "Environment Variables" e adicione:

```env
VITE_API_URL = [DEIXE VAZIO POR ENQUANTO]
VITE_ENV = production
```

### 2.4. Deploy

1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Vercel fornecerá uma URL: `https://seu-projeto.vercel.app`
4. **SALVE ESSA URL!**

---

## ⚙️ PASSO 3: Render (Backend)

### 3.1. Criar Web Service

1. Acesse: https://render.com
2. Login com GitHub
3. Clique em "New +" → "Web Service"
4. Conecte o repositório `TRABALHO_ESCOLA`

### 3.2. Configurar Service

```
Name: despfinancee-api
Region: São Paulo (ou mais próximo)
Branch: master
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### 3.3. Plano

- Escolha: **Free** (grátis)
- Nota: Dorme após 15min de inatividade (normal no plano grátis)

### 3.4. Variáveis de Ambiente

Clique em "Environment" e adicione TODAS essas variáveis:

```env
# Server
NODE_ENV=production
PORT=3001

# MongoDB (USE A STRING DO PASSO 1.4!)
MONGO_URI=mongodb+srv://despfinancee-admin:SUA_SENHA@despfinancee-cluster.xxxxx.mongodb.net/despfinance?retryWrites=true&w=majority

# JWT (GERE CHAVES SEGURAS!)
JWT_SECRET=COLOQUE_32_CARACTERES_ALEATORIOS_AQUI_USE_UM_GERADOR
JWT_REFRESH_SECRET=COLOQUE_OUTRA_CHAVE_DIFERENTE_32_CARACTERES
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# CORS (USE A URL DO VERCEL DO PASSO 2.4!)
CORS_ORIGIN=https://seu-projeto.vercel.app
FRONTEND_URL=https://seu-projeto.vercel.app

# Email (Configure depois se quiser enviar emails)
EMAIL_SERVICE=gmail
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_app
EMAIL_FROM_NAME=DespFinancee
EMAIL_FROM_EMAIL=noreply@despfinance.com

# Gamificação
EXPERIENCE_PER_LEVEL=100
INITIAL_COINS=100
ACHIEVEMENT_BONUS=50

# Defaults
DEFAULT_CURRENCY=BRL
DEFAULT_LANGUAGE=pt-BR
DEFAULT_TIMEZONE=America/Sao_Paulo

# Debug
DEBUG=false
VERBOSE_LOGGING=false
LOG_LEVEL=info
```

### 3.5. Deploy

1. Clique em "Create Web Service"
2. Aguarde o deploy (5-7 minutos)
3. Render fornecerá uma URL: `https://despfinancee-api.onrender.com`
4. **SALVE ESSA URL!**

---

## 🔗 PASSO 4: Conectar Frontend ao Backend

### 4.1. Atualizar Vercel

1. Volte ao Vercel
2. Vá em Settings → Environment Variables
3. Edite `VITE_API_URL`:
   ```
   VITE_API_URL=https://despfinancee-api.onrender.com/api
   ```
4. Clique em "Save"

### 4.2. Redeploy

1. Vá em "Deployments"
2. Clique nos "..." do último deploy
3. Clique em "Redeploy"
4. Aguarde 2-3 minutos

---

## 🌱 PASSO 5: Popular Banco de Dados

### 5.1. Via Render Shell

1. No Render, vá no seu serviço
2. Clique em "Shell" (terminal online)
3. Execute:

```bash
npm run db:setup
npm run db:seed
```

### 5.2. Via Local (Alternativa)

```bash
# Na sua máquina
cd backend

# Crie .env com MONGO_URI de produção
echo "MONGO_URI=mongodb+srv://..." > .env.production

# Execute seeds
NODE_ENV=production npm run db:setup
NODE_ENV=production npm run db:seed
```

---

## ✅ PASSO 6: Testar

### 6.1. Acessar Aplicação

Acesse: `https://seu-projeto.vercel.app`

### 6.2. Fazer Login

Use a conta demo:

```
Email: demo@despfinancee.com
Senha: senha123
```

### 6.3. Verificar API

Acesse: `https://despfinancee-api.onrender.com/api-docs`

---

## 🎉 PRONTO!

Seu app está no ar! 🚀

### URLs Importantes:

- **Frontend**: https://seu-projeto.vercel.app
- **Backend**: https://despfinancee-api.onrender.com
- **API Docs**: https://despfinancee-api.onrender.com/api-docs
- **MongoDB**: MongoDB Atlas Dashboard

---

## 📱 PASSO 7 (Opcional): Domínio Personalizado

### 7.1. Comprar Domínio

- Registro.br (R$ 40/ano)
- GoDaddy
- Namecheap

### 7.2. Configurar DNS

**Para o Frontend (Vercel):**

1. No Vercel, vá em Settings → Domains
2. Adicione seu domínio: `meudespfinancee.com.br`
3. Siga as instruções de DNS
4. Adicione os records:
   ```
   A @ 76.76.21.21
   CNAME www cname.vercel-dns.com
   ```

**Para o Backend (Render):**

1. No Render, vá em Settings → Custom Domain
2. Adicione: `api.meudespfinancee.com.br`
3. Adicione o CNAME record:
   ```
   CNAME api seu-servico.onrender.com
   ```

### 7.3. Atualizar Variáveis

1. No Render, atualize `CORS_ORIGIN` e `FRONTEND_URL`
2. No Vercel, atualize `VITE_API_URL`

---

## 🔧 Manutenção

### Atualizar Código

1. Faça push no GitHub
2. Vercel e Render deployam automaticamente!

### Ver Logs

- **Render**: Aba "Logs"
- **Vercel**: Aba "Deployments" → Clique no deploy → "View Function Logs"
- **MongoDB**: Atlas → Metrics

### Monitorar Uptime

Use: https://uptimerobot.com (grátis)

---

## 🆘 Problemas Comuns

### Frontend não conecta no Backend

- Verifique `VITE_API_URL` no Vercel
- Verifique `CORS_ORIGIN` no Render
- Use HTTPS em ambos!

### Backend não conecta no MongoDB

- Verifique `MONGO_URI` no Render
- Verifique IP whitelist no Atlas (0.0.0.0/0)
- Teste a conexão no Render Shell

### Render "Web Service is Sleeping"

- Normal no plano grátis
- Primeira request acorda (demora 30s)
- Upgrade para plano pago ou use alternativa

---

## 💰 Custos

- **MongoDB Atlas**: R$ 0/mês (M0 Free - 512MB)
- **Vercel**: R$ 0/mês (plano Hobby)
- **Render**: R$ 0/mês (plano Free)
- **Domínio** (opcional): ~R$ 40/ano

**Total**: GRÁTIS! 🎉

---

## 📚 Recursos

- [Documentação MongoDB Atlas](https://docs.atlas.mongodb.com/)
- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Render](https://render.com/docs)

---

## 🎯 Próximos Passos

1. [ ] Configurar email SMTP real
2. [ ] Configurar Stripe/MercadoPago
3. [ ] Adicionar domínio personalizado
4. [ ] Configurar monitoramento (Sentry)
5. [ ] Habilitar backups automáticos

---

**Dúvidas?** Abra uma issue no GitHub!

**Autor**: Bruno Souza ([@bruninho12](https://github.com/bruninho12))
