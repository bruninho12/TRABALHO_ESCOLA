// src/components/responsive/ResponsiveComponents.jsx
import React from "react";
import { Box, Grid, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

/* =============================
   useResponsive (hook central)
   ============================= */
export const useResponsive = () => {
  const theme = useTheme();

  const isMobileSmall = useMediaQuery(theme.breakpoints.down("400"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  return { isMobileSmall, isMobile, isTablet, isDesktop };
};

/* =============================
   ResponsiveContainer (layout principal)
   ============================= */
export const ResponsiveContainer = ({
  children,
  maxWidth = "lg",
  ...rest
}) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: maxWidth === "xl" ? "1600px" : "1400px",
      px: { xs: 1.5, sm: 2, md: 3 },
      py: { xs: 2, sm: 2.5 },
      mx: "auto",
    }}
    {...rest}
  >
    {children}
  </Box>
);

/* =============================
   ResponsiveGrid (grid inteligente)
   ============================= */
export const ResponsiveGrid = ({
  children,
  spacing = 2,
  columns = { xs: 1, sm: 2, md: 2, lg: 3 },
  sx = {},
  ...rest
}) => {
  return (
    <Grid
      container
      spacing={spacing}
      columns={columns}
      sx={{
        width: "100%",
        mb: 3,
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Grid>
  );
};

/* =============================
   ResponsiveCard (card fixo)
   ============================= */
export const ResponsiveCard = ({
  children,
  elevation = 0,
  sx = {},
  ...rest
}) => {
  return (
    <Box
      sx={{
        bgcolor: "rgba(255,255,255,0.04)",
        borderRadius: 3,
        p: { xs: 2, sm: 2.5 },
        border: "1px solid rgba(255,255,255,0.06)",
        width: "100%",
        boxShadow:
          elevation === 0
            ? "0 0 0 rgba(0,0,0,0)"
            : "0 4px 20px rgba(0,0,0,0.25)",
        transition: "0.2s ease",
        "&:hover": {
          boxShadow: "0 6px 25px rgba(0,0,0,0.35)",
          transform: "translateY(-2px)",
        },
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  );
};

/* =============================
   ResponsiveStack (alinhamento flexível)
   ============================= */
export const ResponsiveStack = ({
  children,
  sx = {},
  direction = "row",
  ...rest
}) => {
  const { isMobile } = useResponsive();

  return (
    <Stack
      direction={isMobile ? "column" : direction}
      spacing={isMobile ? 2 : 2}
      sx={{ width: "100%", ...sx }}
      {...rest}
    >
      {children}
    </Stack>
  );
};
