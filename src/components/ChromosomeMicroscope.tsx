import React, { useState, useEffect } from 'react'
import { Microscope, X, RefreshCw, Zap, Binary, Check } from 'lucide-react'
import type { Chromosome, ProblemType, City, KnapsackItem } from '../types'
import { evaluateChromosome } from '../algorithms/gaEngine'

interface ChromosomeMicroscopeProps {
  chromosome: Chromosome | null
  onClose: () => void
  problemType: ProblemType
  context?: { cities?: City[]; targetText?: string; knapsackItems?: KnapsackItem[]; knapsackCapacity?: number }
  onApplyModifiedGenes?: (newGenes: (number | string)[]) => void
}

export const ChromosomeMicroscope: React.FC<ChromosomeMicroscopeProps> = ({
  chromosome,
  onClose,
  problemType,
  context,
  onApplyModifiedGenes
}) => {
  if (!chromosome) return null

  const [sandboxGenes, setSandboxGenes] = useState<(number | string)[]>([...chromosome.genes])
  const [sandboxEval, setSandboxEval] = useState(() =>
    evaluateChromosome(chromosome.genes, problemType, context)
  )

  useEffect(() => {
    setSandboxGenes([...chromosome.genes])
    setSandboxEval(evaluateChromosome(chromosome.genes, problemType, context))
  }, [chromosome, problemType, context])

  const toggleBit = (index: number) => {
    const updated = [...sandboxGenes]
    if (problemType === 'weasel') {
      // Cycle through random characters
      const chars = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const cur = String(updated[index])
      const curIdx = chars.indexOf(cur)
      updated[index] = chars[(curIdx + 1) % chars.length]
    } else if (problemType === 'tsp') {
      // Swap with next neighbor
      const nextIdx = (index + 1) % updated.length
      ;[updated[index], updated[nextIdx]] = [updated[nextIdx], updated[index]]
    } else {
      // Binary flip
      updated[index] = Number(updated[index]) === 1 ? 0 : 1
    }

    setSandboxGenes(updated)
    setSandboxEval(evaluateChromosome(updated, problemType, context))
  }

  const resetSandbox = () => {
    setSandboxGenes([...chromosome.genes])
    setSandboxEval(evaluateChromosome(chromosome.genes, problemType, context))
  }

  // Calculate Hamming distance between original and sandbox
  let diffCount = 0
  for (let i = 0; i < chromosome.genes.length; i++) {
    if (chromosome.genes[i] !== sandboxGenes[i]) diffCount++
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Interactive DNA Microscope & Mutation Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Individual {chromosome.id} — Click any locus to test real-time mutation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* Interactive Gene Ribbon */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-cyan-400" />
                Gene Sequence (Click locus to mutate):
              </span>
              {diffCount > 0 && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                  Hamming Distance: {diffCount} bits flipped
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800">
              {sandboxGenes.map((gene, idx) => {
                const wasMutatedInOriginal = chromosome.mutatedIndices?.includes(idx)
                const isFlippedNow = gene !== chromosome.genes[idx]

                return (
                  <button
                    key={idx}
                    onClick={() => toggleBit(idx)}
                    className={`flex flex-col items-center justify-center min-w-[34px] h-12 rounded-lg font-mono font-bold text-sm transition-all transform hover:scale-105 active:scale-95 ${
                      isFlippedNow
                        ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/30 ring-2 ring-fuchsia-300'
                        : wasMutatedInOriginal
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                        : gene === 1 || gene === '1'
                        ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/60'
                        : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                    }`}
                    title={`Locus ${idx}: Click to mutate`}
                  >
                    <span className="text-[9px] text-slate-400 font-sans font-normal leading-none mb-0.5">
                      {idx}
                    </span>
                    <span>{gene}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Real-time What-If Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Original */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Original Population State
              </span>
              <div className="text-xs font-mono text-slate-300 mb-1">
                Phenotype: <span className="font-semibold text-white">{chromosome.phenotypeDisplay}</span>
              </div>
              <div className="text-sm font-bold text-indigo-400 font-mono">
                Fitness: {chromosome.fitness}
              </div>
            </div>

            {/* Sandbox Mutated */}
            <div className={`p-3 rounded-xl border transition-all ${
              diffCount > 0
                ? sandboxEval.fitness >= chromosome.fitness
                  ? 'bg-emerald-500/10 border-emerald-500/40'
                  : 'bg-rose-500/10 border-rose-500/40'
                : 'bg-slate-950/60 border-slate-800'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  What-If Sandbox State
                </span>
                {diffCount > 0 && (
                  <span className={`text-[11px] font-bold font-mono ${
                    sandboxEval.fitness >= chromosome.fitness ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {sandboxEval.fitness >= chromosome.fitness ? '+' : ''}
                    {Math.round((sandboxEval.fitness - chromosome.fitness) * 100) / 100} fitness
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-slate-300 mb-1">
                Phenotype: <span className="font-semibold text-white">{sandboxEval.phenotypeDisplay}</span>
              </div>
              <div className="text-sm font-bold font-mono text-white">
                Fitness: <span className={sandboxEval.fitness >= chromosome.fitness ? 'text-emerald-400' : 'text-rose-400'}>
                  {sandboxEval.fitness}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Insight on Epistasis & Hamming Cliffs */}
          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200/90 leading-relaxed">
            <span className="font-bold text-indigo-300 block mb-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Pedagogical Insight: Hamming Cliffs & Epistasis
            </span>
            Notice how flipping a single most-significant bit (MSB at index 0) causes a massive fitness leap or collapse, whereas flipping a least-significant bit (LSB) fine-tunes the value. This non-linear mapping is known as epistatic sensitivity!
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={resetSandbox}
            disabled={diffCount === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-750 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Original</span>
          </button>

          <div className="flex items-center gap-2">
            {onApplyModifiedGenes && diffCount > 0 && (
              <button
                onClick={() => {
                  onApplyModifiedGenes(sandboxGenes)
                  onClose()
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Inject into Population</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
