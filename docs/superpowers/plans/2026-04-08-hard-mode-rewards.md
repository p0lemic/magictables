# Hard Mode Rewards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a parallel hard-mode star track (max 30 stars) that unlocks 7 new accessories and 6 new colors progressively.

**Architecture:** Add `hardStars` to `TableProgress` (backwards-compatible). New utility functions compute hard-mode unlocks. `recordSessionResult` receives `difficulty` param and writes to the right star field. UnicornCustomizer shows hard-mode rewards in a dedicated section with locked state.

**Tech Stack:** React 18, TypeScript, Zustand, Vitest

---

## File Map

| File | Change |
|------|--------|
| `src/types/index.ts` | Add `hardStars`, 7 new AccessoryIds, 6 new UnicornColors, `unlockedColors` to UnicornState, labels/hints/hex |
| `src/utils/game.ts` | Add `computeTotalHardStars`, `computeUnlockedColors`; update `computeUnlockedAccessories` signature |
| `src/utils/game.test.ts` | Add tests for new utils; update existing `computeUnlockedAccessories` call signatures |
| `src/store/gameStore.ts` | Update `recordSessionResult` to accept `difficulty`, compute/return unlocked colors |
| `src/pages/SessionResults.tsx` | Pass `difficulty`, handle `{ accessories, colors }` return, show colors in unlock modal |
| `src/pages/UnicornCustomizer.tsx` | Lock new colors behind `unlockedColors`, add hard-mode accessories section |

---

## Task 1: Update Types

**Files:**
- Modify: `src/types/index.ts`

- [ ] **Step 1: Replace the contents of `src/types/index.ts`**

```ts
export type AccessoryId =
  | 'rainbow-horn'
  | 'star-bow'
  | 'fairy-wings'
  | 'flower-crown'
  | 'magic-shoes'
  | 'princess-crown'
  | 'golden-wings'
  | 'sparkle-tail'
  | 'crystal-horn'
  | 'rainbow-mane'
  | 'magic-cape'
  | 'diamond-crown'
  | 'phoenix-wings'
  | 'glitter-sparkle'
  // Hard mode exclusives
  | 'flame-horn'
  | 'dragon-wings'
  | 'star-tiara'
  | 'galaxy-cape'
  | 'thunder-wings'
  | 'ice-crown'
  | 'cosmic-horn';

export type UnicornColor =
  | 'white' | 'lavender' | 'pink' | 'mint' | 'yellow' | 'sky'
  // Hard mode exclusives
  | 'coral' | 'gold' | 'magic-purple' | 'silver' | 'ocean' | 'rainbow';

export interface TableProgress {
  stars: number;           // 0–3, best easy/progressive score
  masteryPercent: number;
  totalAttempts: number;
  totalCorrect: number;
  hardStars?: number;      // 0–3, best hard mode score (optional = backwards compatible)
}

export interface UnicornEquipped {
  horn: AccessoryId | null;
  wings: AccessoryId | null;
  cape: AccessoryId | null;
  bodyColor: UnicornColor;
  maneColor: UnicornColor;
}

export interface UnicornState {
  unlockedAccessories: AccessoryId[];
  equipped: UnicornEquipped;
  unlockedColors: UnicornColor[];   // hard-mode unlocked colors
}

export interface SessionQuestion {
  a: number;
  b: number;
  answer: number;
}

export interface User {
  id: number
  name: string
  hasPin: boolean
  totalStars: number
  equipped: UnicornEquipped
}

export type Screen =
  | { name: 'user-select' }
  | { name: 'home' }
  | { name: 'free-mode' }
  | { name: 'progressive-mode' }
  | { name: 'practice-session'; table: number; mode: 'free' | 'progressive'; ordered?: boolean; difficulty?: 'easy' | 'hard' }
  | { name: 'session-results'; table: number; correct: number; mode: 'free' | 'progressive'; difficulty?: 'easy' | 'hard' }
  | { name: 'unicorn-customizer' }
  | { name: 'table-reference' };

export const BASE_COLORS: UnicornColor[] = ['white', 'lavender', 'pink', 'mint', 'yellow', 'sky'];
export const HARD_COLORS: UnicornColor[] = ['coral', 'gold', 'magic-purple', 'silver', 'ocean', 'rainbow'];

export const UNICORN_COLOR_HEX: Record<UnicornColor, string> = {
  white:          '#FFFFFF',
  lavender:       '#E8D5FF',
  pink:           '#FFB3D9',
  mint:           '#B3FFE8',
  yellow:         '#FFF4B3',
  sky:            '#B3E8FF',
  coral:          '#FFB347',
  gold:           '#FFD700',
  'magic-purple': '#C39BD3',
  silver:         '#D5D8DC',
  ocean:          '#85C1E9',
  rainbow:        '#FF85EA',
};

export const COLOR_LABEL: Record<UnicornColor, string> = {
  white:          'Blanca',
  lavender:       'Lila',
  pink:           'Rosa',
  mint:           'Menta',
  yellow:         'Amarilla',
  sky:            'Celeste',
  coral:          'Coral',
  gold:           'Dorada',
  'magic-purple': 'Púrpura Mágico',
  silver:         'Plateada',
  ocean:          'Azul Océano',
  rainbow:        'Arcoíris',
};

export const HARD_COLOR_UNLOCK_HINT: Partial<Record<UnicornColor, string>> = {
  coral:          'Consigue 5 estrellas en modo difícil',
  gold:           'Consigue 10 estrellas en modo difícil',
  silver:         'Consigue 18 estrellas en modo difícil',
  'magic-purple': 'Consigue 22 estrellas en modo difícil',
  ocean:          'Consigue 28 estrellas en modo difícil',
  rainbow:        'Completa todas las tablas en modo difícil',
};

export const ACCESSORY_LABEL: Record<AccessoryId, string> = {
  'rainbow-horn':    'Cuerno Arcoíris',
  'star-bow':        'Lazo de Estrella',
  'fairy-wings':     'Alas de Hada',
  'flower-crown':    'Corona de Flores',
  'magic-shoes':     'Zapatos Mágicos',
  'princess-crown':  'Corona de Princesa',
  'golden-wings':    'Alas Doradas',
  'sparkle-tail':    'Cola Brillante',
  'crystal-horn':    'Cuerno de Cristal',
  'rainbow-mane':    'Melena Arcoíris',
  'magic-cape':      'Capa Mágica',
  'diamond-crown':   'Corona de Diamante',
  'phoenix-wings':   'Alas de Fénix',
  'glitter-sparkle': 'Destello de Purpurina',
  'flame-horn':      'Cuerno de Fuego',
  'dragon-wings':    'Alas de Dragón',
  'star-tiara':      'Tiara de Estrellas',
  'galaxy-cape':     'Capa Galaxia',
  'thunder-wings':   'Alas de Trueno',
  'ice-crown':       'Corona de Hielo',
  'cosmic-horn':     'Cuerno Cósmico',
};

export const ACCESSORY_UNLOCK_HINT: Record<AccessoryId, string> = {
  'rainbow-horn':    'Consigue 1 estrella en cualquier tabla',
  'star-bow':        'Consigue 1 estrella en 2 tablas',
  'fairy-wings':     'Consigue 1 estrella en 3 tablas',
  'flower-crown':    'Completa 5 tablas con ≥1 estrella',
  'magic-shoes':     'Consigue 1 estrella en 7 tablas',
  'princess-crown':  'Consigue 1 estrella en todas las tablas',
  'golden-wings':    'Consigue 3 estrellas en cualquier tabla',
  'sparkle-tail':    'Consigue ≥2 estrellas en 3 tablas',
  'crystal-horn':    'Consigue ≥2 estrellas en 5 tablas',
  'rainbow-mane':    'Consigue ≥2 estrellas en 7 tablas',
  'magic-cape':      'Consigue ≥2 estrellas en todas las tablas',
  'diamond-crown':   'Consigue 3 estrellas en 3 tablas',
  'phoenix-wings':   'Consigue 3 estrellas en 7 tablas',
  'glitter-sparkle': 'Consigue 3 estrellas en TODAS las tablas',
  'flame-horn':      'Consigue 1 estrella en modo difícil',
  'dragon-wings':    'Consigue 3 estrellas en modo difícil',
  'star-tiara':      'Consigue 8 estrellas en modo difícil',
  'galaxy-cape':     'Consigue 12 estrellas en modo difícil',
  'thunder-wings':   'Consigue 15 estrellas en modo difícil',
  'ice-crown':       'Consigue 20 estrellas en modo difícil',
  'cosmic-horn':     'Consigue 25 estrellas en modo difícil',
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
docker-compose run --rm app npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add hard mode types — hardStars, new accessories and colors"
```

---

## Task 2: Update Game Utils + Tests

**Files:**
- Modify: `src/utils/game.ts`
- Modify: `src/utils/game.test.ts`

- [ ] **Step 1: Write failing tests for the three new/updated functions**

Add to `src/utils/game.test.ts` (import the new functions at the top):

```ts
import {
  calculateStars,
  computeUnlockedAccessories,
  computeTotalHardStars,
  computeUnlockedColors,
  isTableUnlocked,
  generateSession,
  generateWrongOptions,
} from './game'
```

Update the `makeTable` helper to support `hardStars`:

```ts
function makeTable(stars: number, attempts = 10, correct = 5, hardStars = 0): TableProgress {
  return { stars, masteryPercent: correct / attempts * 100, totalAttempts: attempts, totalCorrect: correct, hardStars }
}
```

Add new test blocks at the end of the file:

```ts
// ── computeUnlockedAccessories (hard mode) ───────────────────────────────────

describe('computeUnlockedAccessories — hard mode', () => {
  it('does not unlock hard accessories with 0 hard stars', () => {
    const result = computeUnlockedAccessories(emptyTables(), 0)
    expect(result).not.toContain('flame-horn')
  })

  it('unlocks flame-horn with 1 hard star', () => {
    expect(computeUnlockedAccessories(emptyTables(), 1)).toContain('flame-horn')
  })

  it('unlocks dragon-wings with 3 hard stars', () => {
    expect(computeUnlockedAccessories(emptyTables(), 3)).toContain('dragon-wings')
  })

  it('does not unlock dragon-wings with 2 hard stars', () => {
    expect(computeUnlockedAccessories(emptyTables(), 2)).not.toContain('dragon-wings')
  })

  it('unlocks cosmic-horn with 25 hard stars', () => {
    expect(computeUnlockedAccessories(emptyTables(), 25)).toContain('cosmic-horn')
  })

  it('existing easy accessories still work alongside hard stars', () => {
    const tables = emptyTables()
    tables[1] = makeTable(1)
    const result = computeUnlockedAccessories(tables, 1)
    expect(result).toContain('rainbow-horn')
    expect(result).toContain('flame-horn')
  })
})

// ── computeTotalHardStars ────────────────────────────────────────────────────

describe('computeTotalHardStars', () => {
  it('returns 0 for tables with no hardStars', () => {
    expect(computeTotalHardStars(emptyTables())).toBe(0)
  })

  it('sums hardStars across tables', () => {
    const tables = emptyTables()
    tables[1] = makeTable(0, 10, 5, 3)
    tables[2] = makeTable(0, 10, 5, 2)
    expect(computeTotalHardStars(tables)).toBe(5)
  })

  it('handles missing hardStars field (undefined = 0)', () => {
    const tables = emptyTables()
    // makeTable with no hardStars arg gives hardStars=0
    tables[1] = { stars: 2, masteryPercent: 80, totalAttempts: 10, totalCorrect: 8 }
    expect(computeTotalHardStars(tables)).toBe(0)
  })
})

// ── computeUnlockedColors ────────────────────────────────────────────────────

describe('computeUnlockedColors', () => {
  it('returns empty for 0 hard stars', () => {
    expect(computeUnlockedColors(0)).toEqual([])
  })

  it('unlocks coral at 5 hard stars', () => {
    expect(computeUnlockedColors(5)).toContain('coral')
    expect(computeUnlockedColors(4)).not.toContain('coral')
  })

  it('unlocks gold at 10 hard stars', () => {
    expect(computeUnlockedColors(10)).toContain('gold')
    expect(computeUnlockedColors(9)).not.toContain('gold')
  })

  it('unlocks silver at 18 hard stars', () => {
    expect(computeUnlockedColors(18)).toContain('silver')
  })

  it('unlocks magic-purple at 22 hard stars', () => {
    expect(computeUnlockedColors(22)).toContain('magic-purple')
  })

  it('unlocks ocean at 28 hard stars', () => {
    expect(computeUnlockedColors(28)).toContain('ocean')
  })

  it('unlocks rainbow at 30 hard stars', () => {
    expect(computeUnlockedColors(30)).toContain('rainbow')
    expect(computeUnlockedColors(29)).not.toContain('rainbow')
  })

  it('unlocks all colors at 30 hard stars', () => {
    const colors = computeUnlockedColors(30)
    expect(colors).toContain('coral')
    expect(colors).toContain('gold')
    expect(colors).toContain('silver')
    expect(colors).toContain('magic-purple')
    expect(colors).toContain('ocean')
    expect(colors).toContain('rainbow')
  })
})
```

- [ ] **Step 2: Run tests — expect failures**

```bash
docker-compose run --rm app npm test
```
Expected: failures on `computeTotalHardStars`, `computeUnlockedColors`, and the hard mode `computeUnlockedAccessories` tests (functions not yet exported).

- [ ] **Step 3: Update `src/utils/game.ts`**

Replace the full file contents:

```ts
import type { AccessoryId, SessionQuestion, TableProgress, UnicornColor } from '../types'

/** Calculate stars from a session score (correct out of 10). */
export function calculateStars(correct: number): number {
  if (correct >= 10) return 3
  if (correct >= 7) return 2
  if (correct >= 5) return 1
  return 0
}

/** Sum hard stars across all tables. */
export function computeTotalHardStars(tables: Record<number, TableProgress>): number {
  return Object.values(tables).reduce((sum, t) => sum + (t.hardStars ?? 0), 0)
}

/** Compute which accessories should be unlocked based on current table state. */
export function computeUnlockedAccessories(
  tables: Record<number, TableProgress>,
  totalHardStars = 0
): AccessoryId[] {
  const list = Object.values(tables)
  const withOneStarOrMore = list.filter(t => t.stars >= 1).length
  const withTwoStarsOrMore = list.filter(t => t.stars >= 2).length
  const withThreeStars = list.filter(t => t.stars >= 3).length
  const anyThreeStars = withThreeStars >= 1

  const unlocked: AccessoryId[] = []

  // Easy mode accessories
  if (withOneStarOrMore >= 1)  unlocked.push('rainbow-horn')
  if (withOneStarOrMore >= 2)  unlocked.push('star-bow')
  if (withOneStarOrMore >= 3)  unlocked.push('fairy-wings')
  if (withOneStarOrMore >= 5)  unlocked.push('flower-crown')
  if (withOneStarOrMore >= 7)  unlocked.push('magic-shoes')
  if (withOneStarOrMore >= 10) unlocked.push('princess-crown')
  if (anyThreeStars)           unlocked.push('golden-wings')
  if (withTwoStarsOrMore >= 3) unlocked.push('sparkle-tail')
  if (withTwoStarsOrMore >= 5) unlocked.push('crystal-horn')
  if (withTwoStarsOrMore >= 7) unlocked.push('rainbow-mane')
  if (withTwoStarsOrMore >= 10) unlocked.push('magic-cape')
  if (withThreeStars >= 3)     unlocked.push('diamond-crown')
  if (withThreeStars >= 7)     unlocked.push('phoenix-wings')
  if (withThreeStars >= 10)    unlocked.push('glitter-sparkle')

  // Hard mode accessories
  if (totalHardStars >= 1)  unlocked.push('flame-horn')
  if (totalHardStars >= 3)  unlocked.push('dragon-wings')
  if (totalHardStars >= 8)  unlocked.push('star-tiara')
  if (totalHardStars >= 12) unlocked.push('galaxy-cape')
  if (totalHardStars >= 15) unlocked.push('thunder-wings')
  if (totalHardStars >= 20) unlocked.push('ice-crown')
  if (totalHardStars >= 25) unlocked.push('cosmic-horn')

  return unlocked
}

/** Compute which hard-mode colors should be unlocked based on total hard stars. */
export function computeUnlockedColors(totalHardStars: number): UnicornColor[] {
  const unlocked: UnicornColor[] = []
  if (totalHardStars >= 5)  unlocked.push('coral')
  if (totalHardStars >= 10) unlocked.push('gold')
  if (totalHardStars >= 18) unlocked.push('silver')
  if (totalHardStars >= 22) unlocked.push('magic-purple')
  if (totalHardStars >= 28) unlocked.push('ocean')
  if (totalHardStars >= 30) unlocked.push('rainbow')
  return unlocked
}

/** Table 1 is always unlocked. Table N requires table N-1 to have ≥2 stars. */
export function isTableUnlocked(
  table: number,
  tables: Record<number, TableProgress>
): boolean {
  if (table === 1) return true
  const prev = tables[table - 1]
  return prev !== undefined && prev.stars >= 2
}

/** Generate a shuffled 10-question session for the given table (1–10). */
export function generateSession(tableNumber: number): SessionQuestion[] {
  const questions: SessionQuestion[] = Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
  }))
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[questions[i], questions[j]] = [questions[j], questions[i]]
  }
  return questions
}

/** Generate an ordered 10-question session: tableNumber×1, ×2, … ×10. */
export function generateOrderedSession(tableNumber: number): SessionQuestion[] {
  return Array.from({ length: 10 }, (_, i) => ({
    a: tableNumber,
    b: i + 1,
    answer: tableNumber * (i + 1),
  }))
}

/** Generate 3 distinct wrong answer options for a multiple-choice question. */
export function generateWrongOptions(correct: number): number[] {
  const offsets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5]
  const candidates = offsets
    .map(o => correct + o)
    .filter(n => n > 0 && n !== correct)

  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  return candidates.slice(0, 3)
}
```

- [ ] **Step 4: Run tests — expect all passing**

```bash
docker-compose run --rm app npm test
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/utils/game.ts src/utils/game.test.ts
git commit -m "feat: add computeTotalHardStars, computeUnlockedColors; extend computeUnlockedAccessories for hard mode"
```

---

## Task 3: Update Game Store

**Files:**
- Modify: `src/store/gameStore.ts`

- [ ] **Step 1: Replace the full contents of `src/store/gameStore.ts`**

```ts
import { create } from 'zustand'
import type { AccessoryId, TableProgress, UnicornColor, UnicornEquipped, UnicornState } from '../types'
import { calculateStars, computeUnlockedAccessories, computeUnlockedColors, computeTotalHardStars } from '../utils/game'

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
  ) => { accessories: AccessoryId[]; colors: UnicornColor[] }
  equipAccessory: (slot: keyof UnicornEquipped, value: string) => void
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

const DEFAULT_UNICORN: UnicornState = {
  unlockedAccessories: [],
  unlockedColors: [],
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
          // Migrate: ensure unlockedColors exists for old saves
          if (!data.unicorn.unlockedColors) {
            data.unicorn.unlockedColors = []
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
    const prevUnlockedAccessories = new Set(state.unicorn.unlockedAccessories)
    const prevUnlockedColors = new Set(state.unicorn.unlockedColors)

    const nowUnlockedAccessories = computeUnlockedAccessories(updatedTables, totalHardStars)
    const nowUnlockedColors = computeUnlockedColors(totalHardStars)

    const newlyUnlockedAccessories = nowUnlockedAccessories.filter(a => !prevUnlockedAccessories.has(a))
    const newlyUnlockedColors = nowUnlockedColors.filter(c => !prevUnlockedColors.has(c))

    const updatedUnicorn: UnicornState = {
      ...state.unicorn,
      unlockedAccessories: nowUnlockedAccessories,
      unlockedColors: nowUnlockedColors,
    }

    set({ tables: updatedTables, unicorn: updatedUnicorn })
    if (state.userId) saveToApi(state.userId, updatedTables, updatedUnicorn)

    return { accessories: newlyUnlockedAccessories, colors: newlyUnlockedColors }
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
docker-compose run --rm app npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/store/gameStore.ts
git commit -m "feat: recordSessionResult tracks hardStars and returns unlocked colors"
```

---

## Task 4: Update SessionResults

**Files:**
- Modify: `src/pages/SessionResults.tsx`

- [ ] **Step 1: Replace the full contents of `src/pages/SessionResults.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import type { AccessoryId, UnicornColor, Screen } from '../types'
import { ACCESSORY_LABEL, COLOR_LABEL, UNICORN_COLOR_HEX } from '../types'
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
  difficulty?: 'easy' | 'hard'
  onNavigate: (screen: Screen) => void
}

export default function SessionResults({ table, correct, mode, difficulty = 'easy', onNavigate }: Props) {
  const { recordSessionResult, unicorn } = useGameStore()
  const sound = useSound()
  const [newAccessories, setNewAccessories] = useState<AccessoryId[]>([])
  const [newColors, setNewColors] = useState<UnicornColor[]>([])
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [starsAnimated, setStarsAnimated] = useState(false)
  const recorded = useRef(false)

  const stars = correct >= 10 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0

  useEffect(() => {
    if (recorded.current) return
    recorded.current = true

    sound.enable()
    const { accessories, colors } = recordSessionResult(table, correct, mode, difficulty)
    setNewAccessories(accessories)
    setNewColors(colors)

    setTimeout(() => {
      setStarsAnimated(true)
      if (mode === 'progressive' && stars > 0) {
        sound.playStarFanfare()
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2500)
      }
    }, 400)

    if (accessories.length > 0 || colors.length > 0) {
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
        {mode === 'progressive' && (
          <StarRating stars={starsAnimated ? stars : 0} size="lg" animated={starsAnimated} />
        )}
        {difficulty === 'hard' && (
          <span className="text-sm font-bold text-orange-500">🔥 Modo Difícil</span>
        )}
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <UnicornAvatar equipped={unicorn.equipped} size={130} floating />
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'practice-session', table, mode, difficulty })}
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

      {/* Accessory/color unlock modal */}
      {showUnlockModal && (newAccessories.length > 0 || newColors.length > 0) && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowUnlockModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-xs w-full flex flex-col items-center gap-4 shadow-2xl border-2 border-magic-yellow"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-2xl font-black text-magic-purple text-center">
              🎉 ¡Nuevo desbloqueo!
            </p>
            <div className="animate-spin-slow text-6xl">✨</div>
            {newAccessories.map(a => (
              <p key={a} className="text-xl font-black text-amber-500 text-center">
                🦄 {ACCESSORY_LABEL[a]}
              </p>
            ))}
            {newColors.map(c => (
              <div key={c} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-200 shadow"
                  style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
                />
                <p className="text-xl font-black text-amber-500">
                  🎨 {COLOR_LABEL[c]}
                </p>
              </div>
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
docker-compose run --rm app npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/SessionResults.tsx
git commit -m "feat: SessionResults passes difficulty and shows newly unlocked colors"
```

---

## Task 5: Update UnicornCustomizer

**Files:**
- Modify: `src/pages/UnicornCustomizer.tsx`

- [ ] **Step 1: Replace the full contents of `src/pages/UnicornCustomizer.tsx`**

```tsx
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
  { id: 'flame-horn',   slot: 'horn',  emoji: '🔥' },
  { id: 'dragon-wings', slot: 'wings', emoji: '🐉' },
  { id: 'star-tiara',   slot: 'horn',  emoji: '⭐' },
  { id: 'galaxy-cape',  slot: 'cape',  emoji: '🌌' },
  { id: 'thunder-wings',slot: 'wings', emoji: '⚡' },
  { id: 'ice-crown',    slot: 'horn',  emoji: '❄️' },
  { id: 'cosmic-horn',  slot: 'horn',  emoji: '💫' },
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
```

- [ ] **Step 2: Verify TypeScript compiles and tests pass**

```bash
docker-compose run --rm app npx tsc --noEmit && docker-compose run --rm app npm test
```
Expected: no errors, all tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/pages/UnicornCustomizer.tsx
git commit -m "feat: UnicornCustomizer shows hard mode accessories section and lockable colors"
```

---

## Task 6: Deploy

- [ ] **Step 1: Deploy to Hetzner**

```bash
./deploy.sh
```
Expected: `✓ Deploy completado — http://178.104.152.67`

- [ ] **Step 2: Smoke test in browser**

- Open https://tablasdemultiplicar.xyz
- Complete a hard mode session
- Verify stars are tracked separately from easy mode
- Verify unlock modal shows when reaching a hard star threshold
- Open unicorn customizer and verify the "Modo Difícil 🔥" section appears with locked accessories
