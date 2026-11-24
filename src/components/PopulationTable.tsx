import React from 'react'
import { Microscope, Award } from 'lucide-react'
import type { Chromosome, ProblemType } from '../types'

interface PopulationTableProps {
  population: Chromosome[]
  onSelectChromosome: (chr: Chromosome) => void
  selectedChromosomeId: string | null
  problemType?: ProblemType
}

export const PopulationTable: React.FC<PopulationTableProps> = ({
  population,
  onSelectChromosome,
  selectedChromosomeId
}) => {
  const maxFitness = Math.max(...population.map((c) => c.fitness), 1)

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col h-full font-mono">
      <div className="px-4 py-3 bg-black border-b border-emerald-500/25 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.9)] animate-ping" />
            Current Population ({population.length} Individuals)
          </h3>
          <span className="text-[10px] text-emerald-400 bg-black px-2.5 py-0.5 rounded-full border border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,102,0.15)] font-sans">
            Click row for DNA Microscope
          </span>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-black/80 text-emerald-400 font-bold border-b border-emerald-500/25">
              <th className="py-2.5 px-3">#</th>
              <th className="py-2.5 px-3">Genotype (Chromosome)</th>
              <th className="py-2.5 px-3">Phenotype</th>
              <th className="py-2.5 px-3 text-right">Fitness</th>
              <th className="py-2.5 px-3">p(select)</th>
              <th className="py-2.5 px-3 text-center">E[Count]</th>
              <th className="py-2.5 px-3 text-center">Actual</th>
              <th className="py-2.5 px-2 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-500/15">
            {population.map((chr, index) => {
              const isSelected = chr.id === selectedChromosomeId
              const isBest = chr.fitness === maxFitness

              return (
                <tr
                  key={chr.id}
                  onClick={() => onSelectChromosome(chr)}
                  className={`cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/60 text-white border-l-2 border-[#00ff66] shadow-[inset_0_0_15px_rgba(0,255,102,0.15)]'
                      : isBest
                      ? 'bg-emerald-950/30 hover:bg-emerald-950/40 border-l-2 border-[#00ff66]'
                      : 'hover:bg-emerald-950/20 text-slate-300'
                  }`}
                >
                  <td className="py-2.5 px-3 text-emerald-500/80 font-medium flex items-center gap-1">
                    <span>{index + 1}</span>
                    {isBest && (
                      <span title="Best in Population">
                        <Award className="w-3.5 h-3.5 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
                      </span>
                    )}
                    {chr.isElite && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-emerald-900/60 text-[#00ff66] border border-emerald-500/40 rounded font-bold">
                        ELITE
                      </span>
                    )}
                  </td>

                  {/* Genotype rendering */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-0.5 max-w-[200px] overflow-hidden text-ellipsis">
                      {chr.genes.map((gene, gIdx) => {
                        const isMutated = chr.mutatedIndices?.includes(gIdx)
                        return (
                          <span
                            key={gIdx}
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              isMutated
                                ? 'bg-[#00ff66] text-black shadow-[0_0_12px_rgba(0,255,102,0.9)] animate-pulse'
                                : gene === 1 || gene === '1'
                                ? 'bg-emerald-950/90 text-[#00ff66] border border-emerald-500/40 shadow-[0_0_6px_rgba(0,255,102,0.2)]'
                                : 'bg-black text-slate-600 border border-slate-900'
                            }`}
                          >
                            {gene}
                          </span>
                        )
                      })}
                    </div>
                  </td>

                  {/* Phenotype */}
                  <td className="py-2.5 px-3 text-slate-200 font-sans">
                    {chr.phenotypeDisplay}
                  </td>

                  {/* Fitness */}
                  <td className="py-2.5 px-3 text-right font-bold">
                    <span className={isBest ? 'text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]' : 'text-slate-100'}>
                      {chr.fitness.toLocaleString()}
                    </span>
                  </td>

                  {/* Selection Probability */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-black border border-emerald-500/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#00ff66] rounded-full shadow-[0_0_8px_rgba(0,255,102,0.8)]"
                          style={{ width: `${Math.round(chr.selectionProbability * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#00ff66] font-bold">
                        {Math.round(chr.selectionProbability * 1000) / 10}%
                      </span>
                    </div>
                  </td>

                  {/* Expected Count */}
                  <td className="py-2.5 px-3 text-center text-slate-400">
                    {chr.expectedCount}
                  </td>

                  {/* Actual Selected Count */}
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        chr.actualSelectedCount > 0
                          ? 'bg-emerald-950 text-[#00ff66] border border-emerald-500/50 shadow-[0_0_8px_rgba(0,255,102,0.3)]'
                          : 'text-slate-600'
                      }`}
                    >
                      {chr.actualSelectedCount}
                    </span>
                  </td>

                  {/* Microscope Action */}
                  <td className="py-2.5 px-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectChromosome(chr)
                      }}
                      className="p-1.5 rounded-lg bg-black hover:bg-[#00ff66] hover:text-black text-emerald-400 border border-emerald-500/30 hover:shadow-[0_0_12px_rgba(0,255,102,0.6)] transition-all cursor-pointer"
                      title="Open DNA Microscope"
                    >
                      <Microscope className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
