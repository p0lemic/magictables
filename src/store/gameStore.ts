import { create } from 'zustand'
import type { AccessoryId, TableProgress, UnicornColor, UnicornEquipped, UnicornState } from '../types'
import { calculateStars, computeUnlockedAccessories } from '../utils/game'

interface GameStore {
  tables: Record<number, TableProgress>
  unicorn: UnicornState
  loaded: boolean
  userId: number | null
  init: (userId: number) => Promise<void>
  logout: () => void
  recordSessionResult: (table: number, correct: number, mode: 'free' | 'progressive') => AccessoryId[]
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

const DEFAULT_UNICORN: UnicornState = {
  unlockedAccessories: [],
  equipped: {
    horn: null,
    wings: null,
    cape: null,
    bodyColor: 'white' as UnicornColor,
    maneColor: 'lavender' as UnicornColor,
  },
}

function freshState() {
  return {
    tables: defaultTables(),
    unicorn: { ...DEFAULT_UNICORN, equipped: { ...DEFAULT_UNICORN.equipped } },
    loaded: false,
    userId: null as number | null,
  }
}

function saveToApi(userId: number, tables: Record<number, TableProgress>, unicorn: UnicornState) {
  fetch(`/api/state/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tables, unicorn }),
  }).catch(() => { /* best-effort */ })
}

export const useGameStore = create<GameStore>()((set, get) => ({
  ...freshState(),

  async init(userId) {
    set({ loaded: false, userId })

    for (let attempt = 0; attempt < 8; attempt++) {
      try {
        const res = await fetch(`/api/state/${userId}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        if (data?.tables && data?.unicorn) {
          set({ tables: data.tables, unicorn: data.unicorn, loaded: true })
        } else {
          set({ loaded: true })
        }
        return
      } catch {
        if (attempt < 7) {
          await new Promise(r => setTimeout(r, 300 * (attempt + 1)))
        }
      }
    }
    set({ loaded: true })
  },

  logout() {
    set(freshState())
  },

  recordSessionResult(table, correct, mode) {
    const state = get()
    const prev = state.tables[table] ?? { ...DEFAULT_TABLE }
    const totalAttempts = prev.totalAttempts + 10
    const totalCorrect = prev.totalCorrect + correct
    const masteryPercent = (totalCorrect / totalAttempts) * 100
    const bestStars = mode === 'progressive'
      ? Math.max(prev.stars, calculateStars(correct))
      : prev.stars

    const updatedTables: Record<number, TableProgress> = {
      ...state.tables,
      [table]: { stars: bestStars, masteryPercent, totalAttempts, totalCorrect },
    }

    const prevUnlocked = new Set(state.unicorn.unlockedAccessories)
    const nowUnlocked = computeUnlockedAccessories(updatedTables)
    const newlyUnlocked = nowUnlocked.filter(a => !prevUnlocked.has(a))

    const updatedUnicorn = { ...state.unicorn, unlockedAccessories: nowUnlocked }
    set({ tables: updatedTables, unicorn: updatedUnicorn })
    if (state.userId) saveToApi(state.userId, updatedTables, updatedUnicorn)

    return newlyUnlocked
  },

  equipAccessory(slot, value) {
    const state = get()
    const updatedUnicorn = {
      ...state.unicorn,
      equipped: { ...state.unicorn.equipped, [slot]: value },
    }
    set({ unicorn: updatedUnicorn })
    if (state.userId) saveToApi(state.userId, state.tables, updatedUnicorn)
  },
}))
