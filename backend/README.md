# DespFinancee - Backend

Este é o backend da aplicação DespFinancee para gerenciamento financeiro pessoal. Esta versão utiliza MongoDB como banco de dados, para mais detalhes veja em: (# DespFinancee MongoDB) nesse documento mais abaixo.

## Requisitos

- Node.js 14.x ou superior
- MongoDB 4.4 ou superior (local ou MongoDB Atlas)

## Configuração do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/despfinancee.git
cd despfinancee/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações específicas, incluindo a URL de conexão do MongoDB.

4. Popule o banco de dados com dados de exemplo:

```bash
npm run seed
```

5. Ou use o script de inicialização rápida que popula o banco e inicia o servidor:

**Windows**:

```bash
start-with-data.bat
```

**Linux/Mac**:

```bash
chmod +x start-with-data.sh
./start-with-data.sh
```

## Execução

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Para iniciar o servidor em modo de produção:

```bash
npm start
```

O servidor estará disponível em `http://localhost:3001` (ou na porta definida no arquivo .env).

A documentação da API estará disponível em `http://localhost:3001/api-docs`.

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/         # Configurações (banco de dados, etc)
│   ├── controllers/    # Controladores da API
│   ├── middleware/     # Middlewares (autenticação, validação, etc)
│   ├── models/         # Modelos de dados
│   │   └── mongo/      # Modelos MongoDB (Mongoose)
│   ├── routes/         # Rotas da API
│   ├── seeders/        # Seeders para popular o banco de dados
│   ├── utils/          # Funções utilitárias
│   └── index.js        # Ponto de entrada da aplicação
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Dependências e scripts
└── README.md           # Este arquivo
```

## API Endpoints

### Autenticação

- `POST /api/v1/auth/register` - Registro de novo usuário
- `POST /api/v1/auth/login` - Login de usuário
- `POST /api/v1/auth/refresh` - Atualizar token de acesso
- `POST /api/v1/auth/logout` - Logout de usuário

### Usuários

- `GET /api/v1/users/profile` - Obter perfil do usuário
- `PUT /api/v1/users/profile` - Atualizar perfil do usuário
- `GET /api/v1/users/settings` - Obter configurações do usuário
- `PUT /api/v1/users/settings` - Atualizar configurações do usuário

### Transações

- `GET /api/v1/transactions` - Listar transações
- `GET /api/v1/transactions/:id` - Obter detalhes de uma transação
- `POST /api/v1/transactions` - Criar nova transação
- `PUT /api/v1/transactions/:id` - Atualizar uma transação
- `DELETE /api/v1/transactions/:id` - Excluir uma transação

### Categorias

- `GET /api/v1/categories` - Listar categorias
- `GET /api/v1/categories/:id` - Obter detalhes de uma categoria
- `POST /api/v1/categories` - Criar nova categoria
- `PUT /api/v1/categories/:id` - Atualizar uma categoria
- `DELETE /api/v1/categories/:id` - Excluir uma categoria

### Orçamentos

- `GET /api/v1/budgets` - Listar orçamentos
- `GET /api/v1/budgets/:id` - Obter detalhes de um orçamento
- `POST /api/v1/budgets` - Criar novo orçamento
- `PUT /api/v1/budgets/:id` - Atualizar um orçamento
- `DELETE /api/v1/budgets/:id` - Excluir um orçamento

### Relatórios

- `GET /api/v1/reports/monthly` - Relatório mensal
- `GET /api/v1/reports/category` - Relatório por categoria
- `GET /api/v1/reports/trends` - Tendências de gastos

### Notificações

- `GET /api/v1/notifications` - Listar notificações
- `PUT /api/v1/notifications/:id/read` - Marcar notificação como lida
- `DELETE /api/v1/notifications/:id` - Excluir uma notificação

//-----------------------------------------------------------//

# DespFinancee MongoDB

Este documento descreve as atualizações realizadas no projeto DespFinancee para utilizar o MongoDB como banco de dados.

## Funcionalidades Implementadas

1. **Conexão com MongoDB Atlas**

   - Configuração de conexão com o MongoDB Atlas
   - Migração dos modelos de Sequelize para Mongoose

2. **Seeders para Dados Iniciais**

   - Criação de usuário demo
   - Categorias padrão
   - Transações de exemplo
   - Orçamentos de exemplo
   - Notificações de exemplo

3. **Documentação Swagger**
   - Documentação completa da API
   - Interface interativa para testar endpoints
   - Modelos e esquemas documentados

## Como Usar

### Requisitos

- Node.js 14+ instalado
- MongoDB Atlas (ou MongoDB local configurado)
- Variáveis de ambiente configuradas (ver `.env.example`)

### Configuração Inicial

1. Clone o repositório
2. Instale as dependências:

```
npm install
```

3. Configure as variáveis de ambiente:

```
MONGO_URI=sua_string_de_conexao_mongodb
JWT_SECRET=seu_token_jwt
PORT=3001
NODE_ENV=development
```

### Populando o Banco de Dados

Para popular o banco de dados com dados iniciais, execute:

```
npm run seed
```

Este comando irá criar:

- Usuário demo (email: demo@despfinancee.com, senha: senha123)
- Categorias padrão para receitas e despesas
- Transações de exemplo
- Orçamentos de exemplo
- Notificações de exemplo

### Iniciando o Servidor

Para iniciar o servidor em modo de desenvolvimento:

```
npm run dev
```

Ou utilize o script de inicialização rápida que popula o banco e inicia o servidor:

**Windows**:

```
start-with-data.bat
```

**Linux/Mac**:

```
chmod +x start-with-data.sh
./start-with-data.sh
```

### Acessando a Documentação

A documentação Swagger está disponível em:

```
http://localhost:3001/api-docs
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── config/
│   │   ├── mongoConfig.js      # Configuração de conexão MongoDB
│   │   └── swagger.js          # Configuração do Swagger
│   ├── controllers/            # Controladores da aplicação
│   ├── middleware/             # Middlewares (auth, error handling)
│   ├── models/
│   │   └── mongo/              # Modelos Mongoose
│   ├── routes/                 # Rotas da API
│   ├── seeders/
│   │   └── index.js            # Script para popular o banco
│   ├── swagger/                # Documentação Swagger
│   └── index.js                # Ponto de entrada da aplicação
├── .env                        # Variáveis de ambiente
├── package.json
└── start-with-data.bat/sh      # Scripts de inicialização rápida
```

## Detalhes Técnicos

### Modelos Implementados

- User: Usuários e autenticação
- Category: Categorias de transações
- Transaction: Transações financeiras
- Budget: Orçamentos
- Notification: Sistema de notificações

### API Endpoints

A API está organizada nos seguintes grupos:

- `/api/auth`: Autenticação e gestão de sessões
- `/api/users`: Gestão de usuários e perfis
- `/api/categories`: Gestão de categorias
- `/api/transactions`: Gestão de transações
- `/api/budgets`: Gestão de orçamentos
- `/api/notifications`: Sistema de notificações
- `/api/dashboard`: Dados consolidados para o dashboard

Para detalhes completos dos endpoints, consulte a documentação Swagger.

## Seeders

O sistema inclui seeders abrangentes para popular o banco de dados com dados realistas para desenvolvimento e testes. Os seeders criam:

1. **Usuário demo**

   - Email: demo@despfinancee.com
   - Senha: senha123
   - Configurações personalizadas

2. **Categorias padrão**

   - Categorias de receita: Salário, Investimentos, Freelance, Presentes, Outros
   - Categorias de despesa: Alimentação, Moradia, Transporte, Entretenimento, Saúde, Educação, Contas, Compras, Outros

3. **Transações de exemplo**

   - Transações de receita e despesa dos últimos 3 meses
   - Transações recorrentes e pontuais
   - Distribuição realista entre categorias diferentes

4. **Orçamentos de exemplo**

   - Orçamentos mensais, anuais e personalizados
   - Orçamentos por categoria específica
   - Orçamentos gerais para todas as despesas

5. **Notificações de exemplo**
   - Alertas de orçamento
   - Notificações de pagamentos
   - Dicas financeiras

Para executar os seeders:

```
npm run seed
```

## Documentação Swagger

A API completa está documentada usando Swagger, fornecendo uma interface interativa para testar e explorar os endpoints. A documentação cobre:

- Autenticação e gerenciamento de usuários
- Transações financeiras
- Categorias
- Orçamentos
- Notificações
- Dashboard e relatórios financeiros

A documentação Swagger está disponível em:

```
http://localhost:3001/api-docs
```

## Próximos Passos

- Implementar sistema de backup automático
- Adicionar testes unitários e de integração
- Otimizar consultas para melhor performance
- Implementar sistema de logs mais detalhado

## Troubleshooting

### Problemas de Conexão

Se encontrar problemas de conexão com o MongoDB:

1. Verifique se a string de conexão está correta em `.env`
2. Certifique-se de que seu endereço IP está na lista de IPs permitidos no MongoDB Atlas
3. Teste a conexão com: `npm run test:connection`

### Erros de Autenticação

Se encontrar problemas ao fazer login:

1. Verifique se o usuário demo foi criado corretamente
2. Execute `npm run seed` para garantir que o banco está populado
3. Verifique se a senha está correta (senha123)

### Outros Problemas

Para outros problemas, verifique os logs do servidor e consulte a documentação do Mongoose ou entre em contato com o suporte.
