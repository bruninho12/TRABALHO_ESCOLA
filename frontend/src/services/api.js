import axios from "axios";
import {
  getApiUrl,
  API_CONFIG,
  DEFAULT_HEADERS,
  findWorkingApiUrl,
} from "../config/api";

// ---------------------------
// 1. Criar Axios imediatamente
// ---------------------------
const api = axios.create({
  baseURL: getApiUrl(), // Valor inicial
  timeout: API_CONFIG.timeout,
  headers: DEFAULT_HEADERS,
});

// ---------------------------
// 2. Atualizar baseURL dinamicamente (ASSÍNCRONO)
//    sem recriar o Axios
// ---------------------------
findWorkingApiUrl()
  .then((workingUrl) => {
    if (workingUrl && workingUrl !== api.defaults.baseURL) {
      api.defaults.baseURL = workingUrl;
      console.log("🔄 API URL atualizada para:", workingUrl);
    }
  })
  .catch(() => {
    console.debug("🔍 Detecção de API em background falhou");
  });

// ---------------------------
// 3. INTERCEPTOR DE REQUEST
// ---------------------------
api.interceptors.request.use((config) => {
  // Incluir token se existir
  const token =
    localStorage.getItem("token") || localStorage.getItem("finance_flow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Forçar requisição fresh para GET
  if (config.method === "get") {
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    // Timestamp evita cache do navegador
    config.params = config.params || {};
    config.params._t = Date.now();
  }

  return config;
});

// ---------------------------
// 4. INTERCEPTOR DE RESPOSTA
// ---------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // API offline
    if (error.code === "ERR_NETWORK" || error.code === "ECONNREFUSED") {
      console.debug("⚠️ API offline ou indisponível");
      return Promise.reject(new Error("API_OFFLINE"));
    }

    // Token inválido ou expirado
    if (error.response?.status === 401) {
      localStorage.removeItem("finance_flow_token");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------
// Serviços externos usando a mesma instância "api"
// --------------------------------------------------

// 🔐 Autenticação
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

// 📂 Categorias
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

// 💸 Transações
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
