import React, { useRef, useEffect } from 'react'
import { Mountain } from 'lucide-react'
import type { Chromosome } from '../../types'

interface LandscapeViewerProps {
  population: Chromosome[]
  bestIndividual: Chromosome | null
}

export const LandscapeViewer: React.FC<LandscapeViewerProps> = ({
  population,
  bestIndividual
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 320
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    ctx.clearRect(0, 0, size, size)

    // Draw stylized Rastrigin contour rings
    const centerX = size / 2
    const centerY = size / 2

    const bgGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, size / 2)
    bgGrad.addColorStop(0, '#064e3b') // Deep emerald at optimum (0, 0)
    bgGrad.addColorStop(0.3, '#0f172a')
    bgGrad.addColorStop(0.7, '#1e1b4b')
    bgGrad.addColorStop(1, '#090d16')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, size, size)

    // Draw wavy contour lines representing Rastrigin ripples
    ctx.lineWidth = 1
    for (let r = 20; r < size / 2; r += 24) {
      ctx.beginPath()
      for (let angle = 0; angle <= 2 * Math.PI; angle += 0.05) {
        const ripple = Math.sin(angle * 8) * 3
        const x = centerX + Math.cos(angle) * (r + ripple)
        const y = centerY + Math.sin(angle) * (r + ripple)
        if (angle === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 + (1 - r / (size / 2)) * 0.3})`
      ctx.stroke()
    }

    // Draw global optimum target at center (0, 0)
    ctx.beginPath()
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI)
    ctx.fillStyle = '#10b981'
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Map x, y from [-5.12, 5.12] to canvas coordinates
    const mapCoord = (val: number) => {
      const clamped = Math.max(-5.12, Math.min(5.12, val))
      return centerX + (clamped / 5.12) * (size / 2 - 20)
    }

    // Draw population individuals as dots
    population.forEach((chr) => {
      const x = chr.metadata?.x ?? 0
      const y = chr.metadata?.y ?? 0
      const cx = mapCoord(x)
      const cy = mapCoord(y)

      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, 2 * Math.PI)
      ctx.fillStyle = '#38bdf8'
      ctx.fill()
    })

    // Highlight best individual
    if (bestIndividual) {
      const bx = mapCoord(bestIndividual.metadata?.x ?? 0)
      const by = mapCoord(bestIndividual.metadata?.y ?? 0)

      ctx.beginPath()
      ctx.arc(bx, by, 6, 0, 2 * Math.PI)
      ctx.fillStyle = '#fbbf24'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }, [population, bestIndividual])

  const bestX = bestIndividual?.metadata?.x ?? 0
  const bestY = bestIndividual?.metadata?.y ?? 0
  const bestR = bestIndividual?.metadata?.rawRastrigin ?? 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between items-center">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center gap-2">
          <Mountain className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            Rastrigin 2D Multimodal Surface
          </h3>
        </div>
        <span className="text-[10px] font-mono text-amber-400 font-bold">
          Optimum: (0, 0)
        </span>
      </div>

      <div className="relative border border-slate-800 rounded-xl overflow-hidden shadow-inner my-auto">
        <canvas ref={canvasRef} style={{ width: 320, height: 320 }} className="block" />
      </div>

      <div className="w-full flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/80">
        <span className="text-slate-400">
          Best: (x: <strong className="text-cyan-300">{bestX}</strong>, y: <strong className="text-cyan-300">{bestY}</strong>)
        </span>
        <span className="text-amber-400 font-bold">
          R(x,y) = {bestR}
        </span>
      </div>
    </div>
  )
}
