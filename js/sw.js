// sw.js - Basic Service Worker to make WaelOS a PWA
const CACHE_NAME = 'waelos-v1';

self.addEventListener('install', (event) => {
    // Skip caching for now, just force the worker to activate instantly
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Just fetch from the network normally
    event.respondWith(fetch(event.request));
});
