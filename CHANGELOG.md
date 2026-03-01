# Changelog - DespFinancee

Este arquivo registra mudanças relevantes entre versões.

## [2.0.0] - Estrutura atual do projeto

- Backend em Node.js/Express com MongoDB.
- Frontend em React 18 + Vite.
- Sistema de autenticação com JWT.
- Painel financeiro com dashboards, relatórios e gamificação.

## [2.0.x] - Ajustes de qualidade e segurança (Codex)

- Padronização da variável `MONGO_URI` em exemplos de `.env`.
- Correção de bug em atualização de transações (`category`).
- Melhoria na validação do JWT (`JWT_SECRET` obrigatório em produção).
- Ajustes em CORS para usar `CORS_ORIGIN` e múltiplas origens.
- Correção e criação de scripts utilitários (`check:config`, `check:security`, `demo:reset`).
- Unificação do fluxo de token no frontend (`SESSION_CONFIG.tokenKey`).

Próximas entradas podem detalhar novas features, correções e alterações de API.

