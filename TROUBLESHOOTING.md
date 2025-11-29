# 🆘 TROUBLESHOOTING - Problemas Comuns e Soluções

Guia de resolução de problemas para deploy e operação do DespFinancee.

---

## 🔍 ÍNDICE RÁPIDO

- [Problemas de Deploy](#problemas-de-deploy)
- [Problemas de Conexão](#problemas-de-conexão)
- [Problemas de Autenticação](#problemas-de-autenticação)
- [Problemas de Banco de Dados](#problemas-de-banco-de-dados)
- [Problemas de Performance](#problemas-de-performance)
- [Problemas de Build](#problemas-de-build)
- [Problemas de Segurança](#problemas-de-segurança)

---

## 🚀 PROBLEMAS DE DEPLOY

### ❌ Vercel: "Build Failed"

**Sintoma**: Build falha no Vercel

**Possíveis causas e soluções**:

```bash
# 1. Variáveis de ambiente faltando
# Solução: Adicione no Vercel Dashboard
VITE_API_URL=https://seu-backend.onrender.com/api
VITE_ENV=production

# 2. Comando de build errado
# Solução: Verificar vercel.json ou configuração
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist

# 3. Dependências quebradas
# Solução: Limpe cache no Vercel
Settings → General → Clear Cache → Redeploy
```

---

### ❌ Render: "Deploy Failed"

**Sintoma**: Deploy não completa no Render

**Soluções**:

```bash
# 1. Build Command errado
# Correto:
Build Command: npm install
Start Command: npm start

# 2. Root Directory errado
# Correto:
Root Directory: backend

# 3. Porta errada
# No .env do Render, use:
PORT=3001

# 4. Node version incompatível
# Adicione no package.json:
"engines": {
  "node": ">=16.0.0"
}
```

---

### ❌ Render: "Web Service is Sleeping"

**Sintoma**: App demora 30s+ para carregar

**Causa**: Plano gratuito dorme após 15min de inatividade

**Soluções**:

1. **Aceitar o comportamento** (normal no plano grátis)
2. **Upgrade para plano pago** ($7/mês - sem sleep)
3. **Usar alternativa**:
   - Railway (mais rápido no free tier)
   - AWS EC2 free tier (mais complexo)

**Workaround**:

```bash
# Criar um cron job externo que acessa o site a cada 10min
# Usar: uptimerobot.com (grátis)
```

---

## 🔌 PROBLEMAS DE CONEXÃO

### ❌ Frontend não conecta no Backend

**Sintoma**: Erro de CORS ou "Network Error"

**Checklist de verificação**:

```bash
# 1. Verificar VITE_API_URL no Frontend (Vercel)
# Deve ser:
VITE_API_URL=https://despfinancee-api.onrender.com/api
# NÃO pode ser:
VITE_API_URL=http://localhost:3001/api  ❌

# 2. Verificar CORS_ORIGIN no Backend (Render)
# Deve incluir URL do Vercel:
CORS_ORIGIN=https://seu-projeto.vercel.app
# Pode ser múltiplos separados por vírgula:
CORS_ORIGIN=https://seu-projeto.vercel.app,https://dominio.com

# 3. Ambos devem usar HTTPS em produção!
https://frontend ✅
https://backend ✅

http://frontend ❌
http://backend ❌

# 4. Testar endpoint da API diretamente
curl https://despfinancee-api.onrender.com/api/health
# Deve retornar: { "status": "ok" }
```

**Debug no navegador**:

```javascript
// Console do navegador (F12)
console.log("API URL:", import.meta.env.VITE_API_URL);
// Deve mostrar a URL do Render, não localhost!
```

---

### ❌ CORS Error

**Erro completo**:

```
Access to fetch at 'https://api...' from origin 'https://app...'
has been blocked by CORS policy
```

**Solução passo-a-passo**:

```bash
# 1. Backend (Render) - Adicione variável:
CORS_ORIGIN=https://seu-frontend-url.vercel.app

# 2. Se tiver domínio próprio, adicione também:
CORS_ORIGIN=https://vercel.app,https://meudominio.com

# 3. Verifique o código backend (já deve estar OK):
# backend/server.js ou backend/src/index.js
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

# 4. Redeploy do backend
# 5. Teste novamente
```

---

## 🔐 PROBLEMAS DE AUTENTICAÇÃO

### ❌ "Invalid Token" ou "Token Expired"

**Sintomas**:

- Login não funciona
- Deslogado automaticamente
- "401 Unauthorized"

**Soluções**:

```bash
# 1. Verificar JWT_SECRET em produção
# Backend (Render) deve ter:
JWT_SECRET=<chave_segura_32+_caracteres>
JWT_REFRESH_SECRET=<outra_chave_diferente>

# NÃO use a mesma chave de desenvolvimento!

# 2. Limpar cookies/localStorage do navegador
# Console do navegador (F12):
localStorage.clear();
sessionStorage.clear();
// Depois recarregue a página

# 3. Verificar se JWT_EXPIRES_IN está configurado
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
```

---

### ❌ Login não persiste após refresh

**Sintoma**: Ao recarregar página, usuário desloga

**Solução**:

```javascript
// Frontend - verificar se está salvando token
// frontend/src/contexts/AuthContext.jsx
localStorage.setItem("token", token);

// Verificar se está carregando na inicialização
useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    // validar e restaurar sessão
  }
}, []);
```

---

## 🗄️ PROBLEMAS DE BANCO DE DADOS

### ❌ MongoDB: "Connection Timeout"

**Sintoma**: Backend não conecta no MongoDB Atlas

**Checklist**:

```bash
# 1. Verificar MONGO_URI
# Backend (Render) - deve ser:
MONGO_URI=mongodb+srv://usuario:senha@cluster.xxxxx.mongodb.net/despfinance?retryWrites=true&w=majority

# Certifique-se de:
# - Substituir <password> pela senha real
# - Usar senha sem caracteres especiais (ou fazer URL encode)
# - Nome do database correto (despfinance)

# 2. MongoDB Atlas - Network Access
# Adicionar IP:
# 0.0.0.0/0 (permite todos - OK para desenvolvimento)
# Ou IPs específicos do Render

# 3. MongoDB Atlas - Database Access
# Criar usuário com permissão:
# Read and write to any database

# 4. Testar conexão
# No Render Shell:
node -e "require('mongoose').connect(process.env.MONGO_URI).then(() => console.log('OK'))"
```

---

### ❌ MongoDB: "Authentication Failed"

**Sintoma**: Erro de autenticação ao conectar

**Soluções**:

```bash
# 1. Senha contém caracteres especiais?
# Evite: @ # $ % & etc
# Ou faça URL encoding:
# @ = %40
# # = %23

# 2. Gerar nova senha no Atlas:
# Database Access → Edit User → Edit Password
# Gerar senha automática (só letras e números)

# 3. Atualizar MONGO_URI no Render
# Não esqueça de fazer Deploy novamente
```

---

### ❌ Banco de Dados Vazio

**Sintoma**: Login demo não funciona, nenhum dado carrega

**Solução**:

```bash
# 1. Popular banco de dados
# Via Render Shell:
npm run db:setup
npm run db:seed

# 2. Ou via local (apontando para produção):
# No seu computador:
cd backend
echo "MONGO_URI=mongodb+srv://..." > .env.prod
NODE_ENV=production npm run db:seed

# 3. Verificar se dados foram criados:
# MongoDB Atlas → Browse Collections
# Deve ter: users, transactions, categories, etc.
```

---

## ⚡ PROBLEMAS DE PERFORMANCE

### ❌ App Muito Lento

**Possíveis causas**:

```bash
# 1. Backend sleeping (Render free tier)
# Primeira request demora 30s
# Solução: Upgrade ou aceitar comportamento

# 2. MongoDB Atlas muito distante
# Solução: Escolher região mais próxima (São Paulo)

# 3. Bundle JavaScript muito grande
# Verificar tamanho:
cd frontend
npm run build
# Ver tamanho em frontend/dist/

# Otimizar:
# - Implementar lazy loading
# - Code splitting
# - Remover imports não usados

# 4. Muitas requisições à API
# Solução: Implementar cache com React Query
```

---

### ❌ Lighthouse Score Baixo

**Sintomas**: Performance < 70, Accessibility < 90

**Otimizações**:

```bash
# 1. Performance
# - Lazy load de componentes
# - Otimizar imagens (WebP)
# - Minificar JS/CSS (Vite já faz)
# - Usar CDN (Vercel já faz)

# 2. Accessibility
# - Adicionar alt em imagens
# - Usar labels corretos em forms
# - Contraste de cores adequado

# 3. SEO
# - Meta tags em index.html
# - sitemap.xml
# - robots.txt

# 4. Best Practices
# - HTTPS (automático)
# - Headers de segurança (Helmet já configurado)
```

---

## 🏗️ PROBLEMAS DE BUILD

### ❌ "Module not found"

**Sintoma**: Erro ao buildar ou rodar

**Soluções**:

```bash
# 1. Instalar dependências
npm install

# 2. Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# 3. Verificar import paths
# Usar paths absolutos ou relativos corretos
import Component from './Component'  ✅
import Component from 'Component'    ❌

# 4. Verificar case sensitivity
# Linux/Deploy é case-sensitive!
import from './Component.jsx'  ✅
import from './component.jsx'  ❌ (se arquivo é Component.jsx)
```

---

### ❌ Build do Frontend Falha

**Erro**: "Failed to compile"

**Debug**:

```bash
# 1. Testar build localmente
cd frontend
npm run build

# 2. Ver erros detalhados
npm run build -- --debug

# 3. Verificar variáveis de ambiente
# Todas VITE_* devem existir:
VITE_API_URL=...
VITE_ENV=production

# 4. Verificar imports de assets
# Devem estar em public/ ou src/assets/
```

---

## 🛡️ PROBLEMAS DE SEGURANÇA

### ❌ "npm audit" mostra vulnerabilidades

**Análise**:

```bash
# 1. Verificar se são de produção ou dev
npm audit --production

# 2. Se for só dev, OK para produção
# Exemplo: vulnerabilidades no Jest

# 3. Se for produção, tentar fix automático
npm audit fix

# 4. Se não tiver fix, avaliar risco
npm audit fix --force  # Cuidado! Pode quebrar

# 5. Atualizar dependências manualmente
npm update

# 6. Se vulnerabilidade crítica sem fix:
# - Procurar alternativa à biblioteca
# - Reportar no GitHub da lib
```

---

### ❌ CSP Bloqueando Recursos

**Erro no console**: "Refused to load... because it violates CSP"

**Solução**:

```javascript
// frontend/src/config/security.js
// Adicionar domínio permitido na CSP

const cspDirectives = {
  "script-src": [
    "'self'",
    "https://dominio-confiavel.com", // Adicione aqui
  ],
};
```

---

## 📱 PROBLEMAS ESPECÍFICOS POR PLATAFORMA

### Vercel

```bash
# Erro: "Build timed out"
# Solução: Otimizar build ou upgrade plano

# Erro: "Deployment URL não atualiza"
# Solução: Clear cache + redeploy

# Erro: "Environment variables not working"
# Solução: Adicionar em Settings → Environment Variables
# E fazer redeploy (não atualiza automaticamente)
```

### Render

```bash
# Erro: "Out of memory"
# Solução: Otimizar código ou upgrade plano

# Erro: "Disk quota exceeded"
# Solução: Limpar logs, otimizar uploads

# Erro: "Build cancelled"
# Solução: Build demorando muito, otimizar ou upgrade
```

### MongoDB Atlas

```bash
# Erro: "Storage limit exceeded"
# Solução: M0 tem limite de 512MB
# - Limpar dados antigos
# - Upgrade para M10+

# Erro: "Connection limit reached"
# Solução: M0 tem limite de 100 conexões
# - Implementar connection pooling
# - Fechar conexões não usadas
```

---

## 🔧 FERRAMENTAS DE DEBUG

### Backend

```bash
# Ver logs em tempo real (Render)
# Dashboard → Logs tab

# Executar comandos (Render Shell)
# Dashboard → Shell tab
node -v
npm -v
printenv  # Ver variáveis de ambiente

# Testar endpoint
curl https://seu-backend.onrender.com/api/health
```

### Frontend

```bash
# Console do navegador (F12)
console.log(import.meta.env)  # Ver variáveis
localStorage  # Ver dados salvos
sessionStorage

# Network tab (F12)
# Ver todas requisições HTTP
# Verificar status codes, headers, payload

# Application tab (F12)
# Ver cookies, localStorage, sessionStorage
```

### MongoDB

```bash
# MongoDB Atlas → Metrics
# Ver queries lentas, uso de CPU, memória

# MongoDB Compass (Desktop)
# Conectar e explorar dados visualmente
mongodb+srv://user:pass@cluster...
```

---

## 📞 AINDA COM PROBLEMAS?

### Passo-a-passo de Debug:

1. **Verificar logs**

   - Render: Dashboard → Logs
   - Vercel: Deployment → Function Logs
   - MongoDB: Atlas → Metrics

2. **Testar componentes separadamente**

   - Frontend conecta?
   - Backend responde?
   - Banco está acessível?

3. **Comparar com desenvolvimento local**

   - Funciona local? → Problema de configuração de prod
   - Não funciona local? → Problema no código

4. **Verificar variáveis de ambiente**

   ```bash
   # Backend
   printenv | grep -i mongo
   printenv | grep -i jwt
   printenv | grep -i cors

   # Frontend
   console.log(import.meta.env)
   ```

5. **Consultar documentação**
   - [Render Docs](https://render.com/docs)
   - [Vercel Docs](https://vercel.com/docs)
   - [MongoDB Atlas](https://docs.atlas.mongodb.com/)

### Criar Issue no GitHub

Se nada funcionar, abra uma issue:

```markdown
**Descrição do Problema**
[Descreva claramente]

**Passos para Reproduzir**

1. ...
2. ...

**Comportamento Esperado**
[O que deveria acontecer]

**Comportamento Atual**
[O que está acontecendo]

**Screenshots**
[Se aplicável]

**Ambiente**

- Plataforma: Vercel/Render/Local
- Browser: Chrome/Firefox/etc
- Versão: 2.0.0

**Logs de Erro**
```

[Cole logs aqui]

```

```

---

## 📚 Recursos Úteis

- 📖 [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Guia passo-a-passo
- 📋 [CHECKLIST_PUBLICACAO.md](CHECKLIST_PUBLICACAO.md) - Checklist completo
- 🗺️ [ROADMAP_PUBLICACAO.md](ROADMAP_PUBLICACAO.md) - Roadmap visual
- 📊 [RESUMO_PUBLICACAO.md](RESUMO_PUBLICACAO.md) - Resumo executivo

---

**Última atualização**: 25/11/2025  
**Versão**: 2.0.0  
**Autor**: Bruno Souza

**💡 Dica**: Mantenha este arquivo aberto durante o deploy! 🚀
