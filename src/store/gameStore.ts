import { create } from 'zustand'
import type {
  AccessoryId, CreatureType, DragonAccessoryId, DragonColor, DragonEquipped,
  TableProgress, UnicornColor, UnicornEquipped, UnicornState
} from '../types'
import {
  calculateStars,
  computeUnlockedAccessories,
  computeUnlockedColors,
  computeTotalHardStars,
  computeUnlockedDragonAccessories,
  computeUnlockedDragonColors,
} from '../utils/game'

interface GameStore {
  tables: Record<number, TableProgress>
  unicorn: UnicornState
  loaded: boolean
  userId: number | null
  init: (userId: number) => Promise<void>
  logout: () => void
  recordSessionResult: (
    table: number,
    correct: number,
    mode: 'free' | 'progressive',
    difficulty?: 'easy' | 'hard'
  ) => { accessories: AccessoryId[]; colors: UnicornColor[]; dragonAccessories: DragonAccessoryId[]; dragonColors: DragonColor[] }
  equipAccessory: (slot: keyof UnicornEquipped, value: string) => void
  equipDragonAccessory: (slot: keyof DragonEquipped, value: string) => void
  switchCreature: (type: CreatureType) => void
}

const DEFAULT_TABLE: TableProgress = {
  stars: 0,
  masteryPercent: 0,
  totalAttempts: 0,
  totalCorrect: 0,
  hardStars: 0,
}

function defaultTables(): Record<number, TableProgress> {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, { ...DEFAULT_TABLE }])
  )
}

const DEFAULT_DRAGON_EQUIPPED: DragonEquipped = {
  horns: null,
  wings: null,
  back: null,
  scaleColor: 'forest-green',
  bellyColor: 'silver-scales',
}

const DEFAULT_UNICORN: UnicornState = {
  creature: 'unicorn',
  unlockedAccessories: [],
  unlockedColors: [],
  equipped: {
    horn: null,
    wings: null,
    cape: null,
    bodyColor: 'white' as UnicornColor,
    maneColor: 'lavender' as UnicornColor,
  },
  dragonUnlockedAccessories: [],
  dragonEquipped: { ...DEFAULT_DRAGON_EQUIPPED },
  dragonUnlockedColors: [],
}

function freshState() {
  return {
    tables: defaultTables(),
    unicorn: {
      ...DEFAULT_UNICORN,
      equipped: { ...DEFAULT_UNICORN.equipped },
      dragonEquipped: { ...DEFAULT_DRAGON_EQUIPPED },
    },
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
          // Migrate: ensure unlockedColors exists for old saves
          if (!data.unicorn.unlockedColors) {
            data.unicorn.unlockedColors = []
          }
          // Migrate: ensure hardStars exists on every table entry
          for (const key of Object.keys(data.tables)) {
            if (data.tables[key].hardStars === undefined) {
              data.tables[key].hardStars = 0
            }
          }
          // Migrate: ensure dragon fields exist for old saves
          if (!data.unicorn.creature) data.unicorn.creature = 'unicorn'
          if (!data.unicorn.dragonEquipped) data.unicorn.dragonEquipped = { ...DEFAULT_DRAGON_EQUIPPED }
          // Always recompute dragon unlocks — they're derived from tables, never user choices
          {
            const totalHardStars = Object.values(data.tables as Record<number, { hardStars?: number }>)
              .reduce((sum, t) => sum + (t.hardStars ?? 0), 0)
            data.unicorn.dragonUnlockedAccessories = computeUnlockedDragonAccessories(data.tables, totalHardStars)
            data.unicorn.dragonUnlockedColors = computeUnlockedDragonColors(totalHardStars)
          }

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

  recordSessionResult(table, correct, mode, difficulty = 'easy') {
    const state = get()
    const prev = state.tables[table] ?? { ...DEFAULT_TABLE }
    const totalAttempts = prev.totalAttempts + 10
    const totalCorrect = prev.totalCorrect + correct
    const masteryPercent = (totalCorrect / totalAttempts) * 100
    // Stars (both easy and hard) are only earned in progressive mode.
    // Free mode is casual practice — no star tracking by design.
    const sessionStars = mode === 'progressive' ? calculateStars(correct) : 0

    const updatedTable: TableProgress = {
      ...prev,
      masteryPercent,
      totalAttempts,
      totalCorrect,
      stars: difficulty === 'hard' ? prev.stars : Math.max(prev.stars, sessionStars),
      hardStars: difficulty === 'hard' ? Math.max(prev.hardStars ?? 0, sessionStars) : (prev.hardStars ?? 0),
    }

    const updatedTables: Record<number, TableProgress> = {
      ...state.tables,
      [table]: updatedTable,
    }

    const totalHardStars = computeTotalHardStars(updatedTables)

    // Unicorn unlocks
    const prevUnlockedAccessories = new Set(state.unicorn.unlockedAccessories)
    const prevUnlockedColors = new Set(state.unicorn.unlockedColors)
    const nowUnlockedAccessories = computeUnlockedAccessories(updatedTables, totalHardStars)
    const nowUnlockedColors = computeUnlockedColors(totalHardStars)
    const newlyUnlockedAccessories = nowUnlockedAccessories.filter(a => !prevUnlockedAccessories.has(a))
    const newlyUnlockedColors = nowUnlockedColors.filter(c => !prevUnlockedColors.has(c))

    // Dragon unlocks
    const prevDragonAccessories = new Set(state.unicorn.dragonUnlockedAccessories)
    const prevDragonColors = new Set(state.unicorn.dragonUnlockedColors)
    const nowDragonAccessories = computeUnlockedDragonAccessories(updatedTables, totalHardStars)
    const nowDragonColors = computeUnlockedDragonColors(totalHardStars)
    const newlyDragonAccessories = nowDragonAccessories.filter(a => !prevDragonAccessories.has(a))
    const newlyDragonColors = nowDragonColors.filter(c => !prevDragonColors.has(c))

    const updatedUnicorn: UnicornState = {
      ...state.unicorn,
      unlockedAccessories: nowUnlockedAccessories,
      unlockedColors: nowUnlockedColors,
      dragonUnlockedAccessories: nowDragonAccessories,
      dragonUnlockedColors: nowDragonColors,
    }

    set({ tables: updatedTables, unicorn: updatedUnicorn })
    if (state.userId) saveToApi(state.userId, updatedTables, updatedUnicorn)

    return {
      accessories: newlyUnlockedAccessories,
      colors: newlyUnlockedColors,
      dragonAccessories: newlyDragonAccessories,
      dragonColors: newlyDragonColors,
    }
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

  equipDragonAccessory(slot, value) {
    const state = get()
    const updatedUnicorn = {
      ...state.unicorn,
      dragonEquipped: { ...state.unicorn.dragonEquipped, [slot]: value },
    }
    set({ unicorn: updatedUnicorn })
    if (state.userId) saveToApi(state.userId, state.tables, updatedUnicorn)
  },

  switchCreature(type) {
    const state = get()
    const updatedUnicorn = { ...state.unicorn, creature: type }
    set({ unicorn: updatedUnicorn })
    if (state.userId) saveToApi(state.userId, state.tables, updatedUnicorn)
  },
}))
