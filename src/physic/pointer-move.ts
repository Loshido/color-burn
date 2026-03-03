import { getPouringAngle } from "./angles"
import { setHighlightedTarget } from "./highlight"
import { clamp, dragStates } from "./mod"
import getBottleUnderPointer from "./raycast"

// claude
export default function onPointerMove(this: HTMLDivElement, ev: PointerEvent) {
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
    if (pouring) state.pourSide = pouring.side

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