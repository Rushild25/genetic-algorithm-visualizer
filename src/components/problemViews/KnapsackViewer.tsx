import React from 'react'
import { Package, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { KnapsackItem, Chromosome } from '../../types'

interface KnapsackViewerProps {
  items: KnapsackItem[]
  maxCapacity: number
  bestIndividual: Chromosome | null
}

export const KnapsackViewer: React.FC<KnapsackViewerProps> = ({
  items,
  maxCapacity,
  bestIndividual
}) => {
  const genes = bestIndividual?.genes || []
  const currentWeight = bestIndividual?.metadata?.totalWeight ?? 0
  const currentValue = bestIndividual?.metadata?.totalValue ?? 0
  const isFeasible = currentWeight <= maxCapacity
  const capacityPercent = Math.min(100, Math.round((currentWeight / maxCapacity) * 100))

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-emerald-950/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.2)]">
            <Package className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wider uppercase">
            0/1 Knapsack Packing Manifest
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#00ff66] bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]">
            Value: \${currentValue}
          </span>
          <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
            isFeasible
              ? 'bg-emerald-950/90 text-[#00ff66] border border-emerald-400 shadow-[0_0_10px_rgba(0,255,102,0.2)]'
              : 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
          }`}>
            {currentWeight} / {maxCapacity} kg
          </span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[11px] mb-1.5 font-mono">
          <span className="text-slate-400">Backpack Capacity:</span>
          <span className={isFeasible ? 'text-[#00ff66] font-bold' : 'text-rose-400 font-bold flex items-center gap-1'}>
            {!isFeasible && <AlertTriangle className="w-3 h-3" />}
            {capacityPercent}% {isFeasible ? 'Filled' : 'OVERLOADED'}
          </span>
        </div>
        <div className="w-full h-2.5 bg-black rounded-full overflow-hidden border border-emerald-500/30">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isFeasible ? 'bg-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.8)]' : 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]'
            }`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>
      </div>

      {/* Item Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 my-auto">
        {items.map((item, idx) => {
          const isPacked = Number(genes[idx]) === 1

          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                isPacked
                  ? 'bg-emerald-950/70 border-emerald-400 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                  : 'bg-black/90 border-emerald-950/50 text-slate-500 opacity-50'
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <span className="text-xs font-bold leading-tight truncate w-full text-slate-200">{item.name}</span>
              <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
                <span className="text-slate-400">{item.weight}kg</span>
                <span className="text-emerald-500">•</span>
                <span className="text-[#00ff66] font-bold">\${item.value}</span>
              </div>
              <div className="mt-1.5">
                {isPacked ? (
                  <span className="text-[9px] font-bold text-[#00ff66] flex items-center gap-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Packed
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-600 font-mono">Excluded</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-[10px] text-slate-400 pt-3 border-t border-emerald-950/80 mt-3 font-mono">
        Genetic algorithm maximizes total packed dollar value while applying a harsh penalty if total weight exceeds {maxCapacity}kg.
      </div>
    </div>
  )
}
