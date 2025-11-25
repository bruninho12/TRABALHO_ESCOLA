import React from "react";
import { Button, IconButton, Fab, Box } from "@mui/material";
import { useResponsive } from "./ResponsiveComponents";

/**
 * Botão responsivo que se adapta ao tamanho da tela
 */
const ResponsiveButton = ({
  children,
  variant = "contained",
  size = "medium",
  startIcon,
  endIcon,
  fullWidth,
  onClick,
  disabled,
  color = "primary",
  mobileVariant,
  mobileSize,
  hideTextOnMobile = false,
  iconOnly = false,
  ...props
}) => {
  const { isMobile, isMobileSmall } = useResponsive();

  // Determina o variant baseado na tela
  const actualVariant = isMobile && mobileVariant ? mobileVariant : variant;

  // Determina o tamanho baseado na tela
  const actualSize =
    isMobile && mobileSize
      ? mobileSize
      : isMobileSmall
      ? "small"
      : isMobile
      ? "medium"
      : size;

  // Se é apenas ícone em mobile
  if (isMobile && (iconOnly || hideTextOnMobile)) {
    return (
      <IconButton
        onClick={onClick}
        disabled={disabled}
        color={color}
        size={actualSize}
        sx={{
          minHeight: { xs: 44, sm: 48 },
          minWidth: { xs: 44, sm: 48 },
          borderRadius: 2,
          border: variant === "outlined" ? `1px solid` : "none",
          borderColor: variant === "outlined" ? `${color}.main` : "transparent",
          backgroundColor:
            variant === "contained" ? `${color}.main` : "transparent",
          color:
            variant === "contained" ? `${color}.contrastText` : `${color}.main`,
          "&:hover": {
            backgroundColor:
              variant === "contained" ? `${color}.dark` : `${color}.main`,
            color: variant === "contained" ? `${color}.contrastText` : "white",
          },
          ...props.sx,
        }}
        {...props}
      >
        {startIcon || endIcon}
      </IconButton>
    );
  }

  return (
    <Button
      variant={actualVariant}
      size={actualSize}
      startIcon={!hideTextOnMobile ? startIcon : undefined}
      endIcon={!hideTextOnMobile ? endIcon : undefined}
      fullWidth={isMobile ? true : fullWidth}
      onClick={onClick}
      disabled={disabled}
      color={color}
      sx={{
        minHeight: { xs: 44, sm: 48 },
        textTransform: "none",
        fontWeight: 600,
        borderRadius: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        fontSize: { xs: "0.875rem", sm: "1rem" },
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: isMobile ? "none" : "translateY(-2px)",
          boxShadow: isMobile ? "none" : "0 8px 25px rgba(0, 0, 0, 0.15)",
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

/**
 * Grupo de botões responsivos
 */
const ResponsiveButtonGroup = ({
  children,
  direction = { xs: "column", sm: "row" },
  spacing = { xs: 1, sm: 1.5 },
  align = "stretch",
  justify = "flex-start",
  ...props
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        gap: spacing,
        alignItems: align,
        justifyContent: justify,
        width: "100%",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * FAB responsivo que se adapta à posição em mobile
 */
const ResponsiveFab = ({
  children,
  color = "primary",
  size = "large",
  position = { xs: "fixed", md: "absolute" },
  bottom = { xs: 16, md: 32 },
  right = { xs: 16, md: 32 },
  onClick,
  ...props
}) => {
  const { isMobile } = useResponsive();

  return (
    <Fab
      color={color}
      size={isMobile ? "medium" : size}
      onClick={onClick}
      sx={{
        position: position,
        bottom: bottom,
        right: right,
        boxShadow: {
          xs: "0 4px 12px rgba(0, 0, 0, 0.15)",
          md: "0 8px 25px rgba(0, 0, 0, 0.15)",
        },
        "&:hover": {
          transform: isMobile ? "none" : "scale(1.1)",
          boxShadow: {
            xs: "0 4px 12px rgba(0, 0, 0, 0.15)",
            md: "0 12px 40px rgba(0, 0, 0, 0.2)",
          },
        },
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Fab>
  );
};

export { ResponsiveButton, ResponsiveButtonGroup, ResponsiveFab };
export default ResponsiveButton;
