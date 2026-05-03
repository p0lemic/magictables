import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import { useTranslation } from '../i18n'
import StarParticles from '../components/StarParticles'
import CreatureAvatar from '../components/CreatureAvatar'

interface Props {
  onNavigate: (screen: Screen) => void
  onLogout: () => void
}

export default function Home({ onNavigate, onLogout }: Props) {
  const { tables, unicorn } = useGameStore()
  const { t, toggle } = useTranslation()

  const totalStars = Object.values(tables).reduce((sum, t) => sum + t.stars, 0)
  const totalHardStars = Object.values(tables).reduce((sum, t) => sum + (t.hardStars ?? 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center justify-center gap-6 p-6 relative overflow-hidden font-nunito">
      <StarParticles />

      {/* Header */}
      <div className="relative z-10 w-full max-w-xs flex flex-col gap-1">
        <div className="flex justify-end">
          <button
            onClick={toggle}
            className="px-3 py-1.5 bg-white/70 rounded-xl border border-magic-purple/30
              text-xs font-bold text-magic-purple/70 active:scale-95 transition-all shadow-sm"
          >
            {t.langToggleLabel}
          </button>
        </div>
        <h1 className="text-5xl font-black text-magic-purple drop-shadow-sm leading-none text-center">
          {t.home.title}
        </h1>
        <p className="text-lg font-bold text-pink-500 text-center">{t.home.subtitle}</p>
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <CreatureAvatar state={unicorn} size={160} floating />
      </div>

      {/* Stars count */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 border-2 border-magic-yellow shadow-md flex gap-4">
        <span className="text-2xl font-black text-amber-500">
          ★ {totalStars}/30
        </span>
        <span className="text-2xl font-black text-blue-400">
          ★ {totalHardStars}/30
        </span>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'free-mode' })}
          className="w-full h-20 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          {t.home.practiceBtn}
        </button>

        <button
          onClick={() => onNavigate({ name: 'progressive-mode' })}
          className="w-full h-20 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          {t.home.progressiveBtn}
        </button>

        <button
          onClick={() => onNavigate({ name: 'table-reference' })}
          className="w-full h-20 bg-teal-400 text-white rounded-2xl border-b-4 border-teal-600
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          {t.home.tablesBtn}
        </button>

        <button
          onClick={() => onNavigate({ name: 'unicorn-customizer' })}
          className="w-full h-20 bg-amber-400 text-white rounded-2xl border-b-4 border-amber-600
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          {t.home.creatureBtn}
        </button>

        <button
          onClick={onLogout}
          className="w-full py-3 bg-white/70 rounded-xl border border-magic-purple/30
            text-sm font-bold text-magic-purple/70 active:scale-95 transition-all shadow-sm"
        >
          👤 {t.home.changeUser}
        </button>
      </div>
    </div>
  )
}
