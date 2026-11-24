import React, { useRef, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import type { GenerationStats } from '../types'

interface ConvergenceChartProps {
  statsHistory: GenerationStats[]
}

export const ConvergenceChart: React.FC<ConvergenceChartProps> = ({ statsHistory }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = canvas.parentElement?.clientWidth || 360
    const height = 180

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, width, height)

    if (statsHistory.length === 0) return

    const padding = { top: 20, right: 20, bottom: 25, left: 45 }
    const chartW = width - padding.left - padding.right
    const chartH = height - padding.top - padding.bottom

    const maxFit = Math.max(...statsHistory.map((s) => s.maxFitness), 10)
    const minFit = Math.min(...statsHistory.map((s) => s.minFitness), 0)
    const range = maxFit - minFit || 1

    // Draw grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      const val = Math.round(maxFit - (range / 4) * i)
      ctx.fillStyle = '#64748b'
      ctx.font = '9px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(`${val}`, padding.left - 6, y + 3)
    }

    const getX = (idx: number) => {
      if (statsHistory.length <= 1) return padding.left + chartW / 2
      return padding.left + (chartW / (statsHistory.length - 1)) * idx
    }

    const getY = (val: number) => {
      return padding.top + chartH - ((val - minFit) / range) * chartH
    }

    // Helper to plot line
    const plotLine = (getter: (s: GenerationStats) => number, color: string, lineWidth: number = 2) => {
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      statsHistory.forEach((s, idx) => {
        const x = getX(idx)
        const y = getY(getter(s))
        if (idx === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    // Min line (Rose)
    plotLine((s) => s.minFitness, '#f43f5e', 1)
    // Avg line (Cyan)
    plotLine((s) => s.avgFitness, '#06b6d4', 2)
    // Max line (Gold)
    plotLine((s) => s.maxFitness, '#fbbf24', 2.5)

    // Highlight current best point
    const lastStat = statsHistory[statsHistory.length - 1]
    const lastX = getX(statsHistory.length - 1)
    const lastY = getY(lastStat.maxFitness)

    ctx.beginPath()
    ctx.arc(lastX, lastY, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#fbbf24'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [statsHistory])

  const latest = statsHistory[statsHistory.length - 1]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Fitness Convergence Curve
          </h3>
        </div>
        {latest && (
          <span className="text-[10px] font-mono font-bold text-amber-400">
            Peak: {latest.maxFitness}
          </span>
        )}
      </div>

      <div className="w-full flex-1 min-h-[160px] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="flex items-center justify-around pt-2 border-t border-slate-800/80 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <span className="text-slate-300">Max Fitness</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-slate-300">Average</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">Min</span>
        </div>
      </div>
    </div>
  )
}
