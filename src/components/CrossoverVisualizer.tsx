import React from 'react'
import { Scissors, ArrowDown } from 'lucide-react'
import type { Chromosome } from '../types'

interface CrossoverVisualizerProps {
  offspring: Chromosome[]
  matingPool: Chromosome[]
  activeLocus?: number
}

export const CrossoverVisualizer: React.FC<CrossoverVisualizerProps> = ({
  offspring,
  matingPool
}) => {
  if (offspring.length === 0 && matingPool.length === 0) {
    return (
      <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center justify-center text-center text-slate-500 text-xs min-h-[160px] font-mono shadow-[0_0_20px_rgba(0,255,102,0.05)]">
        <Scissors className="w-6 h-6 mb-2 text-emerald-600 animate-pulse" />
        <span className="text-emerald-500/70">Crossover visualization activates during the Recombination phase.</span>
      </div>
    )
  }

  const p1 = matingPool[0] || offspring[0]
  const p2 = matingPool[1] || offspring[1]
  const c1 = offspring[0]
  const c2 = offspring[1]

  const crossoverPt = c1?.crossoverPoint || 3

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-3 shadow-[0_0_25px_rgba(0,255,102,0.08)] font-mono">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            DNA Recombination Slicer
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-[#00ff66] border border-emerald-400 shadow-[0_0_10px_rgba(0,255,102,0.3)]">
          Locus Cut: k = {crossoverPt}
        </span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Parents */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-emerald-500/80 block uppercase">
            Parent Chromosomes:
          </span>
          {p1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#00ff66] w-14 shrink-0 font-bold">Parent 1:</span>
              <div className="flex items-center gap-1 bg-black p-1.5 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(0,255,102,0.08)]">
                {p1.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-emerald-950 text-[#00ff66] border border-emerald-400 shadow-[0_0_8px_rgba(0,255,102,0.3)]'
                        : 'bg-black text-slate-500 border border-slate-900'
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
              <span className="text-[10px] text-cyan-400 w-14 shrink-0 font-bold">Parent 2:</span>
              <div className="flex items-center gap-1 bg-black p-1.5 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(0,255,102,0.08)]">
                {p2.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-black text-slate-500 border border-slate-900'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
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
        <div className="flex items-center justify-center my-1 text-[#00ff66]">
          <ArrowDown className="w-4 h-4 animate-bounce drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
        </div>

        {/* Offspring */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-emerald-500/80 block uppercase">
            Recombined Offspring:
          </span>
          {c1 && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-300 w-14 shrink-0 font-bold">Child 1:</span>
              <div className="flex items-center gap-1 bg-black p-1.5 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(0,255,102,0.08)]">
                {c1.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-emerald-950 text-[#00ff66] border border-emerald-400 shadow-[0_0_8px_rgba(0,255,102,0.3)]'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
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
              <span className="text-[10px] text-slate-300 w-14 shrink-0 font-bold">Child 2:</span>
              <div className="flex items-center gap-1 bg-black p-1.5 rounded-xl border border-emerald-500/30 shadow-[inset_0_0_10px_rgba(0,255,102,0.08)]">
                {c2.genes.slice(0, 10).map((gene, idx) => (
                  <span
                    key={idx}
                    className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold ${
                      idx < crossoverPt
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                        : 'bg-emerald-950 text-[#00ff66] border border-emerald-400 shadow-[0_0_8px_rgba(0,255,102,0.3)]'
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
