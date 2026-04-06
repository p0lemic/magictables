import type { AccessoryId, Screen, UnicornColor, UnicornEquipped } from '../types'
import { UNICORN_COLOR_HEX, ACCESSORY_LABEL, ACCESSORY_UNLOCK_HINT } from '../types'
import { useGameStore } from '../store/gameStore'
import UnicornAvatar from '../components/UnicornAvatar'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

const COLORS: UnicornColor[] = ['white', 'lavender', 'pink', 'mint', 'yellow', 'sky']
const COLOR_LABEL: Record<UnicornColor, string> = {
  white: 'Blanca', lavender: 'Lila', pink: 'Rosa', mint: 'Menta', yellow: 'Amarilla', sky: 'Celeste',
}

const ACCESSORIES: Array<{ id: AccessoryId; slot: keyof UnicornEquipped; emoji: string }> = [
  { id: 'rainbow-horn',    slot: 'horn',  emoji: '🌈' },
  { id: 'golden-wings',   slot: 'wings', emoji: '🪽' },
  { id: 'flower-crown',   slot: 'horn',  emoji: '🌸' },
  { id: 'magic-cape',     slot: 'cape',  emoji: '🧣' },
  { id: 'glitter-sparkle', slot: 'horn', emoji: '✨' },
]

export default function UnicornCustomizer({ onNavigate }: Props) {
  const { unicorn, equipAccessory } = useGameStore()
  const { equipped, unlockedAccessories } = unicorn

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
        <h2 className="text-3xl font-black text-magic-purple">Mi unicornio</h2>
      </div>

      {/* Preview */}
      <div className="relative z-10">
        <UnicornAvatar equipped={equipped} size={180} floating />
      </div>

      {/* Body color */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🎨 Color del cuerpo</p>
        <div className="flex gap-3 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => equipAccessory('bodyColor', c)}
              className={`
                w-11 h-11 rounded-full border-4 transition-all active:scale-90
                ${equipped.bodyColor === c ? 'border-magic-purple scale-110 shadow-lg' : 'border-white shadow'}
              `}
              style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
              title={COLOR_LABEL[c]}
            />
          ))}
        </div>
      </div>

      {/* Mane color */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🌈 Color de la melena</p>
        <div className="flex gap-3 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => equipAccessory('maneColor', c)}
              className={`
                w-11 h-11 rounded-full border-4 transition-all active:scale-90
                ${equipped.maneColor === c ? 'border-magic-purple scale-110 shadow-lg' : 'border-white shadow'}
              `}
              style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
              title={COLOR_LABEL[c]}
            />
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🦄 Accesorios</p>
        <div className="flex flex-col gap-2">
          {ACCESSORIES.map(({ id, slot, emoji }) => {
            const unlocked = unlockedAccessories.includes(id)
            const isEquipped = equipped[slot] === id

            return (
              <button
                key={id}
                disabled={!unlocked}
                onClick={() => unlocked && equipAccessory(slot, isEquipped ? '' : id)}
                className={`
                  flex items-center gap-3 p-3 rounded-xl border-2 transition-all
                  ${unlocked
                    ? isEquipped
                      ? 'bg-magic-purple/10 border-magic-purple active:scale-95'
                      : 'bg-white border-gray-200 active:scale-95'
                    : 'bg-gray-50 border-gray-100 opacity-50'}
                `}
              >
                <span className="text-2xl">{unlocked ? emoji : '🔒'}</span>
                <div className="flex flex-col items-start">
                  <span className={`font-bold ${unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                    {ACCESSORY_LABEL[id]}
                  </span>
                  {!unlocked && (
                    <span className="text-xs text-gray-400">{ACCESSORY_UNLOCK_HINT[id]}</span>
                  )}
                  {unlocked && isEquipped && (
                    <span className="text-xs text-magic-purple font-bold">¡Puesto!</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-4" />
    </div>
  )
}
