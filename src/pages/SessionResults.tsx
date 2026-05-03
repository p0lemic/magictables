import { useEffect, useRef, useState } from 'react'
import type { AccessoryId, DragonAccessoryId, DragonColor, UnicornColor, Screen } from '../types'
import { UNICORN_COLOR_HEX, DRAGON_COLOR_HEX } from '../types'
import { useGameStore } from '../store/gameStore'
import { useSound } from '../hooks/useSound'
import { useTranslation } from '../i18n'
import StarRating from '../components/StarRating'
import ConfettiAnimation from '../components/ConfettiAnimation'
import CreatureAvatar from '../components/CreatureAvatar'
import StarParticles from '../components/StarParticles'

interface Props {
  table: number
  correct: number
  mode: 'free' | 'progressive'
  difficulty?: 'easy' | 'hard'
  onNavigate: (screen: Screen) => void
}

export default function SessionResults({ table, correct, mode, difficulty = 'easy', onNavigate }: Props) {
  const { recordSessionResult, unicorn } = useGameStore()
  const sound = useSound()
  const { t } = useTranslation()
  const [newAccessories, setNewAccessories] = useState<AccessoryId[]>([])
  const [newColors, setNewColors] = useState<UnicornColor[]>([])
  const [newDragonAccessories, setNewDragonAccessories] = useState<DragonAccessoryId[]>([])
  const [newDragonColors, setNewDragonColors] = useState<DragonColor[]>([])
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [starsAnimated, setStarsAnimated] = useState(false)
  const recorded = useRef(false)

  const stars = correct >= 10 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0

  useEffect(() => {
    if (recorded.current) return
    recorded.current = true

    sound.enable()
    const { accessories, colors, dragonAccessories, dragonColors } = recordSessionResult(table, correct, mode, difficulty)
    setNewAccessories(accessories)
    setNewColors(colors)
    setNewDragonAccessories(dragonAccessories)
    setNewDragonColors(dragonColors)

    setTimeout(() => {
      setStarsAnimated(true)
      if (mode === 'progressive' && stars > 0) {
        sound.playStarFanfare()
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2500)
      }
    }, 400)

    if (accessories.length > 0 || colors.length > 0 || dragonAccessories.length > 0 || dragonColors.length > 0) {
      setTimeout(() => setShowUnlockModal(true), 2200)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center justify-center gap-6 p-6 font-nunito relative overflow-hidden">
      <StarParticles />
      <ConfettiAnimation active={confetti} count={40} />

      {/* Title */}
      <h2 className="relative z-10 text-4xl font-black text-magic-purple">
        {t.sessionResults.title({ correct })}
      </h2>

      {/* Score */}
      <div className="relative z-10 bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3 border-2 border-magic-purple/30 w-full max-w-xs">
        <p className="text-lg font-bold text-gray-500">{t.sessionResults.table({ n: table })}</p>
        <p className="text-6xl font-black text-magic-purple">{correct}/10</p>
        {mode === 'progressive' && (
          <StarRating stars={starsAnimated ? stars : 0} size="lg" animated={starsAnimated} />
        )}
        {difficulty === 'hard' && (
          <span className="text-sm font-bold text-orange-500">{t.sessionResults.hardBadge}</span>
        )}
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <CreatureAvatar state={unicorn} size={130} floating />
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'practice-session', table, mode, difficulty })}
          className="w-full h-16 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
            text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          {t.sessionResults.repeat}
        </button>

        {mode === 'free' ? (
          <button
            onClick={() => onNavigate({ name: 'free-mode' })}
            className="w-full h-16 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
              text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
          >
            {t.sessionResults.anotherTable}
          </button>
        ) : (
          <button
            onClick={() => onNavigate({ name: 'progressive-mode' })}
            className="w-full h-16 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
              text-xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
          >
            {t.sessionResults.viewMap}
          </button>
        )}

        <button
          onClick={() => onNavigate({ name: 'home' })}
          className="w-full h-14 bg-white text-magic-purple rounded-2xl border-2 border-b-4 border-magic-purple
            text-xl font-black shadow active:scale-95 transition-all"
        >
          {t.sessionResults.home}
        </button>
      </div>

      {/* Accessory/color unlock modal */}
      {showUnlockModal && (newAccessories.length > 0 || newColors.length > 0 || newDragonAccessories.length > 0 || newDragonColors.length > 0) && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowUnlockModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-xs w-full flex flex-col items-center gap-4 shadow-2xl border-2 border-magic-yellow"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-2xl font-black text-magic-purple text-center">
              {t.sessionResults.newUnlock}
            </p>
            <div className="animate-spin-slow text-6xl">✨</div>
            {newAccessories.map(a => (
              <p key={a} className="text-xl font-black text-amber-500 text-center">
                🦄 {t.accessoryLabel[a]}
              </p>
            ))}
            {newColors.map(c => (
              <div key={c} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-200 shadow"
                  style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
                />
                <p className="text-xl font-black text-amber-500">
                  🎨 {t.colorLabel[c]}
                </p>
              </div>
            ))}
            {newDragonAccessories.map(a => (
              <p key={a} className="text-xl font-black text-emerald-500 text-center">
                🐉 {t.dragonAccessoryLabel[a]}
              </p>
            ))}
            {newDragonColors.map(c => (
              <div key={c} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-200 shadow"
                  style={{ backgroundColor: DRAGON_COLOR_HEX[c] }}
                />
                <p className="text-xl font-black text-emerald-500">
                  🐉 {t.dragonColorLabel[c]}
                </p>
              </div>
            ))}
            <button
              onClick={() => setShowUnlockModal(false)}
              className="mt-2 w-full h-14 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
                text-xl font-black active:scale-95 transition-all"
            >
              {t.sessionResults.great}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
