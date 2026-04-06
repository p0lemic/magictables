import { useState, useEffect, useCallback } from 'react'
import type { Screen, SessionQuestion } from '../types'
import { generateSession, generateOrderedSession, generateWrongOptions } from '../utils/game'
import { useSound } from '../hooks/useSound'
import MultipleChoiceInput from '../components/MultipleChoiceInput'
import NumericKeyboard from '../components/NumericKeyboard'
import StarParticles from '../components/StarParticles'

interface Props {
  table: number
  mode: 'free' | 'progressive'
  ordered?: boolean
  difficulty?: 'easy' | 'hard'
  onNavigate: (screen: Screen) => void
}

type FeedbackState = 'none' | 'correct' | 'wrong'

function shuffleOptions(correct: number): number[] {
  const wrongs = generateWrongOptions(correct)
  const all = [correct, ...wrongs]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

export default function PracticeSession({ table, mode, ordered = false, difficulty = 'easy', onNavigate }: Props) {
  const sound = useSound()

  const [questions] = useState<SessionQuestion[]>(() =>
    ordered ? generateOrderedSession(table) : generateSession(table)
  )
  const [current, setCurrent] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>('none')
  const [options] = useState<number[][]>(() =>
    questions.map(q => shuffleOptions(q.answer))
  )

  const q: SessionQuestion = questions[current]

  // Enable sound on first render (user is already interacting)
  useEffect(() => { sound.enable() }, [])

  const handleAnswer = useCallback((answer: number) => {
    if (feedback !== 'none') return

    const isCorrect = answer === q.answer

    if (isCorrect) {
      sound.playCorrect()
      setFeedback('correct')
      setCorrect(prev => prev + 1)
    } else {
      sound.playWrong()
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (current + 1 >= 10) {
        const finalCorrect = isCorrect ? correct + 1 : correct
        onNavigate({ name: 'session-results', table, correct: finalCorrect, mode, difficulty })
      } else {
        setCurrent(prev => prev + 1)
        setFeedback('none')
      }
    }, isCorrect ? 800 : 1500)
  }, [feedback, q, correct, current, table, mode, sound, onNavigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-5 p-6 font-nunito relative overflow-hidden">
      <StarParticles />

      {/* Header row: back button + progress label */}
      <div className="relative z-10 w-full max-w-md flex items-center gap-3 pt-2">
        <button
          onClick={() => onNavigate(mode === 'free' ? { name: 'free-mode' } : { name: 'progressive-mode' })}
          className="w-12 h-12 bg-white rounded-xl border-2 border-b-4 border-magic-purple
            text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center shrink-0"
        >
          ←
        </button>
        <div className="flex-1 font-bold text-magic-purple text-lg">Tabla del {table}</div>
        <span className="font-bold text-magic-purple">{current + 1} / 10</span>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-md -mt-2">
        <div className="h-4 bg-white/60 rounded-full overflow-hidden border border-magic-purple/30">
          <div
            className="h-full bg-magic-purple rounded-full transition-all duration-500"
            style={{ width: `${((current) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className={`
          relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8
          flex flex-col items-center gap-4 border-2
          ${feedback === 'correct' ? 'border-green-400 animate-bounce-in' : ''}
          ${feedback === 'wrong'   ? 'border-red-400 animate-shake' : ''}
          ${feedback === 'none'    ? 'border-magic-purple/30' : ''}
        `}
      >
        <p className="text-2xl font-bold text-gray-500">¿Cuánto es?</p>
        <p className="text-6xl font-black text-magic-purple">
          {q.a} × {q.b} = ?
        </p>

        {feedback === 'correct' && (
          <p className="text-4xl animate-bounce-in">✅ ¡Correcto!</p>
        )}
        {feedback === 'wrong' && (
          <p className="text-2xl text-red-500 font-bold">
            ❌ Era <span className="text-3xl font-black">{q.answer}</span>
          </p>
        )}
      </div>

      {/* Input */}
      <div className="relative z-10 w-full flex justify-center">
        {difficulty === 'hard' ? (
          <NumericKeyboard
            key={current}
            onAnswer={handleAnswer}
            disabled={feedback !== 'none'}
          />
        ) : (
          <MultipleChoiceInput
            options={options[current]}
            onAnswer={handleAnswer}
            disabled={feedback !== 'none'}
          />
        )}
      </div>

      {/* Score so far */}
      <div className="relative z-10 mt-auto">
        <span className="text-lg font-bold text-magic-purple/70">
          Aciertos: {correct} / {current}
        </span>
      </div>
    </div>
  )
}
