import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import StarParticles from '../components/StarParticles'
import UnicornAvatar from '../components/UnicornAvatar'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function Home({ onNavigate }: Props) {
  const { tables, unicorn } = useGameStore()

  const totalStars = Object.values(tables).reduce((sum, t) => sum + t.stars, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center justify-center gap-6 p-6 relative overflow-hidden font-nunito">
      <StarParticles />

      {/* Header */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-black text-magic-purple drop-shadow-sm">
          Tablas Mágicas
        </h1>
        <p className="text-xl font-bold text-pink-500 mt-1">✨ Aprende con unicornios ✨</p>
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <UnicornAvatar equipped={unicorn.equipped} size={160} floating />
      </div>

      {/* Stars count */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-2 border-2 border-magic-yellow shadow-md">
        <span className="text-2xl font-black text-amber-500">
          ⭐ {totalStars} / 30 estrellas
        </span>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'free-mode' })}
          className="w-full h-20 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🎯 Práctica libre
        </button>

        <button
          onClick={() => onNavigate({ name: 'progressive-mode' })}
          className="w-full h-20 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🗺️ Modo progresivo
        </button>

        <button
          onClick={() => onNavigate({ name: 'unicorn-customizer' })}
          className="w-full h-20 bg-amber-400 text-white rounded-2xl border-b-4 border-amber-600
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🦄 Mi unicornio
        </button>
      </div>
    </div>
  )
}
