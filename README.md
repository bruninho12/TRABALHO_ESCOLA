# 💰 DespFinancee

Aplicação web completa para gerenciamento de finanças pessoais, com dashboard interativo, controle de gastos, relatórios financeiros e sistema de gamificação.

---

## ✨ Funcionalidades

- 🔐 Autenticação com JWT
- 📊 Dashboard financeiro interativo
- 💳 Controle de receitas e despesas
- 🏷️ Categorias personalizadas
- 💼 Gerenciamento de orçamento
- 📈 Relatórios financeiros
- 🔔 Alertas automáticos
- 🎮 Sistema de gamificação
- 💳 Integração com Stripe e Mercado Pago
- 📱 Interface responsiva
- 🌙 Tema claro e escuro

---

# 🚀 Tecnologias

## Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Stripe API
- Mercado Pago API

## Frontend

- React + Vite
- Material UI
- Axios
- React Router
- React Query
- Chart.js

---

# ⚙️ Instalação

## Clone o projeto

```bash
git clone https://github.com/bruninho12/TRABALHO_ESCOLA.git
cd DespFinancee
```

---

# 🔧 Backend

```bash
cd backend

npm install

cp ../config/.env.backend.example .env

npm run db:setup
npm run seed
npm run dev
```

---

# 🎨 Frontend

```bash
cd frontend

npm install

cp ../config/.env.frontend.example .env

npm run dev
```

---

# 🌐 Acesso

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| API Docs | http://localhost:3001/api-docs |

---

# 🔑 Login Demo

```txt
Email: demo@despfinancee.com
Senha: senha123
```

---

# 📚 API

## Auth

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
```

## Transactions

```http
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
```

## Categories

```http
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Budgets

```http
GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/:id
DELETE /api/budgets/:id
```

---

# 🚀 Deploy

## Build do Frontend

```bash
npm run build
```

## Produção

- Configurar variáveis de ambiente
- Configurar MongoDB Atlas
- Configurar HTTPS
- Publicar frontend e backend

---

# 👨‍💻 Autor

Bruno Souza

- GitHub: https://github.com/bruninho12
- Projeto: https://github.com/bruninho12/TRABALHO_ESCOLA

---

# 📄 Licença

Este projeto está sob a licença MIT.