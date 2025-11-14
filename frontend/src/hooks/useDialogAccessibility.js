import { useEffect } from "react";

/**
 * Hook customizado para gerenciar acessibilidade em Diálogos
 * Previne o erro: "Blocked aria-hidden on an element because its descendant retained focus"
 *
 * Este hook:
 * 1. Monitora quando um diálogo é aberto/fechado
 * 2. Garante que elementos focados permaneçam acessíveis
 * 3. Previne aplicação incorreta de aria-hidden em ancestrais do elemento focado
 *
 * @param {boolean} isOpen - Se o diálogo está aberto
 * @param {HTMLElement} dialogRef - Referência ao elemento Dialog
 */
export function useDialogAccessibility(isOpen, dialogRef) {
  useEffect(() => {
    if (!isOpen || !dialogRef?.current) return;

    const dialog = dialogRef.current;
    const root = document.getElementById("root");

    // Monitorar mudanças no atributo aria-hidden do root
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-hidden" &&
          mutation.target === root
        ) {
          // Se aria-hidden foi adicionado ao root enquanto há um elemento focado dentro do dialog
          const activeElement = document.activeElement;

          // Verificar se o elemento focado está dentro do diálogo
          if (
            activeElement &&
            dialog.contains(activeElement) &&
            root?.getAttribute("aria-hidden") === "true"
          ) {
            // Remover aria-hidden do root para evitar o erro
            root?.removeAttribute("aria-hidden");

            // Usar inert em vez de aria-hidden (quando suportado)
            if ("inert" in HTMLElement.prototype) {
              // Encontrar o modal-backdrop e marcá-lo como inert
              const backdrop = document.querySelector(".MuiBackdrop-root");
              if (backdrop && backdrop !== dialog) {
                backdrop.inert = true;
              }
            }
          }
        }
      });
    });

    // Configurar observer para monitorar mudanças no root
    if (root) {
      observer.observe(root, {
        attributes: true,
        attributeFilter: ["aria-hidden"],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [isOpen, dialogRef]);
}

export default useDialogAccessibility;
