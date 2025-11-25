import React from "react";
import { Box, Grid, useTheme, useMediaQuery } from "@mui/material";

/**
 * Container responsivo otimizado para mobile
 * Adapta automaticamente o layout baseado no tamanho da tela
 */
const ResponsiveContainer = ({
  children,
  maxWidth = "xl",
  padding = { xs: 1, sm: 2, md: 3 },
  className = "",
  ...props
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case "sm":
        return {
          xs: "100%",
          sm: "100%",
          md: "800px",
          lg: "1000px",
          xl: "1200px",
        };
      case "md":
        return {
          xs: "100%",
          sm: "100%",
          md: "900px",
          lg: "1100px",
          xl: "1300px",
        };
      case "lg":
        return {
          xs: "100%",
          sm: "100%",
          md: "1000px",
          lg: "1200px",
          xl: "1400px",
        };
      case "xl":
        return {
          xs: "100%",
          sm: "100%",
          md: "1200px",
          lg: "1400px",
          xl: "1600px",
        };
      default:
        return {
          xs: "100%",
          sm: "100%",
          md: "1200px",
          lg: "1400px",
          xl: "1600px",
        };
    }
  };

  return (
    <Box
      className={`responsive-container ${className}`}
      sx={{
        width: "100%",
        maxWidth: getMaxWidth(),
        mx: "auto",
        px: padding,
        py: { xs: 0.5, sm: 1 },
        position: "relative",
        overflow: "hidden",
        ...(props.sx || {}),
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Grid responsivo que se adapta automaticamente
 * Empilha em mobile, 2 colunas em tablet, 3+ colunas em desktop
 */
const ResponsiveGrid = ({
  children,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  spacing = { xs: 1, sm: 1.5, md: 2, lg: 3 },
  ...props
}) => {
  return (
    <Grid
      container
      spacing={spacing}
      sx={{
        width: "100%",
        margin: 0,
        "& .MuiGrid-item": {
          paddingTop: { xs: "8px", sm: "12px", md: "16px", lg: "24px" },
          paddingLeft: { xs: "8px", sm: "12px", md: "16px", lg: "24px" },
        },
        ...(props.sx || {}),
      }}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <Grid
          item
          xs={12 / (columns.xs || 1)}
          sm={12 / (columns.sm || 2)}
          md={12 / (columns.md || 3)}
          lg={12 / (columns.lg || 4)}
          xl={12 / (columns.xl || columns.lg || 4)}
          key={index}
        >
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

/**
 * Card responsivo com adaptações para mobile
 */
const ResponsiveCard = ({
  children,
  elevation = 1,
  padding = { xs: 1.5, sm: 2, md: 3 },
  borderRadius = { xs: 2, sm: 3, md: 4 },
  className = "",
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      className={`responsive-card ${className}`}
      sx={{
        backgroundColor: "background.paper",
        borderRadius: borderRadius,
        padding: padding,
        boxShadow: isMobile
          ? "0 2px 8px rgba(0, 0, 0, 0.1)"
          : `0 4px 12px rgba(0, 0, 0, ${elevation * 0.08})`,
        border: "1px solid",
        borderColor: "divider",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: isMobile ? "none" : "translateY(-2px)",
          boxShadow: isMobile
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : `0 8px 25px rgba(0, 0, 0, ${elevation * 0.12})`,
        },
        ...(props.sx || {}),
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Stack responsivo que se adapta à direção baseado no tamanho da tela
 */
const ResponsiveStack = ({
  children,
  direction = { xs: "column", sm: "row" },
  spacing = { xs: 1, sm: 2 },
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
        ...(props.sx || {}),
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

/**
 * Hook para detectar tamanho da tela
 */
export const useResponsive = () => {
  const theme = useTheme();
  const isMobileSmall = useMediaQuery("(max-width: 375px)");
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return {
    isMobileSmall,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    breakpoint: isMobileSmall
      ? "xs"
      : isMobile
      ? "sm"
      : isTablet
      ? "md"
      : isDesktop
      ? "lg"
      : "xl",
  };
};

export { ResponsiveContainer, ResponsiveGrid, ResponsiveCard, ResponsiveStack };
export default ResponsiveContainer;
