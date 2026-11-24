import React from 'react'
import { Info, Lightbulb } from 'lucide-react'
import type { GAPhase } from '../types'

interface ExplanationPanelProps {
  phase: GAPhase
  title: string
  body: string
  mathHighlight?: string
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  phase,
  title,
  body,
  mathHighlight
}) => {
  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-xl bg-emerald-950/80 text-[#00ff66] border border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,102,0.3)]">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide font-mono flex items-center gap-2">
            <span>{title}</span>
          </h2>
          <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-black text-[#00ff66] border border-emerald-500/40 shadow-[0_0_8px_rgba(0,255,102,0.2)] ml-auto">
            PHASE: {phase}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 font-sans">
          {body}
        </p>

        {mathHighlight && (
          <div className="bg-black border border-emerald-500/40 rounded-xl p-3 mb-2 shadow-[0_0_15px_rgba(0,255,102,0.1)]">
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400/80 block mb-1">
              Mathematical Relation
            </span>
            <code className="text-xs font-mono text-[#00ff66] font-bold break-words drop-shadow-[0_0_6px_rgba(0,255,102,0.6)]">
              {mathHighlight}
            </code>
          </div>
        )}
      </div>

      <div className="pt-2.5 border-t border-emerald-500/20 flex items-start gap-2 text-xs text-[#00ff66]/90 font-mono font-medium">
        <Lightbulb className="w-3.5 h-3.5 text-[#00ff66] shrink-0 mt-0.5 drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
        <span>
          {phase === 'EVALUATE' && 'Higher fitness yields larger selection wedges, driving reproductive priority.'}
          {phase === 'SELECT' && 'Selection exerts evolutionary pressure toward fitter schema building blocks.'}
          {phase === 'CROSSOVER' && 'Recombination combines high-performing genetic sub-strings from both parents.'}
          {phase === 'MUTATE' && 'Mutation restores lost alleles and guarantees exploration of new regions.'}
          {phase === 'REPLACE' && 'Elitism guarantees monotonic non-decreasing improvement of the best score.'}
          {(phase === 'INITIALIZED' || phase === 'COMPLETED') && 'Explore the stepping controls to observe algorithm evolution.'}
        </span>
      </div>
    </div>
  )
}
