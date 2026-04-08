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
