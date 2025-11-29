import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Alert,
  Chip,
  Paper,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

/**
 * Componente para mostrar o status da conectividade com a API
 * Útil durante desenvolvimento para debug de problemas de CSP/CORS
 */
export default function ApiStatus() {
  const [status, setStatus] = useState("checking"); // checking, connected, error
  const [apiUrl, setApiUrl] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const possibleApiUrls = [
    "http://localhost:3001/api",
    "http://127.0.0.1:3001/api",
    "http://192.168.100.7:3001/api",
    `${window.location.protocol}//${window.location.hostname}:3001/api`,
  ];

  const checkApiConnectivity = async (url, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔍 Testando API em: ${url} (tentativa ${i + 1})`);

        const response = await fetch(`${url}/health`, {
          method: "GET",
          mode: "cors",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(`✅ API conectada em: ${url}`);
          return { success: true, url };
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        console.warn(`❌ Falha na API ${url}:`, error.message);

        if (i === retries - 1) {
          return {
            success: false,
            url,
            error: error.message,
          };
        }

        // Aguardar antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  const testAllApis = async () => {
    setStatus("checking");
    setIsRefreshing(true);

    for (const url of possibleApiUrls) {
      const result = await checkApiConnectivity(url);

      if (result.success) {
        setStatus("connected");
        setApiUrl(result.url);
        setErrorDetails("");
        setIsRefreshing(false);
        return;
      }
    }

    // Se chegou aqui, nenhuma API funcionou
    setStatus("error");
    setErrorDetails(
      "Nenhuma API acessível encontrada. Verifique se o servidor backend está rodando."
    );
    setIsRefreshing(false);
  };

  useEffect(() => {
    testAllApis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    testAllApis();
  };

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "success";
      case "error":
        return "error";
      default:
        return "warning";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckIcon />;
      case "error":
        return <ErrorIcon />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Conectado";
      case "error":
        return "Desconectado";
      default:
        return "Verificando...";
    }
  };

  // Só mostrar em desenvolvimento
  const isDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.");

  if (!isDevelopment) {
    return null;
  }

  return (
    <Paper
      elevation={1}
      sx={{
        position: "fixed",
        top: 16,
        right: 16,
        p: 2,
        minWidth: 300,
        maxWidth: 400,
        zIndex: 9999,
        border: `2px solid ${
          status === "connected"
            ? "#4caf50"
            : status === "error"
            ? "#f44336"
            : "#ff9800"
        }`,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1}
      >
        <Typography variant="h6" component="div">
          Status da API
        </Typography>

        <Box display="flex" alignItems="center" gap={1}>
          <Chip
            icon={getStatusIcon()}
            label={getStatusText()}
            color={getStatusColor()}
            size="small"
          />

          <Button
            size="small"
            onClick={handleRefresh}
            disabled={isRefreshing}
            startIcon={<RefreshIcon />}
          >
            Testar
          </Button>
        </Box>
      </Box>

      {isRefreshing && <LinearProgress sx={{ mb: 2 }} />}

      {status === "connected" && (
        <Alert severity="success" sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>Conectado:</strong> {apiUrl.replace("/api", "")}
          </Typography>
        </Alert>
      )}

      {status === "error" && (
        <Alert severity="error" sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>Erro:</strong> {errorDetails}
          </Typography>

          <Box mt={1}>
            <Typography variant="caption" display="block">
              URLs testadas:
            </Typography>
            {possibleApiUrls.map((url, index) => (
              <Typography
                key={index}
                variant="caption"
                display="block"
                sx={{ ml: 1 }}
              >
                • {url.replace("/api", "")}
              </Typography>
            ))}
          </Box>
        </Alert>
      )}

      <Typography variant="caption" color="textSecondary">
        CSP:{" "}
        {document.querySelector('meta[http-equiv="Content-Security-Policy"]')
          ? "🔒 Ativa"
          : "🔓 Desabilitada"}
      </Typography>
    </Paper>
  );
}

/**
 * Hook para usar o status da API em outros componentes
 */
export const useApiStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [apiUrl, setApiUrl] = useState("");

  useEffect(() => {
    // Implementar lógica de verificação similar
    const checkConnection = async () => {
      // Lógica simplificada aqui
      try {
        const response = await fetch("http://localhost:3001/api/health");
        setIsConnected(response.ok);
        if (response.ok) {
          setApiUrl("http://localhost:3001");
        }
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Verificar a cada 30s

    return () => clearInterval(interval);
  }, []);

  return { isConnected, apiUrl };
};
