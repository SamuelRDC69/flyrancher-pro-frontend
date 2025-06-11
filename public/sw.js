// FlyRancher Pro Service Worker
const CACHE_NAME = 'flyrancher-pro-v1.0.0';
const STATIC_CACHE_NAME = 'flyrancher-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'flyrancher-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  // Add other static assets as needed
];

// API endpoints that should be cached
const API_CACHE_PATTERNS = [
  /\/subscription\/status\//,
  /\/subscription\/metrics/,
  /\/subscription\/system\/status/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old caches
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME &&
                     (cacheName.startsWith('flyrancher-') || cacheName.startsWith(CACHE_NAME));
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim(); // Take control immediately
      })
      .catch((error) => {
        console.error('[SW] Failed to activate service worker:', error);
      })
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleOtherRequests(request));
  }
});

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('.') && 
         (url.pathname.endsWith('.js') || 
          url.pathname.endsWith('.css') || 
          url.pathname.endsWith('.png') || 
          url.pathname.endsWith('.jpg') || 
          url.pathname.endsWith('.svg') || 
          url.pathname.endsWith('.ico') ||
          url.pathname.endsWith('.woff') ||
          url.pathname.endsWith('.woff2'));
}

// Check if request is for API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('flyrancher-sub.onrender.com') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is navigation (page request)
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to handle static asset:', error);
    
    // Try to return cached version as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for images
    if (request.url.includes('.png') || request.url.includes('.jpg') || request.url.includes('.svg')) {
      return new Response('', { status: 200, statusText: 'Offline' });
    }
    
    throw error;
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses for specific endpoints
    if (networkResponse.ok && shouldCacheAPIResponse(request)) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] API request failed, trying cache:', error);
    
    // Try to return cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'No network connection available',
        offline: true 
      }), 
      { 
        status: 503, 
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle navigation requests (page loads)
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.warn('[SW] Navigation request failed, serving cached index:', error);
    
    // Serve cached index.html for SPA routing
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Offline fallback page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FlyRancher Pro - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f172a, #1e293b);
              color: white;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            .container { max-width: 400px; }
            .icon { font-size: 64px; margin-bottom: 20px; }
            h1 { color: #facc15; margin-bottom: 10px; }
            p { color: #94a3b8; margin-bottom: 20px; }
            button { 
              background: linear-gradient(135deg, #facc15, #f97316);
              color: #0f172a;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🤖</div>
            <h1>FlyRancher Pro</h1>
            <p>You're currently offline. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Retry</button>
          </div>
        </body>
      </html>
    `, { 
      status: 200, 
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle other requests with cache-first strategy
async function handleOtherRequests(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Failed to handle request:', error);
    throw error;
  }
}

// Determine if API response should be cached
function shouldCacheAPIResponse(request) {
  const url = new URL(request.url);
  
  // Cache status and metrics endpoints
  return url.pathname.includes('/status') || 
         url.pathname.includes('/metrics') ||
         url.pathname.includes('/system/status');
}

// Handle background sync (for future use)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'subscription-sync') {
    event.waitUntil(syncSubscriptionData());
  }
});

// Sync subscription data when online
async function syncSubscriptionData() {
  try {
    console.log('[SW] Syncing subscription data...');
    
    // Get any pending subscription updates from IndexedDB
    // This would sync with your backend when connection is restored
    
    console.log('[SW] Subscription data synced successfully');
  } catch (error) {
    console.error('[SW] Failed to sync subscription data:', error);
  }
}

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  if (!event.data) {
    return;
  }
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'FlyRancher Pro notification',
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      image: data.image,
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [
        {
          action: 'open',
          title: 'Open App',
          icon: '/icon-72x72.png'
        }
      ],
      requireInteraction: data.requireInteraction || false,
      silent: data.silent || false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'FlyRancher Pro', options)
    );
  } catch (error) {
    console.error('[SW] Failed to show push notification:', error);
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action || 'open';
  const data = event.notification.data || {};
  
  if (action === 'open') {
    const urlToOpen = data.url || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Try to focus existing window
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[SW] Service worker loaded successfully');
