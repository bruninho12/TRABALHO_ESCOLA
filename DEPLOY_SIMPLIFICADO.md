# 🚀 Guia de Deploy Simplificado (Resolução CORS)

## 1️⃣ Resumo do Problema

Você estava enfrentando dois problemas:

- **Erro de CORS**: O frontend no Vercel não conseguia se comunicar com o backend.
- **Erro 500**: O backend no Vercel estava falhando com FUNCTION_INVOCATION_FAILED.

## 2️⃣ Soluções Aplicadas

### Para o Backend:

- ✅ Criamos um novo arquivo `api.js` otimizado para serverless
- ✅ Configuração CORS simplificada (`origin: '*'` para permitir todas as origens)
- ✅ Dados em memória (sem uso de sistema de arquivos)
- ✅ Arquivo `vercel.json` configurado para serverless

### Para o Frontend:

- ✅ URL de API atualizada para apontar para o novo deploy
- ✅ Headers CORS corrigidos nas requisições fetch
- ✅ Configuração `mode: "cors"` em todas as solicitações

## 3️⃣ Como Fazer o Deploy Correto

### Método Manual:

#### 1. Deploy do Backend:

```bash
cd backend
vercel --prod
# Quando perguntado, escolha o nome: trabalho-escola-api
```

#### 2. Deploy do Frontend:

```bash
cd frontend
# Importante: após o deploy do backend, edite o app.js para usar o URL correto
vercel --prod
# Quando perguntado, escolha o nome: trabalho-escola-frontend
```

### Método Automático:

```bash
# Execute o script de deploy
DEPLOY.bat
```

## 4️⃣ URLs Após Deploy

- Frontend: https://trabalho-escola-frontend.vercel.app
- Backend: https://trabalho-escola-api.vercel.app

## 5️⃣ Teste o Sistema

Utilize os seguintes dados de teste:

- Email: bruno@teste.com / Senha: 123456
- Email: maria@teste.com / Senha: 123456

## 6️⃣ Verificação Final

### Checklist para garantir que está funcionando:

- [ ] A API está respondendo em https://trabalho-escola-api.vercel.app
- [ ] O frontend carrega corretamente
- [ ] É possível fazer login com os usuários de teste
- [ ] É possível criar novas transações
- [ ] A exportação de dados funciona

### Solução de Problemas:

Se persistirem erros de CORS, verifique:

1. O Console do navegador para identificar a origem exata
2. Se o URL da API no frontend está correto
3. Se o `vercel.json` foi corretamente carregado

**Observação:** A permissão de CORS para todas as origens (`*`) é uma medida temporária para resolver o problema imediatamente. Para produção real, é recomendável limitar às origens específicas.
