import { syncWithBottle } from "./func"
import { MAX_PER_BOTTLE, bottles, n_bottles } from "./mod"

export function transparent_bottle() {
    const e = document.createElement('div')
    e.style.setProperty('--c', "transparent")
    e.setAttribute('data-color', 'transparent')
    
    return e
}
export function colored_bottle(color: string) {
    const e = document.createElement('div')
    e.setAttribute('data-color', color)
    e.style.setProperty('--c', `#${color}`)

    return e
}

function setupCss() {
    document.body.style.setProperty('--max-per-bottle', MAX_PER_BOTTLE.toString())
    document.body.style.setProperty('--n-bottles', n_bottles.toString())
}

function initializeBottle(): HTMLDivElement {
    const id = Math.floor(Math.random() * 10E8).toString(36)
    bottles.set(id, [])

    const bottle = document.createElement('div')
    bottle.classList.add('bottle')
    bottle.id = id

    for(let i = 0; i < MAX_PER_BOTTLE; i++) bottle.append(transparent_bottle())

    return bottle
}

function reset() {
    bottles.clear()
    const main = document.querySelector('main') as HTMLElement
    main.innerHTML = ""
}

export default async () => {
    reset()
    const main = document.querySelector('main') as HTMLElement
    setupCss()
    
    for(let i = 0; i < n_bottles; i++) main.append(initializeBottle())

    const listener = (ev: MessageEvent) => {
        console.log(ev)
        if(ev.data.type !== "setup:output") return
        const b = ev.data.output.bottles as string[][]
        
        if(bottles.size !== b.length) throw "Something went wrong"
        let i = 0;

        bottles.forEach((_, key) => {
            bottles.set(key, b[i])
            i++
            
            syncWithBottle(key)
        })
    }
    const input = {
        type: "setup",
        input: { n_bottles }
    }

    navigator.serviceWorker.addEventListener('message', listener)
    
    const registration = await navigator.serviceWorker.ready
    registration.active?.postMessage(input)
}