import { pouringBottles } from "./func"
import setup from "./setup"
export const MAX_PER_BOTTLE = 6
export const bottles = new Map<string, string[]>()
export let n_bottles = 6

export default (bottle: number) => {
    n_bottles = bottle
    setup()

    return {
        onPouring(target: HTMLDivElement, origin: HTMLDivElement) {
            pouringBottles(origin.id, target.id)
        }
    }
}