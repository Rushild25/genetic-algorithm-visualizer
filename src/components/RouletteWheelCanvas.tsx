import React, { useRef, useEffect } from 'react'
import type { Chromosome } from '../types'

interface RouletteWheelCanvasProps {
  population: Chromosome[]
  selectedChromosomeId?: string | null
  isSpinning?: boolean
}

const PALETTE = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#8b5cf6', // Violet
  '#f43f5e', // Rose
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#eab308', // Yellow
]

export const RouletteWheelCanvas: React.FC<RouletteWheelCanvasProps> = ({
  population,
  selectedChromosomeId
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rotationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 260
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 16

    ctx.clearRect(0, 0, size, size)

    const totalFitness = population.reduce((sum, c) => sum + c.fitness, 0)
    if (totalFitness <= 0 || population.length === 0) {
      // Draw placeholder circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = '#1e293b'
      ctx.fill()
      ctx.strokeStyle = '#334155'
      ctx.lineWidth = 2
      ctx.stroke()
      return
    }

    let startAngle = rotationRef.current

    population.forEach((chr, idx) => {
      const sliceAngle = (chr.fitness / totalFitness) * (2 * Math.PI)
      const endAngle = startAngle + sliceAngle

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.closePath()

      const isSelected = chr.id === selectedChromosomeId
      ctx.fillStyle = isSelected ? '#fbbf24' : PALETTE[idx % PALETTE.length]
      ctx.fill()
      ctx.strokeStyle = '#0f172a'
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw label if slice is large enough (> 12 degrees)
      if (sliceAngle > 0.2) {
        const midAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.68
        const lx = centerX + Math.cos(midAngle) * labelRadius
        const ly = centerY + Math.sin(midAngle) * labelRadius

        ctx.save()
        ctx.translate(lx, ly)
        ctx.rotate(midAngle + Math.PI / 2)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 9px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`#${idx + 1}`, 0, 0)
        ctx.restore()
      }

      startAngle = endAngle
    })

    // Draw center hub
    ctx.beginPath()
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI)
    ctx.fillStyle = '#090d16'
    ctx.fill()
    ctx.strokeStyle = '#4f46e5'
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw pointer needle at top (12 o'clock position)
    ctx.beginPath()
    ctx.moveTo(centerX - 8, 4)
    ctx.lineTo(centerX + 8, 4)
    ctx.lineTo(centerX, 20)
    ctx.closePath()
    ctx.fillStyle = '#f43f5e'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }, [population, selectedChromosomeId])

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-between shadow-lg h-full">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
          Roulette Wheel Selection
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono">p_i = f_i / Σf</span>
      </div>

      <div className="relative my-auto flex items-center justify-center">
        <canvas
          ref={canvasRef}
          style={{ width: 260, height: 260 }}
          className="rounded-full shadow-inner"
        />
      </div>

      <div className="w-full text-center text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        Wedge angle is directly proportional to fitness.
      </div>
    </div>
  )
}
