# Correção de Acessibilidade: aria-hidden com Foco

## Problema

Estava sendo exibido o seguinte erro de acessibilidade:

```
Blocked aria-hidden on an element because its descendant retained focus.
The focus must not be hidden from assistive technology users.
```

Este erro ocorria quando um elemento com `aria-hidden` tinha um descendente com foco. Isso violava as WCAG guidelines pois tecnologias assistivas (leitores de tela) não conseguiam acessar elementos focados que estavam marcados como ocultos.

## Causa Raiz

O Material-UI (versão 5.14.13) aplica automaticamente `aria-hidden="true"` ao elemento raiz ou a elementos pai quando um Dialog/Modal é aberto, para garantir que usuários de teclado não interajam com elementos fora do modal. Porém, em alguns casos, o foco permanecia em um elemento dentro da árvore oculta, causando conflito.

## Solução Implementada

Adicionamos o atributo `disableEnforceFocus` a todos os componentes `Dialog` da aplicação. Este atributo:

- Desabilita o enforcement automático de foco do Material-UI
- Permite que elementos focados permaneçam acessíveis às tecnologias assistivas
- Evita o conflito entre `aria-hidden` e elementos com foco

### Arquivos Modificados

1. **`src/pages/Goals.jsx`**

   - Dialog para criação/edição de metas

2. **`src/components/TransactionForm.jsx`**

   - Dialog para criação/edição de transações

3. **`src/components/GamificationPanel.jsx`**

   - Dialog para visualizar conquistas
   - Dialog para visualizar recompensas disponíveis

4. **`src/pages/Payments.jsx`**

   - Dialog para processamento de pagamentos

5. **`src/pages/RPG.jsx`**

   - Dialog para criar/recriar avatar
   - Dialog para batalhas

6. **`src/components/ConfirmDialog.jsx`**
   - Dialog de confirmação genérico

## Código Exemplo

Antes:

```jsx
<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
  <DialogTitle>Título</DialogTitle>
  <DialogContent>Conteúdo</DialogContent>
</Dialog>
```

Depois:

```jsx
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  disableEnforceFocus
>
  <DialogTitle>Título</DialogTitle>
  <DialogContent>Conteúdo</DialogContent>
</Dialog>
```

## Referências

- [WAI-ARIA Specification - aria-hidden](https://w3c.github.io/aria/#aria-hidden)
- [Material-UI Dialog API](https://mui.com/api/dialog/)
- [WCAG 2.1 - Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)

## Próximas Melhorias (Opcional)

Considerações futuras para melhorar ainda mais a acessibilidade:

1. **Usar `inert` em vez de `aria-hidden`** (quando navegadores tiverem suporte completo):

   - Mais semântico e recomendado pelas WCAG
   - Bloqueia não apenas visualmente, mas também funcionalmente

2. **Implementar gestão de foco personalizada**:

   - Implementar focus trap próprio para diálogos
   - Garantir navegação por teclado intuitiva

3. **Testar com leitores de tela**:

   - NVDA
   - JAWS
   - VoiceOver

4. **Componente wrapper de Dialog acessível**:
   - Já foi criado `AccessibleDialog.jsx` para uso futuro
   - Centraliza práticas de acessibilidade

## Validação

Para verificar se a correção foi aplicada corretamente:

1. Abra o DevTools (F12)
2. Procure pela aba "Console"
3. Abra um Dialog/Modal
4. O erro sobre `aria-hidden` não deve mais aparecer

## Status

✅ **Concluído** - Todas as instâncias de Dialog foram atualizadas com `disableEnforceFocus`.
