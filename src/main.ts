import "./style.css"
import setupPhysics from "./physics"
import setupLogic from "./logic/mod"

export let sw: ServiceWorkerRegistration | null = null

let n = 6 * 1

if ('serviceWorker' in navigator) {
    (await navigator.serviceWorker.getRegistration())?.unregister()
    sw = await navigator.serviceWorker.register('/sw.js');
    // Attendre que le service worker soit actif
    await navigator.serviceWorker.ready
}

document.addEventListener('color-burn:end', () => {
    n += 6
    start()
})

function start() {
    const { onPouring } = setupLogic(n)
    setupPhysics({ onPouring })
}
start()