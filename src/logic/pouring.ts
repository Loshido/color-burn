import { n_bottles } from "../main"
import { syncWithBottle } from "./func"
import { MAX_PER_BOTTLE, bottles } from "./mod"

export default (from: string, to: string) => {
    const bottleFrom = bottles.get(from)!
    let bottleTo = bottles.get(to)!
    
    let capacity = MAX_PER_BOTTLE - bottleTo.length
    if(capacity <= 0) return

    const color = bottleFrom.shift()!
    capacity--;
    bottleTo = [color].concat(bottleTo)

    // we shift until the color changes or the capacity is none
    while(capacity >= 1 && bottleFrom.at(0) === color) {
        bottleFrom.shift()
        bottleTo = [color].concat(bottleTo)
        capacity--;
    }

    bottles.set(to, bottleTo)
    bottles.set(from, bottleFrom)

    // all layer are the same color && bottle is full => remove it
    if(bottleTo.every((_, i, a) => a.at(i) === a.at(i - 1)) && bottleTo.length === MAX_PER_BOTTLE) {
        document.getElementById(to)?.remove()
        bottles.delete(to)
        syncWithBottle(from)
        
        // we check if the game ended
        if(bottles.size <= Math.round(n_bottles / 6) ) {
            const event = new CustomEvent('color-burn:end')
            document.dispatchEvent(event)
        }
        return
    }
    
    // we sync dom with computed bottles state
    syncWithBottle(from)
    syncWithBottle(to)
}