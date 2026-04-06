import { describe, it, expect } from 'vitest'
import {
  calculateStars,
  computeUnlockedAccessories,
  isTableUnlocked,
  generateSession,
  generateWrongOptions,
} from './game'
import type { TableProgress } from '../types'

function makeTable(stars: number, attempts = 10, correct = 5): TableProgress {
  return { stars, masteryPercent: correct / attempts * 100, totalAttempts: attempts, totalCorrect: correct }
}

function emptyTables(): Record<number, TableProgress> {
  return Object.fromEntries(
    Array.from({ length: 10 }, (_, i) => [i + 1, makeTable(0, 0, 0)])
  )
}

// ── calculateStars ──────────────────────────────────────────────────────────

describe('calculateStars', () => {
  it('returns 0 for fewer than 5 correct', () => {
    expect(calculateStars(4)).toBe(0)
    expect(calculateStars(0)).toBe(0)
  })

  it('returns 1 for 5–6 correct', () => {
    expect(calculateStars(5)).toBe(1)
    expect(calculateStars(6)).toBe(1)
  })

  it('returns 2 for 7–9 correct', () => {
    expect(calculateStars(7)).toBe(2)
    expect(calculateStars(9)).toBe(2)
  })

  it('returns 3 for 10 correct', () => {
    expect(calculateStars(10)).toBe(3)
  })
})

// ── computeUnlockedAccessories ──────────────────────────────────────────────

describe('computeUnlockedAccessories', () => {
  it('unlocks rainbow-horn when any table has ≥1 star', () => {
    const tables = emptyTables()
    tables[1] = makeTable(1)
    expect(computeUnlockedAccessories(tables)).toContain('rainbow-horn')
  })

  it('unlocks golden-wings when any table has 3 stars', () => {
    const tables = emptyTables()
    tables[1] = makeTable(3)
    expect(computeUnlockedAccessories(tables)).toContain('golden-wings')
  })

  it('does not unlock golden-wings for 2 stars', () => {
    const tables = emptyTables()
    tables[1] = makeTable(2)
    expect(computeUnlockedAccessories(tables)).not.toContain('golden-wings')
  })

  it('unlocks flower-crown when 5 tables have ≥1 star', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 5; i++) tables[i] = makeTable(1)
    expect(computeUnlockedAccessories(tables)).toContain('flower-crown')
  })

  it('does not unlock flower-crown for only 4 tables', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 4; i++) tables[i] = makeTable(1)
    expect(computeUnlockedAccessories(tables)).not.toContain('flower-crown')
  })

  it('unlocks magic-cape when all 10 tables have ≥2 stars', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 10; i++) tables[i] = makeTable(2)
    expect(computeUnlockedAccessories(tables)).toContain('magic-cape')
  })

  it('does not unlock magic-cape if one table has only 1 star', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 10; i++) tables[i] = makeTable(2)
    tables[5] = makeTable(1)
    expect(computeUnlockedAccessories(tables)).not.toContain('magic-cape')
  })

  it('unlocks glitter-sparkle when all 10 tables have 3 stars', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 10; i++) tables[i] = makeTable(3)
    expect(computeUnlockedAccessories(tables)).toContain('glitter-sparkle')
  })

  it('does not unlock glitter-sparkle if one table has 2 stars', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 10; i++) tables[i] = makeTable(3)
    tables[3] = makeTable(2)
    expect(computeUnlockedAccessories(tables)).not.toContain('glitter-sparkle')
  })

  it('returns empty array for all-zero tables', () => {
    expect(computeUnlockedAccessories(emptyTables())).toEqual([])
  })
})

// ── isTableUnlocked ─────────────────────────────────────────────────────────

describe('isTableUnlocked', () => {
  it('table 1 is always unlocked', () => {
    expect(isTableUnlocked(1, emptyTables())).toBe(true)
  })

  it('table 2 is locked when table 1 has 0 stars', () => {
    expect(isTableUnlocked(2, emptyTables())).toBe(false)
  })

  it('table 2 is locked when table 1 has 1 star', () => {
    const tables = emptyTables()
    tables[1] = makeTable(1)
    expect(isTableUnlocked(2, tables)).toBe(false)
  })

  it('table 2 unlocks when table 1 has ≥2 stars', () => {
    const tables = emptyTables()
    tables[1] = makeTable(2)
    expect(isTableUnlocked(2, tables)).toBe(true)
  })

  it('table 5 requires table 4 to have ≥2 stars', () => {
    const tables = emptyTables()
    for (let i = 1; i <= 4; i++) tables[i] = makeTable(2)
    expect(isTableUnlocked(5, tables)).toBe(true)
    tables[4] = makeTable(1)
    expect(isTableUnlocked(5, tables)).toBe(false)
  })
})

// ── generateSession ─────────────────────────────────────────────────────────

describe('generateSession', () => {
  it('returns exactly 10 questions', () => {
    expect(generateSession(5).length).toBe(10)
  })

  it('all questions use the given table number', () => {
    const qs = generateSession(7)
    expect(qs.every(q => q.a === 7 || q.b === 7)).toBe(true)
  })

  it('answers are correct products', () => {
    const qs = generateSession(4)
    expect(qs.every(q => q.answer === q.a * q.b)).toBe(true)
  })

  it('covers all multipliers 1–10', () => {
    const qs = generateSession(3)
    const multipliers = qs.map(q => q.b).sort((a, b) => a - b)
    expect(multipliers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})

// ── generateWrongOptions ────────────────────────────────────────────────────

describe('generateWrongOptions', () => {
  it('returns exactly 3 wrong options', () => {
    expect(generateWrongOptions(12).length).toBe(3)
  })

  it('does not include the correct answer', () => {
    for (let i = 0; i < 50; i++) {
      const correct = Math.floor(Math.random() * 90) + 1
      expect(generateWrongOptions(correct)).not.toContain(correct)
    }
  })

  it('all options are positive', () => {
    const opts = generateWrongOptions(2)
    expect(opts.every(o => o > 0)).toBe(true)
  })

  it('has no duplicates', () => {
    for (let i = 0; i < 20; i++) {
      const opts = generateWrongOptions(15)
      expect(new Set(opts).size).toBe(3)
    }
  })
})
