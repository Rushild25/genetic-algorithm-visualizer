import React, { useState, useEffect, useRef, useCallback } from 'react'
import confetti from 'canvas-confetti'
import type {
  ProblemType,
  GAParameters,
  GASnapshot,
  Chromosome,
  City
} from './types'
import {
  stepOnePhase,
  stepOneGeneration,
  computeGenerationStats
} from './algorithms/gaEngine'
import { createGoldbergInitialPopulation } from './algorithms/problems/goldbergProblem'
import { createTspInitialPopulation } from './algorithms/problems/tspProblem'
import { createWeaselInitialPopulation } from './algorithms/problems/weaselProblem'
import { createKnapsackInitialPopulation } from './algorithms/problems/knapsackProblem'
import { createLandscapeInitialPopulation } from './algorithms/problems/landscapeProblem'
import {
  TSP_PRESETS,
  KNAPSACK_ITEMS,
  KNAPSACK_MAX_CAPACITY
} from './constants/problemPresets'
import { sounds } from './audio/soundEffects'

// Components
import { Navbar } from './components/Navbar'
import { PlaybackControls } from './components/PlaybackControls'
import { ExplanationPanel } from './components/ExplanationPanel'
import { PseudocodePanel } from './components/PseudocodePanel'
import { PopulationTable } from './components/PopulationTable'
import { ChromosomeMicroscope } from './components/ChromosomeMicroscope'
import { RouletteWheelCanvas } from './components/RouletteWheelCanvas'
import { CrossoverVisualizer } from './components/CrossoverVisualizer'
import { ConvergenceChart } from './components/ConvergenceChart'
import { AlleleDiversityHeatmap } from './components/AlleleDiversityHeatmap'
import { TextbookVerificationView } from './components/TextbookVerificationView'
import { TSPViewer } from './components/problemViews/TSPViewer'
import { KnapsackViewer } from './components/problemViews/KnapsackViewer'
import { LandscapeViewer } from './components/problemViews/LandscapeViewer'
import { WeaselViewer } from './components/problemViews/WeaselViewer'
import { QuizModal } from './components/QuizModal'
import { TutorialModal } from './components/TutorialModal'

export const App: React.FC = () => {
  // Problem State
  const [currentProblem, setCurrentProblem] = useState<ProblemType>('goldberg')
  const [cities, setCities] = useState<City[]>(TSP_PRESETS.circular12)
  const [targetText, setTargetText] = useState<string>('METHINKS IT IS LIKE A WEASEL')
  const [showTextbookView, setShowTextbookView] = useState<boolean>(false)

  // Modals & Microscope
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false)
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false)
  const [selectedChromosome, setSelectedChromosome] = useState<Chromosome | null>(null)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false)

  // Simulation Parameters
  const [params, setParams] = useState<GAParameters>({
    populationSize: 4, // 4 for Goldberg textbook default
    crossoverRate: 0.8,
    mutationRate: 0.01,
    selectionMethod: 'roulette',
    crossoverMethod: 'single_point',
    mutationMethod: 'bit_flip',
    elitismCount: 1,
    tournamentSize: 2,
    maxGenerations: 100,
    isDeterministicGoldberg: true
  })

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [speed, setSpeed] = useState<number>(1)
  const [history, setHistory] = useState<GASnapshot[]>([])

  // Problem Context Helper
  const getProblemContext = useCallback(() => {
    return {
      cities,
      targetText,
      knapsackItems: KNAPSACK_ITEMS,
      knapsackCapacity: KNAPSACK_MAX_CAPACITY
    }
  }, [cities, targetText])

  // Factory for initial snapshot
  const createInitialSnapshot = useCallback(
    (problem: ProblemType, currentParams: GAParameters): GASnapshot => {
      let initialPop: Chromosome[] = []

      switch (problem) {
        case 'goldberg':
          initialPop = createGoldbergInitialPopulation(currentParams.isDeterministicGoldberg)
          break
        case 'tsp':
          initialPop = createTspInitialPopulation(currentParams.populationSize, cities)
          break
        case 'weasel':
          initialPop = createWeaselInitialPopulation(currentParams.populationSize, targetText)
          break
        case 'knapsack':
          initialPop = createKnapsackInitialPopulation(
            currentParams.populationSize,
            KNAPSACK_ITEMS,
            KNAPSACK_MAX_CAPACITY
          )
          break
        case 'landscape':
          initialPop = createLandscapeInitialPopulation(currentParams.populationSize)
          break
      }

      const initialStats = computeGenerationStats(0, initialPop)

      return {
        generation: 0,
        phase: 'INITIALIZED',
        subStepIndex: 0,
        population: initialPop,
        matingPool: [],
        offspring: [],
        statsHistory: [initialStats],
        activeExplanation: {
          title: `Initial Generation Populated (${initialPop.length} Individuals)`,
          body: `The population has been initialized. In Genetic Algorithms, search begins with a diverse set of candidate solutions distributed across the problem space. Click 'Step Phase' to begin fitness evaluation.`,
          mathHighlight: `P_0 = \\{ \\mathbf{x}_1, \\mathbf{x}_2, \\dots, \\mathbf{x}_N \\}, \\quad N = ${initialPop.length}`,
          pseudocodeLine: 2
        },
        selectedChromosomeId: null
      }
    },
    [cities, targetText]
  )

  const [snapshot, setSnapshot] = useState<GASnapshot>(() =>
    createInitialSnapshot('goldberg', params)
  )

  // Track global best for celebration sound & confetti
  const prevBestRef = useRef<number>(0)

  // Audio & Confetti trigger upon phase changes
  useEffect(() => {
    const currentBest = snapshot.statsHistory[snapshot.statsHistory.length - 1]?.maxFitness || 0
    if (currentBest > prevBestRef.current && prevBestRef.current > 0) {
      sounds.playNewBest()
      // If reached maximum possible
      if (
        (currentProblem === 'goldberg' && currentBest >= 961) ||
        (currentProblem === 'weasel' && currentBest >= Math.pow(targetText.length + 1, 2))
      ) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } })
      }
    }
    prevBestRef.current = currentBest

    // Phase sound cues
    if (snapshot.phase === 'SELECT') sounds.playSpin()
    else if (snapshot.phase === 'CROSSOVER') sounds.playCrossover()
    else if (snapshot.phase === 'MUTATE') sounds.playMutation()
    else sounds.playStep()
  }, [snapshot.phase, snapshot.generation, currentProblem, targetText.length])

  // Reset handler
  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setHistory([])
    prevBestRef.current = 0
    const fresh = createInitialSnapshot(currentProblem, params)
    setSnapshot(fresh)
  }, [createInitialSnapshot, currentProblem, params])

  // Switch Problem Handler
  const handleSelectProblem = (newProblem: ProblemType) => {
    setCurrentProblem(newProblem)
    setShowTextbookView(false)
    // Adjust default population size for problems
    const updatedParams = {
      ...params,
      populationSize: newProblem === 'goldberg' ? 4 : 20,
      isDeterministicGoldberg: newProblem === 'goldberg'
    }
    setParams(updatedParams)
    setIsPlaying(false)
    setHistory([])
    prevBestRef.current = 0
    setSnapshot(createInitialSnapshot(newProblem, updatedParams))
  }

  // Step One Phase
  const handleStepPhase = useCallback(() => {
    setHistory((prev) => [...prev.slice(-80), snapshot])
    const nextSnap = stepOnePhase(snapshot, params, currentProblem, getProblemContext())
    setSnapshot(nextSnap)
  }, [snapshot, params, currentProblem, getProblemContext])

  // Step One Generation
  const handleStepGeneration = useCallback(() => {
    setHistory((prev) => [...prev.slice(-80), snapshot])
    const nextSnap = stepOneGeneration(snapshot, params, currentProblem, getProblemContext())
    setSnapshot(nextSnap)
  }, [snapshot, params, currentProblem, getProblemContext])

  // Step Back (Time-travel)
  const handleStepBack = () => {
    if (history.length === 0) return
    const prevSnap = history[history.length - 1]
    setHistory((prev) => prev.slice(0, prev.length - 1))
    setSnapshot(prevSnap)
  }

  // Auto-play timer loop
  useEffect(() => {
    if (!isPlaying) return
    const intervalMs = Math.max(120, Math.round(900 / speed))

    const timer = setInterval(() => {
      setSnapshot((cur) => {
        setHistory((prev) => [...prev.slice(-80), cur])
        return stepOnePhase(cur, params, currentProblem, getProblemContext())
      })
    }, intervalMs)

    return () => clearInterval(timer)
  }, [isPlaying, speed, params, currentProblem, getProblemContext])

  // Load Goldberg textbook preset
  const handleLoadGoldbergTextbook = () => {
    setCurrentProblem('goldberg')
    setShowTextbookView(false)
    const goldbergParams: GAParameters = {
      ...params,
      populationSize: 4,
      isDeterministicGoldberg: true,
      crossoverRate: 1.0,
      mutationRate: 0.001,
      selectionMethod: 'roulette',
      elitismCount: 0
    }
    setParams(goldbergParams)
    setIsPlaying(false)
    setHistory([])
    prevBestRef.current = 0
    setSnapshot(createInitialSnapshot('goldberg', goldbergParams))
  }

  // Update Parameters
  const handleChangeParams = (newParams: Partial<GAParameters>) => {
    setParams((prev) => ({ ...prev, ...newParams }))
  }

  // Toggle Sound
  const handleToggleSound = () => {
    const nextVal = !soundEnabled
    setSoundEnabled(nextVal)
    sounds.setEnabled(nextVal)
  }

  // Add City in TSP
  const handleAddCity = (city: City) => {
    const updated = [...cities, city]
    setCities(updated)
    if (currentProblem === 'tsp') {
      handleReset()
    }
  }

  // TSP Presets
  const handleSelectTspPreset = (presetKey: string) => {
    if (TSP_PRESETS[presetKey]) {
      setCities(TSP_PRESETS[presetKey])
      if (currentProblem === 'tsp') {
        handleReset()
      }
    }
  }

  const latestStats = snapshot.statsHistory[snapshot.statsHistory.length - 1]
  const bestIndividual = latestStats?.bestIndividual || snapshot.population[0] || null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentProblem={currentProblem}
        onSelectProblem={handleSelectProblem}
        onReset={handleReset}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenQuiz={() => setShowQuizModal(true)}
        onOpenTutorial={() => setShowTutorialModal(true)}
        showTextbookView={showTextbookView}
        onToggleTextbookView={() => setShowTextbookView(!showTextbookView)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* Playback & Parameter Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onStepPhase={handleStepPhase}
          onStepGeneration={handleStepGeneration}
          onStepBack={handleStepBack}
          canStepBack={history.length > 0}
          onReset={handleReset}
          generation={snapshot.generation}
          phase={snapshot.phase}
          speed={speed}
          onChangeSpeed={setSpeed}
          params={params}
          onChangeParams={handleChangeParams}
          problemType={currentProblem}
        />

        {showTextbookView ? (
          /* Textbook Verification Audit View */
          <TextbookVerificationView onLoadTextbookToSimulator={handleLoadGoldbergTextbook} />
        ) : (
          /* Interactive Simulation Studio Grid */
          <div className="space-y-4">
            {/* Row 1: Problem Visualizer + VisuAlgo Pseudocode */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {currentProblem === 'goldberg' && (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                          Goldberg 1989 Textbook Benchmark: f(x) = x² on [0, 31]
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          5-bit chromosome representation with exact analytical verification
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                        Max Possible: f(31) = 961
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto">
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Current Best Solution
                        </span>
                        <div className="text-xs font-mono text-indigo-300 font-bold mb-1">
                          String: {bestIndividual?.genes.join('')}
                        </div>
                        <div className="text-lg font-black font-mono text-amber-400">
                          {bestIndividual?.phenotypeDisplay}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Goldberg Table 1.1 Baseline
                        </span>
                        <div className="text-xs font-mono text-slate-300 mb-1">
                          Initial Pop: <code className="text-cyan-300">01101, 11000, 01000, 10011</code>
                        </div>
                        <div className="text-xs text-emerald-400 font-mono font-bold">
                          Gen 0 Avg = 292.5 → Gen 1 Avg = 438.5 (+49.9%)
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 mt-3 flex items-center justify-between">
                      <span>Click 'Textbook Audit' in the header to inspect the complete chapter proof!</span>
                      <button
                        onClick={() => setShowTextbookView(true)}
                        className="text-xs text-amber-400 hover:underline font-semibold"
                      >
                        Open Table 1.1 & 1.2 →
                      </button>
                    </div>
                  </div>
                )}

                {currentProblem === 'tsp' && (
                  <TSPViewer
                    cities={cities}
                    bestIndividual={bestIndividual}
                    onAddCity={handleAddCity}
                    onSelectPreset={handleSelectTspPreset}
                  />
                )}

                {currentProblem === 'weasel' && (
                  <WeaselViewer
                    targetText={targetText}
                    onChangeTargetText={setTargetText}
                    bestIndividual={bestIndividual}
                  />
                )}

                {currentProblem === 'knapsack' && (
                  <KnapsackViewer
                    items={KNAPSACK_ITEMS}
                    maxCapacity={KNAPSACK_MAX_CAPACITY}
                    bestIndividual={bestIndividual}
                  />
                )}

                {currentProblem === 'landscape' && (
                  <LandscapeViewer
                    population={snapshot.population}
                    bestIndividual={bestIndividual}
                  />
                )}
              </div>

              {/* VisuAlgo Pseudocode Panel */}
              <div className="lg:col-span-1">
                <PseudocodePanel activeLine={snapshot.activeExplanation.pseudocodeLine} />
              </div>
            </div>

            {/* Row 2: Explanation Narrative + Crossover Recombination + Roulette Wheel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <ExplanationPanel
                  phase={snapshot.phase}
                  title={snapshot.activeExplanation.title}
                  body={snapshot.activeExplanation.body}
                  mathHighlight={snapshot.activeExplanation.mathHighlight}
                />
                <CrossoverVisualizer
                  offspring={snapshot.offspring}
                  matingPool={snapshot.matingPool}
                  activeLocus={snapshot.activeCrossoverLocus}
                  problemType={currentProblem}
                />
              </div>

              {/* Roulette Wheel Canvas */}
              <div className="lg:col-span-1">
                <RouletteWheelCanvas
                  population={snapshot.population}
                  selectedChromosomeId={snapshot.selectedChromosomeId}
                />
              </div>
            </div>

            {/* Row 3: Population Table + Fitness Chart & Allele Diversity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <PopulationTable
                  population={snapshot.population}
                  onSelectChromosome={(chr) => setSelectedChromosome(chr)}
                  selectedChromosomeId={snapshot.selectedChromosomeId}
                  problemType={currentProblem}
                />
              </div>

              <div className="lg:col-span-1 space-y-4">
                <ConvergenceChart statsHistory={snapshot.statsHistory} />
                <AlleleDiversityHeatmap statsHistory={snapshot.statsHistory} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DNA Microscope Modal */}
      <ChromosomeMicroscope
        chromosome={selectedChromosome}
        onClose={() => setSelectedChromosome(null)}
        problemType={currentProblem}
        context={getProblemContext()}
        onApplyModifiedGenes={(newGenes) => {
          if (!selectedChromosome) return
          const updatedPop = snapshot.population.map((c) =>
            c.id === selectedChromosome.id ? { ...c, genes: newGenes } : c
          )
          setSnapshot({ ...snapshot, population: updatedPop })
        }}
      />

      {/* Quiz Modal */}
      <QuizModal isOpen={showQuizModal} onClose={() => setShowQuizModal(false)} />

      {/* Tutorial Modal */}
      <TutorialModal isOpen={showTutorialModal} onClose={() => setShowTutorialModal(false)} />

      {/* Footer */}
      <footer className="mt-8 border-t border-slate-800/80 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">EvoAlgo</span>
            <span>•</span>
            <span>Interactive Genetic Algorithm Pedagogical Studio</span>
          </div>
          <div className="text-slate-400">
            Inspired by{' '}
            <a
              href="https://visualgo.net/en/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:underline font-semibold"
            >
              VisuAlgo.net
            </a>{' '}
            & Verified against David E. Goldberg (1989)
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
