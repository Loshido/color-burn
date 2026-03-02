import "./style.css"
import setupPhysics from "./physics"
import setupLogic from "./logic/mod"

export let sw: ServiceWorkerRegistration | null = null

const n = 6 * 6 // 12 or 18

if ('serviceWorker' in navigator) {
    (await navigator.serviceWorker.getRegistration())?.unregister()
    sw = await navigator.serviceWorker.register('/sw.js');
    // Attendre que le service worker soit actif
    await navigator.serviceWorker.ready
}

const { onPouring } = setupLogic(n)
setupPhysics({ onPouring })