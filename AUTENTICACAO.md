# Documentação do Sistema de Controle de Despesas

## Cadastro e Login de Usuários

### Processo de Cadastro

O sistema permite que novos usuários se cadastrem fornecendo:

1. Nome completo
2. Email válido
3. Senha (mínimo 6 caracteres)

#### Validações implementadas:

- Verificação de campos obrigatórios
- Validação de formato de email
- Verificação de comprimento mínimo da senha
- Verificação de email já cadastrado

### Processo de Login

Os usuários podem acessar suas contas fornecendo:

1. Email
2. Senha

#### Segurança implementada:

- Verificação de credenciais
- Token de autenticação para sessão
- Verificação de token na inicialização
- Logout automático para tokens inválidos

## Armazenamento de Dados

Os dados dos usuários são armazenados no arquivo `backend/data/usuarios.json`. Cada usuário tem:

- ID único
- Nome
- Email
- Senha
- Data de criação da conta

## Para Testes

Existem dois usuários pré-cadastrados para testes:

1. **Bruno Souza**

   - Email: bruno@exemplo.com
   - Senha: 123456

2. **Maria Silva**
   - Email: maria@exemplo.com
   - Senha: 123456

## Fluxo de Autenticação

1. O usuário fornece credenciais
2. O backend valida as informações
3. Um token é gerado (no caso atual, o email do usuário)
4. O token é armazenado no localStorage do navegador
5. Para requisições autenticadas, o token é enviado no cabeçalho Authorization
6. O backend valida o token antes de processar requisições protegidas

## Melhorias de Segurança Implementadas

- Validação robusta de dados de entrada
- Feedback informativo para o usuário
- Logs detalhados no servidor para monitoramento
- Verificação de token na inicialização da aplicação
