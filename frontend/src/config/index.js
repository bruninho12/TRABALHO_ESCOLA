/**
 * @fileoverview Configurações globais da aplicação frontend
 */

// URLs da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
  WS_URL: import.meta.env.VITE_WS_URL || "ws://localhost:3001",

  // Versão da API
  VERSION: "v2.0",

  // Timeout padrão para requisições
  TIMEOUT: 10000,

  // Endpoints principais
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH: "/auth/refresh-token",
      FORGOT_PASSWORD: "/auth/forgot-password",
      RESET_PASSWORD: "/auth/reset-password",
      VERIFY_EMAIL: "/auth/verify-email",
      ME: "/auth/me",
    },
    USERS: {
      PROFILE: "/users/profile",
      UPDATE_PROFILE: "/users/profile",
      SETTINGS: "/users/settings",
      DELETE_ACCOUNT: "/users/delete",
    },
    TRANSACTIONS: {
      LIST: "/transactions",
      CREATE: "/transactions",
      UPDATE: "/transactions/:id",
      DELETE: "/transactions/:id",
      SUMMARY: "/transactions/summary",
      SEARCH: "/transactions/search",
    },
    CATEGORIES: {
      LIST: "/categories",
      CREATE: "/categories",
      UPDATE: "/categories/:id",
      DELETE: "/categories/:id",
    },
    GOALS: {
      LIST: "/goals",
      CREATE: "/goals",
      UPDATE: "/goals/:id",
      DELETE: "/goals/:id",
      PROGRESS: "/goals/progress",
    },
    BUDGETS: {
      LIST: "/budgets",
      CREATE: "/budgets",
      UPDATE: "/budgets/:id",
      DELETE: "/budgets/:id",
      PROGRESS: "/budgets/progress",
    },
    REPORTS: {
      SUMMARY: "/reports/summary",
      MONTHLY: "/reports/monthly",
      CATEGORIES: "/reports/categories",
      INCOME_SOURCES: "/reports/income-sources",
      EXPORT: "/reports/export",
    },
    NOTIFICATIONS: {
      LIST: "/notifications",
      READ: "/notifications/read",
      READ_ALL: "/notifications/read-all",
    },
    RPG: {
      PROFILE: "/rpg/profile",
      LEVEL_UP: "/rpg/level-up",
      ACHIEVEMENTS: "/rpg/achievements",
      MISSIONS: "/rpg/missions",
    },
  },
};

// Categorias padrão
export const DEFAULT_CATEGORIES = {
  INCOME: ["Salário", "Freelance", "Investimentos", "Vendas", "Outros"],
  EXPENSE: [
    "Alimentação",
    "Transporte",
    "Moradia",
    "Saúde",
    "Educação",
    "Lazer",
    "Roupas",
    "Outros",
  ],
};

// Cores para gráficos
export const CHART_COLORS = {
  PRIMARY: ["#6366F1", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
  SECONDARY: ["#A5B4FC", "#C4B5FD", "#6EE7B7", "#FCD34D", "#FCA5A5", "#93C5FD"],
  GRADIENTS: {
    INCOME: "linear-gradient(135deg, #10B981 0%, #34D399 100%)",
    EXPENSE: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
    BALANCE: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  },
};

// Configurações de tema
export const THEME_CONFIG = {
  DEFAULT_MODE: "light",
  STORAGE_KEY: "despfinance_theme",
  TRANSITIONS: {
    DURATION: 300,
    EASING: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

// Configurações de localStorage
export const STORAGE_KEYS = {
  TOKEN: "finance_flow_token",
  REFRESH_TOKEN: "finance_flow_refresh_token",
  USER: "finance_flow_user",
  THEME: "finance_flow_theme",
  SETTINGS: "finance_flow_settings",
};

// Configurações de paginação
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Configurações de validação
export const VALIDATION_CONFIG = {
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: false,
    REQUIRE_LOWERCASE: false,
    REQUIRE_NUMBERS: false,
    REQUIRE_SYMBOLS: false,
  },
  EMAIL: {
    MAX_LENGTH: 254,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  TRANSACTION: {
    MAX_AMOUNT: 999999999.99,
    MIN_AMOUNT: 0.01,
    DESCRIPTION_MAX_LENGTH: 500,
  },
};

// Configurações de formatação
export const FORMAT_CONFIG = {
  CURRENCY: {
    LOCALE: "pt-BR",
    CURRENCY: "BRL",
    SHOW_CENTS: true,
  },
  DATE: {
    LOCALE: "pt-BR",
    DEFAULT_FORMAT: "dd/MM/yyyy",
    DATETIME_FORMAT: "dd/MM/yyyy HH:mm",
  },
  NUMBER: {
    LOCALE: "pt-BR",
    DECIMAL_PLACES: 2,
  },
};

export default {
  API_CONFIG,
  DEFAULT_CATEGORIES,
  CHART_COLORS,
  THEME_CONFIG,
  STORAGE_KEYS,
  PAGINATION_CONFIG,
  VALIDATION_CONFIG,
  FORMAT_CONFIG,
};
