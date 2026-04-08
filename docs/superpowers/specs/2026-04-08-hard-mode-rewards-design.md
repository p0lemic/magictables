# Hard Mode Rewards — Design Spec

**Date**: 2026-04-08  
**Status**: Approved

## Overview

Extend the rewards system so that hard mode sessions earn a separate track of up to 30 stars (3 per table × 10 tables), unlocking 13 new rewards progressively: 7 new accessories and 6 new body/mane colors exclusive to hard mode.

## Data Model Changes

### `TableProgress` (src/types/index.ts)
Add an optional field, defaulting to 0 when absent (backwards compatible with existing saves):
```ts
hardStars?: number  // 0–3 best score in hard mode, per table
```

### `UnicornColor` (src/types/index.ts)
Add 6 new hard-mode-exclusive colors:
```ts
'coral' | 'gold' | 'magic-purple' | 'silver' | 'ocean' | 'rainbow'
```

### `AccessoryId` (src/types/index.ts)
Add 7 new hard-mode-exclusive accessories:
```ts
'flame-horn' | 'dragon-wings' | 'star-tiara' |
'galaxy-cape' | 'thunder-wings' | 'ice-crown' | 'cosmic-horn'
```

### `UnicornState` (src/types/index.ts)
Add unlocked colors tracking:
```ts
unlockedColors: UnicornColor[]
```
The original 6 colors (white, lavender, pink, mint, yellow, sky) are always available. The 6 new colors start locked and unlock via hard stars.

## Reward Progression

Total hard stars = sum of `hardStars` across all 10 tables (max 30).

| Hard stars | Type | Reward |
|-----------|------|--------|
| 1  | Accessory | 🔥 Cuerno de Fuego (`flame-horn`) |
| 3  | Accessory | 🐉 Alas de Dragón (`dragon-wings`) |
| 5  | Color     | 🍊 Color coral (`coral`) |
| 8  | Accessory | ⭐ Tiara de Estrellas (`star-tiara`) |
| 10 | Color     | 🥇 Color dorado (`gold`) |
| 12 | Accessory | 🌌 Capa Galaxia (`galaxy-cape`) |
| 15 | Accessory | ⚡ Alas de Trueno (`thunder-wings`) |
| 18 | Color     | 🥈 Color plateado (`silver`) |
| 20 | Accessory | ❄️ Corona de Hielo (`ice-crown`) |
| 22 | Color     | 🔮 Color púrpura mágico (`magic-purple`) |
| 25 | Accessory | 💫 Cuerno Cósmico (`cosmic-horn`) |
| 28 | Color     | 🌊 Color azul océano (`ocean`) |
| 30 | Color     | 🌈 Color arcoíris (`rainbow`) |

## Logic Changes (src/utils/game.ts)

### `computeUnlockedAccessories`
Receives total hard stars as a second parameter. Appends hard-mode accessories based on the progression table above.

```ts
function computeUnlockedAccessories(
  tables: Record<number, TableProgress>,
  totalHardStars: number
): AccessoryId[]
```

### New `computeUnlockedColors`
Returns the list of hard-mode colors the player has unlocked:
```ts
function computeUnlockedColors(totalHardStars: number): UnicornColor[]
```

### New `computeTotalHardStars`
Helper to sum `hardStars` across all tables:
```ts
function computeTotalHardStars(tables: Record<number, TableProgress>): number
```

## Store Changes (src/store/gameStore.ts)

- `recordSessionResult` signature: add `difficulty?: 'easy' | 'hard'` parameter
- When `difficulty === 'hard'`: update `hardStars` (best score only) instead of `stars`
- After updating tables: compute newly unlocked colors via `computeUnlockedColors`
- Return value expands to include `newlyUnlockedColors: UnicornColor[]`
- `DEFAULT_UNICORN` includes `unlockedColors: []`

## UI Changes

### SessionResults (src/pages/SessionResults.tsx)
- Pass `difficulty` to `recordSessionResult`
- Unlock modal shows both new accessories and new colors (with colored circle preview)

### UnicornCustomizer (src/pages/UnicornCustomizer.tsx)
- The 6 new colors appear in the color pickers with a lock icon until unlocked; hint shows required hard stars
- New section at the bottom: **"Modo Difícil 🔥"** listing the 7 hard-mode accessories with lock/unlock state and hints

## Backwards Compatibility

- Existing saves without `hardStars` treat it as 0 — no migration needed
- Existing saves without `unlockedColors` treat it as `[]` — no migration needed
- All existing easy-mode progress and accessories are unaffected
