import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AccessoryId, TableProgress, UnicornColor, UnicornEquipped, UnicornState } from '../types'
import { calculateStars, computeUnlockedAccessories } from '../utils/game'

interface GameStore {
  tables: Record<number, TableProgress>
  unicorn: UnicornState
  /** Call after each 10-question session. Returns newly unlocked accessories. */
  recordSessionResult: (table: number, correct: number) => AccessoryId[]
  equipAccessory: (slot: keyof UnicornEquipped, value: string) => void
}

const DEFAULT_TABLE: TableProgress = {
  stars: 0,
  masteryPercent: 0,
  totalAttempts: 0,
  totalCorrect: 0,
}

function defaultTables(): Record<number, TableProgress> {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, { ...DEFAULT_TABLE }])
  )
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      tables: defaultTables(),
      unicorn: {
        unlockedAccessories: [],
        equipped: {
          horn: null,
          wings: null,
          cape: null,
          bodyColor: 'white' as UnicornColor,
          maneColor: 'lavender' as UnicornColor,
        },
      },

      recordSessionResult(table, correct) {
        const state = get()
        const prev = state.tables[table] ?? { ...DEFAULT_TABLE }
        const newStars = calculateStars(correct)
        const bestStars = Math.max(prev.stars, newStars)
        const totalAttempts = prev.totalAttempts + 10
        const totalCorrect = prev.totalCorrect + correct
        const masteryPercent = (totalCorrect / totalAttempts) * 100

        const updatedTables: Record<number, TableProgress> = {
          ...state.tables,
          [table]: { stars: bestStars, masteryPercent, totalAttempts, totalCorrect },
        }

        // Compute accessory delta
        const prevUnlocked = new Set(state.unicorn.unlockedAccessories)
        const nowUnlocked = computeUnlockedAccessories(updatedTables)
        const newlyUnlocked = nowUnlocked.filter(a => !prevUnlocked.has(a))

        set({
          tables: updatedTables,
          unicorn: {
            ...state.unicorn,
            unlockedAccessories: nowUnlocked,
          },
        })

        return newlyUnlocked
      },

      equipAccessory(slot, value) {
        const state = get()
        set({
          unicorn: {
            ...state.unicorn,
            equipped: {
              ...state.unicorn.equipped,
              [slot]: value,
            },
          },
        })
      },
    }),
    {
      name: 'tablas-magicas-save',
    }
  )
)
