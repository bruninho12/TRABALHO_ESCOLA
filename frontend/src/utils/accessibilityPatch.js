/**
 * Patch de acessibilidade para Material-UI
 *
 * Este arquivo resolve o erro:
 * "Blocked aria-hidden on an element because its descendant retained focus"
 *
 * O problema ocorre quando Material-UI aplica aria-hidden="true" ao elemento root
 * enquanto um elemento dentro de um Dialog tem o foco.
 *
 * Solução: Monitorar quando aria-hidden é adicionado ao root com um elemento focado
 * e remover o aria-hidden neste caso específico.
 */

// Aguardar o DOM estar pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupAccessibilityPatch);
} else {
  setupAccessibilityPatch();
}

function setupAccessibilityPatch() {
  const root = document.getElementById("root");

  if (!root) {
    console.warn("Elemento root não encontrado para patch de acessibilidade");
    return;
  }

  // Observar mudanças de atributos no root
  const observer = new MutationObserver(() => {
    // Verificar se aria-hidden foi aplicado ao root
    if (root.getAttribute("aria-hidden") === "true") {
      const activeElement = document.activeElement;

      // Se há um elemento focado que não é o body
      if (
        activeElement &&
        activeElement !== document.body &&
        activeElement !== root
      ) {
        // Verificar se o elemento focado está dentro de um Dialog/Modal
        const dialog = activeElement.closest(
          ".MuiDialog-root, [role='dialog'], .modal"
        );

        if (dialog) {
          // O elemento focado está dentro de um dialog
          // Remover aria-hidden do root para permitir acessibilidade
          root.removeAttribute("aria-hidden");

          console.debug(
            "Removido aria-hidden do root para manter acessibilidade ao elemento focado dentro do Dialog"
          );

          // Se suportado, usar inert em vez de aria-hidden
          if ("inert" in HTMLElement.prototype) {
            // Marcar backdrop como inert
            const backdrop = document.querySelector(".MuiBackdrop-root");
            if (backdrop) {
              backdrop.inert = true;
            }
          }
        }
      }
    }
  });

  // Configurar observer
  observer.observe(root, {
    attributes: true,
    attributeFilter: ["aria-hidden"],
  });

  // Cleanup: desconectar observer quando a página descarregar
  window.addEventListener("unload", () => {
    observer.disconnect();
  });
}
