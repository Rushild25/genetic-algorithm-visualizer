import React, { useState } from 'react'
import { Award, CheckCircle2, XCircle, X, RotateCcw, ChevronRight } from 'lucide-react'
import { QUIZ_QUESTIONS } from '../constants/problemPresets'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)

  const currentQ = QUIZ_QUESTIONS[currentIndex]
  const isAnswered = selectedAnswers[currentQ.id] !== undefined
  const selectedOption = selectedAnswers[currentQ.id]

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return
    setSelectedAnswers({ ...selectedAnswers, [currentQ.id]: idx })
  }

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setSelectedAnswers({})
    setCurrentIndex(0)
    setShowResults(false)
  }

  const score = Object.entries(selectedAnswers).filter(([qId, ansIdx]) => {
    const q = QUIZ_QUESTIONS.find((item) => item.id === Number(qId))
    return q && q.correctIndex === ansIdx
  }).length

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#020503] border border-emerald-500/50 rounded-2xl max-w-xl w-full p-6 shadow-[0_0_60px_rgba(0,255,102,0.2)] animate-in fade-in zoom-in-95 duration-150 flex flex-col justify-between min-h-[440px]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 text-[#00ff66] border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Genetic Algorithm Mastery Quiz</h3>
              <p className="text-xs text-slate-400">Test your conceptual understanding of evolutionary search</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00ff66] hover:bg-black transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 flex-1 flex flex-col justify-between">
          {!showResults ? (
            <>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
                  <span>Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="text-[#00ff66] font-bold">Score: {score}</span>
                </div>

                <h4 className="text-sm font-semibold text-slate-100 mb-4 leading-snug">
                  {currentQ.question}
                </h4>

                {/* Options */}
                <div className="space-y-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isChosen = selectedOption === optIdx
                    const isCorrect = optIdx === currentQ.correctIndex

                    let optionClasses = 'bg-black/80 border-emerald-950/80 text-slate-300 hover:border-emerald-500/40 hover:text-[#00ff66]'
                    if (isAnswered) {
                      if (isCorrect) {
                        optionClasses = 'bg-emerald-950/90 border-emerald-400 text-[#00ff66] font-bold shadow-[0_0_15px_rgba(0,255,102,0.25)]'
                      } else if (isChosen) {
                        optionClasses = 'bg-rose-950/90 border-rose-500 text-rose-200'
                      } else {
                        optionClasses = 'opacity-30 border-emerald-950/40 text-slate-600'
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-2 cursor-pointer ${optionClasses}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#00ff66] shrink-0" />}
                        {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                      </button>
                    )
                  })}
                </div>

                {/* Explanation on answer */}
                {isAnswered && (
                  <div className="mt-4 p-3 rounded-xl bg-black border border-emerald-500/30 text-xs text-emerald-300 leading-relaxed animate-in fade-in font-sans">
                    <strong className="text-[#00ff66] block mb-0.5 font-bold uppercase tracking-wider text-[10px]">
                      Pedagogical Rationale:
                    </strong>
                    {currentQ.explanation}
                  </div>
                )}
              </div>

              {/* Next Button */}
              {isAnswered && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#00ff66] hover:bg-[#1aff75] text-black shadow-[0_0_20px_rgba(0,255,102,0.5)] transition-all cursor-pointer"
                  >
                    <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-400 flex items-center justify-center mx-auto text-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.4)]">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Quiz Completed!</h4>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-[#00ff66] text-base font-bold">{score}</strong> out of{' '}
                <strong className="text-white text-base">{QUIZ_QUESTIONS.length}</strong> (
                {Math.round((score / QUIZ_QUESTIONS.length) * 100)}%)
              </p>
              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-black border border-emerald-500/40 text-[#00ff66] hover:bg-emerald-950/60 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-black bg-[#00ff66] hover:bg-[#1aff75] text-black shadow-[0_0_20px_rgba(0,255,102,0.5)] transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
