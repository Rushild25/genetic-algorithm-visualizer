import type { City, KnapsackItem, QuizQuestion } from '../types'

export const TSP_PRESETS: Record<string, City[]> = {
  circular12: [
    { id: 0, name: 'Alpha', x: 250, y: 50 },
    { id: 1, name: 'Beta', x: 350, y: 77 },
    { id: 2, name: 'Gamma', x: 423, y: 150 },
    { id: 3, name: 'Delta', x: 450, y: 250 },
    { id: 4, name: 'Epsilon', x: 423, y: 350 },
    { id: 5, name: 'Zeta', x: 350, y: 423 },
    { id: 6, name: 'Eta', x: 250, y: 450 },
    { id: 7, name: 'Theta', x: 150, y: 423 },
    { id: 8, name: 'Iota', x: 77, y: 350 },
    { id: 9, name: 'Kappa', x: 50, y: 250 },
    { id: 10, name: 'Lambda', x: 77, y: 150 },
    { id: 11, name: 'Mu', x: 150, y: 77 },
  ],
  usCities10: [
    { id: 0, name: 'Seattle', x: 70, y: 60 },
    { id: 1, name: 'San Francisco', x: 50, y: 180 },
    { id: 2, name: 'Los Angeles', x: 80, y: 250 },
    { id: 3, name: 'Denver', x: 200, y: 170 },
    { id: 4, name: 'Austin', x: 240, y: 310 },
    { id: 5, name: 'Chicago', x: 310, y: 130 },
    { id: 6, name: 'Atlanta', x: 350, y: 260 },
    { id: 7, name: 'New York', x: 430, y: 110 },
    { id: 8, name: 'Boston', x: 450, y: 80 },
    { id: 9, name: 'Miami', x: 410, y: 370 },
  ],
  random14: [
    { id: 0, name: 'C0', x: 80, y: 110 },
    { id: 1, name: 'C1', x: 150, y: 290 },
    { id: 2, name: 'C2', x: 390, y: 90 },
    { id: 3, name: 'C3', x: 280, y: 220 },
    { id: 4, name: 'C4', x: 120, y: 390 },
    { id: 5, name: 'C5', x: 430, y: 330 },
    { id: 6, name: 'C6', x: 210, y: 80 },
    { id: 7, name: 'C7', x: 320, y: 380 },
    { id: 8, name: 'C8', x: 60, y: 230 },
    { id: 9, name: 'C9', x: 350, y: 170 },
    { id: 10, name: 'C10', x: 230, y: 320 },
    { id: 11, name: 'C11', x: 170, y: 180 },
    { id: 12, name: 'C12', x: 420, y: 240 },
    { id: 13, name: 'C13', x: 300, y: 80 },
  ]
}

export const KNAPSACK_ITEMS: KnapsackItem[] = [
  { id: 0, name: 'Laptop', weight: 4, value: 40, icon: '💻' },
  { id: 1, name: 'Drone', weight: 6, value: 50, icon: '🛸' },
  { id: 2, name: 'Gold Bar', weight: 8, value: 85, icon: '🪙' },
  { id: 3, name: 'Solar Kit', weight: 5, value: 35, icon: '🔋' },
  { id: 4, name: 'First Aid', weight: 2, value: 25, icon: '🩹' },
  { id: 5, name: 'Camera', weight: 3, value: 30, icon: '📷' },
  { id: 6, name: 'Sat Phone', weight: 2, value: 45, icon: '📡' },
  { id: 7, name: 'Jacket', weight: 3, value: 20, icon: '🧥' },
  { id: 8, name: 'Toolbox', weight: 7, value: 40, icon: '🧰' },
  { id: 9, name: 'Ration Pack', weight: 3, value: 22, icon: '🍱' },
]

export const KNAPSACK_MAX_CAPACITY = 20

export const GA_PSEUDOCODE = [
  { line: 1, text: 'procedure GeneticAlgorithm(Population, Parameters):' },
  { line: 2, text: '  P ← InitializeRandomPopulation(N)' },
  { line: 3, text: '  while not TerminationCriteriaMet() do' },
  { line: 4, text: '    fitness ← EvaluateFitness(P)' },
  { line: 5, text: '    MatingPool ← SelectParents(P, fitness)' },
  { line: 6, text: '    Offspring ← Crossover(MatingPool, Pc)' },
  { line: 7, text: '    MutatedOffspring ← Mutate(Offspring, Pm)' },
  { line: 8, text: '    P ← SurvivorSelection(P, MutatedOffspring, Elitism)' },
  { line: 9, text: '  end while' },
  { line: 10, text: '  return BestIndividual(P)' },
]

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'In Roulette Wheel Selection, what directly determines the probability of choosing an individual chromosome?',
    options: [
      'Its rank ordered position in the population',
      'Its relative fitness: f(x) / sum of all fitness values',
      'The number of 1s in its binary chromosome',
      'Its physical Euclidean distance from the global maximum'
    ],
    correctIndex: 1,
    explanation: 'Roulette Wheel (Fitness Proportionate) Selection assigns slice sizes proportional to each individual\'s relative fitness: p_i = f_i / sum(f_k). Higher fitness strings occupy larger wedges and thus get chosen more frequently.'
  },
  {
    id: 2,
    question: 'What is the primary role of Crossover in a Genetic Algorithm?',
    options: [
      'To prevent the algorithm from ever repeating an individual',
      'Exploitation: recombining high-performing sub-solutions (building blocks / schemata)',
      'To evaluate the objective function against real-world constraints',
      'To guarantee that every locus converges to 1'
    ],
    correctIndex: 1,
    explanation: 'Crossover is the recombination operator. By slicing and swapping genetic material between two fit parents, it combines promising building blocks (schemata) into potentially superior offspring.'
  },
  {
    id: 3,
    question: 'Why is Mutation necessary if Crossover already mixes parent genes?',
    options: [
      'To eliminate all weak chromosomes in one step',
      'Exploration: introducing new genetic diversity and preventing premature stagnation',
      'Because Crossover cannot produce valid chromosomes',
      'To calculate the expected reproduction count'
    ],
    correctIndex: 1,
    explanation: 'If a particular allele (e.g. bit 1 at locus 3) is lost across the entire population, crossover alone can never restore it! Mutation acts as an insurance policy by randomly flipping genes to discover lost or unexplored search regions.'
  },
  {
    id: 4,
    question: 'In Goldberg\'s (1989) textbook example of f(x) = x^2, what was the average fitness improvement after just ONE generation of crossover and selection?',
    options: [
      'Average fitness fell from 576 to 292.5 (-49%)',
      'Average fitness increased from 292.5 to 438.5 (+49.9%)',
      'Average fitness remained identical at 292.5 (0%)',
      'Average fitness doubled from 100 to 200 (+100%)'
    ],
    correctIndex: 1,
    explanation: 'As documented in Goldberg (1989) Table 1.1 & 1.2, the initial population had average fitness 292.5. After one generation of roulette selection, single-point crossover, and mutation, average fitness jumped to 438.5—a massive ~50% gain in just one cycle!'
  },
  {
    id: 5,
    question: 'What is "Elitism" in Genetic Algorithms?',
    options: [
      'Selecting only individuals that have an even number of bits',
      'Preserving the top-k best individuals unaltered into the next generation',
      'Multiplying the fitness score by 10 for every generation',
      'Deleting the bottom half of chromosomes before crossover'
    ],
    correctIndex: 1,
    explanation: 'Elitism guarantees monotonic improvement of the best solution found so far by copying the highest-fitness individual(s) directly into the next generation without risking destruction by crossover or mutation.'
  }
]
