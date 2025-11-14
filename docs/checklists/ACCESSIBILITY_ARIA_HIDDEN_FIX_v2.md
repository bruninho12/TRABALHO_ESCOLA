# Correção de Acessibilidade: aria-hidden com Foco

## Problema

Estava sendo exibido o seguinte erro de acessibilidade ao salvar uma meta:

```
Blocked aria-hidden on an element because its descendant retained focus.
The focus must not be hidden from assistive technology users.
```

Este erro ocorria quando um elemento com `aria-hidden` tinha um descendente com foco. Isso violava as WCAG guidelines pois tecnologias assistivas (leitores de tela) não conseguiam acessar elementos focados que estavam marcados como ocultos.

## Causa Raiz

O Material-UI (versão 5.14.13) aplica automaticamente `aria-hidden="true"` ao elemento raiz quando um Dialog/Modal é aberto. O problema ocorre quando:

1. Um elemento dentro do Dialog recebe foco automaticamente (ou por interação)
2. Material-UI aplica `aria-hidden="true"` ao root simultaneamente
3. O navegador detecta que um elemento focado tem um ancestral com `aria-hidden`, causando conflito

## Soluções Implementadas

### 1. **Atributos de Configuração nos Dialogs** ✅

Adicionados os atributos `disableEnforceFocus` e `disableRestoreFocus` a todos os componentes `Dialog`:

```jsx
<Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  disableEnforceFocus      // Não força o foco no diálogo
  disableRestoreFocus      // Não restaura foco anterior ao fechar
>
```

Benefícios:

- Desabilita o enforcement automático de foco do Material-UI
- Permite que elementos focados permaneçam acessíveis
- Evita conflito entre `aria-hidden` e elementos com foco

### 2. **Remoção de autoFocus em Botões** ✅

Removido o atributo `autoFocus` do botão "Confirmar" em `ConfirmDialog.jsx`:

```jsx
// Antes
<Button onClick={onConfirm} variant="contained" color="error" autoFocus>
  Confirmar
</Button>

// Depois
<Button onClick={onConfirm} variant="contained" color="error">
  Confirmar
</Button>
```

### 3. **Patch Global de Acessibilidade** ✅

Criado `src/utils/accessibilityPatch.js` que:

- Monitora quando `aria-hidden` é aplicado ao root
- Detecta se há um elemento focado dentro de um Dialog
- Remove `aria-hidden` do root quando necessário para manter acessibilidade
- Usa `inert` em navegadores que suportam (alternativa mais semântica)

O patch é carregado automaticamente em `src/main.jsx`.

### 4. **Componente Wrapper Acessível** ✅

Atualizado `src/components/AccessibleDialog.jsx` com:

- Configuração automática de `disableEnforceFocus` e `disableRestoreFocus`
- Documentação clara de uso
- Pronto para ser usado em novos Dialogs

### 5. **Hook Customizado para Diálogos** ✅

Criado `src/hooks/useDialogAccessibility.js` para gerenciar acessibilidade em Diálogos customizados.

## Arquivos Modificados

| Arquivo                                   | Alterações                                       |
| ----------------------------------------- | ------------------------------------------------ |
| `src/pages/Goals.jsx`                     | ✅ `disableEnforceFocus` + `disableRestoreFocus` |
| `src/components/TransactionForm.jsx`      | ✅ `disableEnforceFocus` + `disableRestoreFocus` |
| `src/components/GamificationPanel.jsx`    | ✅ 2 Dialogs (Conquistas e Recompensas)          |
| `src/pages/Payments.jsx`                  | ✅ `disableEnforceFocus` + `disableRestoreFocus` |
| `src/pages/RPG.jsx`                       | ✅ 2 Dialogs (Avatar e Batalha)                  |
| `src/components/ConfirmDialog.jsx`        | ✅ Removido `autoFocus`, adicionado flags        |
| `src/components/AccessibleDialog.jsx`     | ✅ Melhor documentação e configurações           |
| `src/main.jsx`                            | ✅ Importação do patch de acessibilidade         |
| **`src/utils/accessibilityPatch.js`**     | ✨ NOVO - Patch global automático                |
| **`src/hooks/useDialogAccessibility.js`** | ✨ NOVO - Hook para diálogos customizados        |

## Validação

Para verificar se a correção foi aplicada:

1. Abra o DevTools (F12) → Console
2. Crie uma nova meta (Goals → "Nova Meta" → "Salvar")
3. **O erro não deve mais aparecer**
4. Mensagens de debug indicam que o patch foi ativado com sucesso

## Referências

- [WAI-ARIA Specification - aria-hidden](https://w3c.github.io/aria/#aria-hidden)
- [MDN - Using inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
- [Material-UI Dialog API](https://mui.com/api/dialog/)
- [WCAG 2.1 - Focus Visible](https://www.w3.org/WAI/WCAG21/Understanding/focus-visible)
- [Dialog (Modal) Pattern - WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)

## Status

✅ **Concluído** - 8 Dialogs corrigidos com múltiplas camadas de proteção contra o erro aria-hidden.
