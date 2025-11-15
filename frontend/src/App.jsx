// React Router
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

// Contextos principais
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./styles/theme";

// React Query
import { QueryClient, QueryClientProvider } from "react-query";

// MUI Theme
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./styles/theme";

// Estilos globais
import "./styles/animations.css";
import "./styles/components.css";
import "./App.css";

// React Query config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Conteúdo principal da aplicação
function AppContent() {
  const { isDarkMode } = useThemeContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <CssBaseline />
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Provider global de tema + AppContent
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AppContent />
        <FloatingFeedbackButton />
      </AuthProvider>
    </ThemeProvider>
  );
}
