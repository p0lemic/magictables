import type { TableProgress } from '../types'
import StarRating from './StarRating'

interface Props {
  tables: Record<number, TableProgress>
  isUnlocked: (n: number) => boolean
  onSelectTable: (n: number) => void
}

export default function ProgressMap({ tables, isUnlocked, onSelectTable }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 w-full px-4">
      {Array.from({ length: 10 }, (_, i) => {
        const n = i + 1
        const unlocked = isUnlocked(n)
        const progress = tables[n]

        return (
          <button
            key={n}
            onClick={() => unlocked && onSelectTable(n)}
            disabled={!unlocked}
            className={`
              w-full max-w-xs flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
              ${unlocked
                ? 'bg-white border-magic-purple shadow-md active:scale-95 cursor-pointer'
                : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'}
            `}
          >
            {/* Table number badge */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0
              ${unlocked ? 'bg-magic-purple text-white' : 'bg-gray-300 text-gray-500'}
            `}>
              {unlocked ? n : '🔒'}
            </div>

            {/* Label + stars */}
            <div className="flex flex-col items-start gap-1">
              <span className="font-bold text-lg text-gray-700">
                Tabla del {n}
              </span>
              {unlocked && (
                <StarRating stars={progress?.stars ?? 0} size="sm" />
              )}
            </div>

            {/* Arrow */}
            {unlocked && (
              <span className="ml-auto text-magic-purple text-2xl">→</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
