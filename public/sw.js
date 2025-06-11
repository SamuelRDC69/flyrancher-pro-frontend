// FlyRancher Pro Service Worker v1.0.0
const CACHE_NAME = 'flyrancher-pro-v1.0.0';
const STATIC_CACHE_NAME = 'flyrancher-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'flyrancher-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_ASSETS = [
  '/flyrancher-pro-frontend/',
  '/flyrancher-pro-frontend/index.html',
  '/flyrancher-pro-frontend/manifest.json',
  '/flyrancher-pro-frontend/favicon.svg'
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
        // Try to cache assets, but don't fail if some are missing
        return Promise.allSettled(
          STATIC_ASSETS.map(asset => cache.add(asset).catch(e => console.warn(`[SW] Failed to cache ${asset}:`, e)))
        );
      })
      .then(() => {
        console.log('[SW] Service worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to install service worker:', error);
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
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME &&
                     cacheName.startsWith('flyrancher-');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
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
  
  // Skip chrome-extension and other protocols
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
  }
});

// Check if request is for a static asset
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.includes('.') && 
         (url.pathname.endsWith('.js') || 
          url.pathname.endsWith('.css') || 
          url.pathname.endsWith('.png') || 
          url.pathname.endsWith('.svg') || 
          url.pathname.endsWith('.ico'));
}

// Check if request is for API
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('flyrancher-sub.onrender.com') ||
         API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is navigation
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
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && shouldCacheAPIResponse(request)) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('[SW] API request failed, trying cache:', error);
    
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

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Serve cached index.html for SPA
    const cachedResponse = await caches.match('/flyrancher-pro-frontend/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Determine if API response should be cached
function shouldCacheAPIResponse(request) {
  const url = new URL(request.url);
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

console.log('[SW] Service worker loaded successfully');
