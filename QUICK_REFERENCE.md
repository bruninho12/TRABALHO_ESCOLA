# 🎴 QUICK REFERENCE - DespFinancee v2.0

> Referência rápida para deploy e comandos do projeto

---

## ⚡ COMANDOS RÁPIDOS

### 🚀 Deploy Check

```bash
npm run check:deploy        # Verifica se está pronto
npm run deploy:vercel       # Deploy frontend
```

### 🛠️ Desenvolvimento

```bash
# Root
npm run install:all         # Instala tudo
npm run dev:all            # Inicia backend + frontend

# Backend (porta 3001)
cd backend
npm run dev                # Desenvolvimento
npm start                  # Produção
npm run db:seed           # Popular dados

# Frontend (porta 5173)
cd frontend
npm run dev                # Desenvolvimento
npm run build              # Build produção
```

### ✅ Qualidade

```bash
npm run lint:all           # Lint backend + frontend
npm run test:all           # Testes
npm run audit:all          # Segurança
```

### 🐳 Docker

```bash
npm run docker:build       # Build imagens
npm run docker:up          # Iniciar containers
npm run docker:down        # Parar containers
npm run docker:logs        # Ver logs
```

---

## 🔐 VARIÁVEIS DE AMBIENTE

### Backend (.env)

```env
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb+srv://...
JWT_SECRET=<32+ caracteres>
JWT_REFRESH_SECRET=<32+ caracteres>
CORS_ORIGIN=https://seu-frontend.vercel.app
FRONTEND_URL=https://seu-frontend.vercel.app
```

### Frontend (.env)

```env
VITE_API_URL=https://seu-backend.onrender.com/api
VITE_ENV=production
```

---

## 🌐 PLATAFORMAS DE DEPLOY

| Serviço       | URL                     | Custo | Para     |
| ------------- | ----------------------- | ----- | -------- |
| MongoDB Atlas | mongodb.com/cloud/atlas | R$ 0  | Banco    |
| Vercel        | vercel.com              | R$ 0  | Frontend |
| Render        | render.com              | R$ 0  | Backend  |

---

## 📁 ESTRUTURA DE PASTAS

```
DespFinancee/
├── backend/           # API Node.js
│   ├── src/          # Código fonte
│   ├── scripts/      # Utilitários
│   └── server.js     # Entry point
├── frontend/          # React App
│   ├── src/          # Código fonte
│   ├── public/       # Assets
│   └── index.html    # HTML base
└── docs/             # Documentação
```

---

## 🔗 ENDPOINTS PRINCIPAIS

### Autenticação

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh-token
```

### Transações

```
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

### Documentação

```
GET /api-docs              # Swagger UI
GET /api/health           # Health check
```

---

## 🐛 TROUBLESHOOTING RÁPIDO

| Problema        | Solução                                                   |
| --------------- | --------------------------------------------------------- |
| CORS Error      | Verifique CORS_ORIGIN (backend) e VITE_API_URL (frontend) |
| MongoDB timeout | Adicione IP 0.0.0.0/0 no Atlas Network Access             |
| Build falha     | Execute `npm install` e `npm run build` localmente        |
| Token inválido  | Verifique JWT_SECRET em produção                          |
| App sleeping    | Normal no Render free tier (espere 30s)                   |

---

## 📊 PORTAS PADRÃO

| Serviço       | Porta |
| ------------- | ----- |
| Backend Dev   | 3001  |
| Frontend Dev  | 5173  |
| MongoDB Local | 27017 |

---

## 🔑 CREDENCIAIS DEMO

```
Email: demo@despfinancee.com
Senha: senha123
```

---

## 📚 DOCUMENTAÇÃO ESSENCIAL

| Arquivo                                            | Quando Usar              |
| -------------------------------------------------- | ------------------------ |
| [RESUMO_PUBLICACAO.md](RESUMO_PUBLICACAO.md)       | Visão geral do que falta |
| [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)                 | Deploy passo-a-passo     |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md)           | Algo deu errado          |
| [CHECKLIST_PUBLICACAO.md](CHECKLIST_PUBLICACAO.md) | Lista completa           |

---

## 🎯 CHECKLIST MÍNIMO

- [ ] Criar LICENSE ✅
- [ ] MongoDB Atlas configurado
- [ ] Chaves JWT geradas
- [ ] Backend no Render
- [ ] Frontend no Vercel
- [ ] URLs conectadas
- [ ] Banco populado
- [ ] Testes em produção

---

## 💡 DICAS PRO

### Gerar Chave JWT Segura

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Online
# https://generate-random.org/api-key-generator
```

### Testar API

```bash
# Health check
curl https://seu-backend.onrender.com/api/health

# Login
curl -X POST https://seu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@despfinancee.com","password":"senha123"}'
```

### Ver Logs

```bash
# Render: Dashboard → Logs
# Vercel: Deployments → Function Logs
# Local: backend/logs/
```

---

## 🚨 EMERGÊNCIA

### App Parou de Funcionar

1. **Check Health**

   ```bash
   curl https://seu-backend.onrender.com/api/health
   ```

2. **Ver Logs**

   - Render: Dashboard → Logs
   - Vercel: Deployments → View Logs

3. **Redeploy**
   - Render: Manual Deploy
   - Vercel: Redeploy

### Banco de Dados Corrompido

```bash
# Backup primeiro!
# Depois limpar e repopular:
npm run db:clean
npm run db:seed
```

---

## 📞 LINKS ÚTEIS

| Recurso          | URL                                          |
| ---------------- | -------------------------------------------- |
| Repositório      | github.com/bruninho12/TRABALHO_ESCOLA        |
| Issues           | github.com/bruninho12/TRABALHO_ESCOLA/issues |
| MongoDB Atlas    | cloud.mongodb.com                            |
| Vercel Dashboard | vercel.com/dashboard                         |
| Render Dashboard | dashboard.render.com                         |

---

## 🏷️ VERSÃO

- **Projeto**: DespFinancee v2.0.0
- **Node.js**: 16+
- **React**: 18
- **MongoDB**: 4.4+

---

## 📱 CONTATOS

- **GitHub**: [@bruninho12](https://github.com/bruninho12)
- **Email**: Veja package.json

---

**💾 Salve este arquivo!** Use como referência durante o deploy.

**🖨️ Imprima!** Tenha sempre à mão.

---

_Atualizado: 25/11/2025_
