// Define a unique cache name for this version of the app
const CACHE_NAME = 'everglow-cache-v1';

// List the essential files that make up the "app shell"
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  'https://cdn.tailwindcss.com'
];

// Event listener for the 'install' event
// This is triggered when the service worker is first registered.
self.addEventListener('install', event => {
  // We don't want to stop the installation for any reason.
  // We'll perform the caching in the background.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all the specified URLs to the cache.
        return cache.addAll(urlsToCache);
      })
  );
});

// Event listener for the 'fetch' event
// This is triggered for every network request made by the app.
self.addEventListener('fetch', event => {
  // We'll respond to the request either with a cached version of the resource
  // or by fetching it from the network.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If the request is found in the cache, return the cached response
        if (response) {
          return response;
        }

        // If the request is not in the cache, fetch it from the network
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(() => {
            // If the fetch fails (e.g., user is offline) and the resource is not in the cache,
            // the request will fail. For the core app shell files, this won't happen 
            // because they were cached during the 'install' event.
        });
      })
  );
});

// Event listener for the 'activate' event
// This is triggered after the 'install' event and when the new service worker takes control.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name is not in our whitelist, delete it.
          // This cleans up old caches from previous versions of the app.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
