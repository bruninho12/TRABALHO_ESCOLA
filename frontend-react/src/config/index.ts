const CONFIG = {
  // API configuration
  API: {
    BASE_URL: "http://localhost:3001/api",
    VERSION: "v1",
    ENDPOINTS: {
      AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        VERIFY: "/auth/verify",
      },
      USERS: {
        PROFILE: "/users/profile",
        UPDATE: "/users/update",
        SETTINGS: "/users/settings",
      },
      TRANSACTIONS: {
        LIST: "/transactions",
        CREATE: "/transactions",
        UPDATE: "/transactions/:id",
        DELETE: "/transactions/:id",
        STATS: "/transactions/stats",
        EXPORT: "/transactions/export",
        RECURRING: "/transactions/recurring",
      },
      CATEGORIES: {
        LIST: "/categories",
        CREATE: "/categories",
        UPDATE: "/categories/:id",
        DELETE: "/categories/:id",
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
    },
  },

  // Default categories
  CATEGORIES: {
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
  },

  // Chart colors
  CHART_COLORS: {
    INCOME: "rgba(16, 185, 129, 0.7)",
    EXPENSE: "rgba(239, 68, 68, 0.7)",
    BALANCE: "rgba(102, 126, 234, 0.7)",
    CATEGORIES: [
      "#667eea",
      "#764ba2",
      "#10b981",
      "#ef4444",
      "#f59e0b",
      "#8b5cf6",
      "#06b6d4",
      "#84cc16",
      "#f97316",
      "#ec4899",
    ],
  },

  // Date formats
  DATE_FORMATS: {
    DISPLAY: "DD/MM/YYYY",
    INPUT: "YYYY-MM-DD",
    API: "YYYY-MM-DD",
  },

  // Pagination defaults
  PAGINATION: {
    LIMIT: 10,
    INITIAL_PAGE: 1,
  },

  // Local storage keys
  STORAGE_KEYS: {
    TOKEN: "finance_flow_token",
    USER: "finance_flow_user",
    SETTINGS: "finance_flow_settings",
    THEME: "finance_flow_theme",
    REMEMBER_ME: "finance_flow_remember",
  },

  // Default settings
  DEFAULT_SETTINGS: {
    THEME: "light",
    NOTIFICATIONS_ENABLED: true,
    SHOW_CENTS: true,
  },

  // Animation durations in ms
  ANIMATIONS: {
    CARD: 300,
    MODAL: 300,
    CHART: 800,
    TABLE_ROW: 500,
  },

  // Default demo account
  DEMO_ACCOUNT: {
    EMAIL: "demo@despfinancee.com",
    PASSWORD: "senha123",
  },
} as const;

export default CONFIG;
