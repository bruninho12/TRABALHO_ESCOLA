import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("finance_flow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("finance_flow_token");
      window.location.href = "/login";
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
