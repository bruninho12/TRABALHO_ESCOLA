import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

/**
 * Componente Dialog acessível que gerencia corretamente aria-hidden
 * Previne o erro "Blocked aria-hidden on an element because its descendant retained focus"
 *
 * Usar este componente em vez do Dialog direto do MUI para melhor acessibilidade.
 *
 * Exemplo de uso:
 * <AccessibleDialog
 *   open={open}
 *   onClose={handleClose}
 *   title="Título do Diálogo"
 *   actions={
 *     <>
 *       <Button onClick={handleClose}>Cancelar</Button>
 *       <Button onClick={handleSave} variant="contained">Salvar</Button>
 *     </>
 *   }
 * >
 *   Conteúdo do diálogo
 * </AccessibleDialog>
 */
export const AccessibleDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
  fullWidth = true,
  ...props
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      // Impede o Material-UI de forçar o foco no diálogo
      disableEnforceFocus
      // Impede que o foco seja restaurado para o elemento anterior
      disableRestoreFocus
      // Configurações adicionais de acessibilidade
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(4px)",
          },
        },
      }}
      // Permitir passar props adicionais
      {...props}
    >
      {title && <DialogTitle>{title}</DialogTitle>}
      {children && <DialogContent>{children}</DialogContent>}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default AccessibleDialog;
