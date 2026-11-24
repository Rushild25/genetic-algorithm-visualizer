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
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      const val = Math.round(maxFit - (range / 4) * i)
      ctx.fillStyle = 'rgba(0, 255, 102, 0.5)'
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

    const plotLine = (getter: (s: GenerationStats) => number, color: string, lineWidth: number = 2, shadowColor?: string) => {
      ctx.save()
      ctx.beginPath()
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      if (shadowColor) {
        ctx.shadowColor = shadowColor
        ctx.shadowBlur = 10
      }
      statsHistory.forEach((s, idx) => {
        const x = getX(idx)
        const y = getY(getter(s))
        if (idx === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.restore()
    }

    // Min line (Dark Emerald)
    plotLine((s) => s.minFitness, '#064e3b', 1)
    // Avg line (Mint/Teal)
    plotLine((s) => s.avgFitness, '#2dd4bf', 2)
    // Max line (Vibrant Neon Green with Glow!)
    plotLine((s) => s.maxFitness, '#00ff66', 2.5, '#00ff66')

    // Highlight current best point
    const lastStat = statsHistory[statsHistory.length - 1]
    const lastX = getX(statsHistory.length - 1)
    const lastY = getY(lastStat.maxFitness)

    ctx.save()
    ctx.beginPath()
    ctx.arc(lastX, lastY, 4.5, 0, 2 * Math.PI)
    ctx.fillStyle = '#00ff66'
    ctx.shadowColor = '#00ff66'
    ctx.shadowBlur = 12
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }, [statsHistory])

  const latest = statsHistory[statsHistory.length - 1]

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-3 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between h-full font-mono">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Fitness Convergence Curve
          </h3>
        </div>
        {latest && (
          <span className="text-[10px] font-mono font-bold text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]">
            PEAK: {latest.maxFitness}
          </span>
        )}
      </div>

      <div className="w-full flex-1 min-h-[160px] relative p-1 rounded-xl bg-black border border-emerald-500/20 shadow-[inset_0_0_15px_rgba(0,255,102,0.05)]">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="flex items-center justify-around pt-2 border-t border-emerald-500/20 text-[10px] font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.9)]" />
          <span className="text-white font-bold">Max</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf]" />
          <span className="text-slate-300">Average</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#064e3b]" />
          <span className="text-slate-400">Min</span>
        </div>
      </div>
    </div>
  )
}
