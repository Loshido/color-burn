import { bottles, MAX_PER_BOTTLE } from "./mod";

type BottleId = string
type Layer = HTMLDivElement

export function isBottleEmpty(id: BottleId) {
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

