import onPointerUp, { onPointerUpUsingCallback } from "./pointer-up"
import onPointerDown from "./pointer-down"
import onPointerMove from "./pointer-move"

export type DragState = {
    pointerId: number
    offsetX: number
    offsetY: number
    x: number
    y: number
    lastX: number
    lastY: number
    lastT: number
    angle: number
    pourSide: -1 | 1
    placeholder: HTMLDivElement
}

export const dragStates = new WeakMap<HTMLDivElement, DragState>()
export const targetHitboxPadding = 40
export const bottleHolder = {
    active: null as HTMLDivElement | null
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

export type InteractionCallback = (origin: string, target: string) => void
interface Props {
    onPouring: InteractionCallback
}

export default ({ onPouring }: Props) => {
    const bottles = document.querySelectorAll('.bottle').values() as ArrayIterator<HTMLDivElement>
    for(const bottle of bottles) {
        bottle.style.touchAction = 'none'
        bottle.style.userSelect = 'none'
        bottle.addEventListener('pointerdown', onPointerDown)
        bottle.addEventListener('pointermove', onPointerMove)
        bottle.addEventListener('pointerup', onPointerUpUsingCallback(onPouring))
        bottle.addEventListener('pointercancel', onPointerUp)
    }
}