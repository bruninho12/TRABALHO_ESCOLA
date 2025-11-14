# 💰 DespFinancee - Gerenciador de Finanças Pessoais

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![Security](https://img.shields.io/badge/Security-94%2F100-brightgreen)](docs/security/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> Uma aplicação web completa para gerenciamento e controle de finanças pessoais com dashboard interativo, análise de gastos, gamificação e sistema de pagamentos integrado.

## ✨ Características

- 🔐 **Autenticação segura** com JWT e rate limiting
- 📊 **Dashboard interativo** com gráficos em tempo real
- 💳 **Gerenciamento de transações** (receitas e despesas)
- 🏷️ **Categorias customizáveis** para organizar gastos
- 💼 **Orçamentos inteligentes** com alertas automáticos
- 📈 **Relatórios avançados** com análise de tendências
- 🔔 **Notificações em tempo real** de limites e metas
- 🎮 **Sistema de gamificação** com avatares e conquistas
- 💳 **Pagamentos integrados** (Stripe + MercadoPago)
- 🛡️ **Segurança avançada** (Score: 94/100)
- 📱 **Design responsivo** para todos os dispositivos
- 🌙 **Modo claro/escuro** personalizável

## 🚀 Quick Start

### Pré-requisitos

- Node.js 16+ instalado
- MongoDB Atlas (ou MongoDB local)
- npm ou yarn

### 1. Clone e Configure

```bash
git clone https://github.com/bruninho12/TRABALHO_ESCOLA.git
cd DespFinancee
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Configure suas variáveis no .env
npm run db:setup
npm run seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL no .env
npm run dev
```

### 4. Acesse a Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Documentação**: http://localhost:3001/api-docs

**Login Demo:**

- Email: `demo@despfinancee.com`
- Senha: `senha123`

## 📁 Estrutura do Projeto

```
DespFinancee/
├── 📁 docs/                    # Documentação completa
│   ├── 📁 guides/              # Guias de setup e uso
│   ├── 📁 security/            # Documentação de segurança
│   └── 📁 checklists/          # Checklists e features
├── 📁 backend/                 # API Node.js + Express
│   ├── 📁 src/                 # Código fonte
│   │   ├── 📁 config/          # Configurações (DB, Security, Swagger)
│   │   ├── 📁 controllers/     # Controladores da API
│   │   ├── 📁 middleware/      # Middlewares (auth, validation, security)
│   │   ├── 📁 models/          # Modelos Mongoose
│   │   ├── 📁 routes/          # Rotas da API
│   │   ├── 📁 utils/           # Utilitários (logger, email, validation)
│   │   └── 📁 swagger/         # Documentação API
│   ├── 📁 scripts/             # Scripts de manutenção
│   │   ├── 📁 database/        # Scripts de banco de dados
│   │   └── 📁 setup/           # Scripts de configuração
│   ├── 📁 logs/                # Logs da aplicação
│   └── 📁 templates/           # Templates de email
└── 📁 frontend/                # React + Vite
    ├── 📁 src/                 # Código fonte
    │   ├── 📁 components/      # Componentes React
    │   ├── 📁 pages/           # Páginas da aplicação
    │   ├── 📁 services/        # Serviços (API calls)
    │   ├── 📁 hooks/           # Custom hooks
    │   ├── 📁 contexts/        # React contexts
    │   ├── 📁 config/          # Configurações do cliente
    │   ├── 📁 utils/           # Funções auxiliares
    │   ├── 📁 styles/          # Estilos globais
    │   └── 📁 assets/          # Assets estáticos
    │       ├── 📁 images/      # Imagens
    │       └── 📁 icons/       # Ícones
    └── 📁 public/              # Arquivos públicos
```

## 🛡️ Segurança

O projeto implementa as melhores práticas de segurança:

- ✅ **Rate Limiting** adaptável por endpoint
- ✅ **Validação e sanitização** rigorosa de inputs
- ✅ **Headers de segurança** (CSP, HSTS, etc.)
- ✅ **Logging de auditoria** para operações críticas
- ✅ **Detecção de anomalias** automatizada
- ✅ **Tokens JWT** seguros com refresh
- ✅ **0 vulnerabilidades** no frontend
- ✅ **Score de segurança: 94/100**

📖 [Guia Completo de Segurança](docs/security/SECURITY_GUIDE.md)

## 🛠️ Stack Tecnológico

### Backend

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **Docs**: Swagger/OpenAPI
- **Logging**: Winston + Sentry
- **Payments**: Stripe + MercadoPago

### Frontend

- **Framework**: React 18 + Vite
- **UI**: Material-UI (MUI)
- **Charts**: Chart.js + Recharts
- **HTTP**: Axios
- **Routing**: React Router 6
- **State**: React Query + Context
- **Forms**: Controlled components
- **Security**: CSP + Input validation

## 📚 Documentação

### Guias Principais

- 📖 [Guia de Setup Completo](docs/guides/SETUP_GUIDE.md)
- 📖 [Guia de Uso](docs/guides/USAGE_GUIDE.md)
- 🛡️ [Guia de Segurança](docs/security/SECURITY_GUIDE.md)
- 📊 [Status de Segurança](docs/security/STATUS_SEGURANCA_FINAL.md)

### Checklists e Features

- ✅ [Checklist de Integração](docs/checklists/INTEGRATION_TEST_CHECKLIST.md)
- ♿ [Acessibilidade](docs/checklists/ACCESSIBILITY_ARIA_HIDDEN_FIX.md)
- 🎮 [Gamificação](docs/checklists/FEEDBACK_GAMIFICACAO.md)
- 📱 [Publicação](docs/checklists/PUBLICACAO_INFRA.md)

## 🔧 Scripts Disponíveis

### Backend

```bash
# Desenvolvimento
npm run dev              # Servidor com hot-reload
npm start               # Servidor de produção

# Database
npm run db:setup        # Configurar MongoDB
npm run db:seed         # Popular com dados demo
npm run db:clean        # Limpar banco
npm run db:check        # Verificar conexão
npm run db:test         # Testar conectividade

# Segurança
npm run security:check  # Auditoria completa
npm run logs:security   # Monitorar logs de segurança

# Qualidade
npm run lint            # Verificar código
npm run test            # Executar testes
```

### Frontend

```bash
# Desenvolvimento
npm run dev             # Servidor de desenvolvimento
npm run build           # Build para produção
npm run preview         # Preview da build

# Segurança
npm run security:check  # Auditoria completa
npm run lint           # Verificar código

# Utilitários
npm run clean          # Limpar cache
```

## 🌟 Features em Destaque

### 💰 Gestão Financeira

- Dashboard com visão geral das finanças
- Categorização automática de transações
- Orçamentos com alertas inteligentes
- Relatórios personalizáveis
- Metas financeiras

### 🎮 Gamificação

- Sistema de avatares personalizáveis
- Conquistas por objetivos financeiros
- Sistema de pontuação (XP)
- Níveis e progressão
- Recompensas virtuais

### 💳 Pagamentos

- Integração com Stripe (cartões)
- Integração com MercadoPago (PIX, boleto)
- Webhook para confirmações
- Dashboard de transações
- Relatórios financeiros

### 🛡️ Segurança Avançada

- Rate limiting específico por endpoint
- Detecção de padrões suspeitos
- Logs de auditoria detalhados
- Validação rigorosa de inputs
- Headers de segurança

## 🚀 Deploy

### Produção

1. **Configure as variáveis de ambiente de produção**
2. **Execute verificação de segurança**: `npm run production:check`
3. **Build do frontend**: `npm run build:production`
4. **Deploy do backend** com HTTPS habilitado
5. **Configure MongoDB Atlas** com IP whitelist
6. **Configure domínio** e certificados SSL

📖 [Guia Completo de Deploy](docs/guides/SETUP_GUIDE.md#produção)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Bruno Souza**

- GitHub: [@bruninho12](https://github.com/bruninho12)
- Projeto: [TRABALHO_ESCOLA](https://github.com/bruninho12/TRABALHO_ESCOLA)

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/bruninho12/TRABALHO_ESCOLA/issues)
- 📖 **Docs**: [docs/](docs/)
- 🛡️ **Security**: [docs/security/](docs/security/)

---

<div align="center">

**Desenvolvido com ❤️ para uma gestão financeira inteligente**

⭐ **Se este projeto foi útil, considere dar uma estrela!** ⭐

</div>

## 🛠️ Stack Tecnológico

### Backend

- **Node.js** + **Express.js** - Servidor web
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Bcrypt** - Criptografia de senhas

### Frontend

- **React 18** - Interface do usuário
- **Vite** - Build tool moderno
- **Material-UI** - Componentes UI
- **Axios** - Cliente HTTP
- **React Router** - Navegação
- **React Query** - Gerenciamento de estado
- **Chart.js** - Gráficos

## 📁 Estrutura do Projeto

```
DespFinancee/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações (DB, Swagger)
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── middleware/      # Middlewares (auth, erros)
│   │   ├── models/          # Modelos Mongoose
│   │   ├── routes/          # Rotas da API
│   │   ├── seeders/         # Scripts de população de dados
│   │   ├── swagger/         # Documentação API
│   │   └── utils/           # Utilitários
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend-react/
    ├── src/
    │   ├── components/      # Componentes React
    │   ├── pages/           # Páginas da aplicação
    │   ├── services/        # Serviços (API)
    │   ├── hooks/           # Custom hooks
    │   ├── contexts/        # Context API
    │   ├── styles/          # Estilos globais
    │   ├── utils/           # Funções auxiliares
    │   └── App.jsx          # App principal
    ├── package.json
    ├── .env.example
    ├── vite.config.js
    └── README.md
```

## 🚀 Quick Start

### Pré-requisitos

- Node.js 14+
- MongoDB (local ou Atlas)
- npm ou yarn

### Instalação Rápida

1. **Clone o repositório**

```bash
git clone https://github.com/seu-usuario/DespFinancee.git
cd DespFinancee
```

2. **Configure e inicie o Backend**

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais MongoDB
npm run seed
npm run dev
```

3. **Em outro terminal, configure e inicie o Frontend**

```bash
cd frontend-react
npm install
cp .env.example .env
npm run dev
```

4. **Acesse a aplicação**

- Aplicação: http://localhost:5173
- API Docs: http://localhost:3001/api-docs

5. **Faça login com as credenciais demo**

```
Email: demo@despfinancee.com
Senha: senha123
```

## 📖 Documentação Completa

Para um guia detalhado de setup, veja [SETUP_GUIDE.md](./SETUP_GUIDE.md)

### Documentação por Componente

- [Backend README](./backend/README.md)
- [Frontend README](./frontend-react/README.md)
- [Seeders](./backend/src/seeders/README.md)
- [Swagger/API Docs](./backend/src/swagger/README.md)
- [Utilitários](./backend/src/utils/README.md)

## 📚 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/refresh-token` - Renovar token

### Usuários

- `GET /api/users/profile` - Obter perfil
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/settings` - Obter configurações
- `PUT /api/users/settings` - Atualizar configurações

### Transações

- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Deletar transação

### Categorias

- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria
- `PUT /api/categories/:id` - Atualizar categoria
- `DELETE /api/categories/:id` - Deletar categoria

### Orçamentos

- `GET /api/budgets` - Listar orçamentos
- `POST /api/budgets` - Criar orçamento
- `PUT /api/budgets/:id` - Atualizar orçamento
- `DELETE /api/budgets/:id` - Deletar orçamento

### Relatórios

- `GET /api/reports/monthly` - Relatório mensal
- `GET /api/reports/categories` - Relatório por categoria
- `GET /api/reports/trends` - Tendências

Para documentação interativa, acesse: http://localhost:3001/api-docs

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT com refresh tokens
- Validação de entrada com Joi
- Protection contra CORS
- Rate limiting em endpoints públicos
- Helmet.js para headers de segurança

## 🧪 Scripts Disponíveis

### Backend

```bash
npm run dev              # Iniciar em desenvolvimento
npm start               # Iniciar em produção
npm run seed            # Popular banco de dados
npm run test:connection # Testar conexão DB
npm run check:config    # Validar configuração
npm run demo:reset      # Resetar usuário demo
npm run test            # Rodar testes
```

### Frontend

```bash
npm run dev      # Iniciar desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
npm run lint     # Verificar linting
```

## 🐛 Solução de Problemas

### MongoDB não conecta

- Verifique se a `MONGO_URI` está correta
- Se usar MongoDB Atlas, adicione seu IP à whitelist
- Execute `npm run test:connection` para diagnosticar

### CORS Error

- Verifique se `VITE_API_URL` está correto no frontend
- Verifique se `CORS_ORIGIN` no backend permite sua origem

### Usuário demo não funciona

- Execute `npm run seed` para recriar dados
- Use `npm run demo:reset` para resetar senha

Veja [SETUP_GUIDE.md](./SETUP_GUIDE.md) para mais detalhes.

## 📊 Roadmap

- [ ] Sistema de backup automático
- [ ] Testes unitários e integração
- [ ] Autenticação OAuth (Google, GitHub)
- [ ] Aplicativo mobile (React Native)
- [ ] Export de relatórios em PDF/Excel
- [ ] Integração com bancos
- [ ] Sistema de metas financeiras
- [ ] Planejamento de aposentadoria

## 📝 Changelog

### v1.0.0 (2025-11-12)

- ✅ Setup inicial do projeto
- ✅ Autenticação com JWT
- ✅ CRUD de transações
- ✅ Sistema de categorias
- ✅ Orçamentos
- ✅ Dashboard com gráficos
- ✅ Relatórios básicos
- ✅ Documentação Swagger

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**Bruno Souza**

- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: contato@despfinancee.com

## 📞 Contato & Suporte

- 📧 Email: contato@despfinancee.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/DespFinancee/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/DespFinancee/discussions)

---

<div align="center">

Made with ❤️ for better financial management

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
