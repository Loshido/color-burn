import COLORS from "./colors.json"
import { MAX_PER_BOTTLE } from "./mod"

export interface SetupInput {
    n_bottles: number
}
interface SetupOutput {
    bottles: string[][]
}

export default async ({ n_bottles }: SetupInput): Promise<SetupOutput> => {
    const colorsPerBottle = MAX_PER_BOTTLE - 1;
    
    const totalColors = n_bottles * colorsPerBottle;
    const n_colors = totalColors / MAX_PER_BOTTLE;
    const bottles: string[][] = Array.from({ length: n_bottles }, () => []);
    
    const colorPool: string[] = [];
    for (let i = 0; i < n_colors; i++) {
        const color = COLORS[i % COLORS.length];
        for (let j = 0; j < MAX_PER_BOTTLE; j++) {
            colorPool.push(color);
        }
    }
    
    // shuffles the pool with Fisher-Yates
    for (let i = colorPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
    }
    
    // distributes colors
    let colorIndex = 0;
    for (let i = 0; i < n_bottles; i++) {
        for (let j = 0; j < colorsPerBottle; j++) {
            bottles[i].push(colorPool[colorIndex]);
            colorIndex++;
        }
    }
    
    return { bottles }
}