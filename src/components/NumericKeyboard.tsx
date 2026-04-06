import { useState } from 'react'

interface Props {
  onAnswer: (n: number) => void
  disabled?: boolean
}

export default function NumericKeyboard({ onAnswer, disabled = false }: Props) {
  const [input, setInput] = useState('')

  function press(digit: string) {
    if (disabled) return
    if (input.length >= 3) return   // max 3 digits (100)
    setInput(prev => prev + digit)
  }

  function del() {
    setInput(prev => prev.slice(0, -1))
  }

  function confirm() {
    if (!input || disabled) return
    onAnswer(parseInt(input, 10))
    setInput('')
  }

  const keys = ['7','8','9','4','5','6','1','2','3']

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs px-4">
      {/* Display */}
      <div className="w-full h-16 bg-white rounded-2xl border-2 border-magic-purple flex items-center justify-center text-4xl font-black text-magic-purple shadow-inner">
        {input || <span className="text-gray-300">?</span>}
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => press(k)}
            disabled={disabled}
            className="h-16 bg-white rounded-xl border-2 border-b-4 border-magic-purple text-2xl font-black text-magic-purple
              active:scale-95 active:border-b-2 transition-all shadow-sm disabled:opacity-40"
          >
            {k}
          </button>
        ))}
        {/* Bottom row: delete, 0, confirm */}
        <button
          onClick={del}
          disabled={disabled}
          className="h-16 bg-gray-100 rounded-xl border-2 border-b-4 border-gray-400 text-2xl
            active:scale-95 active:border-b-2 transition-all shadow-sm disabled:opacity-40"
        >
          ⌫
        </button>
        <button
          onClick={() => press('0')}
          disabled={disabled}
          className="h-16 bg-white rounded-xl border-2 border-b-4 border-magic-purple text-2xl font-black text-magic-purple
            active:scale-95 active:border-b-2 transition-all shadow-sm disabled:opacity-40"
        >
          0
        </button>
        <button
          onClick={confirm}
          disabled={disabled || !input}
          className="h-16 bg-magic-pink rounded-xl border-2 border-b-4 border-pink-700 text-2xl
            active:scale-95 active:border-b-2 transition-all shadow-sm text-white font-black
            disabled:opacity-40"
        >
          ✓
        </button>
      </div>
    </div>
  )
}
