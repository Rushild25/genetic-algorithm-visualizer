import React from 'react'
import { HelpCircle, X, Play, Microscope, BookOpen, Layers } from 'lucide-react'

interface TutorialModalProps {
  isOpen: boolean
  onClose: () => void
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020503] border border-emerald-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-[0_0_60px_rgba(0,255,102,0.2)] animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-950/80 sticky top-0 bg-[#020503] z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 text-[#00ff66] border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">How to Use EvoAlgo</h3>
              <p className="text-xs text-slate-400">Your interactive guide to Evolutionary Computing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00ff66] hover:bg-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content sections */}
        <div className="py-4 space-y-5 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1 */}
          <div className="flex gap-3 p-3 rounded-xl bg-black border border-emerald-500/20">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shrink-0 h-fit">
              <Play className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">1. Two Stepping Granularities (VisuAlgo Inspired)</h4>
              <p>
                You can advance the algorithm in two ways:
                <br />• <strong className="text-[#00ff66]">Step Phase (Micro-Step):</strong> Advances through each of the 5 biological sub-phases: <em>1. Evaluate Fitness</em> → <em>2. Selection (Roulette Wheel)</em> → <em>3. Recombination (Crossover)</em> → <em>4. Mutation (Bit Flip)</em> → <em>5. Survivor Selection & Elitism</em>.
                <br />• <strong className="text-[#00ff66]">Step Gen (Macro-Step):</strong> Advances 1 full generation at a time.
                <br />• <strong className="text-[#00ff66]">Auto Play:</strong> Runs continuously with adjustable speed (0.5x to 4x).
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-3 p-3 rounded-xl bg-black border border-emerald-500/20">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shrink-0 h-fit">
              <Microscope className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">2. Interactive DNA Microscope & Mutation Sandbox</h4>
              <p>
                Click <em>any row</em> in the population table to open the Microscope! You can manually click and flip any bit/allele in real-time to observe the immediate effect on phenotype and fitness, demonstrating <strong className="text-[#00ff66]">epistasis</strong> and <strong className="text-[#00ff66]">Hamming cliffs</strong>.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-3 p-3 rounded-xl bg-black border border-emerald-500/20">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shrink-0 h-fit">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">3. Goldberg (1989) Textbook Verification</h4>
              <p>
                Click <strong className="text-[#00ff66]">"Textbook Audit"</strong> in the top bar to inspect David E. Goldberg's classic 1989 benchmark <code className="text-[#00ff66] font-mono">f(x) = x²</code>. Every number (probabilities, mating pool, crossover loci, and the famous +49.9% fitness leap) is reproduced and mathematically verified down to the last digit!
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-3 p-3 rounded-xl bg-black border border-emerald-500/20">
            <div className="p-2 rounded-lg bg-emerald-950/80 text-[#00ff66] border border-emerald-500/30 shrink-0 h-fit">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">4. 5 Rich Problem Domains</h4>
              <p>
                Switch problems using the header dropdown:
                <br />• <strong>Goldberg Benchmark:</strong> The gold standard textbook benchmark.
                <br />• <strong>TSP (Travelling Salesperson):</strong> Click the 2D map to add custom cities and watch tours untangle using Order Crossover (OX1).
                <br />• <strong>Dawkins' Weasel:</strong> Target string synthesis with character match diffs.
                <br />• <strong>0/1 Knapsack:</strong> Constrained packing with weight penalty bar.
                <br />• <strong>Rastrigin 2D Landscape:</strong> Multimodal continuous terrain with swarming convergence.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-emerald-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-black bg-[#00ff66] hover:bg-[#1aff75] text-black shadow-[0_0_20px_rgba(0,255,102,0.5)] transition-all cursor-pointer"
          >
            Got It! Start Exploring
          </button>
        </div>
      </div>
    </div>
  )
}
