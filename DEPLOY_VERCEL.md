# 🚀 Guia de Deploy no Vercel - Resolvendo CORS

## 📋 Problemas CORS Comuns e Soluções

### ❌ Erro típico:

```
Access to fetch at 'https://trabalho-escola-black.vercel.app/cadastro' from origin 'https://trabalho-escola-5lqz-3rm820502-brunos-projects-4b4f61b9.vercel.app' has been blocked by CORS policy
```

### ✅ Soluções Implementadas:

## 1. Backend (API) - Configuração CORS Robusta

### arquivo: `backend/index.js`

```javascript
// Configuração CORS para Vercel
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://trabalho-escola-5lqz-3rm820502-brunos-projects-4b4f61b9.vercel.app",
  "https://trabalho-escola-brunos-projects-4b4f61b9.vercel.app",
  "https://trabalho-escola.vercel.app",
  /^https:\/\/trabalho-escola-.*\.vercel\.app$/,
  /^https:\/\/.*-brunos-projects-4b4f61b9\.vercel\.app$/,
];
```

### arquivo: `backend/vercel.json`

```json
{
  "version": 2,
  "builds": [{ "src": "./index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "/" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

## 2. Frontend - Configuração de Requisições

### arquivo: `frontend/app.js`

```javascript
// Configuração robusta de fetch
fetch(api + "/cadastro", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  mode: "cors",
  credentials: "omit",
  body: JSON.stringify({ nome, email, senha }),
});
```

### arquivo: `frontend/vercel.json`

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization, X-Requested-With"
        }
      ]
    }
  ]
}
```

## 3. Passos para Deploy

### Backend:

1. Fazer push do backend com as configurações CORS
2. Deploy no Vercel: `https://trabalho-escola-black.vercel.app`

### Frontend:

1. Atualizar a URL da API no `app.js`
2. Deploy no Vercel: `https://trabalho-escola-brunos-projects-4b4f61b9.vercel.app`

## 4. Verificação

### ✅ Checklist:

- [ ] Backend respondendo com headers CORS corretos
- [ ] Frontend fazendo requisições com `mode: 'cors'`
- [ ] URLs da API atualizadas no frontend
- [ ] Ambos os vercel.json configurados
- [ ] Deploy realizado com sucesso

### 🔧 Debug:

```javascript
// Adicionar no console do navegador para verificar:
console.log("API URL:", api);
console.log("Current Origin:", window.location.origin);
```

## 5. URLs de Produção

- **Frontend**: `https://trabalho-escola-brunos-projects-4b4f61b9.vercel.app`
- **Backend**: `https://trabalho-escola-black.vercel.app`

## 6. Comandos de Deploy

```bash
# Deploy backend
cd backend
vercel --prod

# Deploy frontend
cd frontend
vercel --prod
```

---

💡 **Dica**: Sempre teste localmente primeiro com `npm start` antes de fazer deploy!
