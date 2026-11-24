import type {
  Chromosome,
  GAParameters,
  GASnapshot,
  GenerationStats,
  ProblemType,
  City,
  KnapsackItem
} from '../types'
import { decodeGoldberg } from './problems/goldbergProblem'
import { calculateTourDistance, tspFitness, orderCrossover, tspMutate } from './problems/tspProblem'
import { evaluateWeasel, WEASEL_CHARSET } from './problems/weaselProblem'
import { evaluateKnapsack } from './problems/knapsackProblem'
import { decodeLandscape } from './problems/landscapeProblem'
import { GOLDBERG_TABLE_1_2 } from '../constants/goldbergData'

export function evaluateChromosome(
  genes: (number | string)[],
  problemType: ProblemType,
  context?: { cities?: City[]; targetText?: string; knapsackItems?: KnapsackItem[]; knapsackCapacity?: number }
): { fitness: number; rawScore?: number; phenotypeDisplay: string; metadata?: Record<string, any> } {
  switch (problemType) {
    case 'goldberg': {
      const { x, fitness } = decodeGoldberg(genes)
      return {
        fitness,
        rawScore: x,
        phenotypeDisplay: `x = ${x}, f(x) = ${fitness}`,
        metadata: { x }
      }
    }
    case 'tsp': {
      const cities = context?.cities || []
      const dist = calculateTourDistance(genes, cities)
      const fitness = tspFitness(dist)
      return {
        fitness,
        rawScore: dist,
        phenotypeDisplay: `Tour: ${dist} px`,
        metadata: { distance: dist }
      }
    }
    case 'weasel': {
      const target = context?.targetText || 'METHINKS IT IS LIKE A WEASEL'
      const { fitness, matches } = evaluateWeasel(genes, target)
      const text = genes.join('')
      return {
        fitness,
        rawScore: matches,
        phenotypeDisplay: `"${text}" (${matches}/${target.length})`,
        metadata: { matches, text }
      }
    }
    case 'knapsack': {
      const items = context?.knapsackItems || []
      const cap = context?.knapsackCapacity || 20
      const { totalWeight, totalValue, fitness, isFeasible } = evaluateKnapsack(genes, items, cap)
      return {
        fitness,
        rawScore: totalValue,
        phenotypeDisplay: `\$${totalValue} (${totalWeight}/${cap}kg) ${isFeasible ? '✓' : '⚠️'}`,
        metadata: { totalWeight, totalValue, isFeasible }
      }
    }
    case 'landscape': {
      const { x, y, rawRastrigin, fitness } = decodeLandscape(genes)
      return {
        fitness,
        rawScore: rawRastrigin,
        phenotypeDisplay: `(x:${x}, y:${y}) R=${rawRastrigin}`,
        metadata: { x, y, rawRastrigin }
      }
    }
  }
}

export function computeGenerationStats(
  generation: number,
  population: Chromosome[]
): GenerationStats {
  const n = population.length
  if (n === 0) {
    return {
      generation,
      maxFitness: 0,
      avgFitness: 0,
      minFitness: 0,
      totalFitness: 0,
      bestIndividual: {} as Chromosome,
      diversityIndex: 0,
      alleleFrequencies: []
    }
  }

  let totalFitness = 0
  let maxFitness = -Infinity
  let minFitness = Infinity
  let best = population[0]

  population.forEach(chr => {
    totalFitness += chr.fitness
    if (chr.fitness > maxFitness) {
      maxFitness = chr.fitness
      best = chr
    }
    if (chr.fitness < minFitness) {
      minFitness = chr.fitness
    }
  })

  const avgFitness = Math.round((totalFitness / n) * 100) / 100

  // Allele frequency calculation (percentage of '1's or specific alleles at each locus)
  const geneLen = population[0]?.genes?.length || 0
  const alleleFrequencies: number[] = []

  for (let locus = 0; locus < geneLen; locus++) {
    let count = 0
    for (let i = 0; i < n; i++) {
      if (Number(population[i].genes[locus]) === 1) {
        count++
      }
    }
    alleleFrequencies.push(Math.round((count / n) * 100))
  }

  // Diversity Index: average Hamming distance between distinct pairs
  let totalHamming = 0
  let pairCount = 0
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let diff = 0
      for (let k = 0; k < geneLen; k++) {
        if (population[i].genes[k] !== population[j].genes[k]) {
          diff++
        }
      }
      totalHamming += diff
      pairCount++
    }
  }
  const diversityIndex = pairCount > 0 ? Math.round((totalHamming / pairCount) * 10) / 10 : 0

  return {
    generation,
    maxFitness: Math.round(maxFitness * 100) / 100,
    avgFitness,
    minFitness: Math.round(minFitness * 100) / 100,
    totalFitness: Math.round(totalFitness * 100) / 100,
    bestIndividual: { ...best },
    diversityIndex,
    alleleFrequencies
  }
}

// Advances the simulation by exactly one micro-phase
export function stepOnePhase(
  currentSnapshot: GASnapshot,
  params: GAParameters,
  problemType: ProblemType,
  context?: { cities?: City[]; targetText?: string; knapsackItems?: KnapsackItem[]; knapsackCapacity?: number }
): GASnapshot {
  const { generation, phase, population, statsHistory } = currentSnapshot

  switch (phase) {
    case 'INITIALIZED':
    case 'REPLACE': {
      // Transition to EVALUATE
      const evaluatedPop = population.map(chr => {
        const evalRes = evaluateChromosome(chr.genes, problemType, context)
        return {
          ...chr,
          fitness: evalRes.fitness,
          rawScore: evalRes.rawScore,
          phenotypeDisplay: evalRes.phenotypeDisplay,
          metadata: evalRes.metadata,
          actualSelectedCount: 0
        }
      })

      const totalFit = evaluatedPop.reduce((sum, c) => sum + c.fitness, 0)
      const avgFit = totalFit / evaluatedPop.length

      let cumProb = 0
      const popWithProbs = evaluatedPop.map(chr => {
        const prob = totalFit > 0 ? chr.fitness / totalFit : 1 / evaluatedPop.length
        cumProb += prob
        const expected = avgFit > 0 ? chr.fitness / avgFit : 1
        return {
          ...chr,
          selectionProbability: Math.round(prob * 1000) / 1000,
          cumulativeProbability: Math.round(cumProb * 1000) / 1000,
          expectedCount: Math.round(expected * 100) / 100
        }
      })

      const newStats = computeGenerationStats(generation, popWithProbs)
      const updatedHistory = statsHistory.length === 0 || statsHistory[statsHistory.length - 1].generation !== generation
        ? [...statsHistory, newStats]
        : statsHistory

      return {
        ...currentSnapshot,
        phase: 'EVALUATE',
        population: popWithProbs,
        statsHistory: updatedHistory,
        activeExplanation: {
          title: `Generation ${generation}: Evaluation Phase`,
          body: `Evaluated fitness for all ${popWithProbs.length} individuals. Total population fitness is ${newStats.totalFitness}, with an average fitness of ${newStats.avgFitness}. Highest fitness in this population is ${newStats.maxFitness} (${newStats.bestIndividual.phenotypeDisplay}). Each individual's selection probability p_i = f_i / Σf has been calculated.`,
          mathHighlight: `p_i = \\frac{f_i}{\\sum_{k=1}^N f_k}, \\quad \\bar{f} = ${newStats.avgFitness}, \\quad \\sum f = ${newStats.totalFitness}`,
          pseudocodeLine: 4
        }
      }
    }

    case 'EVALUATE': {
      // Transition to SELECT
      // Check if textbook Goldberg deterministic mode
      if (problemType === 'goldberg' && params.isDeterministicGoldberg && generation === 0) {
        // Table 1.1 exact counts: String 1 (count 1), String 2 (count 2), String 3 (count 0), String 4 (count 1)
        const matingPool: Chromosome[] = [
          { ...population[0], actualSelectedCount: 1, selectedAsParent: true },
          { ...population[1], actualSelectedCount: 2, selectedAsParent: true },
          { ...population[1], actualSelectedCount: 2, selectedAsParent: true },
          { ...population[3], actualSelectedCount: 1, selectedAsParent: true },
        ]

        const popUpdated = population.map((chr, idx) => ({
          ...chr,
          actualSelectedCount: idx === 0 ? 1 : idx === 1 ? 2 : idx === 2 ? 0 : 1
        }))

        return {
          ...currentSnapshot,
          phase: 'SELECT',
          population: popUpdated,
          matingPool,
          activeExplanation: {
            title: `Textbook Selection (Goldberg Table 1.1)`,
            body: `Roulette wheel selection sampled 4 individuals based on their relative probabilities: String 2 (prob 49.2%) was selected TWICE, String 1 (prob 14.4%) was selected ONCE, String 4 (prob 30.9%) was selected ONCE, and String 3 (prob 5.5%) was eliminated. This exactly matches Goldberg Chapter 1!`,
            mathHighlight: `\\text{Mating Pool} = \\{ \\text{str}_1, \\text{str}_2, \\text{str}_2, \\text{str}_4 \\}`,
            pseudocodeLine: 5
          }
        }
      }

      // General Selection
      const popSize = population.length
      const matingPool: Chromosome[] = []
      const counts: Record<string, number> = {}
      population.forEach(c => (counts[c.id] = 0))

      if (params.selectionMethod === 'tournament') {
        const k = params.tournamentSize || 2
        for (let i = 0; i < popSize; i++) {
          let bestCandidate = population[Math.floor(Math.random() * popSize)]
          for (let t = 1; t < k; t++) {
            const competitor = population[Math.floor(Math.random() * popSize)]
            if (competitor.fitness > bestCandidate.fitness) {
              bestCandidate = competitor
            }
          }
          matingPool.push({ ...bestCandidate, selectedAsParent: true })
          counts[bestCandidate.id] = (counts[bestCandidate.id] || 0) + 1
        }
      } else {
        // Default: Roulette Wheel Selection
        for (let i = 0; i < popSize; i++) {
          const r = Math.random()
          let selected = population[0]
          for (const chr of population) {
            if (r <= chr.cumulativeProbability) {
              selected = chr
              break
            }
          }
          matingPool.push({ ...selected, selectedAsParent: true })
          counts[selected.id] = (counts[selected.id] || 0) + 1
        }
      }

      const updatedPop = population.map(chr => ({
        ...chr,
        actualSelectedCount: counts[chr.id] || 0
      }))

      return {
        ...currentSnapshot,
        phase: 'SELECT',
        population: updatedPop,
        matingPool,
        activeExplanation: {
          title: `Selection Phase (${params.selectionMethod.toUpperCase()})`,
          body: `Selected ${matingPool.length} parents into the mating pool. Higher-fitness individuals had a larger probability wedge and were sampled more frequently, multiplying fit building blocks while weeding out low-fitness candidates.`,
          mathHighlight: `\\mathbb{E}[\\text{Count}_i] = \\frac{f_i}{\\bar{f}}`,
          pseudocodeLine: 5
        }
      }
    }

    case 'SELECT': {
      // Transition to CROSSOVER execution
      const matingPool = currentSnapshot.matingPool
      const offspring: Chromosome[] = []

      if (problemType === 'goldberg' && params.isDeterministicGoldberg && generation === 0) {
        // Goldberg Table 1.2 exact crossover:
        const step1 = GOLDBERG_TABLE_1_2[0]
        const step2 = GOLDBERG_TABLE_1_2[1]

        const child1Genes = step1.offspringAfterCrossover[0].split('').map(Number)
        const child2Genes = step1.offspringAfterCrossover[1].split('').map(Number)
        const child3Genes = step2.offspringAfterCrossover[0].split('').map(Number)
        const child4Genes = step2.offspringAfterCrossover[1].split('').map(Number)

        offspring.push({
          id: `off-1`,
          genes: child1Genes,
          fitness: 0,
          selectionProbability: 0,
          cumulativeProbability: 0,
          expectedCount: 0,
          actualSelectedCount: 0,
          crossoverPoint: 4,
          parentIds: ['chr-goldberg-1', 'chr-goldberg-2'],
          phenotypeDisplay: `Crossover Site 4`,
        })
        offspring.push({
          id: `off-2`,
          genes: child2Genes,
          fitness: 0,
          selectionProbability: 0,
          cumulativeProbability: 0,
          expectedCount: 0,
          actualSelectedCount: 0,
          crossoverPoint: 4,
          parentIds: ['chr-goldberg-1', 'chr-goldberg-2'],
          phenotypeDisplay: `Crossover Site 4`,
        })
        offspring.push({
          id: `off-3`,
          genes: child3Genes,
          fitness: 0,
          selectionProbability: 0,
          cumulativeProbability: 0,
          expectedCount: 0,
          actualSelectedCount: 0,
          crossoverPoint: 2,
          parentIds: ['chr-goldberg-2', 'chr-goldberg-4'],
          phenotypeDisplay: `Crossover Site 2`,
        })
        offspring.push({
          id: `off-4`,
          genes: child4Genes,
          fitness: 0,
          selectionProbability: 0,
          cumulativeProbability: 0,
          expectedCount: 0,
          actualSelectedCount: 0,
          crossoverPoint: 2,
          parentIds: ['chr-goldberg-2', 'chr-goldberg-4'],
          phenotypeDisplay: `Crossover Site 2`,
        })

        return {
          ...currentSnapshot,
          phase: 'CROSSOVER',
          offspring,
          activePair: [matingPool[0], matingPool[1]],
          activeCrossoverLocus: 4,
          activeExplanation: {
            title: `Textbook Crossover (Goldberg Table 1.2)`,
            body: `Pair 1 ('01101' & '11000') crossed at locus 4 -> Offspring '01100' and '11001'. Pair 2 ('11000' & '10011') crossed at locus 2 -> Offspring '11011' and '10000'. Recombination successfully combined favorable bits from both parents!`,
            mathHighlight: `\\text{Crossover Sites: } k_1 = 4, \\quad k_2 = 2`,
            pseudocodeLine: 6
          }
        }
      }

      // General Crossover
      for (let i = 0; i < matingPool.length; i += 2) {
        const parent1 = matingPool[i]
        const parent2 = matingPool[(i + 1) % matingPool.length]

        if (Math.random() <= params.crossoverRate) {
          if (problemType === 'tsp') {
            const [c1Genes, c2Genes] = orderCrossover(parent1.genes, parent2.genes)
            offspring.push({
              id: `off-${offspring.length + 1}`,
              genes: c1Genes,
              fitness: 0,
              selectionProbability: 0,
              cumulativeProbability: 0,
              expectedCount: 0,
              actualSelectedCount: 0,
              parentIds: [parent1.id, parent2.id],
              phenotypeDisplay: 'Order Crossover (OX1)'
            })
            if (offspring.length < matingPool.length) {
              offspring.push({
                id: `off-${offspring.length + 1}`,
                genes: c2Genes,
                fitness: 0,
                selectionProbability: 0,
                cumulativeProbability: 0,
                expectedCount: 0,
                actualSelectedCount: 0,
                parentIds: [parent1.id, parent2.id],
                phenotypeDisplay: 'Order Crossover (OX1)'
              })
            }
          } else {
            // Single-point Crossover
            const locus = 1 + Math.floor(Math.random() * (parent1.genes.length - 1))
            const c1Genes = [...parent1.genes.slice(0, locus), ...parent2.genes.slice(locus)]
            const c2Genes = [...parent2.genes.slice(0, locus), ...parent1.genes.slice(locus)]

            offspring.push({
              id: `off-${offspring.length + 1}`,
              genes: c1Genes,
              fitness: 0,
              selectionProbability: 0,
              cumulativeProbability: 0,
              expectedCount: 0,
              actualSelectedCount: 0,
              crossoverPoint: locus,
              parentIds: [parent1.id, parent2.id],
              phenotypeDisplay: `Crossover at locus ${locus}`
            })
            if (offspring.length < matingPool.length) {
              offspring.push({
                id: `off-${offspring.length + 1}`,
                genes: c2Genes,
                fitness: 0,
                selectionProbability: 0,
                cumulativeProbability: 0,
                expectedCount: 0,
                actualSelectedCount: 0,
                crossoverPoint: locus,
                parentIds: [parent1.id, parent2.id],
                phenotypeDisplay: `Crossover at locus ${locus}`
              })
            }
          }
        } else {
          // No crossover: clones
          offspring.push({ ...parent1, id: `off-${offspring.length + 1}` })
          if (offspring.length < matingPool.length) {
            offspring.push({ ...parent2, id: `off-${offspring.length + 1}` })
          }
        }
      }

      return {
        ...currentSnapshot,
        phase: 'CROSSOVER',
        offspring,
        activeExplanation: {
          title: `Crossover Phase (Rate: ${Math.round(params.crossoverRate * 100)}%)`,
          body: `Recombined mated pairs into ${offspring.length} offspring. Crossover splits parent chromosomes at designated loci and splices complimentary halves, exploring new regions in search space while preserving sub-optimal schemas.`,
          mathHighlight: `P(crossover) = ${params.crossoverRate}`,
          pseudocodeLine: 6
        }
      }
    }

    case 'CROSSOVER': {
      // Transition from CROSSOVER to MUTATION
      const offspring = currentSnapshot.offspring

      if (problemType === 'goldberg' && params.isDeterministicGoldberg && generation === 0) {
        const mutated = offspring.map((chr, idx) => {
          const evalRes = evaluateChromosome(chr.genes, problemType, context)
          return {
            ...chr,
            fitness: evalRes.fitness,
            rawScore: evalRes.rawScore,
            phenotypeDisplay: evalRes.phenotypeDisplay,
            metadata: evalRes.metadata,
            mutatedIndices: idx === 2 ? [3] : []
          }
        })

        return {
          ...currentSnapshot,
          phase: 'MUTATE',
          offspring: mutated,
          activeExplanation: {
            title: `Textbook Mutation (Goldberg Table 1.2)`,
            body: `At textbook mutation probability p_m = 0.001 across all 20 bits, mutation occurred on String 4 bit 4 (flipped 0 -> 1). The 4 resulting strings are '01100' (x=12), '11001' (x=25), '11011' (x=27), and '10000' (x=16). Notice that String 3 reached x=27 with fitness 729!`,
            mathHighlight: `p_m = 0.001, \\quad \\text{Max } f(x) = 729`,
            pseudocodeLine: 7
          }
        }
      }

      // General Mutation
      const mutated = offspring.map(chr => {
        let genes = [...chr.genes]
        const mutatedIndices: number[] = []

        if (problemType === 'tsp') {
          if (Math.random() <= params.mutationRate) {
            genes = tspMutate(genes)
            mutatedIndices.push(0)
          }
        } else if (problemType === 'weasel') {
          for (let j = 0; j < genes.length; j++) {
            if (Math.random() <= params.mutationRate) {
              const rIdx = Math.floor(Math.random() * WEASEL_CHARSET.length)
              genes[j] = WEASEL_CHARSET[rIdx]
              mutatedIndices.push(j)
            }
          }
        } else {
          // Binary bit-flip mutation
          for (let j = 0; j < genes.length; j++) {
            if (Math.random() <= params.mutationRate) {
              genes[j] = Number(genes[j]) === 1 ? 0 : 1
              mutatedIndices.push(j)
            }
          }
        }

        const evalRes = evaluateChromosome(genes, problemType, context)
        return {
          ...chr,
          genes,
          fitness: evalRes.fitness,
          rawScore: evalRes.rawScore,
          phenotypeDisplay: evalRes.phenotypeDisplay,
          metadata: evalRes.metadata,
          mutatedIndices
        }
      })

      const totalMutations = mutated.reduce((sum, c) => sum + (c.mutatedIndices?.length || 0), 0)

      return {
        ...currentSnapshot,
        phase: 'MUTATE',
        offspring: mutated,
        activeExplanation: {
          title: `Mutation Phase (Rate: ${params.mutationRate})`,
          body: `Evaluated gene mutation across all loci. A total of ${totalMutations} bit-flips occurred. Mutation ensures alleles aren't permanently lost from the gene pool, preventing premature stagnation.`,
          mathHighlight: `P(bit flip) = p_m = ${params.mutationRate}`,
          pseudocodeLine: 7
        }
      }
    }

    case 'MUTATE': {
      // Transition from MUTATE to REPLACE (assemble next generation)
      const sortedOld = [...population].sort((a, b) => b.fitness - a.fitness)
      const eliteCount = Math.min(params.elitismCount, population.length)
      const elites = sortedOld.slice(0, eliteCount).map(c => ({ ...c, isElite: true }))

      const neededFromOffspring = population.length - eliteCount
      const newPopCandidates = currentSnapshot.offspring.slice(0, neededFromOffspring)

      const nextPop: Chromosome[] = [...elites, ...newPopCandidates].map((c, idx) => ({
        ...c,
        id: `chr-g${generation + 1}-${idx + 1}`
      }))

      const newGenStats = computeGenerationStats(generation + 1, nextPop)

      return {
        generation: generation + 1,
        phase: 'REPLACE',
        subStepIndex: 0,
        population: nextPop,
        matingPool: [],
        offspring: [],
        statsHistory: [...statsHistory, newGenStats],
        activeExplanation: {
          title: `Generation ${generation + 1} Assembled!`,
          body: `Survivor selection complete! Preserved ${eliteCount} elite individuals and replaced the remainder with new mutated offspring. Population stats: Max fitness = ${newGenStats.maxFitness}, Average fitness = ${newGenStats.avgFitness}. Ready for next cycle!`,
          mathHighlight: `\\bar{f}_{t+1} = ${newGenStats.avgFitness} \\quad (\\text{Gen } ${generation + 1})`,
          pseudocodeLine: 8
        },
        selectedChromosomeId: null
      }
    }

    case 'COMPLETED':
      return currentSnapshot
  }

  return currentSnapshot
}

// Advances the simulation by an entire generation in one go
export function stepOneGeneration(
  currentSnapshot: GASnapshot,
  params: GAParameters,
  problemType: ProblemType,
  context?: { cities?: City[]; targetText?: string; knapsackItems?: KnapsackItem[]; knapsackCapacity?: number }
): GASnapshot {
  let snap = { ...currentSnapshot }
  const targetGen = snap.generation + 1
  let safety = 0

  while (snap.generation < targetGen && safety < 10) {
    snap = stepOnePhase(snap, params, problemType, context)
    safety++
  }

  return snap
}
