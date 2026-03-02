type DragState = {
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

const dragStates = new WeakMap<HTMLDivElement, DragState>()
let activeBottle: HTMLDivElement | null = null
let highlightedTarget: HTMLDivElement | null = null
const targetHitboxPadding = 40

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
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

function setHighlightedTarget(target: HTMLDivElement | null) {
    if (highlightedTarget === target) return
    if (highlightedTarget) {
        highlightedTarget.classList.remove('bottle-target')
    }

    highlightedTarget = target
    if (highlightedTarget) {
        highlightedTarget.classList.add('bottle-target')
    }
}

function getBottleUnderPointer(x: number, y: number, ignoredBottle: HTMLDivElement) {
    const bottles = document.querySelectorAll('.bottle') as NodeListOf<HTMLDivElement>
    let bestTarget: HTMLDivElement | null = null
    let bestDistance = Number.POSITIVE_INFINITY

    for (const bottle of bottles) {
        if (bottle === ignoredBottle) continue
        if (bottle.style.visibility === 'hidden') continue

        const rect = bottle.getBoundingClientRect()
        const insideExpandedHitbox =
            x >= rect.left - targetHitboxPadding
            && x <= rect.right + targetHitboxPadding
            && y >= rect.top - targetHitboxPadding
            && y <= rect.bottom + targetHitboxPadding

        if (!insideExpandedHitbox) continue

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distance = Math.hypot(centerX - x, centerY - y)

        if (distance < bestDistance) {
            bestDistance = distance
            bestTarget = bottle
        }
    }

    return bestTarget
}

function getPouringAngle(
    draggedBottle: HTMLDivElement,
    targetBottle: HTMLDivElement,
    previousSide: -1 | 1,
) {
    const draggedRect = draggedBottle.getBoundingClientRect()
    const targetRect = targetBottle.getBoundingClientRect()

    const draggedCenterX = draggedRect.left + draggedRect.width / 2
    const draggedCenterY = draggedRect.top + draggedRect.height / 2
    const targetCenterX = targetRect.left + targetRect.width / 2
    const targetCenterY = targetRect.top + targetRect.height / 2

    const deltaX = targetCenterX - draggedCenterX
    const deltaY = targetCenterY - draggedCenterY

    const horizontalRange = targetRect.width * 1.7
    const verticalRange = targetRect.height * 1.35

    const horizontalProximity = 1 - clamp(Math.abs(deltaX) / horizontalRange, 0, 1)
    const verticalProximity = 1 - clamp(Math.abs(deltaY) / verticalRange, 0, 1)
    const aboveFactor = clamp((targetCenterY - draggedCenterY) / (targetRect.height * 0.9), 0, 1.4)
    const proximity = horizontalProximity * verticalProximity * aboveFactor

    if (proximity <= 0.02) return null

    const sideDeadzone = targetRect.width * 0.18
    const side = Math.abs(deltaX) <= sideDeadzone
        ? previousSide
        : (Math.sign(deltaX) as -1 | 1)

    const maxPourAngle = 52
    return {
        angle: side * maxPourAngle * proximity,
        side,
    }
}

function snapBackToOrigin(element: HTMLDivElement, state: DragState) {
    const originRect = state.placeholder.getBoundingClientRect()
    element.style.transition = 'left 180ms ease-out, top 180ms ease-out, transform 180ms ease-out'
    element.style.left = `${originRect.left}px`
    element.style.top = `${originRect.top}px`
    element.style.transform = 'rotate(0deg)'

    const complete = () => {
        state.placeholder.replaceWith(element)
        resetDraggingStyles(element)
    }

    setTimeout(complete, 190)
}

function onPointerDown(this: HTMLDivElement, ev: PointerEvent) {
    if (activeBottle) return
    if (ev.button !== 0) return

    activeBottle = this
    const now = performance.now()
    const rect = this.getBoundingClientRect()
    const placeholder = document.createElement('div')
    placeholder.className = this.className
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.visibility = 'hidden'
    this.replaceWith(placeholder)
    document.body.appendChild(this)

    const state: DragState = {
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

    dragStates.set(this, state)
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

    ev.preventDefault()
}

function onPointerMove(this: HTMLDivElement, ev: PointerEvent) {
    const state = dragStates.get(this)
    if (!state) return
    if (ev.pointerId !== state.pointerId) return

    const now = performance.now()
    const dt = Math.max((now - state.lastT) / 1000, 1 / 240)
    const dx = ev.clientX - state.lastX
    const dy = ev.clientY - state.lastY

    const vx = dx / dt
    const vy = dy / dt
    const speed = Math.hypot(vx, vy)

    state.x = ev.clientX - state.offsetX
    state.y = ev.clientY - state.offsetY

    const directionalTilt = vx * 0.012
    const velocitySign = Math.abs(vx) < 8 ? 0 : Math.sign(vx)
    const dynamicBoost = clamp(speed / 180, 0, 8) * velocitySign
    const movementAngle = clamp(directionalTilt + dynamicBoost, -30, 30)
    const targetBottle = getBottleUnderPointer(ev.clientX, ev.clientY, this)
    setHighlightedTarget(targetBottle)
    const pouring = targetBottle ? getPouringAngle(this, targetBottle, state.pourSide) : null
    if (pouring) {
        state.pourSide = pouring.side
    }

    const targetAngle = pouring === null
        ? movementAngle
        : clamp(pouring.angle + movementAngle * 0.12, -55, 55)

    state.angle += (targetAngle - state.angle) * 0.25
    this.style.left = `${state.x}px`
    this.style.top = `${state.y}px`
    this.style.transform = `rotate(${state.angle.toFixed(2)}deg)`

    state.lastX = ev.clientX
    state.lastY = ev.clientY
    state.lastT = now
}



function resetBottle(target: HTMLDivElement, ev: PointerEvent) {
    const state = dragStates.get(target)
    if (!state) return
    if (ev.pointerId !== state.pointerId) return

    target.releasePointerCapture(ev.pointerId)
    dragStates.delete(target)
    activeBottle = null
    setHighlightedTarget(null)
    snapBackToOrigin(target, state)
}

function onPointerUp(this: HTMLDivElement, ev: PointerEvent) {
    resetBottle(this, ev)
}

function onPointerUpUsingCallback(cb: InteractionCallback) {
    return function(this: HTMLDivElement, ev: PointerEvent) {
        const targetBottle = getBottleUnderPointer(ev.clientX, ev.clientY, this)
        resetBottle(this, ev)

        if(targetBottle) cb(targetBottle, this)
    }
}

type InteractionCallback = (target: HTMLDivElement, origin: HTMLDivElement) => void
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