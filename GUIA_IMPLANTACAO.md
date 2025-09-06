# Guia de Implantação do Sistema

## Visão Geral da Arquitetura

Este sistema está configurado para funcionar com:

- **Frontend**: Hospedado no Vercel (site estático)
- **Backend**: Hospedado no Render (servidor Node.js)

## Configuração de Implantação

### Implantação do Frontend (Vercel)

1. **Estrutura de arquivos**:

   - O frontend está na pasta `/frontend`
   - Contém arquivos HTML, CSS e JavaScript estáticos
   - Configurado com `vercel.json` tanto na raiz quanto na pasta frontend

2. **Implantação automatizada**:

   - Use o script `DEPLOY_VERCEL.bat` para automatizar a implantação
   - Este script:
     - Verifica a instalação do Git e da CLI do Vercel
     - Comita as alterações
     - Envia para o repositório Git
     - Implanta no Vercel

3. **Configurações importantes**:
   - O diretório de saída está configurado como a pasta frontend
   - Os cabeçalhos CORS estão configurados no `vercel.json`
   - As URLs são limpas para melhor SEO

### Implantação do Backend (Render)

1. **Estrutura de arquivos**:

   - O backend está na pasta `/backend`
   - A configuração de implantação está no arquivo `render.yaml`

2. **Passos para implantação**:

   - Crie uma conta no Render.com
   - Configure um novo Web Service apontando para seu repositório Git
   - Use as configurações definidas no `render.yaml`
   - Defina as variáveis de ambiente necessárias

3. **Configurações importantes**:
   - O serviço é do tipo "web"
   - O nome do serviço é "controle-despesas-backend"
   - O ambiente é Node.js
   - O comando de build instala as dependências do backend
   - O comando de início executa `node backend/index.js`

## Comunicação entre Frontend e Backend

- O frontend detecta automaticamente o ambiente (desenvolvimento ou produção)
- Os cabeçalhos CORS no backend permitem solicitações de qualquer origem
- O frontend usa funções robustas de solicitação de API com fallbacks

## Solução de Problemas Comuns

### Erros de CORS

1. Verifique se o backend tem a configuração CORS correta:

   ```javascript
   app.use(
     cors({
       origin: "*", // Em produção, especifique o domínio exato
       methods: ["GET", "POST", "PUT", "DELETE"],
       credentials: true,
     })
   );
   ```

2. Verifique se os cabeçalhos CORS estão configurados no `vercel.json`:
   ```json
   "headers": [
     {
       "source": "/(.*)",
       "headers": [
         { "key": "Access-Control-Allow-Origin", "value": "*" },
         { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
         { "key": "Access-Control-Allow-Headers", "value": "X-Requested-With, Content-Type, Accept, Origin, Authorization" },
         { "key": "Access-Control-Allow-Credentials", "value": "true" }
       ]
     }
   ]
   ```

### Erros de Implantação no Vercel

1. Verifique se o `outputDirectory` está configurado corretamente no vercel.json
2. Verifique se o `buildCommand` está correto e funcionando
3. Certifique-se de que todos os arquivos necessários estão incluídos no repositório Git

### Erros de Implantação no Render

1. Verifique os logs de build para identificar problemas durante a instalação
2. Verifique os logs de runtime para problemas durante a execução
3. Certifique-se de que as dependências estão corretamente listadas no package.json

## Teste após a Implantação

1. Acesse o frontend implantado
2. Teste o login e outras funcionalidades básicas
3. Verifique os logs de console para erros de API
4. Teste diretamente os endpoints da API para verificar se estão funcionando corretamente
