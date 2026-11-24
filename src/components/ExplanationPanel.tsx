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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Info className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white tracking-wide">{title}</h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 ml-auto">
            Phase: {phase}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
          {body}
        </p>

        {mathHighlight && (
          <div className="bg-slate-950 border border-indigo-500/30 rounded-lg p-2.5 mb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block mb-0.5">
              Mathematical Relation
            </span>
            <code className="text-xs font-mono text-cyan-300 font-semibold break-words">
              {mathHighlight}
            </code>
          </div>
        )}
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-start gap-2 text-xs text-amber-300/90 font-medium">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
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
