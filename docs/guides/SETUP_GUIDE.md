# 📚 Guia Completo de Setup - DespFinancee

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração Inicial](#configuração-inicial)
3. [Setup Backend](#setup-backend)
4. [Setup Frontend](#setup-frontend)
5. [Executar o Projeto](#executar-o-projeto)
6. [Solução de Problemas](#solução-de-problemas)
7. [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## 🔧 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 14.x ou superior

  - [Download Node.js](https://nodejs.org/)
  - Verificar instalação: `node -v` e `npm -v`

- **Git** (opcional, mas recomendado)

  - [Download Git](https://git-scm.com/)

- **MongoDB** (uma das opções abaixo):

  - **MongoDB Atlas** (Cloud, recomendado para desenvolvimento)
    - Criar conta em: https://www.mongodb.com/cloud/atlas
  - **MongoDB Local** (instalado na máquina)
    - [Download MongoDB Community](https://www.mongodb.com/try/download/community)

- **Editor de código** (recomendado)
  - [VS Code](https://code.visualstudio.com/)

---

## 🚀 Configuração Inicial

### 1. Clone o Repositório

```bash
# Via HTTPS
git clone https://github.com/seu-usuario/DespFinancee.git

# Ou entre no diretório se já tiver
cd DespFinancee
```

### 2. Estrutura do Projeto

```
DespFinancee/
├── backend/           # API Node.js/Express
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── .env.example
└── frontend-react/    # Aplicação React
    ├── src/
    ├── package.json
    ├── .env
    └── .env.example
```

---

## 🔌 Setup Backend

### 1. Navegue até a pasta do backend

```bash
cd DespFinancee/backend
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

#### Opção A: Com MongoDB Atlas (RECOMENDADO)

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env`:

```properties
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/despfinancee?retryWrites=true&w=majority
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
```

**Como obter a string de conexão MongoDB Atlas:**

1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie ou selecione seu cluster
3. Clique em "Connect" → "Connect your application"
4. Copie a connection string e substitua:
   - `<password>` pela senha do usuário
   - `myFirstDatabase` por `despfinancee`

#### Opção B: Com MongoDB Local

Se preferir usar MongoDB instalado localmente:

```properties
NODE_ENV=development
PORT=3001
MONGO_URI=mongodb://localhost:27017/despfinancee
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:5173
```

Certifique-se de que o MongoDB está rodando:

```bash
# Windows
mongod

# Linux/Mac
brew services start mongodb-community
```

### 4. Popule o banco de dados com dados iniciais

```bash
npm run seed
```

Isso criará:

- Usuário demo: `demo@despfinancee.com` / `senha123`
- Categorias padrão
- Transações de exemplo
- Orçamentos de exemplo
- Notificações de exemplo

### 5. Verifique a configuração

```bash
npm run check:config
```

---

## ⚛️ Setup Frontend

### 1. Abra outro terminal e navegue até o frontend

```bash
cd DespFinancee/frontend-react
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env
```

Edite o arquivo `.env`:

```properties
VITE_API_URL=http://localhost:3001/api
VITE_ENV=development
```

---

## ▶️ Executar o Projeto

### Terminal 1 - Backend

```bash
cd DespFinancee/backend
npm run dev
```

Você deverá ver:

```
Servidor rodando na porta 3001 em modo development
```

Acesse a documentação da API:

- **Swagger UI**: http://localhost:3001/api-docs
- **Health Check**: http://localhost:3001/api/health

### Terminal 2 - Frontend

```bash
cd DespFinancee/frontend-react
npm run dev
```

Você deverá ver:

```
  VITE v4.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Acesse a aplicação:

- **Frontend**: http://localhost:5173

### Fazer Login

Use as credenciais demo criadas pelo seed:

```
Email: demo@despfinancee.com
Senha: senha123
```

---

## 📝 Scripts Disponíveis

### Backend

```bash
# Iniciar em desenvolvimento (com hot-reload)
npm run dev

# Iniciar em produção
npm start

# Popular banco de dados
npm run seed

# Testar conexão com banco de dados
npm run test:connection

# Verificar configuração de ambiente
npm run check:config

# Resetar senha do usuário demo
npm run demo:reset
```

### Frontend

```bash
# Iniciar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Verificar lint
npm run lint
```

---

## 🔐 Variáveis de Ambiente

### Backend (.env)

| Variável                 | Descrição                           | Exemplo                                |
| ------------------------ | ----------------------------------- | -------------------------------------- |
| `NODE_ENV`               | Ambiente de execução                | `development` \| `production`          |
| `PORT`                   | Porta do servidor                   | `3001`                                 |
| `MONGO_URI`              | String de conexão MongoDB           | `mongodb+srv://...`                    |
| `JWT_SECRET`             | Chave secreta para JWT              | Qualquer string segura                 |
| `JWT_EXPIRES_IN`         | Tempo de expiração do token         | `1d` \| `7d`                           |
| `JWT_REFRESH_EXPIRES_IN` | Tempo de expiração do refresh token | `7d` \| `30d`                          |
| `RATE_LIMIT_WINDOW`      | Janela de rate limiting em minutos  | `15`                                   |
| `RATE_LIMIT_MAX`         | Máximo de requisições por janela    | `100`                                  |
| `LOG_LEVEL`              | Nível de log                        | `debug` \| `info` \| `warn` \| `error` |
| `CORS_ORIGIN`            | Origem permitida para CORS          | `http://localhost:5173`                |

### Frontend (.env)

| Variável       | Descrição       | Exemplo                       |
| -------------- | --------------- | ----------------------------- |
| `VITE_API_URL` | URL base da API | `http://localhost:3001/api`   |
| `VITE_ENV`     | Ambiente        | `development` \| `production` |

---

## 🐛 Solução de Problemas

### Erro: "MongoDB conectado" não aparece

**Problema**: A conexão com MongoDB falha.

**Soluções**:

1. Verifique se a `MONGO_URI` está correta:

   ```bash
   npm run test:connection
   ```

2. Se usar MongoDB Atlas:

   - Verifique se seu IP está na whitelist do cluster
   - Acesse: https://cloud.mongodb.com/v2 → Seu Projeto → Network Access
   - Clique em "Add IP Address" e adicione seu IP

3. Se usar MongoDB Local:

   - Certifique-se de que o serviço está rodando:

     ```bash
     # Windows
     mongod

     # Linux/Mac
     brew services start mongodb-community
     ```

### Erro: "Email ou senha incorretos" no login

**Problema**: Não consegue fazer login com o usuário demo.

**Soluções**:

1. Repovoar o banco de dados:

   ```bash
   npm run seed
   ```

2. Resetar a senha do usuário demo:
   ```bash
   npm run demo:reset
   ```

### Erro: CORS - "Access to XMLHttpRequest blocked"

**Problema**: Frontend não consegue se comunicar com o backend.

**Soluções**:

1. Verifique se `VITE_API_URL` está correto no `.env` do frontend

2. Verifique se `CORS_ORIGIN` no backend está permitindo a origem:

   ```properties
   CORS_ORIGIN=http://localhost:5173
   ```

3. Certifique-se de que ambos os servidores estão rodando

### Erro: "Módulo não encontrado"

**Problema**: Alguma dependência não está instalada.

**Solução**:

```bash
# Para backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Para frontend
cd ../frontend-react
rm -rf node_modules package-lock.json
npm install
```

### Porta já está em uso

**Problema**: A porta 3001 (ou 5173) já está sendo usada.

**Soluções**:

1. Mude a porta no `.env`:

   ```properties
   PORT=3002  # backend
   ```

   ou

   ```bash
   npm run dev -- --port 3002  # frontend
   ```

2. Ou libere a porta:

   ```bash
   # Windows (PowerShell com admin)
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F

   # Linux/Mac
   lsof -i :3001
   kill -9 <PID>
   ```

---

## 📚 Recursos Adicionais

- **Documentação MongoDB**: https://docs.mongodb.com/
- **Express.js Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/

---

## 📧 Suporte

Se encontrar problemas:

1. Verifique o arquivo `.env` está correto
2. Rode `npm run check:config` para validar
3. Verifique os logs do servidor
4. Consulte este guia

---

**Última atualização**: 12 de novembro de 2025

Bom desenvolvimento! 🎉
