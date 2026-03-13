import "./style.css"
import setupPhysics from "./physic/mod"
import setupLogic from "./logic/mod"

export let n_bottles = 6 * 1
const SW_VERSION = "dev:0.1.1"

// setup a service worker (computation out of the main thread)
if ('serviceWorker' in navigator) {
    const version = localStorage.getItem('sw-version')
    if(version !== SW_VERSION) {
        const registration = await navigator.serviceWorker.getRegistration()
        registration?.unregister()
        localStorage.setItem('sw-version', SW_VERSION)
    }
    await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready
}

// once the game ends we start again with more bottles
document.addEventListener('color-burn:end', () => {
    n_bottles += 6 // bottles must be a multiple of 6.
    start()
})

function start() {
    const { onPouring } = setupLogic()
    setupPhysics({ onPouring })
}

start()