import { useEffect, useRef, useState } from 'react'
import type { AccessoryId, Screen } from '../types'
import { ACCESSORY_LABEL } from '../types'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import StarRating from '../components/StarRating'
import ConfettiAnimation from '../components/ConfettiAnimation'
import UnicornAvatar from '../components/UnicornAvatar'
import StarParticles from '../components/StarParticles'

interface Props {
  table: number
  correct: number
  mode: 'free' | 'progressive'
  onNavigate: (screen: Screen) => void
}

export default function SessionResults({ table, correct, mode, onNavigate }: Props) {
  const { recordSessionResult, unicorn } = useGameStore()
  const sound = useSound()
  const [newAccessories, setNewAccessories] = useState<AccessoryId[]>([])
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [starsAnimated, setStarsAnimated] = useState(false)
  const recorded = useRef(false)

  const stars = correct >= 10 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0

  useEffect(() => {
    if (recorded.current) return
    recorded.current = true

    sound.enable()
    const unlocked = recordSessionResult(table, correct)
    setNewAccessories(unlocked)

    setTimeout(() => {
      setStarsAnimated(true)
      if (stars > 0) {
        sound.playStarFanfare()
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2500)
      }
    }, 400)

    if (unlocked.length > 0) {
      setTimeout(() => setShowUnlockModal(true), 2200)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center justify-center gap-6 p-6 font-nunito relative overflow-hidden">
      <StarParticles />
      <ConfettiAnimation active={confetti} count={40} />

      {/* Title */}
      <h2 className="relative z-10 text-4xl font-black text-magic-purple">
        {correct >= 8 ? '¡Increíble! 🎉' : correct >= 5 ? '¡Muy bien! 😊' : '¡Sigue practicando! 💪'}
      </h2>

      {/* Score */}
      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3 border-2 border-magic-purple/30 w-full max-w-xs">
        <p className="text-lg font-bold text-gray-500">Tabla del {table}</p>
        <p className="text-6xl font-black text-magic-purple">{correct}/10</p>
        <StarRating stars={starsAnimated ? stars : 0} size="lg" animated={starsAnimated} />
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <UnicornAvatar equipped={unicorn.equipped} size={130} floating />
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'practice-session', table, mode })}
          className="w-full h-16 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
            text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🔄 Repetir
        </button>

        {mode === 'free' ? (
          <button
            onClick={() => onNavigate({ name: 'free-mode' })}
            className="w-full h-16 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
              text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
          >
            🎯 Otra tabla
          </button>
        ) : (
          <button
            onClick={() => onNavigate({ name: 'progressive-mode' })}
            className="w-full h-16 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
              text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
          >
            🗺️ Ver mapa
          </button>
        )}

        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="w-full h-14 bg-white text-magic-purple rounded-2xl border-2 border-b-4 border-magic-purple
            text-xl font-black shadow active:scale-95 transition-all"
        >
          🏠 Inicio
        </button>
      </div>

      {/* Accessory unlock modal */}
      {showUnlockModal && newAccessories.length > 0 && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowUnlockModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-xs w-full flex flex-col items-center gap-4 shadow-2xl border-2 border-magic-yellow"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-2xl font-black text-magic-purple text-center">
              🎉 ¡Nuevo accesorio!
            </p>
            <div className="animate-spin-slow text-6xl">✨</div>
            {newAccessories.map(a => (
              <p key={a} className="text-xl font-black text-amber-500 text-center">
                🦄 {ACCESSORY_LABEL[a]}
              </p>
            ))}
            <button
              onClick={() => setShowUnlockModal(false)}
              className="mt-2 w-full h-14 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
                text-xl font-black active:scale-95 transition-all"
            >
              ¡Genial!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
