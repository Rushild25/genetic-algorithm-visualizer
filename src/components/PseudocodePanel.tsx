import React from 'react'
import { Code2 } from 'lucide-react'
import { GA_PSEUDOCODE } from '../constants/problemPresets'

interface PseudocodePanelProps {
  activeLine: number
}

export const PseudocodePanel: React.FC<PseudocodePanelProps> = ({ activeLine }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col h-full">
      <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
        <Code2 className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">Algorithm Pseudocode</h3>
        <span className="text-[10px] font-mono text-slate-400 ml-auto">VisuAlgo Style</span>
      </div>

      <div className="font-mono text-xs overflow-x-auto space-y-0.5 flex-1 select-none">
        {GA_PSEUDOCODE.map((item) => {
          const isActive = item.line === activeLine
          return (
            <div
              key={item.line}
              className={`flex items-center px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-amber-400/20 text-amber-300 font-bold border-l-2 border-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-6 text-[10px] text-right mr-3 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-600'}`}>
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
