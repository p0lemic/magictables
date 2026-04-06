import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import { isTableUnlocked } from '../utils/game'
import ProgressMap from '../components/ProgressMap'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function ProgressiveMode({ onNavigate }: Props) {
  const { tables } = useGameStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-5 p-6 font-nunito relative overflow-hidden">
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
        <h2 className="text-3xl font-black text-magic-purple">Modo progresivo</h2>
      </div>

      <p className="relative z-10 text-base font-bold text-pink-500 -mt-2 text-center px-4">
        Consigue ≥2 estrellas en una tabla para desbloquear la siguiente 🔓
      </p>

      <div className="relative z-10 w-full overflow-y-auto no-scrollbar pb-8">
        <ProgressMap
          tables={tables}
          isUnlocked={(n) => isTableUnlocked(n, tables)}
          onSelectTable={(n) =>
            onNavigate({ name: 'practice-session', table: n, mode: 'progressive' })
          }
        />
      </div>
    </div>
  )
}
