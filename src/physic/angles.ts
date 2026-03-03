import { clamp } from "./mod"

export function getPouringAngle(
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