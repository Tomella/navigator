const version = 'v3'
import {cacheList} from "./lib/cachelist.js";

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(version);
    await cache.addAll(resources);
    console.log("Added all to cache.");
};

self.addEventListener('install', event => {
    console.log(`${version} installing…`);

    event.waitUntil(
        addResourcesToCache(cacheList)
    );
});

self.addEventListener('activate', event => {
    console.log('Claiming control');
    return self.clients.claim();
});

const putInCache = async (request, response) => {
    const cache = await caches.open(version);

    if (request.method === 'POST') {
        console.log('Cannot cache POST requests')
        return
    }

    await cache.put(request, response);
};

const cacheFirst = async (request) => {
    console.log("Cache request:", request);
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        console.log("Cache request in cache.");
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    // We need to clone the response because the response stream can only be read once
    putInCache(request, responseFromNetwork.clone());
    console.log("Added request to cache.");
    return responseFromNetwork;
};

self.addEventListener("fetch", (event) => {
    event.respondWith(cacheFirst(event.request));
});