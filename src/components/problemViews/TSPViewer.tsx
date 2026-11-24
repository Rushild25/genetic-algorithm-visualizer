import React, { useRef, useEffect } from 'react'
import { MapPin } from 'lucide-react'
import type { City, Chromosome } from '../../types'

interface TSPViewerProps {
  cities: City[]
  bestIndividual: Chromosome | null
  onAddCity: (city: City) => void
  onSelectPreset: (presetKey: string) => void
}

export const TSPViewer: React.FC<TSPViewerProps> = ({
  cities,
  bestIndividual,
  onAddCity,
  onSelectPreset
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const width = 500
    const height = 360

    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)

    // Pitch black background
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    // Draw cyber grid
    ctx.strokeStyle = 'rgba(0, 255, 102, 0.07)'
    ctx.lineWidth = 0.8
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    const cityMap = new Map<number, City>()
    cities.forEach(c => cityMap.set(c.id, c))

    // Draw tour lines for best individual with intense neon green glow
    if (bestIndividual && bestIndividual.genes.length >= 2) {
      ctx.beginPath()
      ctx.strokeStyle = '#00ff66'
      ctx.lineWidth = 2.5
      ctx.shadowColor = '#00ff66'
      ctx.shadowBlur = 14

      const genes = bestIndividual.genes
      for (let i = 0; i < genes.length; i++) {
        const c1 = cityMap.get(Number(genes[i]))
        const c2 = cityMap.get(Number(genes[(i + 1) % genes.length]))
        if (c1 && c2) {
          if (i === 0) ctx.moveTo(c1.x, c1.y)
          ctx.lineTo(c2.x, c2.y)
        }
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Draw city nodes
    cities.forEach((c) => {
      // Outer neon glow
      ctx.save()
      ctx.shadowColor = '#00ff66'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(c.x, c.y, 6.5, 0, 2 * Math.PI)
      ctx.fillStyle = '#00ff66'
      ctx.fill()
      ctx.restore()

      // Inner dark core with white point
      ctx.beginPath()
      ctx.arc(c.x, c.y, 3, 0, 2 * Math.PI)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      // City label
      ctx.fillStyle = '#e2e8f0'
      ctx.font = 'bold 10px monospace'
      ctx.textAlign = 'center'
      ctx.shadowColor = '#000000'
      ctx.shadowBlur = 4
      ctx.fillText(c.name, c.x, c.y - 10)
      ctx.shadowBlur = 0
    })
  }, [cities, bestIndividual])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = Math.round(e.clientX - rect.left)
    const y = Math.round(e.clientY - rect.top)

    const newId = cities.length > 0 ? Math.max(...cities.map(c => c.id)) + 1 : 0
    const newCity: City = {
      id: newId,
      name: `City ${newId}`,
      x,
      y
    }
    onAddCity(newCity)
  }

  const tourDist = bestIndividual?.metadata?.distance || 0

  return (
    <div className="bg-[#030504] border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,255,102,0.08)] flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between border-b border-emerald-950/80 pb-3 mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.2)]">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase flex items-center gap-2">
              TSP Interactive Tour Canvas
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">
              Order Crossover (OX1) Optimization
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#00ff66] bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]">
            Tour: {tourDist} px
          </span>
          <select
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-black text-[#00ff66] text-xs font-mono rounded-lg px-2.5 py-1 border border-emerald-500/40 focus:outline-none focus:border-[#00ff66] cursor-pointer"
            defaultValue="circular12"
          >
            <option value="circular12" className="bg-black text-[#00ff66]">Preset: Circular 12</option>
            <option value="usCities10" className="bg-black text-[#00ff66]">Preset: US Cities 10</option>
            <option value="random14" className="bg-black text-[#00ff66]">Preset: Random 14</option>
          </select>
        </div>
      </div>

      <div className="relative mx-auto border border-emerald-500/30 rounded-xl overflow-hidden bg-black cursor-crosshair shadow-[0_0_20px_rgba(0,255,102,0.06)]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{ width: 500, height: 360 }}
          className="block"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-emerald-950/80 mt-3 font-mono">
        <span className="text-emerald-400/80">✦ Click anywhere on the map to add cities dynamically!</span>
        <span className="text-[#00ff66] font-bold">{cities.length} Cities</span>
      </div>
    </div>
  )
}
