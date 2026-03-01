# 💰 DespFinancee - Gerenciador de Finanças Pessoais


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

> 📱 **Quer publicar o projeto?** Escolha sua opção:
>
> ### 🟩 **VPS Hostinger - RECOMENDADO** 🏆
>
> - 🚀 [**Deploy VPS Profissional**](DEPLOY_VPS_HOSTINGER.md) - R$ 25-49/mês, máxima performance
> - ⚖️ [**Comparação Completa**](COMPARACAO_DEPLOY.md) - VPS vs Grátis
>
> ### 🟦 **Plataformas Gratuitas**
>
> - ⚡ [**Deploy Grátis (30min)**](DEPLOY_GUIDE.md) - Vercel + Render (limitado)
> - 📊 [**Resumo Executivo**](RESUMO_PUBLICACAO.md) - Visão geral
> - 📋 [**Checklist Completo**](CHECKLIST_PUBLICACAO.md) - Tudo que precisa

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
cp ../config/.env.backend.example .env
# Configure suas variáveis no .env
npm run db:setup
npm run seed
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp ../config/.env.frontend.example .env
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
├── 📁 config/                  # Configurações centralizadas (.env.example)
├── 📁 docs/                    # Documentação completa
│   ├── 📁 guides/              # Guias de setup e uso
│   ├── 📁 security/            # Documentação de segurança
│   └── 📁 checklists/          # Checklists e features
├── 📁 deployment/              # Configurações de deploy
│   ├── 📁 docker/              # Docker files
│   └── 📁 platforms/           # Configs por plataforma
├── 📁 scripts/                 # Scripts do projeto
├── 📁 backend/                 # API Node.js + Express
│   ├── 📁 src/                 # Código fonte
│   │   ├── 📁 config/          # Configurações (DB, Security, Swagger)
│   │   ├── 📁 controllers/     # Controladores da API
│   │   ├── 📁 middleware/      # Middlewares (auth, validation, security)
│   │   ├── 📁 models/          # Modelos Mongoose
│   │   ├── 📁 routes/          # Rotas da API
│   │   ├── 📁 services/        # Serviços de negócio (insights, etc)
│   │   ├── 📁 utils/           # Utilitários (logger, email, validation)
│   │   └── 📁 swagger/         # Documentação API
│   ├── 📁 scripts/             # Scripts de manutenção
│   │   ├── 📁 database/        # Scripts de banco de dados
│   │   ├── 📁 setup/           # Scripts de configuração
│   │   ├── 📁 rpg/             # Scripts do sistema RPG
│   │   └── 📁 tests/           # Scripts de teste
│   ├── 📁 logs/                # Logs do sistema (apenas README)
│   └── 📁 exports/             # Exports temporários
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
    │   ├── 📁 tests/           # Testes (incluindo scripts movidos)
    │   └── 📁 assets/          # Assets estáticos
    │       ├── 📁 images/      # Imagens
    │       └── 📁 icons/       # Ícones
    └── 📁 public/              # Arquivos públicos (PWA)
```

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

## 📚 Documentação

### 🚀 Guias de Publicação (NOVO!)

- 📊 [**Resumo Executivo**](RESUMO_PUBLICACAO.md) - O que falta para publicar (COMECE AQUI!)
- 📋 [**Checklist Completo**](CHECKLIST_PUBLICACAO.md) - Lista detalhada de tudo
- ⚡ [**Deploy em 30min**](DEPLOY_GUIDE.md) - Guia rápido passo-a-passo
- 🗺️ [**Roadmap Visual**](ROADMAP_PUBLICACAO.md) - Timeline e diagrama
- 🆘 [**Troubleshooting**](TROUBLESHOOTING.md) - Problemas comuns e soluções
- 📚 [**Índice Completo**](INDICE_DOCUMENTACAO.md) - Todos os documentos

### 📖 Guias Principais

- 📖 [Guia de Setup Completo](docs/guides/SETUP_GUIDE.md)
- 📖 [Guia de Uso](docs/guides/USAGE_GUIDE.md)
- 🛡️ [Guia de Segurança](docs/security/SECURITY_GUIDE.md)
- 📊 [Status de Segurança](docs/security/STATUS_SEGURANCA_FINAL.md)

### 🤝 Contribuição

- 🤝 [Como Contribuir](CONTRIBUTING.md)
- 📝 [Changelog](CHANGELOG.md)
- ⚖️ [Licença](LICENSE)

### ✅ Checklists e Features

- ✅ [Checklist de Integração](docs/checklists/INTEGRATION_TEST_CHECKLIST.md)
- ♿ [Acessibilidade](docs/checklists/ACCESSIBILITY_ARIA_HIDDEN_FIX_v2.md)
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

## 📚 API Endpoints

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/refresh-token` - Renovar token

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

## 🚀 Deploy

### Produção

1. **Configure as variáveis de ambiente de produção**
2. **Execute verificação de segurança**: `npm run production:check`
3. **Build do frontend**: `npm run build:production`
4. **Deploy do backend** com HTTPS habilitado
5. **Configure MongoDB Atlas** com IP whitelist
6. **Configure domínio** e certificados SSL

📖 [Guia Completo de Deploy](docs/guides/SETUP_GUIDE.md#produção)

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

Veja [docs/guides/SETUP_GUIDE.md](docs/guides/SETUP_GUIDE.md) para mais detalhes.

## 📊 Roadmap

- [ ] Sistema de backup automático
- [ ] Testes unitários e integração
- [ ] Autenticação OAuth (Google, GitHub)
- [ ] Aplicativo mobile (React Native)
- [ ] Export de relatórios em PDF/Excel
- [ ] Integração com bancos
- [ ] Sistema de metas financeiras
- [ ] Planejamento de aposentadoria

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Por favor, leia o [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre o processo.

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

Veja também: [CHANGELOG.md](CHANGELOG.md) para histórico de versões.

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
