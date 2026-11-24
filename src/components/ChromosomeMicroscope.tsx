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
      const chars = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      const cur = String(updated[index])
      const curIdx = chars.indexOf(cur)
      updated[index] = chars[(curIdx + 1) % chars.length]
    } else if (problemType === 'tsp') {
      const nextIdx = (index + 1) % updated.length
      ;[updated[index], updated[nextIdx]] = [updated[nextIdx], updated[index]]
    } else {
      updated[index] = Number(updated[index]) === 1 ? 0 : 1
    }

    setSandboxGenes(updated)
    setSandboxEval(evaluateChromosome(updated, problemType, context))
  }

  const resetSandbox = () => {
    setSandboxGenes([...chromosome.genes])
    setSandboxEval(evaluateChromosome(chromosome.genes, problemType, context))
  }

  let diffCount = 0
  for (let i = 0; i < chromosome.genes.length; i++) {
    if (chromosome.genes[i] !== sandboxGenes[i]) diffCount++
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020503] border border-emerald-500/60 rounded-3xl max-w-2xl w-full p-6 shadow-[0_0_60px_rgba(0,255,102,0.25)] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-500/25">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#00ff66] text-black shadow-[0_0_20px_rgba(0,255,102,0.7)] font-black">
              <Microscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                DNA Microscope <span className="text-[#00ff66]">&</span> Mutation Sandbox
              </h3>
              <p className="text-xs text-emerald-400/80 font-mono">
                Individual {chromosome.id} — Click any locus to test real-time mutation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-[#00ff66] hover:bg-emerald-950/40 border border-transparent hover:border-emerald-500/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 font-mono">
          {/* Interactive Gene Ribbon */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Binary className="w-4 h-4 text-[#00ff66]" />
                Gene Sequence (Click locus to mutate):
              </span>
              {diffCount > 0 && (
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-[#00ff66] border border-emerald-400 shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                  Hamming Distance: {diffCount} bits flipped
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-black border border-emerald-500/40 shadow-[inset_0_0_20px_rgba(0,255,102,0.08)]">
              {sandboxGenes.map((gene, idx) => {
                const wasMutatedInOriginal = chromosome.mutatedIndices?.includes(idx)
                const isFlippedNow = gene !== chromosome.genes[idx]

                return (
                  <button
                    key={idx}
                    onClick={() => toggleBit(idx)}
                    className={`flex flex-col items-center justify-center min-w-[36px] h-13 rounded-xl font-mono font-bold text-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
                      isFlippedNow
                        ? 'bg-[#00ff66] text-black shadow-[0_0_25px_rgba(0,255,102,0.9)] ring-2 ring-white font-black'
                        : wasMutatedInOriginal
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : gene === 1 || gene === '1'
                        ? 'bg-emerald-950/90 text-[#00ff66] border border-emerald-500/60 shadow-[0_0_10px_rgba(0,255,102,0.3)] hover:bg-[#00ff66] hover:text-black'
                        : 'bg-black text-slate-500 border border-emerald-500/25 hover:border-emerald-400 hover:text-white'
                    }`}
                    title={`Locus ${idx}: Click to mutate`}
                  >
                    <span className="text-[9px] text-slate-500 font-sans font-normal leading-none mb-0.5">
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
            <div className="p-3.5 rounded-2xl bg-black border border-emerald-500/30">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500/70 block mb-1">
                Original Population State
              </span>
              <div className="text-xs font-mono text-slate-300 mb-1">
                Phenotype: <span className="font-bold text-white">{chromosome.phenotypeDisplay}</span>
              </div>
              <div className="text-sm font-black text-slate-200 font-mono">
                Fitness: {chromosome.fitness}
              </div>
            </div>

            {/* Sandbox Mutated */}
            <div
              className={`p-3.5 rounded-2xl border transition-all ${
                diffCount > 0
                  ? sandboxEval.fitness >= chromosome.fitness
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-[0_0_20px_rgba(0,255,102,0.25)]'
                    : 'bg-rose-950/30 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-black border border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500/70">
                  What-If Sandbox State
                </span>
                {diffCount > 0 && (
                  <span
                    className={`text-[11px] font-black font-mono ${
                      sandboxEval.fitness >= chromosome.fitness ? 'text-[#00ff66]' : 'text-rose-400'
                    }`}
                  >
                    {sandboxEval.fitness >= chromosome.fitness ? '+' : ''}
                    {Math.round((sandboxEval.fitness - chromosome.fitness) * 100) / 100} fitness
                  </span>
                )}
              </div>
              <div className="text-xs font-mono text-slate-300 mb-1">
                Phenotype: <span className="font-bold text-white">{sandboxEval.phenotypeDisplay}</span>
              </div>
              <div className="text-sm font-black font-mono text-white">
                Fitness:{' '}
                <span
                  className={
                    sandboxEval.fitness >= chromosome.fitness
                      ? 'text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]'
                      : 'text-rose-400'
                  }
                >
                  {sandboxEval.fitness}
                </span>
              </div>
            </div>
          </div>

          {/* Educational Insight on Epistasis & Hamming Cliffs */}
          <div className="p-3.5 rounded-2xl bg-black border border-emerald-500/30 text-xs text-slate-300 leading-relaxed font-sans shadow-[0_0_15px_rgba(0,255,102,0.06)]">
            <span className="font-bold text-[#00ff66] block mb-1 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
              Pedagogical Insight: Hamming Cliffs & Epistasis
            </span>
            Notice how flipping a single most-significant bit (MSB at index 0) causes a massive fitness leap or collapse, whereas flipping a least-significant bit (LSB) fine-tunes the value. This non-linear mapping is known as epistatic sensitivity!
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-emerald-500/25 flex items-center justify-between font-mono">
          <button
            onClick={resetSandbox}
            disabled={diffCount === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-black text-slate-300 border border-emerald-500/30 hover:border-emerald-400 hover:text-[#00ff66] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#00ff66] hover:bg-[#33ff85] text-black shadow-[0_0_20px_rgba(0,255,102,0.8)] transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Inject into Population</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-black text-slate-300 border border-emerald-500/30 hover:border-emerald-400 hover:text-white transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
