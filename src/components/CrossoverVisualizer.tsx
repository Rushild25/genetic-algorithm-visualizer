import React from 'react'
import { Scissors, ArrowDown } from 'lucide-react'
import type { Chromosome, ProblemType } from '../types'

interface CrossoverVisualizerProps {
  offspring: Chromosome[]
  matingPool: Chromosome[]
  activeLocus?: number
  problemType: ProblemType
}

export const CrossoverVisualizer: React.FC<CrossoverVisualizerProps> = ({
  offspring,
  matingPool
}) => {
  if (offspring.length === 0 && matingPool.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center text-center text-slate-500 text-xs min-h-[160px]">
        <Scissors className="w-6 h-6 mb-2 text-slate-600" />
        <span>Crossover visualization activates during the Recombination phase.</span>
      </div>
    )
  }

  // Display the first pair of parents and offspring
  const p1 = matingPool[0] || offspring[0]
  const p2 = matingPool[1] || offspring[1]
  const c1 = offspring[0]
  const c2 = offspring[1]

  const crossoverPt = c1?.crossoverPoint || 3

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            DNA Recombination Slicer
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Locus Cut: k = {crossoverPt}
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Parents */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-sans font-semibold text-slate-400 block uppercase">
            Parent Chromosomes:
          </span>
          {p1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-blue-400 font-sans w-12 shrink-0">Parent 1:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                {p1.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                        : 'bg-blue-900/20 text-blue-400'
                    }`}
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </div>
          )}

          {p2 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-purple-400 font-sans w-12 shrink-0">Parent 2:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                {p2.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-purple-900/20 text-purple-400'
                        : 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    }`}
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider arrow */}
        <div className="flex items-center justify-center my-1 text-slate-500">
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </div>

        {/* Offspring */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-sans font-semibold text-slate-400 block uppercase">
            Recombined Offspring:
          </span>
          {c1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-sans w-12 shrink-0">Child 1:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                {c1.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-blue-600/40 text-blue-200 border border-blue-500/50'
                        : 'bg-purple-600/40 text-purple-200 border border-purple-500/50'
                    }`}
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </div>
          )}

          {c2 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-sans w-12 shrink-0">Child 2:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                {c2.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-purple-600/40 text-purple-200 border border-purple-500/50'
                        : 'bg-blue-600/40 text-blue-200 border border-blue-500/50'
                    }`}
                  >
                    {gene}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
