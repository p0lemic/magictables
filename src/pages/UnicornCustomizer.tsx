import type { AccessoryId, DragonAccessoryId, DragonColor, DragonEquipped, Screen, UnicornColor, UnicornEquipped } from '../types'
import {
  UNICORN_COLOR_HEX, BASE_COLORS, HARD_COLORS, HARD_COLOR_UNLOCK_HINT,
  DRAGON_COLOR_HEX, DRAGON_BASE_COLORS, DRAGON_HARD_COLORS, DRAGON_HARD_COLOR_UNLOCK_HINT,
} from '../types'
import { useGameStore } from '../store/gameStore'
import { useTranslation } from '../i18n'
import UnicornAvatar from '../components/UnicornAvatar'
import DragonAvatar from '../components/DragonAvatar'
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

const EASY_DRAGON_ACCESSORIES: Array<{ id: DragonAccessoryId; slot: keyof DragonEquipped; emoji: string }> = [
  { id: 'dragon-spike-horns',   slot: 'horns', emoji: '🔱' },
  { id: 'dragon-gem-horns',     slot: 'horns', emoji: '💎' },
  { id: 'dragon-crystal-wings', slot: 'wings', emoji: '🔷' },
  { id: 'dragon-back-spikes',   slot: 'back',  emoji: '🦔' },
  { id: 'dragon-gold-collar',   slot: 'horns', emoji: '🏅' },
  { id: 'dragon-bat-wings',     slot: 'wings', emoji: '🦇' },
  { id: 'dragon-flower-horns',  slot: 'horns', emoji: '🌸' },
  { id: 'dragon-star-back',     slot: 'back',  emoji: '⭐' },
  { id: 'dragon-wave-wings',    slot: 'wings', emoji: '🌊' },
  { id: 'dragon-gem-back',      slot: 'back',  emoji: '💎' },
  { id: 'dragon-royal-horns',   slot: 'horns', emoji: '👑' },
  { id: 'dragon-feather-wings', slot: 'wings', emoji: '🪽' },
  { id: 'dragon-sparkle-back',  slot: 'back',  emoji: '✨' },
  { id: 'dragon-gem-crown',     slot: 'horns', emoji: '💍' },
]

const HARD_DRAGON_ACCESSORIES: Array<{ id: DragonAccessoryId; slot: keyof DragonEquipped; emoji: string }> = [
  { id: 'dragon-flame-horns',   slot: 'horns', emoji: '🔥' },
  { id: 'dragon-ice-wings',     slot: 'wings', emoji: '❄️' },
  { id: 'dragon-thunder-back',  slot: 'back',  emoji: '⚡' },
  { id: 'dragon-galaxy-wings',  slot: 'wings', emoji: '🌌' },
  { id: 'dragon-cosmic-horns',  slot: 'horns', emoji: '💫' },
  { id: 'dragon-lava-back',     slot: 'back',  emoji: '🌋' },
  { id: 'dragon-shadow-wings',  slot: 'wings', emoji: '🖤' },
]

// ── Shared sub-components ─────────────────────────────────────────────────────

function ColorPicker<C extends string>({
  label, colors, unlockedColors, equippedColor, colorHex, unlockHint, onSelect,
}: {
  label: string
  colors: C[]
  unlockedColors: Set<C>
  equippedColor: C
  colorHex: Record<C, string>
  unlockHint: Partial<Record<C, string>>
  onSelect: (c: C) => void
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
              title={isLocked ? unlockHint[c] : undefined}
              className={`
                relative w-11 h-11 rounded-full border-4 transition-all active:scale-90
                ${isEquipped ? 'border-magic-purple scale-110 shadow-lg' : 'border-white shadow'}
                ${isLocked ? 'opacity-40' : ''}
              `}
              style={{ backgroundColor: colorHex[c] }}
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

function AccessoryList<S extends string>({
  accessories, unlockedAccessories, equippedSlots, onEquip, accessoryLabel, accessoryUnlockHint, equippedLabel,
}: {
  accessories: Array<{ id: S; slot: string; emoji: string }>
  unlockedAccessories: Set<S>
  equippedSlots: Record<string, unknown>
  onEquip: (slot: string, id: S | '') => void
  accessoryLabel: Record<S, string>
  accessoryUnlockHint: Record<S, string>
  equippedLabel: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {accessories.map(({ id, slot, emoji }) => {
        const unlocked = unlockedAccessories.has(id)
        const isEquipped = equippedSlots[slot] === id
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
                {accessoryLabel[id]}
              </span>
              {!unlocked && (
                <span className="text-xs text-gray-400">{accessoryUnlockHint[id]}</span>
              )}
              {unlocked && isEquipped && (
                <span className="text-xs text-magic-purple font-bold">{equippedLabel}</span>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function UnicornCustomizer({ onNavigate }: Props) {
  const { unicorn, equipAccessory, equipDragonAccessory, switchCreature } = useGameStore()
  const { t } = useTranslation()
  const { equipped, unlockedAccessories, unlockedColors, dragonEquipped, dragonUnlockedAccessories, dragonUnlockedColors, creature } = unicorn

  const unlockedAccessorySet = new Set(unlockedAccessories)
  const unlockedColorSet = new Set<UnicornColor>([...BASE_COLORS, ...unlockedColors])

  const unlockedDragonAccessorySet = new Set(dragonUnlockedAccessories)
  const unlockedDragonColorSet = new Set<DragonColor>([...DRAGON_BASE_COLORS, ...dragonUnlockedColors])

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
        <h2 className="text-3xl font-black text-magic-purple">{t.unicornCustomizer.title}</h2>
      </div>

      {/* Creature toggle */}
      <div className="relative z-10 flex bg-white rounded-2xl border-2 border-magic-purple p-1 gap-1 w-full max-w-md">
        <button
          onClick={() => switchCreature('unicorn')}
          className={`flex-1 h-11 rounded-xl text-base font-black transition-all
            ${creature === 'unicorn' ? 'bg-magic-purple text-white shadow' : 'text-magic-purple'}`}
        >
          {t.unicornCustomizer.unicornTab}
        </button>
        <button
          onClick={() => switchCreature('dragon')}
          className={`flex-1 h-11 rounded-xl text-base font-black transition-all
            ${creature === 'dragon' ? 'bg-emerald-500 text-white shadow' : 'text-emerald-700'}`}
        >
          {t.unicornCustomizer.dragonTab}
        </button>
      </div>

      {creature === 'unicorn' ? (
        <>
          {/* Unicorn Preview */}
          <div className="relative z-10">
            <UnicornAvatar equipped={equipped} size={180} floating />
          </div>

          {/* Body color */}
          <ColorPicker
            label={t.unicornCustomizer.bodyColor}
            colors={[...BASE_COLORS, ...HARD_COLORS]}
            unlockedColors={unlockedColorSet}
            equippedColor={equipped.bodyColor}
            colorHex={UNICORN_COLOR_HEX}
            unlockHint={HARD_COLOR_UNLOCK_HINT as Partial<Record<UnicornColor, string>>}
            onSelect={c => equipAccessory('bodyColor', c)}
          />

          {/* Mane color */}
          <ColorPicker
            label={t.unicornCustomizer.maneColor}
            colors={[...BASE_COLORS, ...HARD_COLORS]}
            unlockedColors={unlockedColorSet}
            equippedColor={equipped.maneColor}
            colorHex={UNICORN_COLOR_HEX}
            unlockHint={HARD_COLOR_UNLOCK_HINT as Partial<Record<UnicornColor, string>>}
            onSelect={c => equipAccessory('maneColor', c)}
          />

          {/* Easy accessories */}
          <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
            <p className="font-black text-magic-purple mb-3">{t.unicornCustomizer.accessories}</p>
            <AccessoryList
              accessories={EASY_ACCESSORIES}
              unlockedAccessories={unlockedAccessorySet}
              equippedSlots={equipped as unknown as Record<string, unknown>}
              onEquip={(slot, id) => equipAccessory(slot as keyof UnicornEquipped, id)}
              accessoryLabel={t.accessoryLabel}
              accessoryUnlockHint={t.accessoryUnlockHint}
              equippedLabel={t.unicornCustomizer.equipped}
            />
          </div>

          {/* Hard mode accessories */}
          <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-orange-300 shadow">
            <p className="font-black text-orange-500 mb-1">{t.unicornCustomizer.hardSection}</p>
            <p className="text-xs text-gray-400 mb-3">{t.unicornCustomizer.hardSectionSubtitle}</p>
            <AccessoryList
              accessories={HARD_ACCESSORIES}
              unlockedAccessories={unlockedAccessorySet}
              equippedSlots={equipped as unknown as Record<string, unknown>}
              onEquip={(slot, id) => equipAccessory(slot as keyof UnicornEquipped, id)}
              accessoryLabel={t.accessoryLabel}
              accessoryUnlockHint={t.accessoryUnlockHint}
              equippedLabel={t.unicornCustomizer.equipped}
            />
          </div>
        </>
      ) : (
        <>
          {/* Dragon Preview */}
          <div className="relative z-10">
            <DragonAvatar equipped={dragonEquipped} size={180} floating />
          </div>

          {/* Scale color */}
          <ColorPicker
            label={t.unicornCustomizer.scaleColor}
            colors={[...DRAGON_BASE_COLORS, ...DRAGON_HARD_COLORS]}
            unlockedColors={unlockedDragonColorSet}
            equippedColor={dragonEquipped.scaleColor}
            colorHex={DRAGON_COLOR_HEX}
            unlockHint={DRAGON_HARD_COLOR_UNLOCK_HINT as Partial<Record<DragonColor, string>>}
            onSelect={c => equipDragonAccessory('scaleColor', c)}
          />

          {/* Belly color */}
          <ColorPicker
            label={t.unicornCustomizer.bellyColor}
            colors={[...DRAGON_BASE_COLORS, ...DRAGON_HARD_COLORS]}
            unlockedColors={unlockedDragonColorSet}
            equippedColor={dragonEquipped.bellyColor}
            colorHex={DRAGON_COLOR_HEX}
            unlockHint={DRAGON_HARD_COLOR_UNLOCK_HINT as Partial<Record<DragonColor, string>>}
            onSelect={c => equipDragonAccessory('bellyColor', c)}
          />

          {/* Easy dragon accessories */}
          <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-emerald-200 shadow">
            <p className="font-black text-emerald-600 mb-3">{t.unicornCustomizer.dragonAccessories}</p>
            <AccessoryList
              accessories={EASY_DRAGON_ACCESSORIES}
              unlockedAccessories={unlockedDragonAccessorySet}
              equippedSlots={dragonEquipped as unknown as Record<string, unknown>}
              onEquip={(slot, id) => equipDragonAccessory(slot as keyof DragonEquipped, id)}
              accessoryLabel={t.dragonAccessoryLabel}
              accessoryUnlockHint={t.dragonAccessoryUnlockHint}
              equippedLabel={t.unicornCustomizer.equipped}
            />
          </div>

          {/* Hard dragon accessories */}
          <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-orange-300 shadow">
            <p className="font-black text-orange-500 mb-1">{t.unicornCustomizer.dragonHardSection}</p>
            <p className="text-xs text-gray-400 mb-3">{t.unicornCustomizer.dragonHardSectionSubtitle}</p>
            <AccessoryList
              accessories={HARD_DRAGON_ACCESSORIES}
              unlockedAccessories={unlockedDragonAccessorySet}
              equippedSlots={dragonEquipped as unknown as Record<string, unknown>}
              onEquip={(slot, id) => equipDragonAccessory(slot as keyof DragonEquipped, id)}
              accessoryLabel={t.dragonAccessoryLabel}
              accessoryUnlockHint={t.dragonAccessoryUnlockHint}
              equippedLabel={t.unicornCustomizer.equipped}
            />
          </div>
        </>
      )}

      <div className="h-4" />
    </div>
  )
}
