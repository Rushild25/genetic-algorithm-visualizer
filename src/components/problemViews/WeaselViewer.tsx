import React from 'react'
import { Type } from 'lucide-react'
import type { Chromosome } from '../../types'

interface WeaselViewerProps {
  targetText: string
  onChangeTargetText: (text: string) => void
  bestIndividual: Chromosome | null
}

export const WeaselViewer: React.FC<WeaselViewerProps> = ({
  targetText,
  onChangeTargetText,
  bestIndividual
}) => {
  const currentText = bestIndividual?.metadata?.text || ''
  const matches = bestIndividual?.metadata?.matches || 0
  const total = targetText.length
  const matchPercent = total > 0 ? Math.round((matches / total) * 100) : 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Target String Synthesis (Dawkins' Weasel)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400">
            {matches} / {total} Matches ({matchPercent}%)
          </span>
        </div>
      </div>

      {/* Target input */}
      <div className="mb-3">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          Target Objective Phrase:
        </label>
        <input
          type="text"
          value={targetText}
          onChange={(e) => onChangeTargetText(e.target.value.toUpperCase())}
          className="w-full bg-slate-950 text-white font-mono text-sm px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 tracking-widest uppercase"
          placeholder="ENTER TARGET PHRASE..."
        />
      </div>

      {/* Letter-by-letter matching comparison display */}
      <div className="my-auto space-y-2">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          Current Best Genetic Decoding:
        </span>
        <div className="flex flex-wrap gap-1 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono">
          {targetText.split('').map((targetChar, idx) => {
            const currentChar = currentText[idx] || '?'
            const isMatch = currentChar === targetChar

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center min-w-[28px] h-14 rounded-lg font-bold text-sm transition-all ${
                  isMatch
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                }`}
              >
                <span className="text-[9px] text-slate-500 font-sans">{targetChar === ' ' ? '␣' : targetChar}</span>
                <span className={isMatch ? 'text-emerald-300 text-base' : 'text-slate-400 text-base'}>
                  {currentChar === ' ' ? '␣' : currentChar}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 mt-3">
        Richard Dawkins introduced this thought experiment in <em>The Blind Watchmaker</em> (1986) to demonstrate how cumulative selection rapidly converges on a complex target where pure random chance would take billions of years.
      </div>
    </div>
  )
}
