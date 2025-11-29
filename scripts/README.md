# 🔧 Scripts do Projeto

Esta pasta contém scripts utilitários para manutenção e verificação do projeto.

## 📋 Scripts Disponíveis

### ✅ check-deploy.js

**Descrição**: Verifica se o projeto está pronto para deploy em produção.

**Uso**:

```bash
npm run check:deploy
# ou
node scripts/check-deploy.js
```

**O que verifica**:

- ✓ Arquivos essenciais (LICENSE, README, etc)
- ✓ Documentação completa
- ✓ Estrutura de pastas
- ✓ CI/CD configurado
- ✓ Docker files
- ✓ Package.json (backend e frontend)
- ✓ Variáveis de ambiente
- ✓ Lint do código
- ✓ Build do frontend
- ✓ Audit de segurança

**Saída**:

```
✓ Verificações Passadas: XXX
✗ Verificações Falhas: XXX
⚠ Avisos: XXX
Taxa de Sucesso: XX.X%
```

---

### 📁 check-structure.js

**Descrição**: Verifica se todos os arquivos estão nos lugares corretos.

**Uso**:

```bash
npm run check:structure
# ou
node scripts/check-structure.js
```

**O que verifica**:

- Estrutura de pastas do backend
- Estrutura de pastas do frontend
- Arquivos de configuração
- Documentação

---

## 🚀 Scripts NPM (Root)

Execute da raiz do projeto:

### Instalação

```bash
npm run install:all      # Instala deps de backend + frontend + root
```

### Desenvolvimento

```bash
npm run dev:backend      # Inicia backend (porta 3001)
npm run dev:frontend     # Inicia frontend (porta 5173)
npm run dev:all          # Inicia ambos simultaneamente
```

### Build

```bash
npm run build:backend    # Build do backend
npm run build:frontend   # Build do frontend
npm run build:all        # Build de ambos
```

### Qualidade

```bash
npm run lint:backend     # Lint do backend
npm run lint:frontend    # Lint do frontend
npm run lint:all         # Lint de ambos
```

### Segurança

```bash
npm run audit:backend    # Audit backend (produção)
npm run audit:frontend   # Audit frontend (produção)
npm run audit:all        # Audit de ambos
```

### Testes

```bash
npm run test:backend     # Testes do backend
npm run test:frontend    # Testes do frontend
npm run test:all         # Testes de ambos
```

### Deploy

```bash
npm run deploy:check     # Verifica se está pronto
npm run deploy:vercel    # Deploy frontend no Vercel
```

### Docker

```bash
npm run docker:build     # Build das imagens
npm run docker:up        # Inicia containers
npm run docker:down      # Para containers
npm run docker:logs      # Visualiza logs
```

---

## 📁 Estrutura de Scripts

```
scripts/
├── check-deploy.js          # Verificação pré-deploy
├── check-structure.js       # Verificação de estrutura
└── deploy/                  # Scripts de deploy
    ├── deploy.ps1           # Deploy PowerShell
    ├── fix-issues.ps1       # Correções PowerShell
    └── fix-issues.sh        # Correções Bash
```

---

## 🆕 Adicionando Novos Scripts

1. Crie o arquivo na pasta `scripts/`
2. Adicione shebang no topo:
   ```javascript
   #!/usr/bin/env node
   ```
3. Adicione script no `package.json` (root):
   ```json
   {
     "scripts": {
       "meu-script": "node scripts/meu-script.js"
     }
   }
   ```
4. Documente aqui!

---

## 💡 Dicas

### Executar com mais informações

```bash
DEBUG=* npm run check:deploy
```

### Ver ajuda de um script

```bash
node scripts/check-deploy.js --help
```

### Executar em modo silencioso

```bash
npm run check:deploy --silent
```

---

## 🐛 Troubleshooting

### "Cannot find module X"

```bash
npm install  # Instale dependências do root
```

### "Permission denied"

```bash
# Linux/Mac
chmod +x scripts/*.js

# Windows
# Não é necessário
```

### Script trava

- Pressione `Ctrl+C` para interromper
- Verifique se outro processo está usando a porta

---

## 📚 Recursos

- [Node.js Scripts](https://nodejs.org/api/child_process.html)
- [NPM Scripts](https://docs.npmjs.com/cli/v9/using-npm/scripts)
- [Concurrently](https://github.com/open-cli-tools/concurrently)

---

**Autor**: Bruno Souza  
**Versão**: 2.0.0  
**Atualizado**: 25/11/2025
