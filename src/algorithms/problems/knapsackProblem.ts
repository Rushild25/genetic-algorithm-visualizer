import type { Chromosome, KnapsackItem } from '../../types'

export function evaluateKnapsack(
  genes: (number | string)[],
  items: KnapsackItem[],
  maxCapacity: number
): { totalWeight: number; totalValue: number; fitness: number; isFeasible: boolean } {
  let totalWeight = 0
  let totalValue = 0

  for (let i = 0; i < genes.length; i++) {
    if (Number(genes[i]) === 1 && items[i]) {
      totalWeight += items[i].weight
      totalValue += items[i].value
    }
  }

  const isFeasible = totalWeight <= maxCapacity
  let fitness = totalValue

  if (!isFeasible) {
    const penalty = 8 * (totalWeight - maxCapacity)
    fitness = Math.max(1, totalValue - penalty)
  }

  return { totalWeight, totalValue, fitness, isFeasible }
}

export function createKnapsackInitialPopulation(
  popSize: number,
  items: KnapsackItem[],
  maxCapacity: number
): Chromosome[] {
  const pop: Chromosome[] = []

  for (let i = 0; i < popSize; i++) {
    const genes: number[] = []
    for (let j = 0; j < items.length; j++) {
      genes.push(Math.random() < 0.35 ? 1 : 0)
    }

    const { totalWeight, totalValue, fitness, isFeasible } = evaluateKnapsack(genes, items, maxCapacity)

    pop.push({
      id: `chr-ks-${i + 1}`,
      genes,
      fitness,
      rawScore: totalValue,
      selectionProbability: 0,
      cumulativeProbability: 0,
      expectedCount: 0,
      actualSelectedCount: 0,
      phenotypeDisplay: `Val: \$${totalValue}, Wt: ${totalWeight}/${maxCapacity}kg ${isFeasible ? '✓' : '⚠️Over'}`,
      metadata: { totalWeight, totalValue, isFeasible }
    })
  }

  return pop
}
