/**
 * @fileoverview ErrorBoundary - Componente para capturar e tratar erros no React
 * Implementa tratamento de erros com interface amigável e logging
 */

import React from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  Stack,
  Chip,
  Collapse,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  BugReport as BugIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Atualiza o state para exibir a UI de erro
    return {
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error, errorInfo) {
    // Capturar detalhes do erro
    this.setState({
      error,
      errorInfo,
    });

    // Log do erro (em produção, enviar para serviço de monitoramento)
    this.logError(error, errorInfo);
  }

  logError = (error, errorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: localStorage.getItem("finance_flow_user_id"),
      errorId: this.state.errorId,
    };

    // Em desenvolvimento, apenas console.error
    if (process.env.NODE_ENV === "development") {
      console.error("🔥 Error Boundary caught an error:", errorData);
    }

    // Em produção, enviar para serviço de monitoramento (exemplo: Sentry)
    if (process.env.NODE_ENV === "production") {
      try {
        // Implementar envio para serviço de monitoramento aqui
        // ex: Sentry.captureException(error, { extra: errorData });

        // Por enquanto, armazenar localmente
        const storedErrors = JSON.parse(
          localStorage.getItem("app_errors") || "[]"
        );
        storedErrors.push(errorData);

        // Manter apenas os últimos 5 erros
        if (storedErrors.length > 5) {
          storedErrors.shift();
        }

        localStorage.setItem("app_errors", JSON.stringify(storedErrors));
      } catch (logError) {
        console.error("Failed to log error:", logError);
      }
    }
  };

  handleRefresh = () => {
    // Recarregar a página
    window.location.reload();
  };

  handleReset = () => {
    // Reset do estado do ErrorBoundary
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: null,
    });
  };

  handleGoHome = () => {
    // Navegar para home
    window.location.href = "/dashboard";
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, errorId } = this.state;
      const { fallback: CustomFallback, minimal = false } = this.props;

      // Se um componente customizado foi fornecido
      if (CustomFallback) {
        return (
          <CustomFallback
            error={error}
            errorInfo={errorInfo}
            resetError={this.handleReset}
            errorId={errorId}
          />
        );
      }

      // Interface mínima para erros menores
      if (minimal) {
        return (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={this.handleReset}
                startIcon={<RefreshIcon />}
              >
                Tentar Novamente
              </Button>
            }
            sx={{ margin: 2 }}
          >
            <Typography variant="body2">
              Algo deu errado. Tente recarregar esta seção.
            </Typography>
          </Alert>
        );
      }

      // Interface completa para erros críticos
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            p: 3,
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={4}
              sx={{
                p: 4,
                maxWidth: 600,
                width: "100%",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "error.light",
              }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <ErrorIcon
                  sx={{
                    fontSize: 64,
                    color: "error.main",
                    mb: 2,
                  }}
                />
              </motion.div>

              <Typography variant="h4" color="error.main" gutterBottom>
                Oops! Algo deu errado
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Encontramos um erro inesperado. Nossa equipe foi notificada e
                estamos trabalhando para corrigi-lo.
              </Typography>

              {errorId && (
                <Chip
                  icon={<BugIcon />}
                  label={`ID do Erro: ${errorId}`}
                  variant="outlined"
                  size="small"
                  sx={{ mb: 3 }}
                />
              )}

              <Stack
                spacing={2}
                direction={{ xs: "column", sm: "row" }}
                sx={{ mb: 3 }}
              >
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={this.handleRefresh}
                  sx={{ flex: 1 }}
                >
                  Recarregar Página
                </Button>

                <Button
                  variant="outlined"
                  onClick={this.handleGoHome}
                  sx={{ flex: 1 }}
                >
                  Ir para Início
                </Button>
              </Stack>

              {/* Detalhes técnicos (apenas em desenvolvimento) */}
              {process.env.NODE_ENV === "development" && error && (
                <>
                  <Button
                    variant="text"
                    size="small"
                    onClick={this.toggleDetails}
                    startIcon={
                      showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                    sx={{ mb: 2 }}
                  >
                    {showDetails ? "Ocultar" : "Mostrar"} Detalhes Técnicos
                  </Button>

                  <Collapse in={showDetails}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        textAlign: "left",
                        bgcolor: "grey.50",
                        maxHeight: 200,
                        overflow: "auto",
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        color="error"
                        gutterBottom
                      >
                        Erro:
                      </Typography>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{
                          fontSize: "0.75rem",
                          fontFamily: "monospace",
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                          mb: 2,
                        }}
                      >
                        {error.message}
                      </Typography>

                      {error.stack && (
                        <>
                          <Typography
                            variant="subtitle2"
                            color="error"
                            gutterBottom
                          >
                            Stack Trace:
                          </Typography>
                          <Typography
                            variant="body2"
                            component="pre"
                            sx={{
                              fontSize: "0.65rem",
                              fontFamily: "monospace",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                            }}
                          >
                            {error.stack}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </Collapse>
                </>
              )}
            </Paper>
          </motion.div>
        </Box>
      );
    }

    return this.props.children;
  }
}

// HOC para facilitar o uso
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${
    Component.displayName || Component.name
  })`;

  return WrappedComponent;
};

export default ErrorBoundary;
