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
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-3 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between font-mono">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Allele Fixation & Diversity
          </h3>
        </div>
        <span className="text-[10px] text-[#00ff66] font-bold">
          DIVERSITY: {latest?.diversityIndex ?? 0}
        </span>
      </div>

      <div className="space-y-1.5 my-auto">
        <span className="text-[10px] text-emerald-500/80 block font-sans">
          Locus Allele Frequency (% carrying bit '1'):
        </span>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
          {frequencies.slice(0, 16).map((freq, locus) => {
            const isFixated = freq === 0 || freq === 100
            return (
              <div
                key={locus}
                className={`p-1.5 rounded-xl border text-center transition-all ${
                  isFixated
                    ? 'bg-emerald-950/80 border-emerald-400 text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.4)]'
                    : 'bg-black border-emerald-500/30 text-emerald-300'
                }`}
                title={`Locus ${locus}: ${freq}% allele frequency`}
              >
                <div className="text-[9px] text-emerald-600 font-sans">L{locus}</div>
                <div className="text-xs font-bold">{freq}%</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-[10px] text-emerald-500/80 pt-2 border-t border-emerald-500/20 font-sans">
        When an allele reaches 100% or 0%, the locus is <strong className="text-[#00ff66]">fixated</strong>. Only mutation can reintroduce lost diversity!
      </div>
    </div>
  )
}
