import type { AccessoryId, Screen, UnicornColor, UnicornEquipped } from '../types'
import {
  UNICORN_COLOR_HEX, COLOR_LABEL, ACCESSORY_LABEL, ACCESSORY_UNLOCK_HINT,
  BASE_COLORS, HARD_COLORS, HARD_COLOR_UNLOCK_HINT,
} from '../types'
import { useGameStore } from '../store/gameStore'
import UnicornAvatar from '../components/UnicornAvatar'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

const EASY_ACCESSORIES: Array<{ id: AccessoryId; slot: keyof UnicornEquipped; emoji: string }> = [
  { id: 'rainbow-horn',    slot: 'horn',  emoji: '🌈' },
  { id: 'star-bow',        slot: 'horn',  emoji: '⭐' },
  { id: 'fairy-wings',     slot: 'wings', emoji: '🧚' },
  { id: 'flower-crown',    slot: 'horn',  emoji: '🌸' },
  { id: 'magic-shoes',     slot: 'cape',  emoji: '👟' },
  { id: 'princess-crown',  slot: 'horn',  emoji: '👑' },
  { id: 'golden-wings',    slot: 'wings', emoji: '🪽' },
  { id: 'sparkle-tail',    slot: 'cape',  emoji: '💫' },
  { id: 'crystal-horn',    slot: 'horn',  emoji: '💎' },
  { id: 'rainbow-mane',    slot: 'cape',  emoji: '🌊' },
  { id: 'magic-cape',      slot: 'cape',  emoji: '🧣' },
  { id: 'diamond-crown',   slot: 'horn',  emoji: '💍' },
  { id: 'phoenix-wings',   slot: 'wings', emoji: '🔥' },
  { id: 'glitter-sparkle', slot: 'horn',  emoji: '✨' },
]

const HARD_ACCESSORIES: Array<{ id: AccessoryId; slot: keyof UnicornEquipped; emoji: string }> = [
  { id: 'flame-horn',    slot: 'horn',  emoji: '🔥' },
  { id: 'dragon-wings',  slot: 'wings', emoji: '🐉' },
  { id: 'star-tiara',    slot: 'horn',  emoji: '⭐' },
  { id: 'galaxy-cape',   slot: 'cape',  emoji: '🌌' },
  { id: 'thunder-wings', slot: 'wings', emoji: '⚡' },
  { id: 'ice-crown',     slot: 'horn',  emoji: '❄️' },
  { id: 'cosmic-horn',   slot: 'horn',  emoji: '💫' },
]

function ColorPicker({
  label,
  colors,
  unlockedColors,
  equippedColor,
  onSelect,
}: {
  label: string
  colors: UnicornColor[]
  unlockedColors: Set<UnicornColor>
  equippedColor: UnicornColor
  onSelect: (c: UnicornColor) => void
}) {
  return (
    <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
      <p className="font-black text-magic-purple mb-3">{label}</p>
      <div className="flex gap-3 flex-wrap">
        {colors.map(c => {
          const isLocked = !unlockedColors.has(c)
          const isEquipped = equippedColor === c
          return (
            <button
              key={c}
              disabled={isLocked}
              onClick={() => !isLocked && onSelect(c)}
              title={isLocked ? HARD_COLOR_UNLOCK_HINT[c] : COLOR_LABEL[c]}
              className={`
                relative w-11 h-11 rounded-full border-4 transition-all active:scale-90
                ${isEquipped ? 'border-magic-purple scale-110 shadow-lg' : 'border-white shadow'}
                ${isLocked ? 'opacity-40' : ''}
              `}
              style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
            >
              {isLocked && (
                <span className="absolute inset-0 flex items-center justify-center text-sm">🔒</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AccessoryList({
  accessories,
  unlockedAccessories,
  equipped,
  onEquip,
}: {
  accessories: typeof EASY_ACCESSORIES
  unlockedAccessories: Set<AccessoryId>
  equipped: UnicornEquipped
  onEquip: (slot: keyof UnicornEquipped, id: AccessoryId | '') => void
}) {
  return (
    <div className="flex flex-col gap-2">
      {accessories.map(({ id, slot, emoji }) => {
        const unlocked = unlockedAccessories.has(id)
        const isEquipped = equipped[slot] === id
        return (
          <button
            key={id}
            disabled={!unlocked}
            onClick={() => unlocked && onEquip(slot, isEquipped ? '' : id)}
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
  )
}

export default function UnicornCustomizer({ onNavigate }: Props) {
  const { unicorn, equipAccessory } = useGameStore()
  const { equipped, unlockedAccessories, unlockedColors } = unicorn

  const unlockedAccessorySet = new Set(unlockedAccessories)
  const unlockedColorSet = new Set<UnicornColor>([...BASE_COLORS, ...unlockedColors])

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
      <ColorPicker
        label="🎨 Color del cuerpo"
        colors={[...BASE_COLORS, ...HARD_COLORS]}
        unlockedColors={unlockedColorSet}
        equippedColor={equipped.bodyColor}
        onSelect={c => equipAccessory('bodyColor', c)}
      />

      {/* Mane color */}
      <ColorPicker
        label="🌈 Color de la melena"
        colors={[...BASE_COLORS, ...HARD_COLORS]}
        unlockedColors={unlockedColorSet}
        equippedColor={equipped.maneColor}
        onSelect={c => equipAccessory('maneColor', c)}
      />

      {/* Easy accessories */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🦄 Accesorios</p>
        <AccessoryList
          accessories={EASY_ACCESSORIES}
          unlockedAccessories={unlockedAccessorySet}
          equipped={equipped}
          onEquip={(slot, id) => equipAccessory(slot, id)}
        />
      </div>

      {/* Hard mode accessories */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-orange-300 shadow">
        <p className="font-black text-orange-500 mb-1">🔥 Modo Difícil</p>
        <p className="text-xs text-gray-400 mb-3">Accesorios exclusivos del modo difícil</p>
        <AccessoryList
          accessories={HARD_ACCESSORIES}
          unlockedAccessories={unlockedAccessorySet}
          equipped={equipped}
          onEquip={(slot, id) => equipAccessory(slot, id)}
        />
      </div>

      <div className="h-4" />
    </div>
  )
}
