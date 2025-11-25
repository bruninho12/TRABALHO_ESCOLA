// React Router
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

// Contextos principais
import { AuthProvider } from "./contexts/AuthContext";
import {
  ThemeProvider as CustomThemeProvider,
  useThemeContext,
} from "./contexts/ThemeContext";

// React Query
import { QueryClient, QueryClientProvider } from "react-query";

// MUI Theme
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./styles/theme";

// Error Boundary
import ErrorBoundary from "./components/ErrorBoundary";

// Estilos globais
import "./styles/animations.css";
import "./styles/components.css";
import "./App.css";

// Configuração de segurança dinâmica
import "./config/security";

// React Query config com error handling melhorado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Não tentar novamente em erros de autenticação
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          return false;
        }
        // Máximo 2 tentativas para outros erros
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
    mutations: {
      retry: false, // Não repetir mutações automaticamente
    },
  },
});

// Conteúdo principal da aplicação
function AppContent() {
  const { isDarkMode } = useThemeContext();

  return (
    <ErrorBoundary>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// App principal
export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CustomThemeProvider>
            <AppContent />
          </CustomThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
