# 💰 Sistema de Controle de Despesas Pessoais

Um sistema completo para gerenciar suas finanças pessoais, permitindo controlar receitas, despesas e visualizar relatórios financeiros.

## 🚀 Funcionalidades

### 🔐 Autenticação

- **Login de usuário** - Acesso seguro ao sistema
- **Cadastro de novos usuários** - Criação de conta personalizada
- **Logout** - Saída segura do sistema

### 📊 Dashboard Financeiro

- **Resumo financeiro** - Visualização das receitas, despesas e saldo
- **Categorias de gastos** - Organização por categoria
- **Cards informativos** - Interface clara e intuitiva

### 💸 Gestão de Despesas

- **Adicionar despesas** - Registro de gastos com categoria e data
- **Listar despesas** - Visualização de todas as despesas
- **Excluir despesas** - Remoção de registros desnecessários

### 💰 Gestão de Receitas

- **Adicionar receitas** - Registro de ganhos com categoria e data
- **Listar receitas** - Visualização de todas as receitas
- **Excluir receitas** - Remoção de registros desnecessários

### 📈 Relatórios

- **Histórico completo** - Visualização de todas as transações
- **Exportação para Excel** - Download de relatórios em planilha
- **Análise por categoria** - Agrupamento de gastos

## 🛠️ Tecnologias Utilizadas

### Backend

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **CORS** - Controle de acesso
- **XLSX** - Geração de planilhas Excel

### Frontend

- **HTML5** - Estrutura da interface
- **CSS3** - Estilização moderna
- **JavaScript (Vanilla)** - Interatividade
- **Design Responsivo** - Compatível com mobile

## 📁 Estrutura do Projeto

```
projeto/
├── backend/
│   ├── index.js          # Servidor principal
│   ├── package.json      # Dependências do backend
│   ├── Procfile         # Configuração para deploy
│   └── railway.toml     # Configuração Railway
├── frontend/
│   ├── index.html       # Página principal
│   ├── app.js          # Lógica do frontend
│   ├── style.css       # Estilos
│   ├── package.json    # Dependências do frontend
│   └── netlify/        # Configuração para deploy
└── README.md           # Este arquivo
```

## 🔧 Instalação e Execução

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## 👤 Usuários de Teste

Para facilitar os testes, existem usuários pré-cadastrados:

- **Email:** bruno@exemplo.com | **Senha:** 123456
- **Email:** maria@exemplo.com | **Senha:** 123456

## 🎨 Interface

### Tela de Login

- Interface moderna com gradiente azul
- Formulário de login e cadastro
- Validação de campos

### Dashboard

- Cards com resumo financeiro
- Gráfico de despesas por categoria
- Navegação por abas

### Gestão de Transações

- Formulários intuitivos
- Listagem organizada
- Ações rápidas (excluir)

## 🌐 Deploy

### Backend (Railway)

O backend está configurado para deploy no Railway com:

- Variáveis de ambiente
- Health check
- Auto-deploy
- Persistência de dados
- Sem limitação de timeout

### Frontend (Netlify/Vercel)

O frontend está configurado para deploy no Netlify ou Vercel com:

- Build automático
- CDN global
- HTTPS gratuito

## 📊 Funcionalidades do Sistema

### API Endpoints

- `POST /login` - Autenticar usuário
- `POST /cadastro` - Cadastrar novo usuário
- `GET /despesas` - Listar transações do usuário
- `POST /despesas` - Adicionar nova transação
- `PUT /despesas/:id` - Atualizar transação
- `DELETE /despesas/:id` - Excluir transação
- `GET /resumo` - Obter resumo financeiro
- `GET /exportar` - Exportar para Excel

## 👤 Usuários de Teste

Para facilitar os testes, existem usuários pré-cadastrados:

- **Email:** bruno@exemplo.com | **Senha:** 123456
- **Email:** maria@exemplo.com | **Senha:** 123456

## 🔒 Como Testar

1. Acesse a aplicação
2. Faça login com um dos usuários de teste
3. Explore as funcionalidades:
   - Adicione despesas e receitas
   - Visualize o dashboard
   - Exporte relatórios
   - Teste a responsividade

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:

- Desktop (1200px+)
- Tablet (768px-1199px)
- Mobile (até 767px)

## 👥 Desenvolvido por

**Sistema de Controle de Despesas Pessoais**

- Tecnologias modernas e interface intuitiva
- Desenvolvido em 2025

---

⭐ **Sistema de Controle de Despesas** - Gerencie suas finanças de forma simples e eficiente!
