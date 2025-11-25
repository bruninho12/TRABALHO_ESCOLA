/**
 * @fileoverview Hook para configuração dinâmica da API
 * Detecta e configura automaticamente a melhor URL da API
 */

import { useState, useEffect } from "react";
import { findWorkingApiUrl } from "../config/api";

/**
 * Hook para detectar e configurar a URL da API automaticamente
 */
export const useApiConfig = () => {
  const [apiUrl, setApiUrl] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const configureApi = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("🔍 Detectando melhor URL da API...");

        const workingUrl = await findWorkingApiUrl();

        setApiUrl(workingUrl);
        setIsConnected(true);

        console.log(`✅ API configurada: ${workingUrl}`);

        // Guardar URL no localStorage para próximas sessões
        localStorage.setItem("api_url", workingUrl);
      } catch (err) {
        setError(err.message);
        setIsConnected(false);
        console.debug("🔍 Erro ao configurar API (modo debug):", err.message);

        // Tentar usar URL salva anteriormente
        const savedUrl = localStorage.getItem("api_url");
        if (savedUrl) {
          setApiUrl(savedUrl);
          console.log("🔄 Usando URL salva:", savedUrl);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Aguardar um pouco para permitir que a CSP seja configurada
    setTimeout(configureApi, 100);
  }, []);

  const testConnection = async (url) => {
    try {
      const response = await fetch(`${url}/health`, {
        method: "GET",
        timeout: 5000,
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  const reconnect = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const workingUrl = await findWorkingApiUrl();
      setApiUrl(workingUrl);
      setIsConnected(true);
      localStorage.setItem("api_url", workingUrl);
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiUrl,
    isConnected,
    isLoading,
    error,
    testConnection,
    reconnect,
  };
};
