import { syncWithBottle } from "./func"
import { MAX_PER_BOTTLE, bottles } from "./mod"
import { n_bottles } from "../main"

export function createLayer(color: string = "transparent") {
    const e = document.createElement('div')
    e.setAttribute('data-color', color)
    e.style.setProperty('--c', `#${color}`)

    return e
}

function defineCssProperties() {
    document.body.style.setProperty('--max-per-bottle', MAX_PER_BOTTLE.toString())
    document.body.style.setProperty('--n-bottles', n_bottles.toString())
}

function initializeBottle(): HTMLDivElement {
    const id = Math.floor(Math.random() * 10E8).toString(36)
    const bottle = document.createElement('div')
    
    bottle.classList.add('bottle')
    bottle.id = id
    bottles.set(id, [])

    for(let i = 0; i < MAX_PER_BOTTLE; i++) bottle.append(createLayer())

    return bottle
}

function reset() {
    bottles.clear()
    
    document.querySelectorAll('.bottle').forEach(el => el.remove())
    const main = document.querySelector('main') as HTMLElement
    main.innerHTML = ""
}

export default async () => {
    reset()
    const main = document.querySelector('main') as HTMLElement
    defineCssProperties()
    
    // appends empty bottles
    for(let i = 0; i < n_bottles; i++) main.append(initializeBottle())

    // listener for the sw (service worker) of thread
    // to get the color shuffled bottles
    const listener = (ev: MessageEvent) => {
        if(ev.data.type !== "setup:output") return
        const b = ev.data.output.bottles as string[][]
        
        if(bottles.size !== b.length) 
            throw "The computed color shuffled bottles "
            + "doesn't match with the placeholder"
            
        let i = 0;
        bottles.forEach((_, key) => {
            bottles.set(key, b[i++])
            
            syncWithBottle(key)
        })
    }
    // ask the sw for the bottle's array / color shuffled bottles
    const input = {
        type: "setup",
        input: { n_bottles }
    }

    navigator.serviceWorker.addEventListener('message', listener)
    
    const registration = await navigator.serviceWorker.ready
    registration.active?.postMessage(input)
}