# 💰 DespFinancee - Gestão Financeira Inteligente

<div align="center">

![DespFinancee Logo](https://img.shields.io/badge/DespFinancee-v2.0-6366F1?style=for-the-badge&logo=bitcoin&logoColor=white)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
[![React](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

**A primeira plataforma brasileira de finanças pessoais com IA e Gamificação** 🤖🎮

[Demo ao Vivo](http://localhost:5173) • [Documentação](http://localhost:3001/api-docs) • [Reportar Bug](https://github.com/bruninho12/despfinancee/issues)

</div>

---

## 🚀 O que é DespFinancee?

**DespFinancee** é uma plataforma revolucionária que transforma a forma como você gerencia suas finanças. Combinando **Inteligência Artificial**, **Gamificação RPG** e **Design Premium**, oferecemos uma experiência única e divertida para controlar seu dinheiro.

### 🎯 Por que escolher DespFinancee?

- 🤖 **IA Financeira**: 8 endpoints de Machine Learning analisando seus gastos
- 🎮 **Gamificação**: Sistema completo de níveis, avatares e batalhas
- 📊 **Score Financeiro**: Avaliação 0-100 da sua saúde financeira
- 💎 **Design Premium**: Glassmorphism + Framer Motion
- 🔐 **Segurança Máxima**: JWT, rate limiting, criptografia
- 💯 **100% Gratuito**: Sem planos pagos, sem anúncios

---

## ✨ Features Principais

### 🤖 Inteligência Artificial

```javascript
// Insights automáticos com IA
const insights = await getFinancialInsights();
// → Score: 85/100
// → Previsão próximo mês: R$ 3.450,00
// → Sugestão: "Reduza 15% em entretenimento"
```

- **Score Financeiro**: Cálculo inteligente de 0 a 100
- **Previsões**: ML prevendo despesas futuras
- **Padrões**: Detecção automática de comportamentos
- **Sugestões**: Recomendações personalizadas de economia

### 🎮 Gamificação RPG

- **Sistema de Níveis**: Ganhe XP ao economizar
- **Avatares Únicos**: Personalize seu personagem
- **Batalhas Financeiras**: Desafios mensais
- **Conquistas**: 50+ achievements para desbloquear
- **Recompensas**: Items e poderes especiais

### 📊 Análise Completa

- Dashboard em tempo real
- Gráficos interativos
- Exportação (PDF, Excel, CSV, JSON)
- Relatórios personalizados
- Comparação mensal/anual

### 🔄 Automação

- Transações recorrentes
- Notificações inteligentes
- Alertas de orçamento
- Backup automático

---

## 🎨 Design Premium

### Glassmorphism

```jsx
<GlassCard variant="primary" blur={15} opacity={0.15}>
  <Typography>Card com efeito vidro fosco</Typography>
</GlassCard>
```

### Animações Suaves

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Conteúdo animado
</motion.div>
```

### Paleta de Cores

- 🎨 99 variações de cores
- 🌈 10 gradientes premium
- 🌙 Dark mode (em breve)

---

## 📊 Comparação com Concorrentes

| Feature             | **DespFinancee** | Pierre Finance | Outros |
| ------------------- | :--------------: | :------------: | :----: |
| IA/Machine Learning | ✅ **SUPERIOR**  |       ❌       |   ❌   |
| Gamificação RPG     |   ✅ **ÚNICO**   |       ❌       |   ❌   |
| Score Financeiro    |        ✅        |       ❌       |   ⚠️   |
| Design Moderno      |        ✅        |       ⚠️       |   ⚠️   |
| Open Source         |        ✅        |       ❌       |   ❌   |
| 100% Gratuito       |        ✅        |       ❌       |   ⚠️   |
| Exportação Completa |        ✅        |       ⚠️       |   ❌   |
| Segurança Avançada  |        ✅        |       ✅       |   ⚠️   |

---

## 🚀 Começando

### Pré-requisitos

- Node.js 16+
- MongoDB 4.4+
- NPM ou Yarn

### Instalação Rápida

```bash
# Clone o repositório
git clone https://github.com/bruninho12/despfinancee.git
cd despfinancee

# Backend
cd backend
npm install
cp .env.example .env
# Configure MONGODB_URI no .env
npm start

# Frontend (novo terminal)
cd frontend
npm install
npm run dev
```

### Acesse

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

### Demo Rápida

```bash
# Usuário demo pré-configurado
Email: demo@despfinancee.com
Senha: demo123
```

---

## 📦 Estrutura do Projeto

```
DespFinancee/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Lógica de negócio
│   │   ├── models/           # Schemas MongoDB
│   │   ├── routes/           # Endpoints API
│   │   ├── utils/            # IA, exportação, etc
│   │   └── middleware/       # Auth, validation
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── pages/            # Páginas React
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── styles/           # Design System
│   │   └── services/         # API calls
│   └── vite.config.js
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── CONTRIBUTING.md
```

---

## 🛠️ Stack Tecnológico

### Backend

- **Node.js** + **Express** - API REST
- **MongoDB** + **Mongoose** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação API
- **Node-cron** - Agendamentos
- **PDFKit** - Geração de PDFs

### Frontend

- **React 18** - UI Library
- **Material-UI** - Componentes
- **Framer Motion** - Animações
- **Chart.js** - Gráficos
- **Axios** - HTTP Client
- **Vite** - Build tool

### IA/ML

- **TensorFlow.js** - Previsões (futuro)
- **Algoritmos proprietários** - Score, padrões
- **Análise preditiva** - Gastos futuros

---

## 📈 Roadmap

### ✅ Concluído (v2.0)

- [x] Sistema de autenticação completo
- [x] Dashboard com insights IA
- [x] Gamificação RPG
- [x] Exportação de dados
- [x] Design premium
- [x] 8 endpoints de IA

### 🚧 Em Desenvolvimento

- [ ] Open Banking (Pluggy)
- [ ] PWA (App instalável)
- [ ] Dark Mode completo
- [ ] Notificações Push
- [ ] Integração Stripe

### 🔮 Futuro (v3.0)

- [ ] App Mobile (React Native)
- [ ] Assistente de voz
- [ ] Marketplace de temas
- [ ] API pública
- [ ] Integrações (Nubank, PicPay)

---

## 🎬 Demo em Vídeo

### Como Gravar

1. **Introdução (10s)**

   - "Conheça o DespFinancee, a revolução em gestão financeira"

2. **Landing Page (15s)**

   - Scroll suave mostrando features
   - Destaque para comparação

3. **Login/Registro (10s)**

   - Demonstrar fluidez

4. **Dashboard (30s)**

   - Cards premium com glassmorphism
   - Gráficos animados
   - Botão "Ver Insights com IA"

5. **Insights IA (40s)**

   - Score financeiro em destaque
   - Previsões do próximo mês
   - Tendências por categoria
   - Sugestões inteligentes

6. **Gamificação (25s)**

   - Página RPG
   - Avatar e nível
   - Conquistas

7. **Exportação (15s)**

   - Exportar dados em PDF

8. **Conclusão (15s)**
   - "100% gratuito, open source, feito no Brasil"

**Total**: 2m 40s

---

## 📱 Para Redes Sociais

### LinkedIn Post

```
🚀 Acabei de lançar o DespFinancee - uma plataforma revolucionária de gestão financeira!

🤖 IA que analisa seus gastos e prevê o futuro
🎮 Gamificação RPG para tornar economia divertida
📊 Score financeiro de 0-100
💎 Design premium com glassmorphism
🔐 Segurança máxima
💯 100% GRATUITO e Open Source

Tecnologias: React, Node.js, MongoDB, TensorFlow, Material-UI

🔗 GitHub: [link]
🌐 Demo: [link]

#FinTech #OpenSource #ReactJS #NodeJS #IA #Gamification
```

### Twitter Thread

```
🧵 Thread: Como criar uma FinTech em 2025

1/ Acabei de lançar DespFinancee - gestão financeira com IA e gamificação RPG 🤖🎮

2/ Features únicas:
- 8 endpoints de IA analisando gastos
- Score financeiro 0-100
- Previsões com Machine Learning
- Sistema RPG completo

3/ Stack tech moderna:
- React 18 + Vite
- Node.js + Express
- MongoDB + Mongoose
- Framer Motion
- Material-UI

4/ Diferencial competitivo:
✅ IA (vs. Pierre Finance ❌)
✅ Gamificação (vs. todos ❌)
✅ 100% Gratuito
✅ Open Source

5/ Resultado:
- Design premium
- 10+ features avançadas
- Zero bugs
- 100% funcional

6/ Próximos passos:
- Open Banking
- PWA instalável
- App mobile

Explore: [github_link]
Demo: [demo_link]

#100DaysOfCode #React #FinTech
```

### Reddit Post (r/webdev)

```markdown
[Showcase] DespFinancee - FinTech com IA e Gamificação (React + Node.js)

Olá r/webdev! Criei uma plataforma de gestão financeira que combina IA e gamificação RPG.

**Por que é diferente:**

- IA analisando gastos com 8 endpoints
- Gamificação RPG completa (níveis, avatares, batalhas)
- Score financeiro calculado por ML
- Design premium (glassmorphism + animações)
- 100% gratuito e open source

**Stack:**
Frontend: React 18, Material-UI, Framer Motion, Chart.js
Backend: Node.js, Express, MongoDB, JWT
IA: Algoritmos proprietários + TensorFlow.js (futuro)

**Features:**

- Dashboard em tempo real
- Exportação (PDF/Excel/CSV)
- Transações recorrentes
- Notificações inteligentes
- Swagger docs completa

**Comparação:**
vs. Pierre Finance: ✅ IA, ✅ Gamificação, ✅ Gratuito
vs. Outros: Design superior, features únicas

GitHub: [link]
Demo: [link]
Docs: [link]

Feedback é muito bem-vindo! 🚀
```

---

## 🤝 Contribuindo

Adoraríamos sua contribuição! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para começar.

### Áreas para Contribuir

- 🐛 **Bug fixes** - Reporte ou corrija bugs
- ✨ **Features** - Implemente novas funcionalidades
- 📝 **Documentação** - Melhore a docs
- 🎨 **Design** - Crie novos temas
- 🌍 **i18n** - Traduções

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Bruno Souza**

- GitHub: [@bruninho12](https://github.com/bruninho12)
- LinkedIn: [Seu LinkedIn]
- Email: contato@despfinancee.com

---

## 🌟 Apoie o Projeto

Se você gostou do DespFinancee, considere:

- ⭐ Dar uma estrela no GitHub
- 🐦 Compartilhar no Twitter
- 💼 Compartilhar no LinkedIn
- 🐛 Reportar bugs
- 💡 Sugerir features
- 🤝 Contribuir com código

---

## 📊 Status

![GitHub Stars](https://img.shields.io/github/stars/bruninho12/despfinancee?style=social)
![GitHub Forks](https://img.shields.io/github/forks/bruninho12/despfinancee?style=social)
![GitHub Issues](https://img.shields.io/github/issues/bruninho12/despfinancee)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/bruninho12/despfinancee)

---

<div align="center">

**Feito com ❤️ no Brasil** 🇧🇷

[⬆ Voltar ao topo](#-despfinancee---gestão-financeira-inteligente)

</div>
