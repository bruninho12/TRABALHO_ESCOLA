// ==========================================
// 🧪 Test Utils - Helpers para Testes
// Utilities comuns para facilitar testes
// ==========================================

import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "@contexts/AuthContext";
import { vi } from "vitest";

// Tema padrão para testes
const testTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

// Wrapper personalizado para renderizar componentes com providers
export function renderWithProviders(
  ui,
  {
    // Automatically create a store instance if no store was passed in
    route = "/",
    theme = testTheme,
    ...renderOptions
  } = {}
) {
  // Mock do usuário autenticado
  const mockUser = {
    id: "test-user-id",
    name: "Usuário Teste",
    email: "teste@exemplo.com",
    isAuthenticated: true,
  };

  // Mock do contexto de autenticação
  const mockAuthContext = {
    user: mockUser,
    login: vi.fn(),
    logout: vi.fn(),
    isLoading: false,
    isAuthenticated: true,
  };

  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider value={mockAuthContext}>{children}</AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  // Set initial route
  window.history.pushState({}, "Test page", route);

  return {
    user: mockUser,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Wrapper simples para componentes que só precisam de roteamento
export function renderWithRouter(ui, { route = "/" } = {}) {
  window.history.pushState({}, "Test page", route);

  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

// Mock de dados de transações
export const mockTransactions = [
  {
    id: "1",
    description: "Salário",
    amount: 5000.0,
    type: "income",
    category: "Trabalho",
    date: "2024-01-15",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    description: "Supermercado",
    amount: -250.5,
    type: "expense",
    category: "Alimentação",
    date: "2024-01-16",
    createdAt: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    description: "Conta de luz",
    amount: -120.0,
    type: "expense",
    category: "Casa",
    date: "2024-01-17",
    createdAt: "2024-01-17T09:15:00Z",
  },
];

// Mock de categorias
export const mockCategories = [
  { id: "1", name: "Trabalho", type: "income", color: "#4caf50" },
  { id: "2", name: "Alimentação", type: "expense", color: "#f44336" },
  { id: "3", name: "Casa", type: "expense", color: "#ff9800" },
  { id: "4", name: "Transporte", type: "expense", color: "#2196f3" },
  { id: "5", name: "Lazer", type: "expense", color: "#9c27b0" },
];

// Mock de metas financeiras
export const mockGoals = [
  {
    id: "1",
    title: "Emergência",
    description: "Reserva de emergência",
    targetAmount: 10000,
    currentAmount: 3500,
    targetDate: "2024-12-31",
    status: "active",
  },
  {
    id: "2",
    title: "Viagem",
    description: "Férias em família",
    targetAmount: 5000,
    currentAmount: 1200,
    targetDate: "2024-07-15",
    status: "active",
  },
];

// Helpers para testes de API
export function createMockApiResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
}

// Helper para simular erro de API
export function createMockApiError(message = "Erro de API", status = 500) {
  const error = new Error(message);
  error.response = {
    status,
    statusText: "Internal Server Error",
    data: { message },
  };
  return error;
}

// Helper para aguardar async operations nos testes
export function waitFor(fn, timeout = 1000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    function check() {
      try {
        const result = fn();
        if (result) {
          resolve(result);
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error("Timeout waiting for condition"));
        } else {
          setTimeout(check, 10);
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error);
        } else {
          setTimeout(check, 10);
        }
      }
    }

    check();
  });
}

// Mock do Chart.js para testes
export const mockChartJs = {
  Chart: vi.fn(),
  registerables: [],
};

// Helper para testes de formulários
export function createFormData(fields) {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return formData;
}

// Export all testing utilities
export * from "@testing-library/react";
export { vi } from "vitest";
