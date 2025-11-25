/**
 * @fileoverview Componente de status da API
 * Mostra status da conexão e permite reconexão
 */

import React from "react";
import {
  Box,
  Alert,
  Button,
  Typography,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import {
  Wifi as ConnectedIcon,
  WifiOff as DisconnectedIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useApiConfig } from "../hooks/useApiConfig";

const ApiStatus = ({ showFullStatus = false }) => {
  const { apiUrl, isConnected, isLoading, error, reconnect } = useApiConfig();

  if (isLoading && !showFullStatus) {
    return null; // Não mostrar loading no header
  }

  if (isConnected && !showFullStatus) {
    return null; // Não mostrar quando tudo está funcionando
  }

  const getStatusColor = () => {
    if (isLoading) return "warning";
    if (isConnected) return "success";
    return "error";
  };

  const getStatusIcon = () => {
    if (isLoading) return <CircularProgress size={16} />;
    if (isConnected) return <ConnectedIcon fontSize="small" />;
    return <DisconnectedIcon fontSize="small" />;
  };

  const getStatusText = () => {
    if (isLoading) return "Conectando...";
    if (isConnected) return "Conectado";
    return "Desconectado";
  };

  if (showFullStatus) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Status da Conexão API
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              URL da API:
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              {apiUrl || "Não configurada"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Status:
            </Typography>
            <Chip
              icon={getStatusIcon()}
              label={getStatusText()}
              color={getStatusColor()}
              size="small"
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Typography variant="body2">
                <strong>Erro:</strong> {error}
              </Typography>
            </Alert>
          )}

          <Box>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={reconnect}
              disabled={isLoading}
              size="small"
            >
              {isLoading ? "Reconectando..." : "Testar Conexão"}
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }

  // Versão compacta para exibir em caso de erro
  return (
    <Alert
      severity={getStatusColor()}
      sx={{ mb: 2 }}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={reconnect}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={16} /> : "Reconectar"}
        </Button>
      }
    >
      <Typography variant="body2">
        {isLoading && "Detectando servidor..."}
        {!isLoading && !isConnected && "Servidor indisponível"}
        {error && `: ${error}`}
      </Typography>
    </Alert>
  );
};

export default ApiStatus;
