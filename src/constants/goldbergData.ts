// Exact textbook data from David E. Goldberg (1989)
// "Genetic Algorithms in Search, Optimization, and Machine Learning", Addison-Wesley
// Chapter 1: A Gentle Introduction to Genetic Algorithms, Tables 1.1 and 1.2

export interface GoldbergString {
  id: number
  string: string
  x: number
  fitness: number
  probSelection: number
  expectedCount: number
  actualCount: number
}

export interface GoldbergCrossoverStep {
  matePair: [number, number]
  parentStrings: [string, string]
  crossoverSite: number // 1-indexed locus
  offspringAfterCrossover: [string, string]
  mutationApplied: boolean
  mutatedBitIndex?: number
  finalStrings: [string, string]
  finalX: [number, number]
  finalFitness: [number, number]
}

export const GOLDBERG_TABLE_1_1: GoldbergString[] = [
  { id: 1, string: '01101', x: 13, fitness: 169, probSelection: 0.144, expectedCount: 0.58, actualCount: 1 },
  { id: 2, string: '11000', x: 24, fitness: 576, probSelection: 0.492, expectedCount: 1.97, actualCount: 2 },
  { id: 3, string: '01000', x: 8,  fitness: 64,  probSelection: 0.055, expectedCount: 0.22, actualCount: 0 },
  { id: 4, string: '10011', x: 19, fitness: 361, probSelection: 0.309, expectedCount: 1.23, actualCount: 1 },
]

export const GOLDBERG_GEN0_TOTAL_FITNESS = 1170
export const GOLDBERG_GEN0_AVG_FITNESS = 292.5
export const GOLDBERG_GEN0_MAX_FITNESS = 576

export const GOLDBERG_TABLE_1_2: GoldbergCrossoverStep[] = [
  {
    matePair: [1, 2],
    parentStrings: ['01101', '11000'],
    crossoverSite: 4, // After 4th bit: '0110' + '0' and '1100' + '1'
    offspringAfterCrossover: ['01100', '11001'],
    mutationApplied: false,
    finalStrings: ['01100', '11001'],
    finalX: [12, 25],
    finalFitness: [144, 625]
  },
  {
    matePair: [2, 4],
    parentStrings: ['11000', '10011'],
    crossoverSite: 2, // After 2nd bit: '11' + '011' and '10' + '000'
    offspringAfterCrossover: ['11011', '10000'],
    mutationApplied: false,
    finalStrings: ['11011', '10000'],
    finalX: [27, 16],
    finalFitness: [729, 256]
  }
]

export const GOLDBERG_GEN1_TOTAL_FITNESS = 1754
export const GOLDBERG_GEN1_AVG_FITNESS = 438.5
export const GOLDBERG_GEN1_MAX_FITNESS = 729
export const GOLDBERG_IMPROVEMENT_PERCENT = 49.91
