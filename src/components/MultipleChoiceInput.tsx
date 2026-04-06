interface Props {
  options: number[]   // 4 values: [correct, wrong1, wrong2, wrong3] shuffled
  onAnswer: (n: number) => void
  disabled?: boolean
}

const BUTTON_COLORS = [
  'bg-magic-purple text-white border-purple-700',
  'bg-magic-pink   text-white border-pink-700',
  'bg-amber-400    text-white border-amber-600',
  'bg-teal-400     text-white border-teal-600',
]

export default function MultipleChoiceInput({ options, onAnswer, disabled = false }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => !disabled && onAnswer(opt)}
          disabled={disabled}
          className={`
            ${BUTTON_COLORS[i % BUTTON_COLORS.length]}
            h-20 rounded-2xl border-b-4 text-3xl font-black
            transition-all active:scale-95 active:border-b-2 active:translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
