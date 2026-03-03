import pouring from "./pouring"
import setup from "./setup"
export const MAX_PER_BOTTLE = 6
export const bottles = new Map<string, string[]>()

export default () => {
    setup()

    return {
        onPouring: pouring
    }
}