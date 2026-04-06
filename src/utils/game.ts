import type { AccessoryId, SessionQuestion, TableProgress } from '../types'

/** Calculate stars from a session score (correct out of 10). */
export function calculateStars(correct: number): number {
  if (correct >= 10) return 3
  if (correct >= 7) return 2
  if (correct >= 5) return 1
  return 0
}

/** Compute which accessories should be unlocked based on current table state. */
export function computeUnlockedAccessories(
  tables: Record<number, TableProgress>
): AccessoryId[] {
  const list = Object.values(tables)
  const withOneStarOrMore = list.filter(t => t.stars >= 1).length
  const withTwoStarsOrMore = list.filter(t => t.stars >= 2).length
  const withThreeStars = list.filter(t => t.stars >= 3).length
  const anyThreeStars = withThreeStars >= 1

  const unlocked: AccessoryId[] = []
  if (withOneStarOrMore >= 1) unlocked.push('rainbow-horn')
  if (anyThreeStars) unlocked.push('golden-wings')
  if (withOneStarOrMore >= 5) unlocked.push('flower-crown')
  if (withTwoStarsOrMore >= 10) unlocked.push('magic-cape')
  if (withThreeStars >= 10) unlocked.push('glitter-sparkle')
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
  // Fisher-Yates shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[questions[i], questions[j]] = [questions[j], questions[i]]
  }
  return questions
}

/** Generate 3 distinct wrong answer options for a multiple-choice question. */
export function generateWrongOptions(correct: number): number[] {
  const offsets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5]
  const candidates = offsets
    .map(o => correct + o)
    .filter(n => n > 0 && n !== correct)

  // Shuffle candidates and take first 3
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  return candidates.slice(0, 3)
}
