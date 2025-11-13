# 💰 DespFinancee - Gerenciador de Finanças Pessoais

[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

> Uma aplicação web completa para gerenciamento e controle de finanças pessoais com dashboard interativo, análise de gastos e orçamentos.

## ✨ Características

- 🔐 **Autenticação segura** com JWT
- 📊 **Dashboard interativo** com gráficos em tempo real
- 💳 **Gerenciamento de transações** (receitas e despesas)
- 🏷️ **Categorias customizáveis** para organizar gastos
- 💼 **Orçamentos** para controlar gastos por categoria
- 📈 **Relatórios** com análise de tendências
- 🔔 **Notificações** de limites de orçamento
- 🎨 **Interface moderna** com Material-UI
- 📱 **Design responsivo** para todos os dispositivos
- 🌙 **Modo claro/escuro** (tema personalizável)

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
