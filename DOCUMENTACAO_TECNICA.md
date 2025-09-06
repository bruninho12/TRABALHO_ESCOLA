# Documentação Técnica: Controle de Despesas

## Visão Geral da Arquitetura

Este sistema utiliza uma arquitetura distribuída com backend e frontend hospedados separadamente:

- **Backend**: Node.js/Express hospedado no Render.com
- **Frontend**: HTML/CSS/JavaScript hospedado no Vercel

## Configuração do Backend (Render)

O backend está configurado para deploy no Render através do arquivo `render.yaml`. Esta configuração:

1. Instala as dependências necessárias
2. Configura um volume persistente para os dados
3. Inicia o servidor Express na porta definida pelo ambiente

### Variáveis de Ambiente

- `NODE_ENV`: Define o ambiente de execução (production)
- `PORT`: Define a porta do servidor (3001)
- `RENDER`: Indica que o ambiente é o Render

## Configuração do Frontend (Vercel)

O frontend é estático e detecta automaticamente o ambiente para se conectar ao backend correto:

```javascript
const environments = {
  local: "http://localhost:3001",
  render: "https://controle-despesas-c7oj.onrender.com",
};
```

### Detecção de Ambiente

O frontend utiliza detecção automática para determinar qual URL do backend usar:

- Em localhost: API local
- Em qualquer outro ambiente: API do Render

## Conexão entre Frontend e Backend

### CORS

O backend está configurado para aceitar requisições de origens específicas, incluindo:

- Ambientes locais (localhost)
- Domínios do Vercel

### Autenticação

A autenticação é realizada via tokens JWT, armazenados no localStorage do navegador.

## Estrutura do Projeto

```
projeto/
├── backend/           # Servidor Node.js/Express
│   ├── index.js       # Ponto de entrada da aplicação
│   ├── package.json   # Dependências
│   └── data/          # Armazenamento persistente
├── frontend/          # Interface do usuário
│   ├── index.html     # HTML principal
│   ├── app.js         # Lógica JavaScript
│   └── style.css      # Estilos
├── render.yaml        # Configuração do Render
└── package.json       # Scripts para deploy/start
```

## Fluxo de Implantação

### Backend (Render)

1. Push para o GitHub
2. Render detecta mudanças e inicia o processo de build
3. Executa o buildCommand no render.yaml
4. Inicia o servidor com startCommand

### Frontend (Vercel)

1. Push para o GitHub
2. Vercel detecta mudanças e inicia o processo de build
3. Implanta os arquivos estáticos no CDN
4. Frontend se conecta ao backend no Render

## Tratamento de CORS

Para garantir a comunicação segura entre frontend e backend em diferentes domínios, implementamos:

1. Configuração de CORS no backend para permitir origens específicas
2. Handlers para requisições preflight OPTIONS
3. Técnicas de fallback para garantir compatibilidade em diferentes navegadores

## Solução de Problemas

### Problemas de CORS

Se ocorrerem problemas de CORS, verifique:

1. Se o domínio do frontend está na lista de allowedOrigins no backend
2. Se as requisições estão incluindo os cabeçalhos apropriados
3. Se o backend está respondendo corretamente às requisições preflight OPTIONS

### Falhas de Conexão

Se o frontend não conseguir se conectar ao backend:

1. Verifique se a URL do backend no environments está correta
2. Confirme que o backend está rodando (faça uma requisição direta)
3. Verifique os logs no console para mensagens de erro específicas
