/**
 * @fileoverview Design System Premium - DespFinancee
 * Paleta de cores, tipografia, espaçamentos e tokens de design
 */

// ============= PALETA DE CORES PREMIUM =============
export const colors = {
  // Cores Principais
  primary: {
    main: "#6366F1", // Índigo vibrante
    dark: "#4F46E5",
    light: "#A5B4FC",
    lighter: "#C7D2FE",
    lightest: "#E0E7FF",
    50: "#EEF2FF",
    100: "#E0E7FF",
    200: "#C7D2FE",
    300: "#A5B4FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
  },

  secondary: {
    main: "#8B5CF6", // Roxo
    dark: "#7C3AED",
    light: "#A78BFA",
    lighter: "#C4B5FD",
    lightest: "#DDD6FE",
  },

  // Cores de Status
  success: {
    main: "#10B981", // Verde esmeralda
    dark: "#059669",
    light: "#34D399",
    bg: "#D1FAE5",
    text: "#065F46",
  },

  warning: {
    main: "#F59E0B", // Âmbar
    dark: "#D97706",
    light: "#FBD38D",
    bg: "#FEF3C7",
    text: "#92400E",
  },

  error: {
    main: "#EF4444", // Vermelho coral
    dark: "#DC2626",
    light: "#FCA5A5",
    bg: "#FEE2E2",
    text: "#991B1B",
  },

  info: {
    main: "#3B82F6", // Azul oceano
    dark: "#2563EB",
    light: "#93C5FD",
    bg: "#DBEAFE",
    text: "#1E40AF",
  },

  // Cores Neutras
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },

  // Cores Especiais
  background: {
    default: "#FFFFFF",
    paper: "#F9FAFB",
    dark: "#111827",
    paperDark: "#1F2937",
  },

  text: {
    primary: "#111827",
    secondary: "#6B7280",
    disabled: "#9CA3AF",
    hint: "#D1D5DB",
    primaryDark: "#F9FAFB",
    secondaryDark: "#9CA3AF",
  },
};

// ============= GRADIENTES PREMIUM =============
export const gradients = {
  primary: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  success: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
  warning: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  info: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  premium: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  sunset: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  ocean: "linear-gradient(135deg, #2e3192 0%, #1bffff 100%)",
  purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  dark: "linear-gradient(135deg, #2c3e50 0%, #000000 100%)",
};

// ============= SOMBRAS PREMIUM =============
export const shadows = {
  // Sombras suaves
  xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",

  // Sombras coloridas
  primaryGlow: "0 0 20px rgba(99, 102, 241, 0.4)",
  successGlow: "0 0 20px rgba(16, 185, 129, 0.4)",
  warningGlow: "0 0 20px rgba(245, 158, 11, 0.4)",
  errorGlow: "0 0 20px rgba(239, 68, 68, 0.4)",

  // Glassmorphism
  glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
};

// ============= TIPOGRAFIA =============
export const typography = {
  fontFamily: {
    primary:
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    secondary: '"Poppins", sans-serif',
    mono: '"Fira Code", "Courier New", monospace',
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
    "6xl": "3.75rem", // 60px
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

// ============= ESPAÇAMENTOS =============
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
};

// ============= BORDAS =============
export const borders = {
  radius: {
    none: "0",
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },

  width: {
    0: "0",
    1: "1px",
    2: "2px",
    4: "4px",
    8: "8px",
  },
};

// ============= TRANSIÇÕES =============
export const transitions = {
  duration: {
    fast: "150ms",
    normal: "300ms",
    slow: "500ms",
  },

  easing: {
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  },
};

// ============= BREAKPOINTS =============
export const breakpoints = {
  xs: "0px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// ============= Z-INDEX =============
export const zIndex = {
  modal: 1300,
  drawer: 1200,
  appBar: 1100,
  tooltip: 1500,
  notification: 1400,
  dropdown: 1000,
};

// ============= EFEITOS ESPECIAIS =============
export const effects = {
  // Glassmorphism
  glass: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px) saturate(180%)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: shadows.glass,
  },

  // Neumorphism
  neumorphic: {
    light: {
      background: "#e0e5ec",
      boxShadow:
        "9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255,0.5)",
    },
    dark: {
      background: "#2d3436",
      boxShadow:
        "9px 9px 16px rgba(0,0,0,0.4), -9px -9px 16px rgba(70,70,70,0.1)",
    },
  },

  // Hover effects
  hover: {
    lift: {
      transform: "translateY(-4px)",
      boxShadow: shadows.lg,
    },
    scale: {
      transform: "scale(1.05)",
    },
    glow: {
      boxShadow: shadows.primaryGlow,
    },
  },
};

// ============= ANIMAÇÕES =============
export const animations = {
  // Bounce
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,

  // Fade in
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,

  // Slide in
  slideInRight: `
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,

  // Pulse
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,

  // Shimmer (loading)
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
  `,
};

// ============= TEMA COMPLETO =============
export const theme = {
  colors,
  gradients,
  shadows,
  typography,
  spacing,
  borders,
  transitions,
  breakpoints,
  zIndex,
  effects,
  animations,
};

export default theme;
