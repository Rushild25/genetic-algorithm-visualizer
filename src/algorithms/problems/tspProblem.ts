import type { City, Chromosome } from '../../types'

export function calculateTourDistance(genes: (number | string)[], cities: City[]): number {
  if (genes.length < 2) return 0
  let totalDist = 0
  const cityMap = new Map<number, City>()
  cities.forEach(c => cityMap.set(c.id, c))

  for (let i = 0; i < genes.length; i++) {
    const c1Id = Number(genes[i])
    const c2Id = Number(genes[(i + 1) % genes.length])
    const c1 = cityMap.get(c1Id)
    const c2 = cityMap.get(c2Id)
    if (c1 && c2) {
      const dx = c1.x - c2.x
      const dy = c1.y - c2.y
      totalDist += Math.sqrt(dx * dx + dy * dy)
    }
  }
  return Math.round(totalDist * 10) / 10
}

export function tspFitness(distance: number): number {
  if (distance <= 0) return 1
  return Math.round((100000 / distance) * 100) / 100
}

export function createTspInitialPopulation(popSize: number, cities: City[]): Chromosome[] {
  const cityIds = cities.map(c => c.id)
  const pop: Chromosome[] = []

  for (let i = 0; i < popSize; i++) {
    const genes = [...cityIds]
    for (let j = genes.length - 1; j > 0; j--) {
      const r = Math.floor(Math.random() * (j + 1))
      ;[genes[j], genes[r]] = [genes[r], genes[j]]
    }

    const dist = calculateTourDistance(genes, cities)
    const fit = tspFitness(dist)

    pop.push({
      id: `chr-tsp-${i + 1}`,
      genes,
      fitness: fit,
      rawScore: dist,
      selectionProbability: 0,
      cumulativeProbability: 0,
      expectedCount: 0,
      actualSelectedCount: 0,
      phenotypeDisplay: `Tour Length: ${dist} px`,
      metadata: { distance: dist }
    })
  }

  return pop
}

export function orderCrossover(parent1: (number | string)[], parent2: (number | string)[]): [(number | string)[], (number | string)[]] {
  const n = parent1.length
  if (n <= 2) return [[...parent1], [...parent2]]

  const pt1 = Math.floor(Math.random() * (n - 2))
  const pt2 = pt1 + 1 + Math.floor(Math.random() * (n - pt1 - 1))

  const breedChild = (p1: (number | string)[], p2: (number | string)[]) => {
    const child: (number | string)[] = new Array(n).fill(null)
    const included = new Set<number | string>()

    for (let i = pt1; i <= pt2; i++) {
      child[i] = p1[i]
      included.add(p1[i])
    }

    let p2Idx = (pt2 + 1) % n
    let childIdx = (pt2 + 1) % n

    while (included.size < n) {
      const candidate = p2[p2Idx]
      if (!included.has(candidate)) {
        child[childIdx] = candidate
        included.add(candidate)
        childIdx = (childIdx + 1) % n
      }
      p2Idx = (p2Idx + 1) % n
    }

    return child
  }

  return [breedChild(parent1, parent2), breedChild(parent2, parent1)]
}

export function tspMutate(genes: (number | string)[]): (number | string)[] {
  const res = [...genes]
  const n = res.length
  if (n <= 2) return res

  const i = Math.floor(Math.random() * (n - 1))
  const j = i + 1 + Math.floor(Math.random() * (n - i - 1))

  let left = i
  let right = j
  while (left < right) {
    ;[res[left], res[right]] = [res[right], res[left]]
    left++
    right--
  }

  return res
}
