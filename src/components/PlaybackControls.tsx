import React from 'react'
import {
  Play,
  Pause,
  SkipForward,
  FastForward,
  RotateCcw,
  Sliders,
  Sparkles,
  ArrowLeft
} from 'lucide-react'
import type { GAParameters, GAPhase, ProblemType } from '../types'

interface PlaybackControlsProps {
  isPlaying: boolean
  onTogglePlay: () => void
  onStepPhase: () => void
  onStepGeneration: () => void
  onStepBack: () => void
  canStepBack: boolean
  onReset: () => void
  generation: number
  phase: GAPhase
  speed: number
  onChangeSpeed: (speed: number) => void
  params: GAParameters
  onChangeParams: (newParams: Partial<GAParameters>) => void
  problemType: ProblemType
}

const PHASE_CONFIG: Record<GAPhase, { label: string }> = {
  INITIALIZED: { label: '0. Initialized' },
  EVALUATE: { label: '1. Evaluate Fitness' },
  SELECT: { label: '2. Selection (Mating)' },
  CROSSOVER: { label: '3. Recombination' },
  MUTATE: { label: '4. Mutation' },
  REPLACE: { label: '5. Survivor Selection' },
  COMPLETED: { label: 'Complete' }
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onStepPhase,
  onStepGeneration,
  onStepBack,
  canStepBack,
  onReset,
  generation,
  phase,
  speed,
  onChangeSpeed,
  params,
  onChangeParams,
  problemType
}) => {
  const [showSettings, setShowSettings] = React.useState(false)
  const currentPhaseMeta = PHASE_CONFIG[phase] || PHASE_CONFIG.INITIALIZED

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-3 shadow-[0_0_30px_rgba(0,255,102,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Generation & Phase Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5 px-3.5 py-1.5 rounded-xl bg-black border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,102,0.15)]">
            <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-emerald-500/70">GEN</span>
            <span className="text-xl font-black text-[#00ff66] font-mono drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">
              {generation}
            </span>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/50 text-[#00ff66] font-mono text-xs font-bold tracking-wide flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#00ff66]" />
            <span>{currentPhaseMeta.label}</span>
          </div>
        </div>

        {/* Primary Step Controls */}
        <div className="flex items-center gap-2">
          {/* Step Back (Time-travel) */}
          <button
            onClick={onStepBack}
            disabled={!canStepBack || isPlaying}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-black text-slate-300 border border-emerald-500/30 hover:border-emerald-400 hover:text-[#00ff66] hover:shadow-[0_0_15px_rgba(0,255,102,0.2)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Step Backward in History"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-mono font-black shadow-lg transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(251,191,36,0.6)]'
                : 'bg-[#00ff66] hover:bg-[#33ff85] text-black shadow-[0_0_25px_rgba(0,255,102,0.7)] hover:shadow-[0_0_35px_rgba(0,255,102,0.9)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>AUTO PLAY</span>
              </>
            )}
          </button>

          {/* Step Phase (Micro-step) */}
          <button
            onClick={onStepPhase}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-black text-[#00ff66] border border-emerald-500/50 hover:bg-emerald-950/40 hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(0,255,102,0.35)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Execute Next Phase (Evaluate -> Select -> Crossover -> Mutate -> Replace)"
          >
            <SkipForward className="w-4 h-4" />
            <span>Step Phase</span>
          </button>

          {/* Step Gen (Macro-step) */}
          <button
            onClick={onStepGeneration}
            disabled={isPlaying}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold bg-black text-[#00ff66] border border-emerald-500/50 hover:bg-emerald-950/40 hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(0,255,102,0.35)] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            title="Advance 1 Full Generation"
          >
            <FastForward className="w-4 h-4" />
            <span>Step Gen</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl bg-black text-slate-400 hover:text-rose-400 border border-emerald-500/30 hover:border-rose-500 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all cursor-pointer"
            title="Reset Population"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Parameter Settings Toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              showSettings
                ? 'bg-emerald-950 text-[#00ff66] border-emerald-400 shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                : 'bg-black text-slate-300 border-emerald-500/30 hover:border-emerald-400 hover:text-[#00ff66]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Params</span>
          </button>
        </div>

        {/* Speed Slider */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-xs font-bold text-emerald-500/70">SPEED:</span>
          <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.1)]">
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2.5 py-0.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-[#00ff66] text-black shadow-[0_0_10px_rgba(0,255,102,0.6)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collapsible Parameter Controls Drawer */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-emerald-500/20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-black p-4 rounded-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(0,255,102,0.1)] font-mono">
          {/* Population Size */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-300">Population Size (N)</span>
              <span className="text-[#00ff66] font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.6)]">
                {params.populationSize}
              </span>
            </div>
            <input
              type="range"
              min={problemType === 'goldberg' ? 4 : 6}
              max={problemType === 'goldberg' ? 20 : 60}
              step={problemType === 'goldberg' ? 2 : 2}
              value={params.populationSize}
              onChange={(e) => onChangeParams({ populationSize: Number(e.target.value) })}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
            {problemType === 'goldberg' && (
              <span className="text-[10px] text-amber-400 block mt-0.5 font-sans">Goldberg textbook uses N=4</span>
            )}
          </div>

          {/* Crossover Rate */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-300">Crossover Rate (Pc)</span>
              <span className="text-[#00ff66] font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.6)]">
                {Math.round(params.crossoverRate * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={params.crossoverRate}
              onChange={(e) => onChangeParams({ crossoverRate: Number(e.target.value) })}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">Typical range: 60% – 95%</span>
          </div>

          {/* Mutation Rate */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-bold text-slate-300">Mutation Rate (Pm)</span>
              <span className="text-[#00ff66] font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.6)]">
                {Math.round(params.mutationRate * 1000) / 10}%
              </span>
            </div>
            <input
              type="range"
              min="0.001"
              max="0.2"
              step="0.005"
              value={params.mutationRate}
              onChange={(e) => onChangeParams({ mutationRate: Number(e.target.value) })}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 block mt-0.5 font-sans">Typical range: 0.1% – 5%</span>
          </div>

          {/* Selection Method & Deterministic Mode */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="font-bold text-xs text-slate-300 block mb-1">Selection Method</span>
              <select
                value={params.selectionMethod}
                onChange={(e) => onChangeParams({ selectionMethod: e.target.value as any })}
                className="w-full bg-black text-[#00ff66] text-xs border border-emerald-500/40 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-emerald-400 cursor-pointer"
              >
                <option value="roulette">Roulette Wheel (Fitness Proportionate)</option>
                <option value="tournament">Tournament Selection (k=2)</option>
              </select>
            </div>

            {problemType === 'goldberg' && (
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs text-amber-300 font-bold font-sans">
                <input
                  type="checkbox"
                  checked={params.isDeterministicGoldberg}
                  onChange={(e) => onChangeParams({ isDeterministicGoldberg: e.target.checked })}
                  className="rounded accent-amber-500"
                />
                <span>Deterministic Goldberg 1989 Mode</span>
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
