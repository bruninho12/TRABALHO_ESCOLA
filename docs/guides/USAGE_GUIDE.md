# 🚀 Guia de Uso - DespFinance v2.0

**Última Atualização**: 12 de Novembro de 2025  
**Versão**: 2.0.0  
**Status**: 🟢 Pronto para Usar

---

## 📋 Índice

1. [Inicialização Rápida](#inicialização-rápida)
2. [Estrutura do Projeto](#estrutura-do-projeto)
3. [Guia de Desenvolvimento](#guia-de-desenvolvimento)
4. [Testes](#testes)
5. [APIs e Endpoints](#apis-e-endpoints)
6. [Componentes Disponíveis](#componentes-disponíveis)
7. [Custom Hooks](#custom-hooks)
8. [Troubleshooting](#troubleshooting)

---

## 🚀 Inicialização Rápida

### Pré-requisitos

- Node.js (v16+)
- npm (v8+)
- MongoDB (local ou Atlas)

### Instalação

#### 1. Backend Setup

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais

# Iniciar servidor
npm run dev
# Será iniciado em: http://localhost:3001
```

#### 2. Frontend Setup

```bash
cd frontend-react

# Instalar dependências
npm install

# Iniciar dev server
npm run dev
# Será iniciado em: http://localhost:5173
```

### 3. Acessar a Aplicação

Abrir no navegador: **http://localhost:5173**

---

## 📁 Estrutura do Projeto

```
DespFinancee/
├── backend/
│   ├── src/
│   │   ├── config/        # Configurações (MongoDB, Swagger, etc)
│   │   ├── controllers/   # Lógica de business (30+ controllers)
│   │   ├── middleware/    # Middleware customizado (Auth, Validation, etc)
│   │   ├── models/        # Modelos MongoDB (9 modelos)
│   │   ├── routes/        # Definição de rotas (30+ endpoints)
│   │   ├── services/      # Serviços (Email, Payment, etc)
│   │   ├── utils/         # Utilitários e helpers
│   │   ├── seeders/       # Scripts de seed de dados
│   │   └── swagger/       # Documentação Swagger
│   ├── app.js             # Express app configurado
│   ├── server.js          # Entry point
│   ├── test-backend.js    # Script de testes (460 linhas)
│   ├── package.json       # Dependências (30 packages)
│   └── .env.example       # Template de variáveis de ambiente
│
├── frontend-react/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   │   ├── Layout.jsx           # Layout principal
│   │   │   ├── PrivateRoute.jsx     # Proteção de rotas
│   │   │   ├── GoalCard.jsx         # Card de metas (NOVO)
│   │   │   ├── PaymentForm.jsx      # Formulário pagamentos (NOVO)
│   │   │   ├── AvatarSelector.jsx   # Seletor de avatar RPG (NOVO)
│   │   │   └── ... outros
│   │   ├── pages/         # Páginas React (8 páginas)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Goals.jsx           # NOVO
│   │   │   ├── Payments.jsx        # NOVO
│   │   │   ├── Reports.jsx         # NOVO
│   │   │   ├── Settings.jsx        # NOVO
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── hooks/         # Custom React Hooks (5 hooks)
│   │   │   ├── useGamification.js  # NOVO
│   │   │   ├── useRPGGame.js       # NOVO
│   │   │   ├── useGoals.js         # NOVO
│   │   │   ├── usePayments.js      # NOVO
│   │   │   ├── useReports.js       # NOVO
│   │   │   ├── useDashboardData.js
│   │   │   └── ... outros
│   │   ├── contexts/      # React Context (Auth)
│   │   ├── services/      # Serviços HTTP (Axios)
│   │   ├── styles/        # Estilos CSS e tema
│   │   ├── App.jsx        # App principal
│   │   ├── routes.jsx     # Definição de rotas
│   │   └── main.jsx       # Entry point
│   ├── package.json       # Dependências (25 packages)
│   └── vite.config.js     # Configuração Vite
│
├── PROGRESS_REPORT.md     # Relatório de progresso (NOVO)
├── TASKS_COMPLETED.md     # Tarefas concluídas (NOVO)
├── INTEGRATION_COMPLETE.md# Resumo integração anterior
└── STATUS_FINAL.md        # Status final anterior
```

---

## 👨‍💻 Guia de Desenvolvimento

### Estrutura de um Controller

```javascript
// Exemplo: controllers/goalController.js
class GoalController {
  async getGoals(req, res) {
    // req.user.id vem do JWT middleware
    // res.json({ data: goals, message: 'OK' })
  }

  async createGoal(req, res) {
    // Validação
    // Salvar no MongoDB
    // Retornar nova goal
  }
}
```

### Estrutura de uma Rota

```javascript
// Exemplo: routes/goalRoutes.js
router.get("/", auth, goalController.getGoals);
router.post("/", auth, validate, goalController.createGoal);
router.put("/:id", auth, validate, goalController.updateGoal);
router.delete("/:id", auth, goalController.deleteGoal);
```

### Estrutura de um Custom Hook

```javascript
// Exemplo: hooks/useGoals.js
export const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const listGoals = useCallback(async () => {
    // Chamar API com axios
    // Atualizar estado
  }, []);

  useEffect(() => {
    listGoals();
  }, []);

  return { goals, loading, error, listGoals, ... };
};
```

### Estrutura de um Componente

```javascript
// Exemplo: components/GoalCard.jsx
const GoalCard = ({ goal, onEdit, onDelete, ... }) => {
  return (
    <Card>
      {/* Exibição da goal */}
      {/* Ações */}
    </Card>
  );
};
```

---

## 🧪 Testes

### Backend Testing

#### Executar Script de Testes

```bash
cd backend
node test-backend.js
```

**Saída esperada:**

```
╔════════════════════════════════════════════════════╗
║       DespFinance v2.0 - Teste de Backend         ║
╚════════════════════════════════════════════════════╝

🔗 URL da API: http://localhost:3001/api
⏱️  Timeout: 10000ms

📋 1. HEALTH CHECK
  ✅ Health Check

🔐 2. AUTENTICAÇÃO
  ✅ Registrar usuário
  ✅ Login de usuário
  ✅ Obter perfil do usuário

... mais testes ...

📈 RESUMO DOS TESTES
 Total de testes: 30+
 ✅ Passou: X
 ❌ Falhou: Y

Taxa de sucesso: XX%
```

#### Testes Manuais com curl

```bash
# Health check
curl http://localhost:3001/api/health

# Registrar usuário
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "email": "joao@example.com",
    "password": "Senha@123",
    "confirmPassword": "Senha@123"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "Senha@123"
  }'

# Usar token em requisição autenticada
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Frontend Testing

#### Testes Manuais

1. Abrir http://localhost:5173
2. Registrar nova conta
3. Fazer login
4. Navegar pelas páginas:
   - Dashboard
   - Transactions
   - Goals
   - Payments
   - Reports
   - Settings
5. Testar CRUD em cada página

#### Verificar Console

```javascript
// Abrir F12 → Console
// Verificar se há erros
// Verificar logs de requisições
```

---

## 🔌 APIs e Endpoints

### Grupos de Endpoints Disponíveis

#### 🔐 Autenticação (`/api/auth`)

```
POST   /auth/register              - Registrar novo usuário
POST   /auth/login                 - Fazer login (retorna JWT)
GET    /auth/me                    - Obter dados do usuário atual
PUT    /auth/profile               - Atualizar perfil
POST   /auth/change-password       - Alterar senha
POST   /auth/logout                - Logout
```

#### 📂 Categorias (`/api/categories`)

```
GET    /categories                 - Listar categorias
POST   /categories                 - Criar categoria
PUT    /categories/:id             - Atualizar categoria
DELETE /categories/:id             - Deletar categoria
```

#### 💸 Transações (`/api/transactions`)

```
GET    /transactions               - Listar transações
POST   /transactions               - Criar transação
PUT    /transactions/:id           - Atualizar transação
DELETE /transactions/:id           - Deletar transação
GET    /transactions/stats         - Estatísticas
```

#### 🎯 Metas/Goals (`/api/goals`)

```
GET    /goals                      - Listar metas
POST   /goals                      - Criar meta
PUT    /goals/:id                  - Atualizar meta
DELETE /goals/:id                  - Deletar meta
POST   /goals/:id/contribute       - Adicionar contribuição
POST   /goals/:id/complete         - Marcar como completa
GET    /goals/stats                - Estatísticas
```

#### 💳 Pagamentos (`/api/payments`)

```
GET    /payments                   - Listar pagamentos
POST   /payments                   - Criar pagamento
PUT    /payments/:id               - Atualizar pagamento
DELETE /payments/:id               - Deletar pagamento
POST   /payments/:id/process       - Processar pagamento
POST   /payments/:id/confirm       - Confirmar pagamento
```

#### 📊 Finanças/Dashboard (`/api/finance`)

```
GET    /finance/dashboard          - Dashboard completo
GET    /finance/cash-flow          - Fluxo de caixa
GET    /finance/expenses-by-category - Despesas por categoria
GET    /finance/monthly-balance    - Saldo mensal
GET    /finance/summary            - Resumo financeiro
POST   /finance/compare            - Comparar períodos
GET    /finance/forecast           - Previsão
GET    /finance/export/pdf         - Exportar PDF
GET    /finance/export/csv         - Exportar CSV
```

#### 🎮 Gamificação (`/api/gamification`)

```
GET    /gamification/data          - Dados de gamificação
GET    /gamification/achievements  - Conquistas
POST   /gamification/add-points    - Adicionar pontos
POST   /gamification/streak        - Aumentar streak
```

#### 🐉 RPG (`/api/rpg`)

```
GET    /rpg/avatar                 - Obter avatar
POST   /rpg/avatar                 - Criar/atualizar avatar
GET    /rpg/world                  - Obter dados do mundo
POST   /rpg/move                   - Mover para localização
POST   /rpg/battle/start           - Iniciar batalha
POST   /rpg/battle/action          - Executar ação em batalha
POST   /rpg/heal                   - Curar avatar
GET    /rpg/battles/history        - Histórico de batalhas
```

---

## 🧩 Componentes Disponíveis

### Componentes da UI

| Componente          | Arquivo                          | Funcionalidade                |
| ------------------- | -------------------------------- | ----------------------------- |
| **Layout**          | `components/Layout.jsx`          | Shell principal com navegação |
| **PrivateRoute**    | `components/PrivateRoute.jsx`    | Proteção de rotas             |
| **Loading**         | `components/Loading.jsx`         | Indicador de carregamento     |
| **ConfirmDialog**   | `components/ConfirmDialog.jsx`   | Diálogo de confirmação        |
| **StatCard**        | `components/StatCard.jsx`        | Card de estatísticas          |
| **TransactionForm** | `components/TransactionForm.jsx` | Formulário de transações      |
| **CategoryForm**    | `components/CategoryForm.jsx`    | Formulário de categorias      |

### Novos Componentes Criados

| Componente         | Arquivo                         | Funcionalidade                    |
| ------------------ | ------------------------------- | --------------------------------- |
| **GoalCard**       | `components/GoalCard.jsx`       | Card visual de metas              |
| **PaymentForm**    | `components/PaymentForm.jsx`    | Formulário completo de pagamentos |
| **AvatarSelector** | `components/AvatarSelector.jsx` | Seletor/editor de avatar RPG      |

---

## 🎣 Custom Hooks

### useGamification

```javascript
const { data, loading, error, loadGamificationData, addPoints, ... } = useGamification();
```

**Funções**: loadGamificationData, loadAchievements, addPoints, increaseStreak

### useRPGGame

```javascript
const { avatar, world, battles, loading, ..., startBattle } = useRPGGame();
```

**Funções**: loadAvatar, loadWorld, startBattle, executeBattleAction, moveToLocation, heal

### useGoals

```javascript
const { goals, loading, ..., createGoal, updateGoal, contributeToGoal } = useGoals();
```

**Funções**: listGoals, createGoal, getGoal, updateGoal, deleteGoal, contributeToGoal, completeGoal

### usePayments

```javascript
const { payments, loading, ..., createPayment, processPayment } = usePayments();
```

**Funções**: listPayments, createPayment, updatePayment, deletePayment, processPayment, confirmPayment

### useReports

```javascript
const { reports, loading, ..., getCashFlow, exportToPDF } = useReports();
```

**Funções**: getCashFlow, getExpensesByCategory, getMonthlyBalance, exportToPDF, exportToCSV, comparePeriods, getForecast

---

## 🛠️ Troubleshooting

### Backend não inicia

```bash
# Verificar se MongoDB está rodando
mongod

# Verificar se porta 3001 está livre
netstat -ano | findstr :3001

# Verificar variáveis de ambiente
cat .env
```

### Frontend não carrega

```bash
# Limpar cache Vite
rm -rf node_modules/.vite

# Reinstalar dependências
npm install

# Resetar dev server
npm run dev
```

### Erros de autenticação

```javascript
// Verificar token no localStorage
localStorage.getItem("token");

// Verificar se JWT_SECRET está configurado no backend
// Verificar se Authorization header está sendo enviado
```

### Erro de CORS

```javascript
// Verificar se CORS está habilitado no backend
// Verificar se FRONTEND_URL está correta no .env
// Verificar headers na requisição
```

### Banco de dados vazio

```bash
# Executar seed de dados
npm run db:seed

# Ou resetar banco de dados
npm run db:clean
```

---

## 📚 Recursos Úteis

### Documentação

- Swagger API: http://localhost:3001/api-docs
- Material-UI: https://mui.com/material-ui/
- React Router: https://reactrouter.com/
- Axios: https://axios-http.com/
- Recharts: https://recharts.org/

### Ferramentas

- Postman: Testar APIs
- VS Code: Editor de código
- MongoDB Compass: Gerenciar banco de dados
- Chrome DevTools: Debug frontend

---

## 📝 Exemplos de Uso

### Criar uma nova página

```javascript
// pages/NewPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Typography } from "@mui/material";

export default function NewPage() {
  return (
    <Container>
      <Typography variant="h4">Nova Página</Typography>
    </Container>
  );
}
```

### Usar um custom hook

```javascript
import { useGoals } from '../hooks/useGoals';

function MyComponent() {
  const { goals, loading, createGoal } = useGoals();

  const handleCreate = async (goalData) => {
    await createGoal(goalData);
  };

  return (
    // Render component
  );
}
```

### Chamar API diretamente

```javascript
import axios from "axios";

const getGoals = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get("http://localhost:3001/api/goals", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

---

## 🎓 Próximos Passos

1. **Executar testes** do backend
2. **Testar frontend** manualmente
3. **Criar componentes faltantes** (FinanceChart, GamificationPanel)
4. **Implementar dark theme**
5. **Adicionar E2E tests** com Cypress
6. **Deploy** em servidor de produção

---

**Versão**: 2.0.0  
**Data**: 12 de Novembro de 2025  
**Suporte**: Consulte os arquivos de documentação no projeto
