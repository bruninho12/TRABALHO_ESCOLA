import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./utils/accessibilityPatch.js"; // Patch para acessibilidade com aria-hidden

// Configurações de segurança para CSP
if (import.meta.env.PROD) {
  // Em produção, desabilitar console para evitar vazamento de informações
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

// Verificar se o DOM foi carregado de forma segura
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    "Root element not found. This may indicate a security issue."
  );
}

// Verificar integridade básica do documento
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  // Adicionar meta tags de segurança se não existirem
  addSecurityMetaTags();

  // Inicializar aplicação React
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

function addSecurityMetaTags() {
  const head = document.head;

  // Content Security Policy (apenas se não definido pelo servidor)
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement("meta");
    cspMeta.setAttribute("http-equiv", "Content-Security-Policy");

    if (import.meta.env.PROD) {
      cspMeta.setAttribute(
        "content",
        "default-src 'self'; connect-src 'self' http://localhost:3001 https://*; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
      );
    } else {
      // Desenvolvimento: permitir localhost e conexões WebSocket
      cspMeta.setAttribute(
        "content",
        "default-src 'self'; connect-src 'self' http://localhost:* ws://localhost:* https://*; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
      );
    }

    head.appendChild(cspMeta);
  }

  // X-Frame-Options
  if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
    const frameMeta = document.createElement("meta");
    frameMeta.setAttribute("http-equiv", "X-Frame-Options");
    frameMeta.setAttribute("content", "DENY");
    head.appendChild(frameMeta);
  }

  // X-Content-Type-Options
  if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
    const contentTypeMeta = document.createElement("meta");
    contentTypeMeta.setAttribute("http-equiv", "X-Content-Type-Options");
    contentTypeMeta.setAttribute("content", "nosniff");
    head.appendChild(contentTypeMeta);
  }
}
