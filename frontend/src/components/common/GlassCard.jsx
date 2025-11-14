/**
 * @fileoverview Componente GlassCard - Card com efeito Glassmorphism
 * Componente premium reutilizável com efeito de vidro fosco
 */

import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

// ============= STYLED COMPONENT =============
const StyledGlassCard = styled(Box)(({ theme, variant, blur, opacity }) => {
  const variants = {
    default: {
      background: `rgba(255, 255, 255, ${opacity})`,
      border: "1px solid rgba(255, 255, 255, 0.18)",
    },
    primary: {
      background: `rgba(99, 102, 241, ${opacity})`,
      border: "1px solid rgba(99, 102, 241, 0.3)",
    },
    success: {
      background: `rgba(16, 185, 129, ${opacity})`,
      border: "1px solid rgba(16, 185, 129, 0.3)",
    },
    dark: {
      background: `rgba(31, 41, 55, ${opacity})`,
      border: "1px solid rgba(255, 255, 255, 0.1)",
    },
  };

  return {
    position: "relative",
    ...variants[variant],
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    borderRadius: theme.spacing(2),
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.45)",
    },

    // Efeito de brilho no hover
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
      transition: "left 0.5s",
    },

    "&:hover::before": {
      left: "100%",
    },
  };
});

// ============= COMPONENTE PRINCIPAL =============
const GlassCard = ({
  children,
  variant = "default",
  blur = 10,
  opacity = 0.1,
  padding = 3,
  elevation = 0,
  ...otherProps
}) => {
  return (
    <StyledGlassCard
      variant={variant}
      blur={blur}
      opacity={opacity}
      p={padding}
      elevation={elevation}
      {...otherProps}
    >
      {children}
    </StyledGlassCard>
  );
};

// ============= PROP TYPES =============
GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "primary", "success", "dark"]),
  blur: PropTypes.number,
  opacity: PropTypes.number,
  padding: PropTypes.number,
  elevation: PropTypes.number,
};

export default GlassCard;
