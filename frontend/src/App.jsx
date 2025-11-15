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
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

// App principal
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CustomThemeProvider>
          <AppContent />
        </CustomThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
