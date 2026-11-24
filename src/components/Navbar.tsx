import React from 'react'
import { Dna, BookOpen, HelpCircle, Volume2, VolumeX, RotateCcw, Award, Video } from 'lucide-react'
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
    <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-emerald-500/25 px-4 py-2.5 shadow-[0_4px_25px_rgba(0,255,102,0.08)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00ff66] flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.6)] text-black font-black">
            <Dna className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center">
                Evo<span className="text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">Algo</span>
              </h1>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-[#00ff66] font-mono font-bold border border-emerald-500/40 shadow-[0_0_10px_rgba(0,255,102,0.2)]">
                v2.0 • Cyber Lab
              </span>
            </div>
            <p className="text-xs text-emerald-400/70 font-mono tracking-tight">
              Interactive Genetic Algorithm Studio
            </p>
          </div>
        </div>

        {/* Problem Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-500/80 hidden sm:inline">
            Problem:
          </span>
          <select
            value={currentProblem}
            onChange={(e) => onSelectProblem(e.target.value as ProblemType)}
            className="bg-black text-[#00ff66] text-xs sm:text-sm font-mono font-bold border border-emerald-500/40 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 shadow-[0_0_12px_rgba(0,255,102,0.15)] transition-all cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_18px_rgba(0,255,102,0.25)]"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
              showTextbookView
                ? 'bg-[#00ff66] text-black border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.8)]'
                : 'bg-black text-[#00ff66] border-emerald-500/40 hover:bg-emerald-950/40 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)]'
            }`}
            title="Goldberg 1989 Table 1.1 & 1.2 Verification"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Textbook Audit</span>
          </button>

          {/* Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-black text-[#00ff66] border border-emerald-500/40 hover:bg-emerald-950/40 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(0,255,102,0.25)] transition-all cursor-pointer"
            title="Interactive Knowledge Check Quiz"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quiz</span>
          </button>

          {/* Tutorial Guide */}
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-medium bg-black text-slate-300 border border-emerald-500/30 hover:border-emerald-400 hover:text-[#00ff66] hover:shadow-[0_0_12px_rgba(0,255,102,0.2)] transition-all cursor-pointer"
            title="Guide & Pedagogical Concepts"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Demo Video Walkthrough */}
          <a
            href="https://drive.google.com/file/d/1zkIF-SmBye56OW1tr2mXBxnLcNtmywB2/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-emerald-950/80 text-[#00ff66] border border-emerald-500/40 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(0,255,102,0.3)] transition-all cursor-pointer"
            title="Watch 3-5 Minute Demo Video Walkthrough on Google Drive"
          >
            <Video className="w-3.5 h-3.5 text-[#00ff66]" />
            <span className="hidden md:inline">Demo Video</span>
          </a>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-xl text-xs border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-emerald-950/80 text-[#00ff66] border-emerald-400 shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                : 'bg-black text-slate-400 border-emerald-500/25 hover:border-emerald-400 hover:text-[#00ff66]'
            }`}
            title={soundEnabled ? 'Mute Audio' : 'Enable Audio Synthesizer'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            className="p-2 rounded-xl text-xs bg-black text-slate-400 border border-emerald-500/25 hover:border-rose-500 hover:text-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all cursor-pointer"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/Rushild25/genetic-algorithm-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-xs bg-black text-slate-300 border border-emerald-500/25 hover:border-emerald-400 hover:text-[#00ff66] hover:shadow-[0_0_15px_rgba(0,255,102,0.25)] transition-all"
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
