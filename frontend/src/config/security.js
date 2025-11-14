/**
 * @fileoverview Configurações de segurança para o frontend
 * Este arquivo define configurações específicas de segurança para o cliente
 */

// Configurações de Content Security Policy para desenvolvimento
export const CSP_CONFIG = {
  development: {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-eval'", "'unsafe-inline'"],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'", "http://localhost:3001", "ws://localhost:*"],
  },
  production: {
    "default-src": ["'self'"],
    "script-src": ["'self'"],
    "style-src": ["'self'", "https://fonts.googleapis.com"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:"],
    "connect-src": ["'self'"],
  },
};

// Configurações de validação do cliente
export const CLIENT_VALIDATION = {
  // Limites de input
  maxInputLengths: {
    shortText: 100,
    mediumText: 500,
    longText: 2000,
    email: 320,
  },

  // Patterns de validação
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[1-9]\d{1,14}$/,
    currency: /^\d+(\.\d{1,2})?$/,
    alphanumeric: /^[a-zA-Z0-9\s]+$/,
  },

  // Validação de arquivos
  fileUpload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxFiles: 5,
  },
};

// Configurações de segurança da sessão
export const SESSION_CONFIG = {
  tokenKey: "finance_flow_token",
  refreshTokenKey: "finance_flow_refresh",
  maxAge: 24 * 60 * 60 * 1000, // 24 horas
  checkInterval: 5 * 60 * 1000, // Verificar a cada 5 minutos
};

// Headers de segurança para requisições
export const SECURITY_HEADERS = {
  "X-Requested-With": "XMLHttpRequest",
  "Cache-Control": "no-store",
  Pragma: "no-cache",
};

// Configurações anti-CSRF
export const CSRF_CONFIG = {
  tokenHeader: "X-CSRF-Token",
  cookieName: "csrf_token",
  paramName: "_csrf",
};

/**
 * Sanitiza input do usuário no frontend
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/[<>]/g, "");
};

/**
 * Valida se uma string é segura para exibição
 */
export const isSafeString = (input) => {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /vbscript:/i,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(input));
};

/**
 * Configura interceptadores do Axios para segurança
 */
export const setupAxiosInterceptors = (axiosInstance) => {
  // Request interceptor para adicionar headers de segurança
  axiosInstance.interceptors.request.use(
    (config) => {
      // Adicionar headers de segurança
      Object.assign(config.headers, SECURITY_HEADERS);

      // Adicionar token se disponível
      const token = localStorage.getItem(SESSION_CONFIG.tokenKey);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor para lidar com erros de autenticação
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expirado ou inválido
        localStorage.removeItem(SESSION_CONFIG.tokenKey);
        localStorage.removeItem(SESSION_CONFIG.refreshTokenKey);
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Configurações de rate limiting do cliente
 */
export const CLIENT_RATE_LIMITS = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutos
  },
  api: {
    maxRequests: 60,
    windowMs: 60 * 1000, // 1 minuto
  },
  upload: {
    maxUploads: 3,
    windowMs: 5 * 60 * 1000, // 5 minutos
  },
};

/**
 * Utilitário para rate limiting no cliente
 */
class ClientRateLimit {
  constructor(name, config) {
    this.name = name;
    this.maxAttempts = config.maxAttempts;
    this.windowMs = config.windowMs;
    this.attempts = this.getAttempts();
  }

  getAttempts() {
    const stored = localStorage.getItem(`rateLimit_${this.name}`);
    if (!stored) return [];

    const attempts = JSON.parse(stored);
    const now = Date.now();

    // Limpar tentativas antigas
    return attempts.filter((time) => now - time < this.windowMs);
  }

  saveAttempts() {
    localStorage.setItem(
      `rateLimit_${this.name}`,
      JSON.stringify(this.attempts)
    );
  }

  isAllowed() {
    const now = Date.now();
    this.attempts = this.attempts.filter((time) => now - time < this.windowMs);

    return this.attempts.length < this.maxAttempts;
  }

  recordAttempt() {
    this.attempts.push(Date.now());
    this.saveAttempts();
  }

  getRemainingTime() {
    if (this.attempts.length < this.maxAttempts) return 0;

    const oldestAttempt = Math.min(...this.attempts);
    const remainingTime = this.windowMs - (Date.now() - oldestAttempt);

    return Math.max(0, remainingTime);
  }
}

export { ClientRateLimit };
