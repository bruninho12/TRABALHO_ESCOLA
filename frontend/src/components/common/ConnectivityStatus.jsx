import React, { useState, useEffect } from "react";
import { Snackbar, Alert, IconButton } from "@mui/material";
import {
  Close as CloseIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
} from "@mui/icons-material";

/**
 * Componente para notificar problemas de conectividade de forma discreta
 */
export default function ConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiStatus, setApiStatus] = useState("checking"); // checking, online, offline
  const [showNotification, setShowNotification] = useState(false);

  // Verificar status da API
  const checkApiStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch("/api/health", {
        signal: controller.signal,
        headers: { "Cache-Control": "no-cache" },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        if (apiStatus !== "online") {
          setApiStatus("online");
          if (apiStatus === "offline") {
            setShowNotification(true);
          }
        }
      } else {
        throw new Error("API not responding");
      }
    } catch (error) {
      if (apiStatus !== "offline") {
        setApiStatus("offline");
        setShowNotification(true);
      }
    }
  };

  // Monitorar conectividade de rede
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkApiStatus();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setApiStatus("offline");
      setShowNotification(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Verificar API status inicialmente e a cada 30 segundos
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(interval);
    };
  }, [apiStatus]);

  // Auto-fechar notificação após 5 segundos se a conexão foi restaurada
  useEffect(() => {
    if (showNotification && apiStatus === "online") {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, apiStatus]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowNotification(false);
  };

  const getNotificationConfig = () => {
    if (!isOnline) {
      return {
        severity: "error",
        icon: <WifiOffIcon />,
        message: "Sem conexão com a internet",
      };
    }

    if (apiStatus === "offline") {
      return {
        severity: "warning",
        icon: <WifiOffIcon />,
        message: "Servidor temporariamente indisponível",
      };
    }

    if (apiStatus === "online") {
      return {
        severity: "success",
        icon: <WifiIcon />,
        message: "Conexão restaurada",
      };
    }

    return null;
  };

  const config = getNotificationConfig();

  // Só mostrar em desenvolvimento ou quando explicitamente necessário
  const shouldShow =
    showNotification &&
    config &&
    (import.meta.env.MODE === "development" ||
      !isOnline ||
      apiStatus === "offline");

  if (!shouldShow) {
    return null;
  }

  return (
    <Snackbar
      open={shouldShow}
      autoHideDuration={apiStatus === "online" ? 3000 : null}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ mb: 2, mr: 2 }}
    >
      <Alert
        severity={config.severity}
        icon={config.icon}
        variant="filled"
        onClose={handleClose}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        sx={{
          "& .MuiAlert-message": {
            fontSize: "0.875rem",
            fontWeight: 500,
          },
        }}
      >
        {config.message}
      </Alert>
    </Snackbar>
  );
}
