import { setHighlightedTarget } from "./highlight"
import { bottleHolder, dragStates, type DragState, type InteractionCallback } from "./mod"
import getBottleUnderPointer from "./raycast"

export default function onPointerUp(this: HTMLDivElement, ev: PointerEvent) {
    resetBottle(this, ev)
}

export function onPointerUpUsingCallback(pouring: InteractionCallback) {
    return function(this: HTMLDivElement, ev: PointerEvent) {
        const targetBottle = getBottleUnderPointer(ev.clientX, ev.clientY, this)
        resetBottle(this, ev)

        if(targetBottle) pouring(this.id, targetBottle.id)
    }
}

function resetBottle(target: HTMLDivElement, ev: PointerEvent) {
    const state = dragStates.get(target)
    if (!state) return
    if (ev.pointerId !== state.pointerId) return

    target.releasePointerCapture(ev.pointerId)
    dragStates.delete(target)
    bottleHolder.active = null
    setHighlightedTarget(null)
    snapBackToOrigin(target, state)
}

function snapBackToOrigin(element: HTMLDivElement, state: DragState) {
    const originRect = state.placeholder.getBoundingClientRect()
    element.style.transition = 'left 180ms ease-out, top 180ms ease-out, transform 180ms ease-out'
    element.style.left = `${originRect.left}px`
    element.style.top = `${originRect.top}px`
    element.style.transform = 'rotate(0deg)'

    const complete = () => {
        console.log(element, state.placeholder)
        state.placeholder.replaceWith(element)
        resetDraggingStyles(element)
    }

    setTimeout(complete, 190)
}

function resetDraggingStyles(element: HTMLDivElement) {
    element.style.position = ''
    element.style.left = ''
    element.style.top = ''
    element.style.width = ''
    element.style.height = ''
    element.style.margin = ''
    element.style.zIndex = ''
    element.style.transition = ''
    element.style.transform = ''
    element.style.willChange = ''
    element.style.transformOrigin = ''
    element.style.pointerEvents = ''
}