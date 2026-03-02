import COLORS from "./colors.json"
import { MAX_PER_BOTTLE } from "./mod"

export interface SetupInput {
    n_bottles: number
}
interface SetupOutput {
    bottles: string[][]
}

export default async ({ n_bottles }: SetupInput): Promise<SetupOutput> => {
    // Chaque bouteille contient (MAX_PER_BOTTLE - 1) couleurs
    const colorsPerBottle = MAX_PER_BOTTLE - 1;
    
    // Nombre total de couleurs à distribuer
    const totalColors = n_bottles * colorsPerBottle;
    
    // Nombre de couleurs différentes (chaque couleur apparaît MAX_PER_BOTTLE fois)
    const n_colors = totalColors / MAX_PER_BOTTLE;
    
    // Initialiser toutes les bouteilles
    const bottles: string[][] = Array.from({ length: n_bottles }, () => []);
    
    // Créer le pool de couleurs : chaque couleur apparaît MAX_PER_BOTTLE fois
    const colorPool: string[] = [];
    for (let i = 0; i < n_colors; i++) {
        const color = COLORS[i % COLORS.length];
        for (let j = 0; j < MAX_PER_BOTTLE; j++) {
            colorPool.push(color);
        }
    }
    
    // Mélanger le pool avec Fisher-Yates
    for (let i = colorPool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
    }
    
    // Distribuer les couleurs dans toutes les bouteilles
    let colorIndex = 0;
    for (let i = 0; i < n_bottles; i++) {
        for (let j = 0; j < colorsPerBottle; j++) {
            bottles[i].push(colorPool[colorIndex]);
            colorIndex++;
        }
    }
    
    return { bottles }
}