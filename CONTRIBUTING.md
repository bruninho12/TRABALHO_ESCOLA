# 🤝 Contribuindo para o DespFinancee

Obrigado por considerar contribuir para o DespFinancee! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Índice

- [Código de Conduta](#código-de-conduta)
- [Como Posso Contribuir?](#como-posso-contribuir)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Guia de Estilo](#guia-de-estilo)
- [Commit Guidelines](#commit-guidelines)

## 📜 Código de Conduta

Este projeto adere a um código de conduta. Ao participar, espera-se que você mantenha esse código. Por favor, reporte comportamentos inaceitáveis.

## 🎯 Como Posso Contribuir?

### 🐛 Reportando Bugs

Antes de criar um bug report:

- Verifique se o bug já foi reportado
- Colete informações sobre o bug

**Como submeter um bug report:**

```markdown
**Descrição**
Descrição clara e concisa do bug.

**Como Reproduzir**

1. Vá para '...'
2. Clique em '....'
3. Role até '....'
4. Veja o erro

**Comportamento Esperado**
O que deveria acontecer.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente:**

- OS: [ex: Windows 10]
- Browser: [ex: Chrome 120]
- Versão: [ex: 2.0.0]
```

### 💡 Sugerindo Melhorias

Para sugerir melhorias:

- Use um título claro e descritivo
- Forneça uma descrição detalhada
- Explique por que seria útil

### 🔧 Pull Requests

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 🛠️ Processo de Desenvolvimento

### Configuração Local

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/TRABALHO_ESCOLA.git
cd DespFinancee

# Adicione o repositório original como upstream
git remote add upstream https://github.com/bruninho12/TRABALHO_ESCOLA.git

# Backend setup
cd backend
npm install
cp .env.example .env
npm run db:setup
npm run db:seed
npm run dev

# Frontend setup (nova janela de terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Estrutura de Branches

- `master` - Branch principal (produção)
- `develop` - Branch de desenvolvimento
- `feature/*` - Novas features
- `bugfix/*` - Correções de bugs
- `hotfix/*` - Correções urgentes para produção

## 📝 Guia de Estilo

### JavaScript/React

- Use ESLint configurado no projeto
- Siga o Airbnb Style Guide
- Use componentes funcionais com hooks
- Mantenha componentes pequenos e reutilizáveis

```javascript
// ✅ Bom
const MinhaFuncao = ({ prop1, prop2 }) => {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    // lógica
  }, []);

  return <div>{/* JSX */}</div>;
};

// ❌ Evite
function MinhaFuncao(props) {
  // componente de classe ou estilo antigo
}
```

### CSS

- Use CSS Modules ou styled-components
- Mantenha mobile-first
- Use variáveis CSS para cores e espaçamentos

### Comentários

```javascript
// ✅ Bom - Explica o "porquê"
// Usamos debounce aqui para evitar múltiplas chamadas à API
const debouncedSearch = useDebouce(searchTerm, 500);

// ❌ Ruim - Explica o "o quê" (óbvio)
// Define a variável count como 0
const count = 0;
```

## 📝 Commit Guidelines

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

[corpo opcional]

[rodapé opcional]
```

### Tipos

- `feat`: Nova feature
- `fix`: Correção de bug
- `docs`: Mudanças na documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Atualização de build, etc

### Exemplos

```bash
feat(auth): adiciona login com Google
fix(payments): corrige cálculo de juros
docs(readme): atualiza instruções de setup
style(dashboard): melhora responsividade
refactor(api): simplifica lógica de transações
test(budget): adiciona testes unitários
chore(deps): atualiza dependências
```

## 🧪 Testes

Sempre adicione testes para novas features:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Coverage

Mantenha coverage acima de 70%:

```bash
npm run test:coverage
```

## 📚 Documentação

- Atualize o README se necessário
- Adicione comentários JSDoc para funções complexas
- Atualize a documentação Swagger para novos endpoints

```javascript
/**
 * Calcula o orçamento restante
 * @param {number} total - Orçamento total
 * @param {number} spent - Valor gasto
 * @returns {number} Orçamento restante
 */
const calcularRestante = (total, spent) => total - spent;
```

## ✅ Checklist do Pull Request

Antes de submeter:

- [ ] Código segue o guia de estilo
- [ ] Testes passam (`npm test`)
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Sem vulnerabilidades novas (`npm audit`)
- [ ] Documentação atualizada
- [ ] Commits seguem convenção
- [ ] Branch está atualizada com `develop`

## 🔍 Revisão de Código

Seu PR será revisado considerando:

- Qualidade do código
- Testes adequados
- Documentação clara
- Sem breaking changes (se não for major version)
- Performance
- Segurança

## 📞 Precisa de Ajuda?

- Abra uma issue com a tag `question`
- Entre em contato com [@bruninho12](https://github.com/bruninho12)

## 🙏 Agradecimentos

Obrigado por contribuir para tornar o DespFinancee melhor!

---

**Lembre-se**: Contribuições de todos os níveis são bem-vindas! 🎉
