const putInCache = async (request: Request, response: Response) => {
    const cache = await caches.open("v1");
    await cache.put(request, response);
};

const cacheFirst = async ({ request }: { request: Request }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) return responseFromCache

    try {
        const responseFromNetwork = await fetch(request);
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 408,
            headers: { "Content-Type": "text/plain" },
        });
    }
};

export default () => {
    // @ts-ignore
    self.addEventListener("fetch", (event: FetchEvent) => {
        event.respondWith(
            cacheFirst({ request: event.request }),
        );
    });
}
