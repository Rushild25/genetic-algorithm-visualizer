import React from 'react'
import { Activity } from 'lucide-react'
import type { GenerationStats } from '../types'

interface AlleleDiversityHeatmapProps {
  statsHistory: GenerationStats[]
}

export const AlleleDiversityHeatmap: React.FC<AlleleDiversityHeatmapProps> = ({ statsHistory }) => {
  const latest = statsHistory[statsHistory.length - 1]
  const frequencies = latest?.alleleFrequencies || []

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-fuchsia-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Allele Fixation & Diversity
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Diversity: {latest?.diversityIndex ?? 0}
        </span>
      </div>

      <div className="space-y-1.5 my-auto">
        <span className="text-[10px] text-slate-400 block font-sans">
          Locus Allele Frequency (% of population carrying bit '1'):
        </span>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
          {frequencies.slice(0, 16).map((freq, locus) => {
            // Color based on fixation (0% = cold dark blue, 50% = vibrant purple, 100% = bright cyan/emerald)
            const isFixated = freq === 0 || freq === 100
            return (
              <div
                key={locus}
                className={`p-1.5 rounded-lg border text-center transition-all ${
                  isFixated
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-indigo-950/40 border-indigo-500/30 text-cyan-300'
                }`}
                title={`Locus ${locus}: ${freq}% allele frequency`}
              >
                <div className="text-[9px] text-slate-500 font-sans">L{locus}</div>
                <div className="text-xs font-mono font-bold">{freq}%</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
        When an allele reaches 100% or 0%, the locus is <strong className="text-amber-400">fixated</strong>. Only mutation can reintroduce lost diversity!
      </div>
    </div>
  )
}
