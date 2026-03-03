import { bottles, MAX_PER_BOTTLE, n_bottles } from "./mod";

type BottleId = string
type Layer = HTMLDivElement

export function isBottleEmpty(id: string) {
    const bottle = bottles.get(id)!
    
    return bottle.length >= 1
}

function setLayerTransparent(layer: Layer) {
    layer.style.setProperty('--c', "transparent")
    layer.setAttribute('data-color', 'transparent')
}

function setLayerColor(layer: Layer, color: string) {
    layer.setAttribute('data-color', color)
    layer.style.setProperty('--c', `#${color}`)
}

export function syncWithBottle(id: BottleId) {
    const bottleElement = document.getElementById(id) as HTMLDivElement | null
    if(!bottleElement) return
    const bottle = bottles.get(id)!
    
    const layerList = bottleElement.querySelectorAll('[data-color]') as NodeListOf<HTMLDivElement>
    const layers = new Array(...layerList)

    const transparent_layer = MAX_PER_BOTTLE - bottle.length
    layers.forEach((layer, i) => {
        if(i < transparent_layer) setLayerTransparent(layer)
        else setLayerColor(layer, bottle.at(i - transparent_layer)!)
    })
}

export function pouringBottles(from: BottleId, to: BottleId) {
    const bottleFrom = bottles.get(from)!
    let bottleTo = bottles.get(to)!
    
    let capacity = MAX_PER_BOTTLE - bottleTo.length
    if(capacity <= 0) return

    const color = bottleFrom.shift()!
    capacity--;
    bottleTo = [color].concat(bottleTo)

    while(capacity >= 1 && bottleFrom.at(0) === color) {
        bottleFrom.shift()
        bottleTo = [color].concat(bottleTo)
        capacity--;
    }

    bottles.set(to, bottleTo)
    bottles.set(from, bottleFrom)

    if(bottleTo.every((_, i, a) => a.at(i) === a.at(i - 1)) && bottleTo.length === MAX_PER_BOTTLE) {
        document.getElementById(to)?.remove()
        bottles.delete(to)

        if(bottles.size <= Math.round(n_bottles / 6) ) {
            const event = new CustomEvent('color-burn:end')
            console.log(event)
            document.dispatchEvent(event)
        }
    }
    
    syncWithBottle(from)
    syncWithBottle(to)
}