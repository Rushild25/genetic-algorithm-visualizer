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

    ctx.clearRect(0, 0, width, height)

    // Draw background grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 0.5
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

    // Draw tour lines for best individual
    if (bestIndividual && bestIndividual.genes.length >= 2) {
      ctx.beginPath()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 2.5
      ctx.shadowColor = '#10b981'
      ctx.shadowBlur = 8

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
      // Glow circle
      ctx.beginPath()
      ctx.arc(c.x, c.y, 7, 0, 2 * Math.PI)
      ctx.fillStyle = '#6366f1'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()

      // City label
      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(c.name, c.x, c.y - 11)
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
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg flex flex-col justify-between">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-2 mb-2 gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
            TSP Interactive Tour Canvas
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
            Click canvas to add city
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-400">
            Tour: {tourDist} px
          </span>
          <select
            onChange={(e) => onSelectPreset(e.target.value)}
            className="bg-slate-800 text-slate-300 text-xs rounded px-2 py-1 border border-slate-700 focus:outline-none"
            defaultValue="circular12"
          >
            <option value="circular12">Preset: Circular 12</option>
            <option value="usCities10">Preset: US Cities 10</option>
            <option value="random14">Preset: Random 14</option>
          </select>
        </div>
      </div>

      <div className="relative mx-auto border border-slate-800 rounded-lg overflow-hidden bg-slate-950 cursor-crosshair">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          style={{ width: 500, height: 360 }}
          className="block"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Click anywhere on the map to add cities dynamically!</span>
        <span className="font-mono text-cyan-300 font-bold">{cities.length} Cities</span>
      </div>
    </div>
  )
}
