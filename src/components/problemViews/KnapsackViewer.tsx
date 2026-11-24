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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            0/1 Knapsack Packing Manifest
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-300">
            Value: \${currentValue}
          </span>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            isFeasible ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {currentWeight} / {maxCapacity} kg
          </span>
        </div>
      </div>

      {/* Capacity Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] mb-1 font-mono">
          <span className="text-slate-400">Backpack Capacity:</span>
          <span className={isFeasible ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold flex items-center gap-1'}>
            {!isFeasible && <AlertTriangle className="w-3 h-3" />}
            {capacityPercent}% {isFeasible ? 'Filled' : 'OVERLOADED'}
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isFeasible ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' : 'bg-rose-500'
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
              className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                isPacked
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <span className="text-xs font-bold leading-tight truncate w-full">{item.name}</span>
              <div className="flex items-center gap-1 text-[10px] font-mono mt-0.5">
                <span>{item.weight}kg</span>
                <span>•</span>
                <span className="text-amber-400">\${item.value}</span>
              </div>
              <div className="mt-1">
                {isPacked ? (
                  <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-0.5">
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

      <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
        Genetic algorithm maximizes total packed dollar value while applying a harsh penalty if total weight exceeds {maxCapacity}kg.
      </div>
    </div>
  )
}
