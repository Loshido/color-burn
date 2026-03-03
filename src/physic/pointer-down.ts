import { bottleHolder, dragStates, type DragState } from "./mod"

function getState(div: HTMLDivElement, ev: PointerEvent): DragState {
    const rect = div.getBoundingClientRect()
    const now = performance.now()

    const placeholder = document.createElement('div')
    placeholder.className = div.className
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.visibility = 'hidden'
    div.replaceWith(placeholder)

    return {
        pointerId: ev.pointerId,
        offsetX: ev.clientX - rect.left,
        offsetY: ev.clientY - rect.top,
        x: rect.left,
        y: rect.top,
        lastX: ev.clientX,
        lastY: ev.clientY,
        lastT: now,
        angle: 0,
        pourSide: 1,
        placeholder,
    }
}

// claude
export default function onPointerDown(this: HTMLDivElement, ev: PointerEvent) {
    if (bottleHolder.active) return
    if (ev.button !== 0) return
    ev.preventDefault()
    bottleHolder.active = this

    const rect = this.getBoundingClientRect()
    const state = getState(this, ev)
    dragStates.set(this, state)

    document.body.appendChild(this)
    
    this.setPointerCapture(ev.pointerId)
    this.style.position = 'fixed'
    this.style.left = `${rect.left}px`
    this.style.top = `${rect.top}px`
    this.style.width = `${rect.width}px`
    this.style.height = `${rect.height}px`
    this.style.margin = '0'
    this.style.zIndex = '1000'
    this.style.transformOrigin = '50% 100%'
    this.style.willChange = 'left, top, transform'
    this.style.transition = 'transform 0s'
    this.style.pointerEvents = 'none'
}