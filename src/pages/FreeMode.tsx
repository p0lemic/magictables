import { useState } from 'react'
import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import StarRating from '../components/StarRating'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function FreeMode({ onNavigate }: Props) {
  const { tables } = useGameStore()
  const [ordered, setOrdered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-6 p-6 font-nunito relative overflow-hidden">
      <StarParticles />

      {/* Header */}
      <div className="relative z-10 w-full max-w-md flex items-center gap-3 pt-2">
        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="w-12 h-12 bg-white rounded-xl border-2 border-b-4 border-magic-purple
            text-2xl active:scale-95 transition-all shadow-sm flex items-center justify-center"
        >
          ←
        </button>
        <h2 className="text-3xl font-black text-magic-purple">Práctica libre</h2>
      </div>

      {/* Mode toggle */}
      <div className="relative z-10 flex bg-white rounded-2xl border-2 border-magic-purple p-1 gap-1 w-full max-w-md">
        <button
          onClick={() => setOrdered(false)}
          className={`flex-1 h-11 rounded-xl text-base font-black transition-all
            ${!ordered ? 'bg-magic-purple text-white shadow' : 'text-magic-purple'}`}
        >
          🔀 Aleatorio
        </button>
        <button
          onClick={() => setOrdered(true)}
          className={`flex-1 h-11 rounded-xl text-base font-black transition-all
            ${ordered ? 'bg-magic-purple text-white shadow' : 'text-magic-purple'}`}
        >
          🔢 En orden
        </button>
      </div>

      <p className="relative z-10 text-lg font-bold text-pink-500 -mt-2">
        ¿Qué tabla quieres practicar?
      </p>

      {/* Table grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1
          const progress = tables[n]
          return (
            <button
              key={n}
              onClick={() => onNavigate({ name: 'practice-session', table: n, mode: 'free', ordered })}
              className="bg-white rounded-2xl border-2 border-b-4 border-magic-purple p-4
                flex flex-col items-center gap-2 shadow-md
                active:scale-95 active:border-b-2 transition-all"
            >
              <span className="text-4xl font-black text-magic-purple">×{n}</span>
              <span className="text-sm font-bold text-gray-500">Tabla del {n}</span>
              <StarRating stars={progress?.stars ?? 0} size="sm" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
