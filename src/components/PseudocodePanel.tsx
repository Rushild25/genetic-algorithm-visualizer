import React from 'react'
import { Code2 } from 'lucide-react'
import { GA_PSEUDOCODE } from '../constants/problemPresets'

interface PseudocodePanelProps {
  activeLine: number
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({ activeLine }) => {
  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-3 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col h-full font-mono">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-500/20">
        <Code2 className="w-4 h-4 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
        <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">Algorithm Pseudocode</h3>
        <span className="text-[10px] text-emerald-400/70 ml-auto border border-emerald-500/30 px-2 py-0.5 rounded-full bg-black">
          VisuAlgo Engine
        </span>
      </div>

      <div className="text-xs overflow-x-auto space-y-0.5 flex-1 select-none">
        {GA_PSEUDOCODE.map((item) => {
          const isActive = item.line === activeLine
          return (
            <div
              key={item.line}
              className={`flex items-center px-2 py-1 rounded-lg transition-all ${
                isActive
                  ? 'bg-emerald-950/70 text-[#00ff66] font-bold border-l-2 border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-emerald-950/20'
              }`}
            >
              <span
                className={`w-6 text-[10px] text-right mr-3 shrink-0 ${
                  isActive ? 'text-[#00ff66] font-bold drop-shadow-[0_0_4px_rgba(0,255,102,0.8)]' : 'text-emerald-900'
                }`}
              >
                {item.line}
              </span>
              <pre className="whitespace-pre">{item.text}</pre>
            </div>
          )
        })}
      </div>
    </div>
  )
}
