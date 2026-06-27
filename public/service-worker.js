/* eslint-disable */
/**
 * Copyright (c) Microsoft Corporation.
 * Licensed under the MIT License (MIT). See LICENSE in the repo root for copyright and license information.
 */

const isVersionCachingEnabled = true;

const staticAssetPatterns = [
  'index.html',
  '**/*.{js,json,css,html,ico,png,svg,jpg,jpeg,woff,woff2,ttf,otf,webp}',
];

const staticAssetURLs = [
  'https://unpkg.com/smooth-scrollbar/dist/scrollbar.css',
];

const fontPatterns = ['**/*.{woff,woff2,ttf,otf}'];

const cacheableResponsePatterns = [
  '**/response.*',
  '**/*.{png,jpg,jpeg,gif,svg,webp,avif,ico}',
  '**/*.{css,js,html}',
];

const version = 'v1';

const ignoreUrlParametersMatching = [/^x-client/];

const runtimeCaching = [
  {
    urlPattern: ({ request }) => request.mode === 'navigate',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'audos-navigation-cache',
      expiration: {
        maxAgeSeconds: 86400,
        maxEntries: 50,
      },
      broadcastUpdate: {
        channelName: 'AUDOS_NAVIGATION_UPDATES',
      },
    },
  },
  {
    urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'audos-api-cache',
      expiration: {
        maxAgeSeconds: 300,
        maxEntries: 100,
      },
      broadcastUpdate: {
        channelName: 'AUDOS_API_UPDATES',
      },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === 'image',
    handler: 'CacheFirst',
    options: {
      cacheName: 'audos-image-cache',
      expiration: {
        maxAgeSeconds: 2592000,
        maxEntries: 100,
      },
      cacheableResponse: {
        statuses: [0, 200],
        headers: {
          'X-Cache-Status': ['HIT', 'MISS'],
        },
      },
    },
  },
  {
    urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'audos-resource-cache',
      expiration: {
        maxAgeSeconds: 604800,
        maxEntries: 200,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

export default function configureWorkbox (workbox) {
  if (!isVersionCachingEnabled) {
    return;
  }

  workbox.skipWaiting();
  workbox.clientsClaim();

  workbox.routing.registerRoute(staticAssetPatterns, workbox.strategies.cacheFirst(), {
    cacheName: `audos-static-assets-cache-${version}`,n    expiration: {
      maxAgeSeconds: 2592000,
      maxEntries: 100,
    },
    cacheableResponse: {
      statuses: [200],
      headers: {
        'Content-Type': ['text/html', 'application/json', 'text/css', 'application/javascript', 'image/svg+xml'],
      },
    },
  });

  workbox.routing.registerRoute(staticAssetURLs, workbox.strategies.cacheFirst(), {
    cacheName: `audos-static-assets-cache-${version}-urls`,
    expiration: {
      maxAgeSeconds: 2592000,
      maxEntries: 50,
    },
  });

  workbox.routing.registerRoute(fontPatterns, workbox.strategies.cacheFirst(), {
    cacheName: `audos-fonts-cache`,
    expiration: {
      maxAgeSeconds: 31536000,
      maxEntries: 20,
    },
    cacheableResponse: {
      statuses: [200],
      headers: {
        'Content-Type': ['font/woff', 'font/woff2', 'font/ttf', 'font/otf'],
      },
    },
  });

  workbox.routing.registerRoute(cacheableResponsePatterns, workbox.strategies.cacheFirst(), {
    cacheName: 'audos-cacheable-responses-cache',
    expiration: {
      maxAgeSeconds: 300,
      maxEntries: 100,
    },
  });
}
