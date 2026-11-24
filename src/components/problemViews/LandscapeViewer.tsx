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

    // Draw stylized Rastrigin contour rings on pitch black
    const centerX = size / 2
    const centerY = size / 2

    const bgGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, size / 2)
    bgGrad.addColorStop(0, '#002611') // Deep emerald center at optimum (0, 0)
    bgGrad.addColorStop(0.4, '#010f07')
    bgGrad.addColorStop(1, '#000000') // Pitch black outer edge
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, size, size)

    // Draw wavy contour lines representing Rastrigin ripples in neon green
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
      ctx.strokeStyle = `rgba(0, 255, 102, ${0.12 + (1 - r / (size / 2)) * 0.25})`
      ctx.stroke()
    }

    // Draw global optimum target at center (0, 0)
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI)
    ctx.fillStyle = '#00ff66'
    ctx.shadowColor = '#00ff66'
    ctx.shadowBlur = 12
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.restore()

    // Map x, y from [-5.12, 5.12] to canvas coordinates
    const mapCoord = (val: number) => {
      const clamped = Math.max(-5.12, Math.min(5.12, val))
      return centerX + (clamped / 5.12) * (size / 2 - 20)
    }

    // Draw population individuals as neon dots
    population.forEach((chr) => {
      const x = chr.metadata?.x ?? 0
      const y = chr.metadata?.y ?? 0
      const cx = mapCoord(x)
      const cy = mapCoord(y)

      ctx.beginPath()
      ctx.arc(cx, cy, 3, 0, 2 * Math.PI)
      ctx.fillStyle = 'rgba(0, 255, 102, 0.7)'
      ctx.fill()
    })

    // Highlight best individual with glowing aura
    if (bestIndividual) {
      const bx = mapCoord(bestIndividual.metadata?.x ?? 0)
      const by = mapCoord(bestIndividual.metadata?.y ?? 0)

      ctx.save()
      ctx.beginPath()
      ctx.arc(bx, by, 7, 0, 2 * Math.PI)
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = '#00ff66'
      ctx.shadowBlur = 16
      ctx.fill()
      ctx.strokeStyle = '#00ff66'
      ctx.lineWidth = 2.5
      ctx.stroke()
      ctx.restore()
    }
  }, [population, bestIndividual])

  const bestX = bestIndividual?.metadata?.x ?? 0
  const bestY = bestIndividual?.metadata?.y ?? 0
  const bestR = bestIndividual?.metadata?.rawRastrigin ?? 0

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between items-center">
      <div className="w-full flex items-center justify-between border-b border-emerald-950/80 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.2)]">
            <Mountain className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wider uppercase">
            Rastrigin 2D Multimodal Surface
          </h3>
        </div>
        <span className="text-[10px] font-mono text-[#00ff66] font-bold bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/30 shadow-[0_0_8px_rgba(0,255,102,0.15)]">
          Optimum: (0, 0)
        </span>
      </div>

      <div className="relative border border-emerald-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,255,102,0.06)] bg-black my-auto">
        <canvas ref={canvasRef} style={{ width: 320, height: 320 }} className="block" />
      </div>

      <div className="w-full flex items-center justify-between text-[11px] font-mono pt-3 border-t border-emerald-950/80 mt-3">
        <span className="text-slate-400">
          Best: (x: <strong className="text-[#00ff66]">{bestX}</strong>, y: <strong className="text-[#00ff66]">{bestY}</strong>)
        </span>
        <span className="text-[#00ff66] font-bold">
          R(x,y) = {bestR}
        </span>
      </div>
    </div>
  )
}
