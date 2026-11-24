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
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between border-b border-emerald-950/80 pb-3 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.2)]">
            <Type className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wider uppercase">
            Target String Synthesis (Dawkins' Weasel)
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#00ff66] bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]">
            {matches} / {total} Matches ({matchPercent}%)
          </span>
        </div>
      </div>

      {/* Target input */}
      <div className="mb-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          Target Objective Phrase:
        </label>
        <input
          type="text"
          value={targetText}
          onChange={(e) => onChangeTargetText(e.target.value.toUpperCase())}
          className="w-full bg-black text-[#00ff66] font-mono text-sm px-3 py-2 rounded-xl border border-emerald-500/40 focus:outline-none focus:border-[#00ff66] focus:shadow-[0_0_15px_rgba(0,255,102,0.25)] tracking-widest uppercase transition-all"
          placeholder="ENTER TARGET PHRASE..."
        />
      </div>

      {/* Letter-by-letter matching comparison display */}
      <div className="my-auto space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Current Best Genetic Decoding:
        </span>
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-black border border-emerald-500/30 font-mono shadow-[inset_0_0_20px_rgba(0,255,102,0.03)]">
          {targetText.split('').map((targetChar, idx) => {
            const currentChar = currentText[idx] || '?'
            const isMatch = currentChar === targetChar

            return (
              <div
                key={idx}
                className={`flex flex-col items-center justify-center min-w-[28px] h-14 rounded-lg font-bold text-sm transition-all ${
                  isMatch
                    ? 'bg-[#00ff66] text-black border border-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.7)] font-black'
                    : 'bg-black text-slate-500 border border-emerald-950/70'
                }`}
              >
                <span className={`text-[9px] font-sans ${isMatch ? 'text-black/80 font-bold' : 'text-slate-600'}`}>
                  {targetChar === ' ' ? '␣' : targetChar}
                </span>
                <span className={`text-base font-mono ${isMatch ? 'text-black font-black' : 'text-slate-400'}`}>
                  {currentChar === ' ' ? '␣' : currentChar}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-[10px] text-slate-400 pt-3 border-t border-emerald-950/80 mt-3 font-mono">
        Richard Dawkins introduced this thought experiment in <em>The Blind Watchmaker</em> (1986) to demonstrate how cumulative selection rapidly converges on a complex target where pure random chance would take billions of years.
      </div>
    </div>
  )
}
