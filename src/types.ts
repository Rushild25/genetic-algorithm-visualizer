// Core Types and Data Models for EvoAlgo Genetic Algorithm Visualizer

export type ProblemType = 'goldberg' | 'tsp' | 'weasel' | 'knapsack' | 'landscape'

export type SelectionMethod = 'roulette' | 'tournament' | 'rank'
export type CrossoverMethod = 'single_point' | 'two_point' | 'uniform' | 'ox1'
export type MutationMethod = 'bit_flip' | 'swap' | 'inversion'

export type GAPhase = 
  | 'INITIALIZED'
  | 'EVALUATE'
  | 'SELECT'
  | 'CROSSOVER'
  | 'MUTATE'
  | 'REPLACE'
  | 'COMPLETED'

export interface Chromosome {
  id: string
  genes: (number | string)[]
  fitness: number
  rawScore?: number
  selectionProbability: number
  cumulativeProbability: number
  expectedCount: number
  actualSelectedCount: number
  isElite?: boolean
  selectedAsParent?: boolean
  parentIds?: [string, string]
  crossoverPoint?: number
  mutatedIndices?: number[]
  phenotypeDisplay: string
  metadata?: Record<string, any>
}

export interface GenerationStats {
  generation: number
  maxFitness: number
  avgFitness: number
  minFitness: number
  totalFitness: number
  bestIndividual: Chromosome
  diversityIndex: number
  alleleFrequencies: number[] // Frequency of '1' or target at each locus
}

export interface GAParameters {
  populationSize: number
  crossoverRate: number
  mutationRate: number
  selectionMethod: SelectionMethod
  crossoverMethod: CrossoverMethod
  mutationMethod: MutationMethod
  elitismCount: number
  tournamentSize: number
  maxGenerations: number
  isDeterministicGoldberg: boolean
}

export interface City {
  id: number
  name: string
  x: number
  y: number
}

export interface KnapsackItem {
  id: number
  name: string
  weight: number
  value: number
  icon: string
}

export interface GASnapshot {
  generation: number
  phase: GAPhase
  subStepIndex: number
  population: Chromosome[]
  matingPool: Chromosome[]
  offspring: Chromosome[]
  statsHistory: GenerationStats[]
  activeExplanation: {
    title: string
    body: string
    mathHighlight?: string
    pseudocodeLine: number
  }
  selectedChromosomeId: string | null
  lastWheelAngle?: number
  activePair?: [Chromosome, Chromosome]
  activeCrossoverLocus?: number
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}
