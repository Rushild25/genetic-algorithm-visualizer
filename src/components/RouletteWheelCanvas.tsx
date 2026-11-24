import React, { useRef, useEffect } from 'react'
import type { Chromosome } from '../types'

interface RouletteWheelCanvasProps {
  population: Chromosome[]
  selectedChromosomeId?: string | null
  isSpinning?: boolean
}

const NEON_PALETTE = [
  '#00ff66', // Pure Neon Green
  '#10b981', // Emerald
  '#4ade80', // Light Lime
  '#22c55e', // Vibrant Green
  '#a3e635', // Electric Lime
  '#06b6d4', // Cyan Green
  '#14b8a6', // Teal
  '#84cc16', // Cyber Lime
  '#34d399', // Mint
  '#2dd4bf', // Light Teal
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
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = '#050a06'
      ctx.fill()
      ctx.strokeStyle = 'rgba(0, 255, 102, 0.25)'
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
      ctx.fillStyle = isSelected ? '#ffffff' : NEON_PALETTE[idx % NEON_PALETTE.length]
      ctx.fill()
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = 2.5
      ctx.stroke()

      // Draw label if slice is large enough
      if (sliceAngle > 0.22) {
        const midAngle = startAngle + sliceAngle / 2
        const labelRadius = radius * 0.68
        const lx = centerX + Math.cos(midAngle) * labelRadius
        const ly = centerY + Math.sin(midAngle) * labelRadius

        ctx.save()
        ctx.translate(lx, ly)
        ctx.rotate(midAngle + Math.PI / 2)
        ctx.fillStyle = '#000000'
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.fillText(`#${idx + 1}`, 0, 0)
        ctx.restore()
      }

      startAngle = endAngle
    })

    // Draw center hub with neon rim
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI)
    ctx.fillStyle = '#000000'
    ctx.shadowColor = '#00ff66'
    ctx.shadowBlur = 12
    ctx.fill()
    ctx.strokeStyle = '#00ff66'
    ctx.lineWidth = 3
    ctx.stroke()
    ctx.restore()

    // Draw pointer needle at top (12 o'clock position)
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(centerX - 8, 4)
    ctx.lineTo(centerX + 8, 4)
    ctx.lineTo(centerX, 20)
    ctx.closePath()
    ctx.fillStyle = '#00ff66'
    ctx.shadowColor = '#00ff66'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()
  }, [population, selectedChromosomeId])

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-3 flex flex-col items-center justify-between shadow-[0_0_25px_rgba(0,255,102,0.08)] h-full font-mono">
      <div className="w-full flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-2">
        <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
          Roulette Wheel Selection
        </h3>
        <span className="text-[10px] text-[#00ff66] font-bold drop-shadow-[0_0_5px_rgba(0,255,102,0.6)]">
          p_i = f_i / Σf
        </span>
      </div>

      <div className="relative my-auto flex items-center justify-center p-2 rounded-2xl bg-black border border-emerald-500/30 shadow-[inset_0_0_20px_rgba(0,255,102,0.1)]">
        <canvas
          ref={canvasRef}
          style={{ width: 260, height: 260 }}
          className="rounded-full shadow-[0_0_20px_rgba(0,255,102,0.15)]"
        />
      </div>

      <div className="w-full text-center text-[11px] text-emerald-500/80 pt-2 border-t border-emerald-500/20">
        Wedge angle is directly proportional to fitness.
      </div>
    </div>
  )
}
