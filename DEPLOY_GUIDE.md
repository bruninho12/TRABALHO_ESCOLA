# 🚀 Guia Completo de Deploy - DespFinancee

## ✅ Status do Projeto

- ✅ Frontend: Build funcionando
- ✅ Backend: API funcionando
- ✅ Database: MongoDB conectado
- ✅ Pronto para produção!

## 🌐 Opções de Deploy (Recomendadas)

### 1. **VERCEL** (Recomendado para Frontend)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. No diretório frontend
cd frontend
vercel --prod

# 3. Configurar variáveis de ambiente no dashboard Vercel:
VITE_API_URL=https://sua-api.herokuapp.com
```

### 2. **NETLIFY** (Alternativa Frontend)

```bash
# 1. Build local
cd frontend
npm run build

# 2. Fazer upload da pasta 'dist' no Netlify
# 3. Configurar redirects no Netlify
```

### 3. **HEROKU** (Backend + Database)

```bash
# 1. Instalar Heroku CLI
# 2. Login no Heroku
heroku login

# 3. Criar app
heroku create despfinancee-api

# 4. Configurar MongoDB (addon ou Atlas)
heroku addons:create mongolab:sandbox

# 5. Deploy
git subtree push --prefix backend heroku main
```

### 4. **RAILWAY** (Full Stack - Recomendado)

```bash
# 1. Conectar repositório no Railway
# 2. Deploy automático do backend
# 3. Configurar variáveis de ambiente
```

## 🔧 Correções Necessárias

### 1. Problema de CSP (Content Security Policy)

**Solução A: Configurar CSP no index.html**

```html
<meta
  http-equiv="Content-Security-Policy"
  content="style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;"
/>
```

**Solução B: Usar fontes locais**

### 2. Problema de Conexão

**Configurar variáveis de ambiente:**

**Frontend (.env)**

```bash
VITE_API_URL=http://localhost:3001
VITE_APP_ENV=development
```

**Backend (.env)**

```bash
PORT=3001
NODE_ENV=production
JWT_SECRET=sua_chave_super_secreta_aqui
MONGODB_URI=sua_string_mongodb
CORS_ORIGIN=http://localhost:5173,https://seu-frontend.vercel.app
```

## 🚀 Deploy Rápido (5 minutos)

### Opção 1: Netlify + Railway

```bash
# Frontend (Netlify)
1. cd frontend && npm run build
2. Drag & drop pasta 'dist' no Netlify
3. Configurar redirects: _redirects file

# Backend (Railway)
1. Conectar repositório no Railway
2. Selecionar pasta 'backend'
3. Deploy automático
```

### Opção 2: Vercel + Heroku

```bash
# Frontend (Vercel)
cd frontend && vercel --prod

# Backend (Heroku)
heroku create sua-api
git subtree push --prefix backend heroku main
```

## 🔒 Configurações de Segurança

### CORS

```javascript
// backend/server.js
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://seu-app.vercel.app",
      "https://seu-app.netlify.app",
    ],
    credentials: true,
  })
);
```

### Environment Variables

```bash
# Produção
JWT_SECRET=chave_super_secreta_256_bits
MONGODB_URI=mongodb+srv://...
NODE_ENV=production
CORS_ORIGIN=https://seu-frontend.com
```

## 📱 URLs de Exemplo

**Frontend:** `https://despfinancee.vercel.app`
**Backend:** `https://despfinancee-api.railway.app`
**Docs:** `https://despfinancee-api.railway.app/api-docs`

## 🛠 Troubleshooting

### Erro de CORS

- Adicionar URL do frontend no CORS_ORIGIN
- Verificar protocolo (http vs https)

### Erro de Database

- Verificar MONGODB_URI
- Whitelist IP no MongoDB Atlas

### Erro de Build

- Verificar todas as dependências
- Rodar `npm run build` localmente

## ✅ Checklist Final

- [ ] Build frontend sem erros
- [ ] Backend funcionando local
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado
- [ ] MongoDB conectado
- [ ] Deploy realizado
- [ ] URLs funcionando
- [ ] SSL/HTTPS configurado

## 🚀 Deploy Automático (GitHub Actions)

Posso configurar deploy automático para vocês! Só me avisar.
