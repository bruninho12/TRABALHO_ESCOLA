/**
 * @fileoverview Configurações de segurança para o frontend
 * Este arquivo define configurações específicas de segurança para o cliente
 */

/**
 * Classe para gerenciar CSP dinamicamente baseado no ambiente
 */
class SecurityManager {
  constructor() {
    this.isDevelopment = this.detectDevelopmentEnvironment();
    this.currentDomain = window.location.origin;
    this.init();
  }

  detectDevelopmentEnvironment() {
    const hostname = window.location.hostname;

    // Detectar ambiente de desenvolvimento
    const devPatterns = [
      "localhost",
      "127.0.0.1",
      /^192\.168\./,
      /^10\./,
      /^172\.1[6-9]\./,
      /^172\.2[0-9]\./,
      /^172\.3[0-1]\./,
    ];

    return devPatterns.some((pattern) => {
      if (typeof pattern === "string") {
        return hostname === pattern;
      }
      return pattern.test(hostname);
    });
  }

  init() {
    if (this.isDevelopment) {
      this.setupDevelopmentSecurity();
    } else {
      this.setupProductionSecurity();
    }
  }

  setupDevelopmentSecurity() {
    console.log("🔧 Configurando segurança para DESENVOLVIMENTO");

    // Em desenvolvimento, não fazemos nada aqui porque a CSP já foi configurada no HTML
    console.log("🔓 Segurança de desenvolvimento já configurada no HTML");

    // Permitir conexões locais
    this.allowLocalConnections();
  }

  setupProductionSecurity() {
    console.log("🔒 Configurando segurança para PRODUÇÃO");
    this.enforceProductionCSP();
  }

  allowLocalConnections() {
    // Configurar fetch para aceitar conexões locais
    if (!window.originalFetch) {
      window.originalFetch = window.fetch;

      window.fetch = async (url, options = {}) => {
        const devOptions = {
          ...options,
          mode: "cors",
          credentials: "include",
        };

        try {
          return await window.originalFetch(url, devOptions);
        } catch (error) {
          console.warn("🚨 Erro de conectividade:", error.message);
          throw error;
        }
      };
    }
  }

  enforceProductionCSP() {
    const csp = this.getProductionCSP();

    let cspMeta = document.querySelector(
      'meta[http-equiv="Content-Security-Policy"]'
    );
    if (!cspMeta) {
      cspMeta = document.createElement("meta");
      cspMeta.setAttribute("http-equiv", "Content-Security-Policy");
      document.head.appendChild(cspMeta);
    }

    cspMeta.setAttribute("content", csp);
    console.log("🛡️ CSP de produção aplicada");
  }

  getProductionCSP() {
    return [
      "default-src 'self'",
      "script-src 'self' https://js.stripe.com https://www.mercadopago.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.stripe.com https://api.mercadopago.com",
      "frame-src https://js.stripe.com https://www.mercadopago.com",
      "worker-src 'self' blob:",
      "child-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
    ].join("; ");
  }

  async checkApiConnectivity(apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        mode: "cors",
        timeout: 5000,
      });

      return response.ok;
    } catch (error) {
      console.warn(`❌ API não acessível em ${apiUrl}:`, error.message);
      return false;
    }
  }

  async detectBestApiUrl(possibleUrls) {
    console.log("🔍 Testando conectividade com APIs...");

    for (const url of possibleUrls) {
      const isAccessible = await this.checkApiConnectivity(url);
      if (isAccessible) {
        console.log(`✅ API acessível em: ${url}`);
        return url;
      }
    }

    console.warn("❌ Nenhuma API acessível encontrada");
    return possibleUrls[0]; // fallback
  }
}

// Inicializar e exportar gerenciador de segurança
const SECURITY_MANAGER = new SecurityManager();

// Configurações de Content Security Policy para desenvolvimento
export const CSP_CONFIG = {
  development: {
    // CSP muito permissiva para desenvolvimento - aplicada diretamente no HTML
    allowAll: true,
  },
  production: {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "https://js.stripe.com",
      "https://www.mercadopago.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "style-src-elem": [
      "'self'",
      "'unsafe-inline'",
      "https://fonts.googleapis.com",
    ],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "img-src": ["'self'", "data:", "https:", "blob:"],
    "connect-src": [
      "'self'",
      "https://api.stripe.com",
      "https://api.mercadopago.com",
    ],
    "frame-src": ["https://js.stripe.com", "https://www.mercadopago.com"],
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

export { ClientRateLimit, SecurityManager, SECURITY_MANAGER };
