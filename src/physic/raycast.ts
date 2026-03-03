import { targetHitboxPadding } from "./mod"

function isInsideHitBox<T extends HTMLElement>(x: number, y: number, item: T): boolean {
    const rect = item.getBoundingClientRect()
    return x >= rect.left   - targetHitboxPadding
        && x <= rect.right  + targetHitboxPadding
        && y >= rect.top    - targetHitboxPadding
        && y <= rect.bottom + targetHitboxPadding
}

function distancePointItem<T extends HTMLElement>(x: number, y: number, item: T): number {
    const rect = item.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    return Math.hypot(centerX - x, centerY - y)
}

export default function getBottleUnderPointer(x: number, y: number, ignoredBottle: HTMLDivElement) {
    const bottles = document.querySelectorAll('.bottle') as NodeListOf<HTMLDivElement>
    let bestTarget: HTMLDivElement | null = null
    let bestDistance = Number.POSITIVE_INFINITY

    for (const bottle of bottles) {
        if (bottle === ignoredBottle) continue
        if (bottle.style.visibility === 'hidden') continue
        if (!isInsideHitBox(x, y, bottle)) continue

        const distance = distancePointItem(x, y, bottle)

        if (distance < bestDistance) {
            bestDistance = distance
            bestTarget = bottle
        }
    }

    return bestTarget
}