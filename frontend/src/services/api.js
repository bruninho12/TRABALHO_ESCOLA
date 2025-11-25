import axios from "axios";
import {
  getApiUrl,
  API_CONFIG,
  DEFAULT_HEADERS,
  findWorkingApiUrl,
} from "../config/api";

// Detectar automaticamente a melhor API no carregamento
let dynamicBaseURL = getApiUrl();

// Tentar encontrar API funcionando em background
findWorkingApiUrl()
  .then((workingUrl) => {
    if (workingUrl !== dynamicBaseURL) {
      dynamicBaseURL = workingUrl;
      api.defaults.baseURL = workingUrl;
      console.log("🔄 API URL atualizada para:", workingUrl);
    }
  })
  .catch(() => {
    console.debug("🔍 Detecção de API em background falhou");
  });

const api = axios.create({
  baseURL: dynamicBaseURL,
  timeout: API_CONFIG.timeout,
  headers: DEFAULT_HEADERS,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("finance_flow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Desabilitar cache para requisições GET
  if (config.method === "get") {
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
    // Adicionar timestamp para força requisição fresh
    config.params = config.params || {};
    config.params.t = new Date().getTime();
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Não logar erros de rede para reduzir ruído no console
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      console.debug("API não disponível, modo offline");
      return Promise.reject(new Error("API_OFFLINE"));
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("finance_flow_token");
      // Só redirecionar se não estiver já na página de login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Serviço de autenticação
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
  refreshToken: async (refreshToken) => {
    const response = await api.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },
};

// Serviço de categorias
export const categoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  create: async (category) => {
    const response = await api.post("/categories", category);
    return response.data;
  },
  update: async (id, category) => {
    const response = await api.put(`/categories/${id}`, category);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/categories/${id}`);
  },
};

// Serviço de transações
export const transactionService = {
  getAll: async () => {
    const response = await api.get("/transactions");
    return response.data;
  },
  create: async (transaction) => {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },
  update: async ({ id, transaction }) => {
    const response = await api.put(`/transactions/${id}`, transaction);
    return response.data;
  },
  delete: async (id) => {
    await api.delete(`/transactions/${id}`);
  },
  getSummary: async () => {
    const response = await api.get("/transactions/summary");
    return response.data;
  },
};

export default api;
