import type { Chromosome } from '../../types'

export function decodeLandscape(genes: (number | string)[]): { x: number; y: number; rawRastrigin: number; fitness: number } {
  const bitsX = genes.slice(0, 8).join('')
  const bitsY = genes.slice(8, 16).join('')

  const intX = parseInt(bitsX, 2)
  const intY = parseInt(bitsY, 2)

  const x = -5.12 + (intX / 255) * 10.24
  const y = -5.12 + (intY / 255) * 10.24

  const rawRastrigin = 20 + (x * x - 10 * Math.cos(2 * Math.PI * x)) + (y * y - 10 * Math.cos(2 * Math.PI * y))
  const fitness = Math.round((100 / (1 + rawRastrigin)) * 100) / 100

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
    rawRastrigin: Math.round(rawRastrigin * 100) / 100,
    fitness
  }
}

export function createLandscapeInitialPopulation(popSize: number): Chromosome[] {
  const pop: Chromosome[] = []

  for (let i = 0; i < popSize; i++) {
    const genes: number[] = []
    for (let j = 0; j < 16; j++) {
      genes.push(Math.random() < 0.5 ? 1 : 0)
    }

    const { x, y, rawRastrigin, fitness } = decodeLandscape(genes)

    pop.push({
      id: `chr-land-${i + 1}`,
      genes,
      fitness,
      rawScore: rawRastrigin,
      selectionProbability: 0,
      cumulativeProbability: 0,
      expectedCount: 0,
      actualSelectedCount: 0,
      phenotypeDisplay: `(x: ${x}, y: ${y}), R(x,y)=${rawRastrigin}`,
      metadata: { x, y, rawRastrigin }
    })
  }

  return pop
}
