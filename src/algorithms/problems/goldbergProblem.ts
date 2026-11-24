import type { Chromosome } from '../../types'
import { GOLDBERG_TABLE_1_1 } from '../../constants/goldbergData'

export function decodeGoldberg(genes: (number | string)[]): { x: number; fitness: number } {
  const binaryStr = genes.join('')
  const x = parseInt(binaryStr, 2)
  const fitness = x * x
  return { x, fitness }
}

export function createGoldbergInitialPopulation(deterministic: boolean = true): Chromosome[] {
  if (deterministic) {
    return GOLDBERG_TABLE_1_1.map((item, index) => {
      const genes = item.string.split('').map(Number)
      return {
        id: `chr-goldberg-${index + 1}`,
        genes,
        fitness: item.fitness,
        rawScore: item.x,
        selectionProbability: item.probSelection,
        cumulativeProbability: 0,
        expectedCount: item.expectedCount,
        actualSelectedCount: item.actualCount,
        phenotypeDisplay: `x = ${item.x}, f(x) = ${item.fitness}`,
        metadata: { x: item.x, originalGoldbergId: item.id }
      }
    })
  }

  // Random 4 strings
  const pop: Chromosome[] = []
  for (let i = 0; i < 4; i++) {
    const genes: number[] = []
    for (let j = 0; j < 5; j++) {
      genes.push(Math.random() < 0.5 ? 0 : 1)
    }
    const { x, fitness } = decodeGoldberg(genes)
    pop.push({
      id: `chr-rnd-${i + 1}`,
      genes,
      fitness,
      rawScore: x,
      selectionProbability: 0,
      cumulativeProbability: 0,
      expectedCount: 0,
      actualSelectedCount: 0,
      phenotypeDisplay: `x = ${x}, f(x) = ${fitness}`,
      metadata: { x }
    })
  }
  return pop
}
