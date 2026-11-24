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
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Current Population ({population.length} Individuals)
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            Click row for DNA Microscope
          </span>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <th className="py-2 px-3">#</th>
              <th className="py-2 px-3">Genotype (Chromosome)</th>
              <th className="py-2 px-3">Phenotype</th>
              <th className="py-2 px-3 text-right">Fitness</th>
              <th className="py-2 px-3">p(select)</th>
              <th className="py-2 px-3 text-center">E[Count]</th>
              <th className="py-2 px-3 text-center">Actual</th>
              <th className="py-2 px-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {population.map((chr, index) => {
              const isSelected = chr.id === selectedChromosomeId
              const isBest = chr.fitness === maxFitness

              return (
                <tr
                  key={chr.id}
                  onClick={() => onSelectChromosome(chr)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white'
                      : isBest
                      ? 'bg-amber-500/10 hover:bg-amber-500/15'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <td className="py-2 px-3 text-slate-400 font-sans font-medium flex items-center gap-1">
                    <span>{index + 1}</span>
                    {isBest && (
                      <span title="Best in Population">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                    )}
                    {chr.isElite && <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded">Elite</span>}
                  </td>

                  {/* Genotype rendering */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-0.5 max-w-[200px] overflow-hidden text-ellipsis">
                      {chr.genes.map((gene, gIdx) => {
                        const isMutated = chr.mutatedIndices?.includes(gIdx)
                        return (
                          <span
                            key={gIdx}
                            className={`px-1 py-0.5 rounded text-[11px] font-bold ${
                              isMutated
                                ? 'bg-fuchsia-500 text-white animate-pulse'
                                : gene === 1 || gene === '1'
                                ? 'bg-indigo-600/40 text-indigo-200'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {gene}
                          </span>
                        )
                      })}
                    </div>
                  </td>

                  {/* Phenotype */}
                  <td className="py-2 px-3 font-sans text-slate-200">
                    {chr.phenotypeDisplay}
                  </td>

                  {/* Fitness */}
                  <td className="py-2 px-3 text-right font-bold">
                    <span className={isBest ? 'text-amber-400' : 'text-slate-100'}>
                      {chr.fitness.toLocaleString()}
                    </span>
                  </td>

                  {/* Selection Probability */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${Math.round(chr.selectionProbability * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-cyan-300">
                        {Math.round(chr.selectionProbability * 1000) / 10}%
                      </span>
                    </div>
                  </td>

                  {/* Expected Count */}
                  <td className="py-2 px-3 text-center text-slate-400">
                    {chr.expectedCount}
                  </td>

                  {/* Actual Selected Count */}
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`px-1.5 py-0.5 rounded font-bold ${
                        chr.actualSelectedCount > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-500'
                      }`}
                    >
                      {chr.actualSelectedCount}
                    </span>
                  </td>

                  {/* Microscope Action */}
                  <td className="py-2 px-2 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectChromosome(chr)
                      }}
                      className="p-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-400 transition-colors cursor-pointer"
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
