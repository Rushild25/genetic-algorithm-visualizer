import type { Chromosome } from '../../types'

export const WEASEL_CHARSET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export function evaluateWeasel(genes: (number | string)[], target: string): { fitness: number; matches: number } {
  let matches = 0
  const n = Math.min(genes.length, target.length)
  for (let i = 0; i < n; i++) {
    if (genes[i] === target[i]) {
      matches++
    }
  }
  const fitness = Math.pow(matches + 1, 2)
  return { fitness, matches }
}

export function createWeaselInitialPopulation(popSize: number, target: string): Chromosome[] {
  const pop: Chromosome[] = []
  const len = target.length

  for (let i = 0; i < popSize; i++) {
    const genes: string[] = []
    for (let j = 0; j < len; j++) {
      const idx = Math.floor(Math.random() * WEASEL_CHARSET.length)
      genes.push(WEASEL_CHARSET[idx])
    }

    const { fitness, matches } = evaluateWeasel(genes, target)
    const str = genes.join('')

    pop.push({
      id: `chr-weasel-${i + 1}`,
      genes,
      fitness,
      rawScore: matches,
      selectionProbability: 0,
      cumulativeProbability: 0,
      expectedCount: 0,
      actualSelectedCount: 0,
      phenotypeDisplay: `"${str}" (${matches}/${len})`,
      metadata: { matches, text: str }
    })
  }

  return pop
}
