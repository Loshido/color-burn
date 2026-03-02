import COLORS from "./colors.json"
import { syncWithBottle } from "./func"
import { MAX_PER_BOTTLE, bottles } from "./mod"

const colors: [string, number][] = []

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

function setupCss(bottle: number) {
    document.body.style.setProperty('--max-per-bottle', MAX_PER_BOTTLE.toString())
    document.body.style.setProperty('--n-bottles', bottle.toString())
}

function fillColorsArray(bottle: number) {
    colors.push(...COLORS.slice(0, bottle).map(c => ([c, 0] as [string, number])))
}

function initializeBottle(): HTMLDivElement {
    const id = Math.floor(Math.random() * 10E8).toString(36)
    bottles.set(id, [])

    const bottle = document.createElement('div')
    bottle.classList.add('bottle')
    bottle.id = id

    for(let i = 0; i < 6; i++) bottle.append(transparent_bottle())

    return bottle
}

function isReady() {
    return new Array(...bottles.values()).every(bottle => bottle.length === MAX_PER_BOTTLE - 1)
}


function fillWithColor(color: string) {
    const b = new Array(...bottles.entries())

    let hint = Math.floor(Math.random() * b.length)

    while(b[hint][1].length === MAX_PER_BOTTLE - 1) {
        hint = Math.floor(Math.random() * b.length)
    }

    b[hint][1].push(color)

    b.forEach(([id, bottle]) => bottles.set(id, bottle))
}

function isBottleNumberPossible(n: number) {
    const c = (MAX_PER_BOTTLE - 1) * n / MAX_PER_BOTTLE
    return Math.round(c) === c
}

export default (n_bottle: number) => {
    if(!isBottleNumberPossible(n_bottle)) throw new Error('Impossible')

    const main = document.querySelector('main') as HTMLElement
    setupCss(n_bottle)
    fillColorsArray(n_bottle)
    const bottlesHolder = []
    
    for(let i = 0; i < n_bottle; i++) {
        const bottle = initializeBottle()
        bottlesHolder.push(bottle)
    }
    main.append(...bottlesHolder)

    const count_per_color: Array<[number, number]> = Array.from(
        { length: n_bottle - 1 },
        (_, index) => [0, index]
    )
    let count = 0
    while(count_per_color.length !== 0 && count < 1000) {
        const hint = Math.floor(Math.random() * count_per_color.length)

        fillWithColor(COLORS.at(count_per_color[hint][1])!)

        count_per_color[hint][0]++
        if(count_per_color[hint][0] >= MAX_PER_BOTTLE) 
            count_per_color.splice(hint, 1)
    
        count++
    }

    for(const id of bottles.keys()) syncWithBottle(id)
}