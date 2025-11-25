/**
 * @fileoverview Configuração de API dinâmica
 * Detecta automaticamente a melhor URL da API baseada no ambiente
 */

/**
 * Detecta a URL da API baseada no ambiente atual
 */
export const getApiUrl = () => {
  // Se VITE_API_URL está definida, usar ela
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Se estamos em produção, usar URL relativa
  if (import.meta.env.PROD) {
    return "/api";
  }

  // Em desenvolvimento, detectar IP local automaticamente
  const hostname = window.location.hostname;

  // Se estamos acessando via IP local, usar o mesmo IP para a API
  if (hostname.match(/^192\.168\.|^10\.|^172\.(1[6-9]|2\d|3[01])\./)) {
    return `http://${hostname}:3001/api`;
  }

  // Fallback para localhost
  return "http://localhost:3001/api";
};

/**
 * URLs conhecidas para teste de conectividade
 */
export const API_URLS = [
  "http://localhost:3001/api",
  "http://127.0.0.1:3001/api",
  `http://${window.location.hostname}:3001/api`,
];

/**
 * Testa conectividade com múltiplas URLs de API
 */
export const findWorkingApiUrl = async () => {
  const urls = import.meta.env.VITE_API_URL
    ? [import.meta.env.VITE_API_URL]
    : API_URLS;

  for (const url of urls) {
    try {
      // Usar AbortController para timeout mais confiável
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(`${url}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`✅ API conectada: ${url}`);
        return url;
      }
    } catch (error) {
      // Silenciar erros de conectividade para não poluir console
      if (!error.name?.includes("AbortError")) {
        console.debug(`❌ API não disponível: ${url}`);
      }
    }
  }

  // Se nenhuma URL funcionar, retorna a padrão
  console.warn("⚠️ Nenhuma API encontrada, usando URL padrão");
  return getApiUrl();
};

/**
 * Configurações de timeout e retry
 */
export const API_CONFIG = {
  timeout: 10000, // 10 segundos
  retries: 3,
  retryDelay: 1000, // 1 segundo
};

/**
 * Headers padrão para todas as requisições
 */
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
};
