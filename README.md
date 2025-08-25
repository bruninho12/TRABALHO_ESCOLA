# InovaTech - Sistema de Gestão de Estoque

Este projeto é um sistema de gerenciamento de estoque para produtos tecnológicos, desenvolvido com JavaScript, Node.js e Express.

## Estrutura do Projeto

- **frontend/**: Interface de usuário em HTML, CSS e JavaScript
- **backend/**: API REST construída com Node.js e Express

## Funcionalidades

- Cadastro e listagem de produtos
- Edição e exclusão de produtos
- Exportação para Excel
- Visualização detalhada de produtos
- Interface responsiva e moderna

## Como Executar Localmente

### Backend

```bash
cd backend
npm install
npm start
```

O servidor estará disponível em `http://localhost:3001`

### Frontend

Abra o arquivo `frontend/index.html` em um navegador web ou utilize uma extensão como Live Server no VS Code.

## Como Fazer Deploy

### Backend (Railway)

1. Crie uma conta no [Railway](https://railway.app/)
2. No dashboard do Railway, clique em "New Project" > "Deploy from GitHub"
3. Selecione o repositório e a pasta backend do projeto
4. Railway detectará automaticamente o projeto Node.js e fará o deploy
5. Anote a URL fornecida pela Railway para uso no frontend

### Frontend (Vercel)

1. Crie uma conta no [Vercel](https://vercel.com/)
2. No dashboard do Vercel, clique em "Add New" > "Project"
3. Selecione o repositório e a pasta frontend do projeto
4. Configure as seguintes opções:
   - Framework Preset: Other
   - Root Directory: frontend
   - Build Command: deixe em branco
   - Output Directory: deixe em branco
5. Clique em "Deploy"

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **Exportação de dados**: XLSX

## Projeto Desenvolvido por

Grupo InovaTech © 2025
