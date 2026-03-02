import { pouringBottles } from "./func"
import setup from "./setup"
export const MAX_PER_BOTTLE = 6
export const bottles = new Map<string, string[]>()

export default (bottle: number) => {
    setup(bottle)

    return {
        onPouring(target: HTMLDivElement, origin: HTMLDivElement) {
            pouringBottles(origin.id, target.id)
        }
    }
}