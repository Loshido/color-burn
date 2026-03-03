export let highlightedTarget: HTMLDivElement | null = null

export function setHighlightedTarget(target: HTMLDivElement | null) {
    if (highlightedTarget === target) return
    if (highlightedTarget) {
        highlightedTarget.classList.remove('bottle-target')
    }

    highlightedTarget = target
    if (highlightedTarget) {
        highlightedTarget.classList.add('bottle-target')
    }
}