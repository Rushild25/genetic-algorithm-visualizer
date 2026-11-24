import React from 'react'
import { Dna, BookOpen, HelpCircle, Volume2, VolumeX, RotateCcw, Award } from 'lucide-react'
import type { ProblemType } from '../types'

interface NavbarProps {
  currentProblem: ProblemType
  onSelectProblem: (problem: ProblemType) => void
  onReset: () => void
  soundEnabled: boolean
  onToggleSound: () => void
  onOpenQuiz: () => void
  onOpenTutorial: () => void
  showTextbookView: boolean
  onToggleTextbookView: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProblem,
  onSelectProblem,
  onReset,
  soundEnabled,
  onToggleSound,
  onOpenQuiz,
  onOpenTutorial,
  showTextbookView,
  onToggleTextbookView
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white">EvoAlgo</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Genetic Algorithm Studio
              </span>
            </div>
            <p className="text-xs text-slate-400">Interactive Pedagogical Optimization Visualizer</p>
          </div>
        </div>

        {/* Problem Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">Problem:</span>
          <select
            value={currentProblem}
            onChange={(e) => onSelectProblem(e.target.value as ProblemType)}
            className="bg-slate-800 text-slate-200 text-sm font-medium border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer hover:bg-slate-750"
          >
            <option value="goldberg">📘 Goldberg Benchmark [f(x) = x² Textbook]</option>
            <option value="tsp">🗺️ Travelling Salesperson Problem (TSP)</option>
            <option value="weasel">🐒 Target String ("Dawkins' Weasel")</option>
            <option value="knapsack">🎒 0/1 Knapsack (Constrained Packing)</option>
            <option value="landscape">🏔️ Rastrigin Multimodal 2D Surface</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Textbook Verification Mode Toggle */}
          <button
            onClick={onToggleTextbookView}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              showTextbookView
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-amber-300 border-amber-500/40 hover:bg-slate-750'
            }`}
            title="Goldberg 1989 Table 1.1 & 1.2 Verification"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Textbook Audit</span>
          </button>

          {/* Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-indigo-300 border border-indigo-500/30 hover:bg-slate-750 transition-all cursor-pointer"
            title="Interactive Knowledge Check Quiz"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quiz</span>
          </button>

          {/* Tutorial Guide */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 transition-all cursor-pointer"
            title="Guide & Pedagogical Concepts"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg text-xs border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio Synthesizer'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 transition-all hover:text-rose-400 cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Rushild25/genetic-algorithm-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 transition-all hover:text-white"
            title="View Source on GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
