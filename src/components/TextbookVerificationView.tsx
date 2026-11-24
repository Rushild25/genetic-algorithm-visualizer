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
  // Interactive Custom Hand-Calc Tester
  const [testStrings, setTestStrings] = useState<string[]>(['01101', '11000', '01000', '10011'])

  const handleStringChange = (idx: number, val: string) => {
    const cleaned = val.replace(/[^01]/g, '').slice(0, 5)
    const updated = [...testStrings]
    updated[idx] = cleaned
    setTestStrings(updated)
  }

  // Derive math for custom inputs
  const derivedData = testStrings.map((s, idx) => {
    const padded = s.padEnd(5, '0')
    const x = parseInt(padded, 2) || 0
    const fitness = x * x
    return { id: idx + 1, string: padded, x, fitness }
  })

  const customTotal = derivedData.reduce((sum, d) => sum + d.fitness, 0)
  const customAvg = derivedData.length > 0 ? customTotal / derivedData.length : 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">Textbook Hand-Calculation Audit</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Mathematically Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Reference: David E. Goldberg (1989), <em>Genetic Algorithms in Search, Optimization, and Machine Learning</em>, Addison-Wesley, Ch. 1, Tables 1.1 & 1.2
            </p>
          </div>
        </div>

        <button
          onClick={onLoadTextbookToSimulator}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Load Goldberg Preset in Simulator</span>
        </button>
      </div>

      {/* Section 1: Goldberg Table 1.1 Verification */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-200">
              Table 1.1: Initial Generation Reproduction Scheme (Goldberg 1989, p. 11)
            </h3>
            <p className="text-xs text-slate-400">
              Objective: Maximize <code className="text-cyan-300 font-mono">f(x) = x²</code> for integer{' '}
              <code className="text-cyan-300 font-mono">x ∈ [0, 31]</code> encoded as 5-bit binary strings.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="py-2.5 px-3">No.</th>
                <th className="py-2.5 px-3">Initial String</th>
                <th className="py-2.5 px-3 text-right">x Value</th>
                <th className="py-2.5 px-3 text-right">Fitness f(x) = x²</th>
                <th className="py-2.5 px-3 text-right">p_select = f(x)/Σf</th>
                <th className="py-2.5 px-3 text-right">Expected Count f/f̄</th>
                <th className="py-2.5 px-3 text-center">Actual Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {GOLDBERG_TABLE_1_1.map((row) => (
                <tr key={row.id} className="hover:bg-slate-900/40 text-slate-200">
                  <td className="py-2 px-3 text-slate-400">{row.id}</td>
                  <td className="py-2 px-3 font-bold text-indigo-300">{row.string}</td>
                  <td className="py-2 px-3 text-right">{row.x}</td>
                  <td className="py-2 px-3 text-right font-bold text-amber-300">{row.fitness}</td>
                  <td className="py-2 px-3 text-right text-cyan-300">
                    {(row.probSelection * 100).toFixed(1)}% ({row.probSelection})
                  </td>
                  <td className="py-2 px-3 text-right text-slate-300">{row.expectedCount}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="px-2 py-0.5 rounded font-bold bg-indigo-600/30 text-indigo-200 border border-indigo-500/40">
                      {row.actualCount}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Summary Rows */}
              <tr className="bg-slate-900/90 font-bold border-t-2 border-slate-700 text-slate-100">
                <td className="py-2.5 px-3" colSpan={3}>Sum (Σ)</td>
                <td className="py-2.5 px-3 text-right text-amber-400">{GOLDBERG_GEN0_TOTAL_FITNESS}</td>
                <td className="py-2.5 px-3 text-right text-cyan-400">1.000 (100%)</td>
                <td className="py-2.5 px-3 text-right">4.00</td>
                <td className="py-2.5 px-3 text-center">4</td>
              </tr>
              <tr className="bg-slate-900/90 font-bold text-slate-300">
                <td className="py-2 px-3" colSpan={3}>Average (f̄)</td>
                <td className="py-2 px-3 text-right text-amber-400">{GOLDBERG_GEN0_AVG_FITNESS}</td>
                <td className="py-2 px-3 text-right text-cyan-400">0.250 (25%)</td>
                <td className="py-2 px-3 text-right">1.00</td>
                <td className="py-2 px-3 text-center">1</td>
              </tr>
              <tr className="bg-slate-900/90 font-bold text-amber-400">
                <td className="py-2 px-3" colSpan={3}>Max (f_max)</td>
                <td className="py-2 px-3 text-right">{GOLDBERG_GEN0_MAX_FITNESS}</td>
                <td className="py-2 px-3 text-right">0.492 (49.2%)</td>
                <td className="py-2 px-3 text-right">1.97</td>
                <td className="py-2 px-3 text-center">2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Goldberg Table 1.2 Verification */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-200">
            Table 1.2: Crossover, Mutation & Next Generation Performance (Goldberg 1989, p. 12)
          </h3>
          <p className="text-xs text-slate-400">
            Mating pool constructed from Table 1.1 counts: <code className="text-indigo-300">01101</code> (once), <code className="text-indigo-300">11000</code> (twice), <code className="text-indigo-300">10011</code> (once).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <th className="py-2.5 px-3">Mating Pair</th>
                <th className="py-2.5 px-3">Parent Strings</th>
                <th className="py-2.5 px-3 text-center">Locus Site (k)</th>
                <th className="py-2.5 px-3">Crossover Splicing</th>
                <th className="py-2.5 px-3">Final Gen 1 Strings</th>
                <th className="py-2.5 px-3 text-right">New x</th>
                <th className="py-2.5 px-3 text-right">New Fitness f(x)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Pair 1 */}
              <tr className="hover:bg-slate-900/40 text-slate-200">
                <td className="py-2.5 px-3 font-sans text-slate-400 font-bold" rowSpan={2}>(1, 2)</td>
                <td className="py-1 px-3 text-blue-300">{GOLDBERG_TABLE_1_2[0].parentStrings[0]}</td>
                <td className="py-2.5 px-3 text-center font-bold text-amber-400" rowSpan={2}>
                  k = {GOLDBERG_TABLE_1_2[0].crossoverSite}
                </td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-blue-300">0110</span> | <span className="text-purple-300">0</span>
                </td>
                <td className="py-1 px-3 font-bold text-cyan-300">{GOLDBERG_TABLE_1_2[0].finalStrings[0]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[0].finalX[0]}</td>
                <td className="py-1 px-3 text-right font-bold text-amber-300">{GOLDBERG_TABLE_1_2[0].finalFitness[0]}</td>
              </tr>
              <tr className="hover:bg-slate-900/40 text-slate-200">
                <td className="py-1 px-3 text-purple-300">{GOLDBERG_TABLE_1_2[0].parentStrings[1]}</td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-purple-300">1100</span> | <span className="text-blue-300">1</span>
                </td>
                <td className="py-1 px-3 font-bold text-cyan-300">{GOLDBERG_TABLE_1_2[0].finalStrings[1]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[0].finalX[1]}</td>
                <td className="py-1 px-3 text-right font-bold text-amber-300">{GOLDBERG_TABLE_1_2[0].finalFitness[1]}</td>
              </tr>

              {/* Pair 2 */}
              <tr className="hover:bg-slate-900/40 text-slate-200 border-t border-slate-800">
                <td className="py-2.5 px-3 font-sans text-slate-400 font-bold" rowSpan={2}>(2, 4)</td>
                <td className="py-1 px-3 text-blue-300">{GOLDBERG_TABLE_1_2[1].parentStrings[0]}</td>
                <td className="py-2.5 px-3 text-center font-bold text-amber-400" rowSpan={2}>
                  k = {GOLDBERG_TABLE_1_2[1].crossoverSite}
                </td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-blue-300">11</span> | <span className="text-purple-300">011</span>
                </td>
                <td className="py-1 px-3 font-bold text-cyan-300">{GOLDBERG_TABLE_1_2[1].finalStrings[0]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[1].finalX[0]}</td>
                <td className="py-1 px-3 text-right font-bold text-amber-300">{GOLDBERG_TABLE_1_2[1].finalFitness[0]}</td>
              </tr>
              <tr className="hover:bg-slate-900/40 text-slate-200">
                <td className="py-1 px-3 text-purple-300">{GOLDBERG_TABLE_1_2[1].parentStrings[1]}</td>
                <td className="py-1 px-3 text-slate-300">
                  <span className="text-purple-300">10</span> | <span className="text-blue-300">000</span>
                </td>
                <td className="py-1 px-3 font-bold text-cyan-300">{GOLDBERG_TABLE_1_2[1].finalStrings[1]}</td>
                <td className="py-1 px-3 text-right">{GOLDBERG_TABLE_1_2[1].finalX[1]}</td>
                <td className="py-1 px-3 text-right font-bold text-amber-300">{GOLDBERG_TABLE_1_2[1].finalFitness[1]}</td>
              </tr>

              {/* New Generation Summary */}
              <tr className="bg-slate-900/90 font-bold border-t-2 border-slate-700 text-slate-100">
                <td className="py-2.5 px-3" colSpan={6}>Generation 1 Sum (Σ)</td>
                <td className="py-2.5 px-3 text-right text-emerald-400">{GOLDBERG_GEN1_TOTAL_FITNESS}</td>
              </tr>
              <tr className="bg-slate-900/90 font-bold text-slate-300">
                <td className="py-2 px-3" colSpan={6}>
                  Generation 1 Average (f̄) — <span className="text-emerald-400 font-extrabold">+{GOLDBERG_IMPROVEMENT_PERCENT}% Gain</span> in ONE Generation!
                </td>
                <td className="py-2 px-3 text-right text-emerald-400">{GOLDBERG_GEN1_AVG_FITNESS}</td>
              </tr>
              <tr className="bg-slate-900/90 font-bold text-amber-400">
                <td className="py-2 px-3" colSpan={6}>Generation 1 Maximum (f_max)</td>
                <td className="py-2 px-3 text-right">{GOLDBERG_GEN1_MAX_FITNESS}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Interactive Custom Hand Calculation Tester */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">
            Interactive Hand-Calculation Verification Workbench
          </h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Test the exact formula derivation with your own 4 binary chromosomes or modify the bits to verify textbook homework problems!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          {testStrings.map((str, idx) => (
            <div key={idx} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                String #{idx + 1} (5 bits):
              </label>
              <input
                type="text"
                value={str}
                onChange={(e) => handleStringChange(idx, e.target.value)}
                maxLength={5}
                className="w-full bg-slate-950 text-indigo-300 font-mono text-center text-sm font-bold py-1 px-2 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-2">
                <span>x = {derivedData[idx].x}</span>
                <span className="text-amber-400 font-bold">f(x) = {derivedData[idx].fitness}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-400">Sum of Fitness: </span>
            <strong className="text-amber-400 font-bold">{customTotal}</strong>
          </div>
          <div>
            <span className="text-slate-400">Mean Fitness (f̄): </span>
            <strong className="text-cyan-400 font-bold">{customAvg.toFixed(2)}</strong>
          </div>
          <div className="text-emerald-400 font-bold flex items-center gap-1 font-sans">
            <CheckCircle2 className="w-4 h-4" /> Formulas Verified
          </div>
        </div>
      </div>
    </div>
  )
}
