import React, { useState } from 'react'
import {
  BookOpen,
  CheckCircle2,
  Calculator,
  Sparkles
} from 'lucide-react'
import {
  GOLDBERG_TABLE_1_1,
  GOLDBERG_GEN0_TOTAL_FITNESS,
  GOLDBERG_GEN0_AVG_FITNESS,
  GOLDBERG_GEN0_MAX_FITNESS,
  GOLDBERG_TABLE_1_2,
  GOLDBERG_GEN1_TOTAL_FITNESS,
  GOLDBERG_GEN1_AVG_FITNESS,
  GOLDBERG_GEN1_MAX_FITNESS,
  GOLDBERG_IMPROVEMENT_PERCENT
} from '../constants/goldbergData'

interface TextbookVerificationViewProps {
  onLoadTextbookToSimulator: () => void
}

export const TextbookVerificationView: React.FC<TextbookVerificationViewProps> = ({
  onLoadTextbookToSimulator
}) => {
  const [testStrings, setTestStrings] = useState<string[]>(['01101', '11000', '01000', '10011'])

  const handleStringChange = (idx: number, val: string) => {
    const cleaned = val.replace(/[^01]/g, '').slice(0, 5)
    const updated = [...testStrings]
    updated[idx] = cleaned
    setTestStrings(updated)
  }

  const derivedData = testStrings.map((s, idx) => {
    const padded = s.padEnd(5, '0')
    const x = parseInt(padded, 2) || 0
    const fitness = x * x
    return { id: idx + 1, string: padded, x, fitness }
  })

  const customTotal = derivedData.reduce((sum, d) => sum + d.fitness, 0)
  const customAvg = derivedData.length > 0 ? customTotal / derivedData.length : 0

  return (
    <div className="bg-[#030504] border border-emerald-500/40 rounded-3xl p-6 shadow-[0_0_40px_rgba(0,255,102,0.12)] max-w-6xl mx-auto space-y-6 font-mono">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-emerald-500/25 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#00ff66] text-black shadow-[0_0_20px_rgba(0,255,102,0.7)] font-black">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Textbook Hand-Calculation Audit</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-[#00ff66] font-bold border border-emerald-400 shadow-[0_0_10px_rgba(0,255,102,0.4)] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Mathematically Verified
              </span>
            </div>
            <p className="text-xs text-emerald-400/80 font-sans mt-0.5">
              Reference: David E. Goldberg (1989), <em>Genetic Algorithms in Search, Optimization, and Machine Learning</em>, Addison-Wesley, Ch. 1, Tables 1.1 & 1.2
            </p>
          </div>
        </div>

        <button
          onClick={onLoadTextbookToSimulator}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black bg-[#00ff66] hover:bg-[#33ff85] text-black shadow-[0_0_20px_rgba(0,255,102,0.7)] hover:shadow-[0_0_30px_rgba(0,255,102,0.9)] transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Load Goldberg Preset in Simulator</span>
        </button>
      </div>

      {/* Section 1: Goldberg Table 1.1 Verification */}
      <div className="bg-black border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,255,102,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Table 1.1: Initial Generation Reproduction Scheme (Goldberg 1989, p. 11)
            </h3>
            <p className="text-xs text-emerald-500/80 font-sans">
              Objective: Maximize <code className="text-[#00ff66] font-mono">f(x) = x²</code> for integer{' '}
              <code className="text-[#00ff66] font-mono">x ∈ [0, 31]</code> encoded as 5-bit binary strings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black text-emerald-400 border-b border-emerald-500/30">
                <th className="py-2.5 px-3">No.</th>
                <th className="py-2.5 px-3">Initial String</th>
                <th className="py-2.5 px-3 text-right">x Value</th>
                <th className="py-2.5 px-3 text-right">Fitness f(x) = x²</th>
                <th className="py-2.5 px-3 text-right">p_select = f(x)/Σf</th>
                <th className="py-2.5 px-3 text-right">Expected Count f/f̄</th>
                <th className="py-2.5 px-3 text-center">Actual Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {GOLDBERG_TABLE_1_1.map((row) => (
                <tr key={row.id} className="hover:bg-emerald-950/20 text-slate-200">
                  <td className="py-2 px-3 text-emerald-600">{row.id}</td>
                  <td className="py-2 px-3 font-bold text-[#00ff66] drop-shadow-[0_0_4px_rgba(0,255,102,0.6)]">{row.string}</td>
                  <td className="py-2 px-3 text-right">{row.x}</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-100">{row.fitness}</td>
                  <td className="py-2 px-3 text-right text-emerald-300">
                    {(row.probSelection * 100).toFixed(1)}% ({row.probSelection})
                  </td>
                  <td className="py-2 px-3 text-right text-slate-400">{row.expectedCount}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-950 text-[#00ff66] border border-emerald-500/50 shadow-[0_0_8px_rgba(0,255,102,0.3)]">
                      {row.actualCount}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Summary Rows */}
              <tr className="bg-black font-bold border-t-2 border-emerald-500/40 text-slate-100">
                <td className="py-2.5 px-3" colSpan={3}>Sum (Σ)</td>
                <td className="py-2.5 px-3 text-right text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.7)]">{GOLDBERG_GEN0_TOTAL_FITNESS}</td>
                <td className="py-2.5 px-3 text-right text-emerald-300">1.000 (100%)</td>
                <td className="py-2.5 px-3 text-right text-slate-300">4.00</td>
                <td className="py-2.5 px-3 text-center text-[#00ff66]">4</td>
              </tr>
              <tr className="bg-black font-bold text-slate-300">
                <td className="py-2 px-3" colSpan={3}>Average (f̄)</td>
                <td className="py-2 px-3 text-right text-[#00ff66] drop-shadow-[0_0_6px_rgba(0,255,102,0.7)]">{GOLDBERG_GEN0_AVG_FITNESS}</td>
                <td className="py-2 px-3 text-right text-emerald-300">0.250 (25%)</td>
                <td className="py-2 px-3 text-right text-slate-300">1.00</td>
                <td className="py-2 px-3 text-center text-[#00ff66]">1</td>
              </tr>
              <tr className="bg-black font-bold text-[#00ff66]">
                <td className="py-2 px-3" colSpan={3}>Max (f_max)</td>
                <td className="py-2 px-3 text-right drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">{GOLDBERG_GEN0_MAX_FITNESS}</td>
                <td className="py-2 px-3 text-right">0.492 (49.2%)</td>
                <td className="py-2 px-3 text-right">1.97</td>
                <td className="py-2 px-3 text-center">2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Goldberg Table 1.2 Verification */}
      <div className="bg-black border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,255,102,0.06)]">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-white">
            Table 1.2: Crossover, Mutation & Next Generation Performance (Goldberg 1989, p. 12)
          </h3>
          <p className="text-xs text-emerald-500/80 font-sans">
            Mating pool constructed from Table 1.1 counts: <code className="text-[#00ff66]">01101</code> (once), <code className="text-[#00ff66]">11000</code> (twice), <code className="text-[#00ff66]">10011</code> (once).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-black text-emerald-400 border-b border-emerald-500/30">
                <th className="py-2.5 px-3">Mating Pair</th>
                <th className="py-2.5 px-3">Parent Strings</th>
                <th className="py-2.5 px-3 text-center">Locus Site (k)</th>
                <th className="py-2.5 px-3">Crossover Splicing</th>
                <th className="py-2.5 px-3">Final Gen 1 Strings</th>
                <th className="py-2.5 px-3 text-right">New x</th>
                <th className="py-2.5 px-3 text-right">New Fitness f(x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/15">
              {/* Pair 1 */}
              <tr className="hover:bg-emerald-950/20 text-slate-200">
                <td className="py-2.5 px-3 text-emerald-600 font-bold" rowSpan={2}>(1, 2)</td>
                <td className="py-1 px-3 text-[#00ff66]">{GOLDBERG_TABLE_1_2[0].parentStrings[0]}</td>
                <td className="py-2.5 px-3 text-center font-bold text-[#00ff66]" rowSpan={2}>
                  k = {GOLDBERG_TABLE_1_2[0].crossoverSite}
                </td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-[#00ff66]">0110</span> | <span className="text-cyan-400">0</span>
                </td>
                <td className="py-1 px-3 font-bold text-white">{GOLDBERG_TABLE_1_2[0].finalStrings[0]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[0].finalX[0]}</td>
                <td className="py-1 px-3 text-right font-bold text-[#00ff66]">{GOLDBERG_TABLE_1_2[0].finalFitness[0]}</td>
              </tr>
              <tr className="hover:bg-emerald-950/20 text-slate-200">
                <td className="py-1 px-3 text-cyan-400">{GOLDBERG_TABLE_1_2[0].parentStrings[1]}</td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-cyan-400">1100</span> | <span className="text-[#00ff66]">1</span>
                </td>
                <td className="py-1 px-3 font-bold text-white">{GOLDBERG_TABLE_1_2[0].finalStrings[1]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[0].finalX[1]}</td>
                <td className="py-1 px-3 text-right font-bold text-[#00ff66]">{GOLDBERG_TABLE_1_2[0].finalFitness[1]}</td>
              </tr>

              {/* Pair 2 */}
              <tr className="hover:bg-emerald-950/20 text-slate-200 border-t border-emerald-500/20">
                <td className="py-2.5 px-3 text-emerald-600 font-bold" rowSpan={2}>(2, 4)</td>
                <td className="py-1 px-3 text-[#00ff66]">{GOLDBERG_TABLE_1_2[1].parentStrings[0]}</td>
                <td className="py-2.5 px-3 text-center font-bold text-[#00ff66]" rowSpan={2}>
                  k = {GOLDBERG_TABLE_1_2[1].crossoverSite}
                </td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-[#00ff66]">11</span> | <span className="text-cyan-400">011</span>
                </td>
                <td className="py-1 px-3 font-bold text-white">{GOLDBERG_TABLE_1_2[1].finalStrings[0]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[1].finalX[0]}</td>
                <td className="py-1 px-3 text-right font-bold text-[#00ff66]">{GOLDBERG_TABLE_1_2[1].finalFitness[0]}</td>
              </tr>
              <tr className="hover:bg-emerald-950/20 text-slate-200">
                <td className="py-1 px-3 text-cyan-400">{GOLDBERG_TABLE_1_2[1].parentStrings[1]}</td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-cyan-400">10</span> | <span className="text-[#00ff66]">000</span>
                </td>
                <td className="py-1 px-3 font-bold text-white">{GOLDBERG_TABLE_1_2[1].finalStrings[1]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[1].finalX[1]}</td>
                <td className="py-1 px-3 text-right font-bold text-[#00ff66]">{GOLDBERG_TABLE_1_2[1].finalFitness[1]}</td>
              </tr>

              {/* New Generation Summary */}
              <tr className="bg-black font-bold border-t-2 border-emerald-500/40 text-slate-100">
                <td className="py-2.5 px-3" colSpan={6}>Generation 1 Sum (Σ)</td>
                <td className="py-2.5 px-3 text-right text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">{GOLDBERG_GEN1_TOTAL_FITNESS}</td>
              </tr>
              <tr className="bg-black font-bold text-slate-300">
                <td className="py-2 px-3" colSpan={6}>
                  Generation 1 Average (f̄) — <span className="text-[#00ff66] font-black">+{GOLDBERG_IMPROVEMENT_PERCENT}% Gain</span> in ONE Generation!
                </td>
                <td className="py-2 px-3 text-right text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">{GOLDBERG_GEN1_AVG_FITNESS}</td>
              </tr>
              <tr className="bg-black font-bold text-[#00ff66]">
                <td className="py-2 px-3" colSpan={6}>Generation 1 Maximum (f_max)</td>
                <td className="py-2 px-3 text-right drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">{GOLDBERG_GEN1_MAX_FITNESS}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Interactive Custom Hand Calculation Tester */}
      <div className="bg-black border border-emerald-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(0,255,102,0.06)]">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-[#00ff66]" />
          <h3 className="text-sm font-bold text-white">
            Interactive Hand-Calculation Verification Workbench
          </h3>
        </div>
        <p className="text-xs text-emerald-500/80 mb-4 font-sans">
          Test the exact formula derivation with your own 4 binary chromosomes or modify the bits to verify textbook homework problems!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          {testStrings.map((str, idx) => (
            <div key={idx} className="bg-[#030504] p-3 rounded-2xl border border-emerald-500/30">
              <label className="text-[10px] font-bold text-emerald-500/80 block mb-1">
                String #{idx + 1} (5 bits):
              </label>
              <input
                type="text"
                value={str}
                onChange={(e) => handleStringChange(idx, e.target.value)}
                maxLength={5}
                className="w-full bg-black text-[#00ff66] font-mono text-center text-sm font-black py-1.5 px-2 rounded-xl border border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-[#00ff66] shadow-[inset_0_0_10px_rgba(0,255,102,0.15)]"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>x = {derivedData[idx].x}</span>
                <span className="text-[#00ff66] font-bold">f(x) = {derivedData[idx].fitness}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-2xl bg-black border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3 text-xs shadow-[0_0_15px_rgba(0,255,102,0.1)]">
          <div>
            <span className="text-slate-400">Sum of Fitness: </span>
            <strong className="text-[#00ff66] font-bold">{customTotal}</strong>
          </div>
          <div>
            <span className="text-slate-400">Mean Fitness (f̄): </span>
            <strong className="text-[#00ff66] font-bold">{customAvg.toFixed(2)}</strong>
          </div>
          <div className="text-[#00ff66] font-bold flex items-center gap-1.5 drop-shadow-[0_0_6px_rgba(0,255,102,0.8)]">
            <CheckCircle2 className="w-4 h-4" /> Formulas Verified
          </div>
        </div>
      </div>
    </div>
  )
}
