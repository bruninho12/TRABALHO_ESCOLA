// 🔧 Service Worker - Suporte Offline e Notificações Push + Performance
/* global clients */
const CACHE_NAME = "despfinancee-v2.0.1";
const STATIC_CACHE = "despfinancee-static-v2.0.1";
const DYNAMIC_CACHE = "despfinancee-dynamic-v2.0.1";

// Assets essenciais (cache imediato) - Otimizado
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/offline.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Instala o Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Instalando Service Worker...");

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Cacheando assets estáticos");
      return cache.addAll(STATIC_ASSETS);
    })
  );

  self.skipWaiting();
});

// Ativa o Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Ativando Service Worker...");

  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log("[SW] Removendo cache antigo:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requisições de API (sempre busca na rede)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: "Sem conexão. Tente novamente mais tarde.",
          }),
          {
            headers: { "Content-Type": "application/json" },
            status: 503,
          }
        );
      })
    );
    return;
  }

  // Estratégia: Cache First (assets estáticos)
  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "style" ||
    request.destination === "script"
  ) {
    event.respondWith(
      caches
        .match(request)
        .then((response) => {
          return (
            response ||
            fetch(request).then((fetchResponse) => {
              return caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, fetchResponse.clone());
                return fetchResponse;
              });
            })
          );
        })
        .catch(() => {
          // Fallback para imagem offline
          if (request.destination === "image") {
            return caches.match("/icons/icon-192x192.png");
          }
        })
    );
    return;
  }

  // Estratégia: Network First (HTML)
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cacheia respostas bem-sucedidas
        if (response.ok) {
          const clonedResponse = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback para cache ou página offline
        return caches.match(request).then((response) => {
          return response || caches.match("/offline.html");
        });
      })
  );
});

// 🔔 Gerenciamento de Notificações Push
self.addEventListener("push", (event) => {
  console.log("[SW] Push recebido:", event);

  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: "DespFinancee", body: event.data.text() };
    }
  }

  const options = {
    body: data.body || "Nova notificação",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: data.badge || "/icons/badge-72x72.png",
    image: data.image,
    vibrate: data.vibrate || [200, 100, 200],
    tag: data.tag || "default",
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
    silent: data.silent || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "DespFinancee", options)
  );
});

// Clique na notificação
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notificação clicada:", event);

  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  // URL de destino baseada na ação
  let targetUrl = "/";

  if (action === "view" && data.type) {
    switch (data.type) {
      case "budget_alert":
        targetUrl = "/budgets";
        break;
      case "goal_achieved":
        targetUrl = `/goals/${data.goalId}`;
        break;
      case "achievement":
        targetUrl = "/rpg";
        break;
      case "bill_due":
        targetUrl = "/transactions";
        break;
      case "insight":
        targetUrl = "/insights";
        break;
      default:
        targetUrl = "/dashboard";
    }
  }

  // Abre ou foca na janela
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Verifica se já tem uma janela aberta
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.postMessage({
              type: "notification-click",
              action,
              data,
              targetUrl,
            });
            return;
          }
        }

        // Se não, abre nova janela
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

// Fecha notificação
self.addEventListener("notificationclose", (event) => {
  console.log("[SW] Notificação fechada:", event);

  // Analytics: registra que usuário dispensou a notificação
  const data = event.notification.data;
  if (data && data.trackDismiss) {
    // Enviar analytics
    fetch("/api/analytics/notification-dismissed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tag: event.notification.tag,
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
});

// 🔄 Sincronização em Background
self.addEventListener("sync", (event) => {
  console.log("[SW] Sync event:", event.tag);

  if (event.tag === "sync-transactions") {
    event.waitUntil(syncTransactions());
  } else if (event.tag === "sync-budgets") {
    event.waitUntil(syncBudgets());
  }
});

// Função auxiliar: sincroniza transações pendentes
async function syncTransactions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();

    const pendingTransactions = requests.filter(
      (request) =>
        request.url.includes("/api/transactions") && request.method === "POST"
    );

    for (const request of pendingTransactions) {
      await fetch(request.clone());
    }

    console.log("[SW] Transações sincronizadas");
  } catch (error) {
    console.error("[SW] Erro ao sincronizar:", error);
  }
}

// Função auxiliar: sincroniza orçamentos
async function syncBudgets() {
  try {
    const response = await fetch("/api/budgets");
    const data = await response.json();

    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.put("/api/budgets", new Response(JSON.stringify(data)));

    console.log("[SW] Orçamentos sincronizados");
  } catch (error) {
    console.error("[SW] Erro ao sincronizar orçamentos:", error);
  }
}

// Mensagens do cliente
self.addEventListener("message", (event) => {
  console.log("[SW] Mensagem recebida:", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches
        .keys()
        .then((keyList) => {
          return Promise.all(
            keyList.map((key) => {
              return caches.delete(key);
            })
          );
        })
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }
});

// Periodic Background Sync (se suportado)
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "daily-sync") {
    event.waitUntil(syncAllData());
  }
});

async function syncAllData() {
  try {
    await Promise.all([syncTransactions(), syncBudgets()]);
    console.log("[SW] Sync periódico completo");
  } catch (error) {
    console.error("[SW] Erro no sync periódico:", error);
  }
}

console.log("[SW] Service Worker carregado");
