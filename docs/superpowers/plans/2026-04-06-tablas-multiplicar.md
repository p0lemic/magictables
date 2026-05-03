# Tablas de Multiplicar — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React 18 + Vite PWA game for a 7-year-old to learn multiplication tables 1–10 with unicorn theme, star achievements, and unicorn customization, running in Docker.

**Architecture:** Single-page React app with a state-machine router in `App.tsx` (no React Router). Pure game logic in `src/utils/game.ts` (fully tested). Zustand store with `persist` middleware saves all progress to `localStorage`. Docker provides dev (hot-reload on port 5173) and prod (nginx on port 80) environments.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Zustand 4, vite-plugin-pwa, Vitest + @testing-library/react, Docker (node:20-alpine + nginx:alpine)

---

## File Map

| File | Responsibility |
|---|---|
| `package.json` | All dependencies |
| `vite.config.ts` | Vite + Vitest + PWA config |
| `tailwind.config.ts` | Custom colors, font, animations |
| `postcss.config.js` | PostCSS for Tailwind |
| `Dockerfile` | Multi-stage: node build → nginx serve |
| `docker-compose.yml` | Dev: hot-reload on 5173 |
| `docker-compose.prod.yml` | Prod: nginx on 80 |
| `index.html` | HTML entry point |
| `src/main.tsx` | React bootstrap |
| `src/index.css` | Tailwind directives + CSS animations + Nunito font |
| `src/types/index.ts` | Shared types: AccessoryId, UnicornColor, TableProgress, Screen, UnicornState |
| `src/utils/game.ts` | Pure functions: calculateStars, computeUnlockedAccessories, isTableUnlocked, generateSession, generateWrongOptions |
| `src/utils/game.test.ts` | Tests for all pure game logic |
| `src/store/gameStore.ts` | Zustand store with persist: tables, unicorn, recordSessionResult, equipAccessory |
| `src/hooks/useSound.ts` | Web Audio API tones (correct, wrong, fanfare) |
| `src/components/StarRating.tsx` | 0–3 star display |
| `src/components/UnicornAvatar.tsx` | SVG unicorn with CSS custom properties for colors/accessories |
| `src/components/ProgressMap.tsx` | 10-node path showing table progress with lock/unlock |
| `src/components/ConfettiAnimation.tsx` | CSS confetti burst overlay |
| `src/components/MultipleChoiceInput.tsx` | 4 large touch-friendly answer buttons |
| `src/components/NumericKeyboard.tsx` | Custom number pad with current input display |
| `src/pages/Home.tsx` | Main menu: 3 navigation buttons + total stars |
| `src/pages/FreeMode.tsx` | Table selector grid (all 10 unlocked) |
| `src/pages/ProgressiveMode.tsx` | Progress map with sequential unlock |
| `src/pages/PracticeSession.tsx` | Active game: 10 questions, feedback, progress bar |
| `src/pages/SessionResults.tsx` | Results: star animation + optional accessory unlock modal |
| `src/pages/UnicornCustomizer.tsx` | Color palette + accessory equip |
| `src/App.tsx` | Screen state machine + renders active page |

---

## Task 1: Project Scaffold + Docker

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `index.html`
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `docker-compose.prod.yml`
- Create: `.dockerignore`
- Create: `src/main.tsx`
- Create: `src/App.tsx` (placeholder)
- Create: `src/index.css` (minimal)
- Create: `src/test-setup.ts`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "tablas-magicas",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "jsdom": "^24.1.0",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.4",
    "typescript": "^5.5.3",
    "vite": "^5.3.1",
    "vite-plugin-pwa": "^0.20.0",
    "vitest": "^1.6.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

- [ ] **Step 3: Create `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["vite.config.ts", "tailwind.config.ts", "postcss.config.js"]
}
```

- [ ] **Step 5: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Tablas Mágicas',
        short_name: 'Tablas',
        description: 'Aprende las tablas de multiplicar con unicornios',
        theme_color: '#9b5de5',
        background_color: '#f0e6ff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  }
})
```

- [ ] **Step 6: Create `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        magic: {
          purple: '#9b5de5',
          pink: '#f72585',
          yellow: '#fee440',
          teal: '#00f5d4',
          lavender: '#f0e6ff',
          rose: '#ffe6f0',
        },
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
      animation: {
        'bounce-in': 'bounceIn 0.4s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'star-fill': 'starFill 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'confetti-fall': 'confettiFall 2s ease-in forwards',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-8px)' },
          '40%': { transform: 'translateX(8px)' },
          '60%': { transform: 'translateX(-5px)' },
          '80%': { transform: 'translateX(5px)' },
        },
        starFill: {
          '0%': { transform: 'scale(0) rotate(-30deg)', opacity: '0' },
          '60%': { transform: 'scale(1.3) rotate(10deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        confettiFall: {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 7: Create `postcss.config.js`**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 8: Create `index.html`**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/unicorn.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="Tablas Mágicas" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
    <title>Tablas Mágicas ✨</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 9: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 10: Create placeholder `src/App.tsx`**

```tsx
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex items-center justify-center font-nunito">
      <h1 className="text-4xl font-black text-magic-purple">¡Tablas Mágicas! ✨</h1>
    </div>
  )
}
```

- [ ] **Step 11: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  body {
    font-family: 'Nunito', sans-serif;
    overscroll-behavior: none;
    user-select: none;
  }
}

@layer utilities {
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
}

/* Floating star particles in background */
.star-particle {
  position: fixed;
  pointer-events: none;
  z-index: 0;
  animation: float var(--duration, 3s) ease-in-out infinite;
  animation-delay: var(--delay, 0s);
  opacity: 0.4;
}
```

- [ ] **Step 12: Create `src/test-setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 13: Create `Dockerfile`**

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- [ ] **Step 14: Create `nginx.conf`**

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

- [ ] **Step 15: Create `docker-compose.yml`**

```yaml
services:
  app:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

- [ ] **Step 16: Create `docker-compose.prod.yml`**

```yaml
services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
```

- [ ] **Step 17: Create `.dockerignore`**

```
node_modules
dist
.git
.dockerignore
*.md
```

- [ ] **Step 18: Start the dev container and verify it works**

```bash
docker-compose up
```

Expected: Dev server starts, open `http://localhost:5173` and see "¡Tablas Mágicas! ✨" in purple on a gradient background.

- [ ] **Step 19: Commit**

```bash
git init
git add .
git commit -m "feat: project scaffold with React+Vite+Tailwind+Docker"
```

---

## Task 2: Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create `src/types/index.ts`**

```typescript
export type AccessoryId =
  | 'rainbow-horn'
  | 'golden-wings'
  | 'flower-crown'
  | 'magic-cape'
  | 'glitter-sparkle';

export type UnicornColor = 'white' | 'lavender' | 'pink' | 'mint' | 'yellow' | 'sky';

export interface TableProgress {
  stars: number;           // 0–3, best historical score only
  masteryPercent: number;  // (totalCorrect / totalAttempts) × 100
  totalAttempts: number;
  totalCorrect: number;
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
}

export interface SessionQuestion {
  a: number;
  b: number;
  answer: number;
}

// State-machine router screens
export type Screen =
  | { name: 'home' }
  | { name: 'free-mode' }
  | { name: 'progressive-mode' }
  | { name: 'practice-session'; table: number; mode: 'free' | 'progressive' }
  | { name: 'session-results'; table: number; correct: number; mode: 'free' | 'progressive' }
  | { name: 'unicorn-customizer' };

export const UNICORN_COLOR_HEX: Record<UnicornColor, string> = {
  white:    '#FFFFFF',
  lavender: '#E8D5FF',
  pink:     '#FFB3D9',
  mint:     '#B3FFE8',
  yellow:   '#FFF4B3',
  sky:      '#B3E8FF',
};

export const ACCESSORY_LABEL: Record<AccessoryId, string> = {
  'rainbow-horn':   'Cuerno Arcoíris',
  'golden-wings':   'Alas Doradas',
  'flower-crown':   'Corona de Flores',
  'magic-cape':     'Capa Mágica',
  'glitter-sparkle':'Destello de Purpurina',
};

export const ACCESSORY_UNLOCK_HINT: Record<AccessoryId, string> = {
  'rainbow-horn':    'Consigue 1 estrella en cualquier tabla',
  'golden-wings':    'Consigue 3 estrellas en cualquier tabla',
  'flower-crown':    'Completa 5 tablas con ≥1 estrella',
  'magic-cape':      'Consigue ≥2 estrellas en todas las tablas',
  'glitter-sparkle': 'Consigue 3 estrellas en TODAS las tablas',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add shared types"
```

---

## Task 3: Pure Game Logic (TDD)

**Files:**
- Create: `src/utils/game.test.ts`
- Create: `src/utils/game.ts`

- [ ] **Step 1: Write failing tests in `src/utils/game.test.ts`**

```typescript
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
```

- [ ] **Step 2: Run tests — verify they all fail**

```bash
docker-compose run --rm app npx vitest run src/utils/game.test.ts
```

Expected: All tests fail with "Cannot find module './game'".

- [ ] **Step 3: Create `src/utils/game.ts`**

```typescript
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
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
docker-compose run --rm app npx vitest run src/utils/game.test.ts
```

Expected: All 22 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/
git commit -m "feat: pure game logic with full test coverage"
```

---

## Task 4: Zustand Store

**Files:**
- Create: `src/store/gameStore.ts`

- [ ] **Step 1: Create `src/store/gameStore.ts`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add src/store/
git commit -m "feat: Zustand store with persist middleware"
```

---

## Task 5: Global Styles + Background Particles

**Files:**
- Modify: `src/index.css` (replace placeholder)
- Create: `src/components/StarParticles.tsx`

- [ ] **Step 1: Replace `src/index.css` with full version**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    box-sizing: border-box;
  }

  body {
    font-family: 'Nunito', sans-serif;
    overscroll-behavior: none;
    -webkit-user-select: none;
    user-select: none;
    margin: 0;
    padding: 0;
  }
}

@layer utilities {
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
}
```

- [ ] **Step 2: Create `src/components/StarParticles.tsx`**

```tsx
const PARTICLES = [
  { emoji: '⭐', size: 18, left: 5,  top: 10, duration: 3.2, delay: 0 },
  { emoji: '✨', size: 14, left: 15, top: 60, duration: 2.8, delay: 0.5 },
  { emoji: '⭐', size: 22, left: 25, top: 30, duration: 3.5, delay: 1 },
  { emoji: '💫', size: 16, left: 40, top: 75, duration: 2.5, delay: 0.3 },
  { emoji: '✨', size: 20, left: 55, top: 20, duration: 3.1, delay: 0.8 },
  { emoji: '⭐', size: 12, left: 65, top: 50, duration: 2.9, delay: 1.2 },
  { emoji: '💫', size: 18, left: 75, top: 15, duration: 3.3, delay: 0.2 },
  { emoji: '✨', size: 14, left: 85, top: 65, duration: 2.7, delay: 0.7 },
  { emoji: '⭐', size: 16, left: 92, top: 40, duration: 3.0, delay: 1.5 },
  { emoji: '💫', size: 20, left: 48, top: 88, duration: 2.6, delay: 0.4 },
]

export default function StarParticles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-0 select-none"
          style={{
            fontSize: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.35,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/index.css src/components/StarParticles.tsx
git commit -m "feat: global styles and background star particles"
```

---

## Task 6: useSound Hook

**Files:**
- Create: `src/hooks/useSound.ts`

- [ ] **Step 1: Create `src/hooks/useSound.ts`**

```typescript
import { useRef } from 'react'

export function useSound() {
  const enabledRef = useRef(false)

  function getCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!enabledRef.current) return null
    return new AudioContext()
  }

  function playTone(
    ctx: AudioContext,
    frequency: number,
    startTime: number,
    duration: number,
    gain = 0.3
  ) {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.frequency.setValueAtTime(frequency, startTime)
    gainNode.gain.setValueAtTime(gain, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }

  /** Call on first user interaction to enable sound. */
  function enable() {
    enabledRef.current = true
  }

  function playCorrect() {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    playTone(ctx, 523, t, 0.15)        // C5
    playTone(ctx, 659, t + 0.12, 0.2)  // E5
    playTone(ctx, 784, t + 0.24, 0.3)  // G5
  }

  function playWrong() {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    playTone(ctx, 330, t, 0.15, 0.25)        // E4
    playTone(ctx, 277, t + 0.15, 0.3, 0.2)  // C#4
  }

  function playStarFanfare() {
    const ctx = getCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const melody = [523, 659, 784, 1047]
    melody.forEach((freq, i) => {
      playTone(ctx, freq, t + i * 0.15, 0.25, 0.35)
    })
  }

  return { enable, playCorrect, playWrong, playStarFanfare }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/
git commit -m "feat: Web Audio API sound hook"
```

---

## Task 7: StarRating Component

**Files:**
- Create: `src/components/StarRating.tsx`
- Create: `src/components/StarRating.test.tsx`

- [ ] **Step 1: Write failing test in `src/components/StarRating.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders 3 filled stars for stars=3', () => {
    render(<StarRating stars={3} />)
    expect(screen.getAllByText('⭐')).toHaveLength(3)
    expect(screen.queryByText('☆')).toBeNull()
  })

  it('renders 1 filled and 2 empty stars for stars=1', () => {
    render(<StarRating stars={1} />)
    expect(screen.getAllByText('⭐')).toHaveLength(1)
    expect(screen.getAllByText('☆')).toHaveLength(2)
  })

  it('renders 3 empty stars for stars=0', () => {
    render(<StarRating stars={0} />)
    expect(screen.getAllByText('☆')).toHaveLength(3)
    expect(screen.queryByText('⭐')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
docker-compose run --rm app npx vitest run src/components/StarRating.test.tsx
```

Expected: FAIL — "Cannot find module './StarRating'"

- [ ] **Step 3: Create `src/components/StarRating.tsx`**

```tsx
interface Props {
  stars: number      // 0–3
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const SIZE = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }

export default function StarRating({ stars, size = 'md', animated = false }: Props) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={`${SIZE[size]} ${animated && i < stars ? 'animate-star-fill' : ''}`}
          style={animated ? { animationDelay: `${i * 0.2}s` } : undefined}
        >
          {i < stars ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
docker-compose run --rm app npx vitest run src/components/StarRating.test.tsx
```

Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/StarRating.tsx src/components/StarRating.test.tsx
git commit -m "feat: StarRating component with tests"
```

---

## Task 8: UnicornAvatar SVG Component

**Files:**
- Create: `src/components/UnicornAvatar.tsx`

- [ ] **Step 1: Create `src/components/UnicornAvatar.tsx`**

```tsx
import type { UnicornEquipped } from '../types'
import { UNICORN_COLOR_HEX } from '../types'

interface Props {
  equipped: UnicornEquipped
  size?: number
  floating?: boolean
}

export default function UnicornAvatar({ equipped, size = 200, floating = false }: Props) {
  const bodyColor = UNICORN_COLOR_HEX[equipped.bodyColor]
  const maneColor = UNICORN_COLOR_HEX[equipped.maneColor]
  const hasWings = equipped.wings === 'golden-wings'
  const hasCape = equipped.cape === 'magic-cape'
  const hasSparkle = equipped.horn === 'rainbow-horn'

  return (
    <div
      className={floating ? 'animate-float' : ''}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {/* Magic cape (behind body) */}
        {hasCape && (
          <ellipse cx="115" cy="148" rx="65" ry="30"
            fill="#c77dff" opacity="0.7" />
        )}

        {/* Wings (behind body) */}
        {hasWings && (
          <>
            <ellipse cx="165" cy="110" rx="30" ry="18"
              fill="#FFD700" opacity="0.85"
              transform="rotate(-20 165 110)" />
            <ellipse cx="170" cy="125" rx="25" ry="14"
              fill="#FFE55C" opacity="0.75"
              transform="rotate(-10 170 125)" />
          </>
        )}

        {/* Body */}
        <ellipse cx="115" cy="135" rx="58" ry="40" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1.5" />

        {/* Neck */}
        <ellipse cx="72" cy="108" rx="18" ry="22" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />

        {/* Head */}
        <circle cx="62" cy="82" r="28" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1.5" />

        {/* Ear */}
        <polygon points="78,64 88,64 83,50" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />
        <polygon points="80,64 86,64 83,54" fill={maneColor} opacity="0.6" />

        {/* Horn */}
        <polygon
          points="57,56 67,56 62,28"
          fill={hasSparkle ? 'url(#rainbowGrad)' : '#fee440'}
          stroke="#f0c000" strokeWidth="1"
        />
        {hasSparkle && (
          <defs>
            <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#ff6b6b" />
              <stop offset="25%"  stopColor="#ffd93d" />
              <stop offset="50%"  stopColor="#6bcb77" />
              <stop offset="75%"  stopColor="#4d96ff" />
              <stop offset="100%" stopColor="#c77dff" />
            </linearGradient>
          </defs>
        )}

        {/* Mane strands */}
        <path d="M75 60 Q88 75 82 98 Q76 112 70 124"
          stroke={maneColor} strokeWidth="9" fill="none"
          strokeLinecap="round" opacity="0.9" />
        <path d="M82 57 Q98 73 91 100 Q85 116 80 128"
          stroke={maneColor} strokeWidth="6" fill="none"
          strokeLinecap="round" opacity="0.7" />

        {/* Eye */}
        <circle cx="52" cy="80" r="5" fill="#4a2060" />
        <circle cx="53.5" cy="78.5" r="2" fill="white" />
        {/* Eyelashes */}
        <line x1="48" y1="74" x2="46" y2="71" stroke="#4a2060" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="52" y1="73" x2="51" y2="70" stroke="#4a2060" strokeWidth="1.5" strokeLinecap="round" />

        {/* Nose */}
        <ellipse cx="44" cy="86" rx="4" ry="2.5" fill="#f4b8d0" />

        {/* Legs */}
        <rect x="78"  y="165" width="13" height="28" rx="6" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />
        <rect x="97"  y="165" width="13" height="28" rx="6" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />
        <rect x="130" y="162" width="13" height="28" rx="6" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />
        <rect x="148" y="162" width="13" height="28" rx="6" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />

        {/* Hooves */}
        <rect x="78"  y="187" width="13" height="8" rx="4" fill="#c8a0e0" />
        <rect x="97"  y="187" width="13" height="8" rx="4" fill="#c8a0e0" />
        <rect x="130" y="184" width="13" height="8" rx="4" fill="#c8a0e0" />
        <rect x="148" y="184" width="13" height="8" rx="4" fill="#c8a0e0" />

        {/* Tail */}
        <path d="M170 130 Q192 108 186 90 Q180 74 173 80 Q167 90 172 115"
          fill={maneColor} opacity="0.88" />
        <path d="M168 133 Q188 118 183 100 Q178 82 170 88"
          stroke={maneColor} strokeWidth="5" fill="none"
          strokeLinecap="round" opacity="0.6" />

        {/* Glitter sparkle effect */}
        {equipped.horn === 'rainbow-horn' && (
          <>
            <text x="38" y="22" fontSize="12" opacity="0.8">✨</text>
            <text x="70" y="14" fontSize="10" opacity="0.6">⭐</text>
            <text x="88" y="24" fontSize="8"  opacity="0.7">💫</text>
          </>
        )}

        {/* Flower crown */}
        {equipped.wings === 'golden-wings' || equipped.horn === 'flower-crown' ? null : null}
        {/* Note: flower-crown is an AccessoryId for wings slot — rendered as flowers around head */}
        {equipped.wings === null && equipped.horn === 'flower-crown' && (
          <>
            <text x="35" y="62" fontSize="14">🌸</text>
            <text x="55" y="55" fontSize="12">🌺</text>
            <text x="72" y="58" fontSize="14">🌸</text>
          </>
        )}
      </svg>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/UnicornAvatar.tsx
git commit -m "feat: SVG unicorn avatar with dynamic colors and accessories"
```

---

## Task 9: ProgressMap Component

**Files:**
- Create: `src/components/ProgressMap.tsx`

- [ ] **Step 1: Create `src/components/ProgressMap.tsx`**

```tsx
import type { TableProgress } from '../types'
import StarRating from './StarRating'

interface Props {
  tables: Record<number, TableProgress>
  isUnlocked: (n: number) => boolean
  onSelectTable: (n: number) => void
}

export default function ProgressMap({ tables, isUnlocked, onSelectTable }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 w-full px-4">
      {Array.from({ length: 10 }, (_, i) => {
        const n = i + 1
        const unlocked = isUnlocked(n)
        const progress = tables[n]

        return (
          <button
            key={n}
            onClick={() => unlocked && onSelectTable(n)}
            disabled={!unlocked}
            className={`
              w-full max-w-xs flex items-center gap-4 p-4 rounded-2xl border-2 transition-all
              ${unlocked
                ? 'bg-white border-magic-purple shadow-md active:scale-95 cursor-pointer'
                : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'}
            `}
          >
            {/* Table number badge */}
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shrink-0
              ${unlocked ? 'bg-magic-purple text-white' : 'bg-gray-300 text-gray-500'}
            `}>
              {unlocked ? n : '🔒'}
            </div>

            {/* Label + stars */}
            <div className="flex flex-col items-start gap-1">
              <span className="font-bold text-lg text-gray-700">
                Tabla del {n}
              </span>
              {unlocked && (
                <StarRating stars={progress?.stars ?? 0} size="sm" />
              )}
            </div>

            {/* Arrow */}
            {unlocked && (
              <span className="ml-auto text-magic-purple text-2xl">→</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProgressMap.tsx
git commit -m "feat: ProgressMap component with lock/unlock states"
```

---

## Task 10: ConfettiAnimation Component

**Files:**
- Create: `src/components/ConfettiAnimation.tsx`

- [ ] **Step 1: Create `src/components/ConfettiAnimation.tsx`**

```tsx
import { useEffect, useState } from 'react'

const COLORS = ['#f72585', '#fee440', '#9b5de5', '#00f5d4', '#ff9e00', '#ff6b6b']
const EMOJIS = ['⭐', '✨', '💫', '🌟', '🦄', '🎉']

interface Piece {
  id: number
  left: number
  color: string
  emoji: string
  duration: number
  delay: number
  size: number
}

function makeConfetti(count: number): Piece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    duration: 1.5 + Math.random() * 1.5,
    delay: Math.random() * 0.8,
    size: 14 + Math.floor(Math.random() * 14),
  }))
}

interface Props {
  active: boolean
  count?: number
}

export default function ConfettiAnimation({ active, count = 30 }: Props) {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    if (active) {
      setPieces(makeConfetti(count))
    } else {
      setPieces([])
    }
  }, [active, count])

  if (!active || pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0 text-center"
          style={{
            left: `${p.left}%`,
            fontSize: p.size,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ConfettiAnimation.tsx
git commit -m "feat: CSS confetti animation component"
```

---

## Task 11: MultipleChoiceInput + NumericKeyboard

**Files:**
- Create: `src/components/MultipleChoiceInput.tsx`
- Create: `src/components/NumericKeyboard.tsx`

- [ ] **Step 1: Create `src/components/MultipleChoiceInput.tsx`**

```tsx
interface Props {
  options: number[]   // 4 values: [correct, wrong1, wrong2, wrong3] shuffled
  onAnswer: (n: number) => void
  disabled?: boolean
}

const BUTTON_COLORS = [
  'bg-magic-purple text-white border-purple-700',
  'bg-magic-pink   text-white border-pink-700',
  'bg-amber-400    text-white border-amber-600',
  'bg-teal-400     text-white border-teal-600',
]

export default function MultipleChoiceInput({ options, onAnswer, disabled = false }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md px-4">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => !disabled && onAnswer(opt)}
          disabled={disabled}
          className={`
            ${BUTTON_COLORS[i % BUTTON_COLORS.length]}
            h-20 rounded-2xl border-b-4 text-3xl font-black
            transition-all active:scale-95 active:border-b-2 active:translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-md
          `}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/NumericKeyboard.tsx`**

```tsx
import { useState } from 'react'

interface Props {
  onAnswer: (n: number) => void
  disabled?: boolean
}

export default function NumericKeyboard({ onAnswer, disabled = false }: Props) {
  const [input, setInput] = useState('')

  function press(digit: string) {
    if (disabled) return
    if (input.length >= 3) return   // max 3 digits (100)
    setInput(prev => prev + digit)
  }

  function del() {
    setInput(prev => prev.slice(0, -1))
  }

  function confirm() {
    if (!input || disabled) return
    onAnswer(parseInt(input, 10))
    setInput('')
  }

  const keys = ['7','8','9','4','5','6','1','2','3']

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs px-4">
      {/* Display */}
      <div className="w-full h-16 bg-white rounded-2xl border-2 border-magic-purple flex items-center justify-center text-4xl font-black text-magic-purple shadow-inner">
        {input || <span className="text-gray-300">?</span>}
      </div>

      {/* Number grid */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {keys.map(k => (
          <button
            key={k}
            onClick={() => press(k)}
            disabled={disabled}
            className="h-16 bg-white rounded-xl border-2 border-b-4 border-magic-purple text-2xl font-black text-magic-purple
              active:scale-95 active:border-b-2 transition-all shadow-sm disabled:opacity-40"
          >
            {k}
          </button>
        ))}
        {/* Bottom row: delete, 0, confirm */}
        <button
          onClick={del}
          disabled={disabled}
          className="h-16 bg-gray-100 rounded-xl border-2 border-b-4 border-gray-400 text-2xl
            active:scale-95 active:border-b-2 transition-all shadow-sm disabled:opacity-40"
        >
          ⌫
        </button>
        <button
          onClick={() => press('0')}
          disabled={disabled}
          className="h-16 bg-white rounded-xl border-2 border-b-4 border-magic-purple text-2xl font-black text-magic-purple
            active:scale-95 active:border-b-2 transition-all shadow-sm disabled:opacity-40"
        >
          0
        </button>
        <button
          onClick={confirm}
          disabled={disabled || !input}
          className="h-16 bg-magic-pink rounded-xl border-2 border-b-4 border-pink-700 text-2xl
            active:scale-95 active:border-b-2 transition-all shadow-sm text-white font-black
            disabled:opacity-40"
        >
          ✓
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/MultipleChoiceInput.tsx src/components/NumericKeyboard.tsx
git commit -m "feat: MultipleChoiceInput and NumericKeyboard components"
```

---

## Task 12: Home Page

**Files:**
- Create: `src/pages/Home.tsx`

- [ ] **Step 1: Create `src/pages/Home.tsx`**

```tsx
import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import StarParticles from '../components/StarParticles'
import UnicornAvatar from '../components/UnicornAvatar'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function Home({ onNavigate }: Props) {
  const { tables, unicorn } = useGameStore()

  const totalStars = Object.values(tables).reduce((sum, t) => sum + t.stars, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center justify-center gap-6 p-6 relative overflow-hidden font-nunito">
      <StarParticles />

      {/* Header */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-black text-magic-purple drop-shadow-sm">
          Tablas Mágicas
        </h1>
        <p className="text-xl font-bold text-pink-500 mt-1">✨ Aprende con unicornios ✨</p>
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <UnicornAvatar equipped={unicorn.equipped} size={160} floating />
      </div>

      {/* Stars count */}
      <div className="relative z-10 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-2 border-2 border-magic-yellow shadow-md">
        <span className="text-2xl font-black text-amber-500">
          ⭐ {totalStars} / 30 estrellas
        </span>
      </div>

      {/* Navigation buttons */}
      <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'free-mode' })}
          className="w-full h-20 bg-magic-purple text-white rounded-2xl border-b-4 border-purple-800
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🎯 Práctica libre
        </button>

        <button
          onClick={() => onNavigate({ name: 'progressive-mode' })}
          className="w-full h-20 bg-magic-pink text-white rounded-2xl border-b-4 border-pink-800
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🗺️ Modo progresivo
        </button>

        <button
          onClick={() => onNavigate({ name: 'unicorn-customizer' })}
          className="w-full h-20 bg-amber-400 text-white rounded-2xl border-b-4 border-amber-600
            text-2xl font-black shadow-lg active:scale-95 active:border-b-2 transition-all"
        >
          🦄 Mi unicornio
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: Home page with navigation and total stars"
```

---

## Task 13: FreeMode Page

**Files:**
- Create: `src/pages/FreeMode.tsx`

- [ ] **Step 1: Create `src/pages/FreeMode.tsx`**

```tsx
import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import StarRating from '../components/StarRating'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function FreeMode({ onNavigate }: Props) {
  const { tables } = useGameStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-6 p-6 font-nunito relative overflow-hidden">
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
        <h2 className="text-3xl font-black text-magic-purple">Práctica libre</h2>
      </div>

      <p className="relative z-10 text-lg font-bold text-pink-500 -mt-2">
        ¿Qué tabla quieres practicar?
      </p>

      {/* Table grid */}
      <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-md">
        {Array.from({ length: 10 }, (_, i) => {
          const n = i + 1
          const progress = tables[n]
          return (
            <button
              key={n}
              onClick={() => onNavigate({ name: 'practice-session', table: n, mode: 'free' })}
              className="bg-white rounded-2xl border-2 border-b-4 border-magic-purple p-4
                flex flex-col items-center gap-2 shadow-md
                active:scale-95 active:border-b-2 transition-all"
            >
              <span className="text-4xl font-black text-magic-purple">×{n}</span>
              <span className="text-sm font-bold text-gray-500">Tabla del {n}</span>
              <StarRating stars={progress?.stars ?? 0} size="sm" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/FreeMode.tsx
git commit -m "feat: FreeMode table selector page"
```

---

## Task 14: ProgressiveMode Page

**Files:**
- Create: `src/pages/ProgressiveMode.tsx`

- [ ] **Step 1: Create `src/pages/ProgressiveMode.tsx`**

```tsx
import type { Screen } from '../types'
import { useGameStore } from '../store/gameStore'
import { isTableUnlocked } from '../utils/game'
import ProgressMap from '../components/ProgressMap'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

export default function ProgressiveMode({ onNavigate }: Props) {
  const { tables } = useGameStore()

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
        <h2 className="text-3xl font-black text-magic-purple">Modo progresivo</h2>
      </div>

      <p className="relative z-10 text-base font-bold text-pink-500 -mt-2 text-center px-4">
        Consigue ≥2 estrellas en una tabla para desbloquear la siguiente 🔓
      </p>

      <div className="relative z-10 w-full overflow-y-auto no-scrollbar pb-8">
        <ProgressMap
          tables={tables}
          isUnlocked={(n) => isTableUnlocked(n, tables)}
          onSelectTable={(n) =>
            onNavigate({ name: 'practice-session', table: n, mode: 'progressive' })
          }
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/ProgressiveMode.tsx
git commit -m "feat: ProgressiveMode page with sequential unlock"
```

---

## Task 15: PracticeSession Page

**Files:**
- Create: `src/pages/PracticeSession.tsx`

- [ ] **Step 1: Create `src/pages/PracticeSession.tsx`**

```tsx
import { useState, useEffect, useCallback } from 'react'
import type { Screen, SessionQuestion } from '../types'
import { useGameStore } from '../store/gameStore'
import { generateSession, generateWrongOptions } from '../utils/game'
import { useSound } from '../hooks/useSound'
import MultipleChoiceInput from '../components/MultipleChoiceInput'
import NumericKeyboard from '../components/NumericKeyboard'
import StarParticles from '../components/StarParticles'

interface Props {
  table: number
  mode: 'free' | 'progressive'
  onNavigate: (screen: Screen) => void
}

type FeedbackState = 'none' | 'correct' | 'wrong'

function shuffleOptions(correct: number): number[] {
  const wrongs = generateWrongOptions(correct)
  const all = [correct, ...wrongs]
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

export default function PracticeSession({ table, mode, onNavigate }: Props) {
  const { tables } = useGameStore()
  const sound = useSound()

  const [questions] = useState<SessionQuestion[]>(() => generateSession(table))
  const [current, setCurrent] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [feedback, setFeedback] = useState<FeedbackState>('none')
  const [options] = useState<number[][]>(() =>
    generateSession(table).map(q => shuffleOptions(q.answer))
  )

  const mastery = tables[table]?.masteryPercent ?? 0
  const useKeyboard = mastery >= 80
  const q: SessionQuestion = questions[current]

  // Enable sound on first render (user is already interacting)
  useEffect(() => { sound.enable() }, [])

  const handleAnswer = useCallback((answer: number) => {
    if (feedback !== 'none') return

    const isCorrect = answer === q.answer

    if (isCorrect) {
      sound.playCorrect()
      setFeedback('correct')
      setCorrect(prev => prev + 1)
    } else {
      sound.playWrong()
      setFeedback('wrong')
    }

    setTimeout(() => {
      if (current + 1 >= 10) {
        const finalCorrect = isCorrect ? correct + 1 : correct
        onNavigate({ name: 'session-results', table, correct: finalCorrect, mode })
      } else {
        setCurrent(prev => prev + 1)
        setFeedback('none')
      }
    }, isCorrect ? 800 : 1500)
  }, [feedback, q, correct, current, table, mode, sound, onNavigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-magic-lavender to-magic-rose flex flex-col items-center gap-5 p-6 font-nunito relative overflow-hidden">
      <StarParticles />

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-between text-sm font-bold text-magic-purple mb-1">
          <span>Tabla del {table}</span>
          <span>{current + 1} / 10</span>
        </div>
        <div className="h-4 bg-white/60 rounded-full overflow-hidden border border-magic-purple/30">
          <div
            className="h-full bg-magic-purple rounded-full transition-all duration-500"
            style={{ width: `${((current) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div
        className={`
          relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-8
          flex flex-col items-center gap-4 border-2
          ${feedback === 'correct' ? 'border-green-400 animate-bounce-in' : ''}
          ${feedback === 'wrong'   ? 'border-red-400 animate-shake' : ''}
          ${feedback === 'none'    ? 'border-magic-purple/30' : ''}
        `}
      >
        <p className="text-2xl font-bold text-gray-500">¿Cuánto es?</p>
        <p className="text-6xl font-black text-magic-purple">
          {q.a} × {q.b} = ?
        </p>

        {feedback === 'correct' && (
          <p className="text-4xl animate-bounce-in">✅ ¡Correcto!</p>
        )}
        {feedback === 'wrong' && (
          <p className="text-2xl text-red-500 font-bold">
            ❌ Era <span className="text-3xl font-black">{q.answer}</span>
          </p>
        )}
      </div>

      {/* Input */}
      <div className="relative z-10 w-full flex justify-center">
        {useKeyboard
          ? <NumericKeyboard onAnswer={handleAnswer} disabled={feedback !== 'none'} />
          : <MultipleChoiceInput
              options={options[current]}
              onAnswer={handleAnswer}
              disabled={feedback !== 'none'}
            />
        }
      </div>

      {/* Score so far */}
      <div className="relative z-10 mt-auto">
        <span className="text-lg font-bold text-magic-purple/70">
          Aciertos: {correct} / {current}
        </span>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/PracticeSession.tsx
git commit -m "feat: PracticeSession page with feedback and adaptive input"
```

---

## Task 16: SessionResults Page

**Files:**
- Create: `src/pages/SessionResults.tsx`

- [ ] **Step 1: Create `src/pages/SessionResults.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react'
import type { AccessoryId, Screen } from '../types'
import { ACCESSORY_LABEL } from '../types'
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
  onNavigate: (screen: Screen) => void
}

export default function SessionResults({ table, correct, mode, onNavigate }: Props) {
  const { recordSessionResult, unicorn } = useGameStore()
  const sound = useSound()
  const [newAccessories, setNewAccessories] = useState<AccessoryId[]>([])
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const [starsAnimated, setStarsAnimated] = useState(false)
  const recorded = useRef(false)

  const stars = correct >= 10 ? 3 : correct >= 7 ? 2 : correct >= 5 ? 1 : 0

  useEffect(() => {
    if (recorded.current) return
    recorded.current = true

    sound.enable()
    const unlocked = recordSessionResult(table, correct)
    setNewAccessories(unlocked)

    setTimeout(() => {
      setStarsAnimated(true)
      if (stars > 0) {
        sound.playStarFanfare()
        setConfetti(true)
        setTimeout(() => setConfetti(false), 2500)
      }
    }, 400)

    if (unlocked.length > 0) {
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
        <StarRating stars={starsAnimated ? stars : 0} size="lg" animated={starsAnimated} />
      </div>

      {/* Unicorn */}
      <div className="relative z-10">
        <UnicornAvatar equipped={unicorn.equipped} size={130} floating />
      </div>

      {/* Action buttons */}
      <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onNavigate({ name: 'practice-session', table, mode })}
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

      {/* Accessory unlock modal */}
      {showUnlockModal && newAccessories.length > 0 && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowUnlockModal(false)}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-xs w-full flex flex-col items-center gap-4 shadow-2xl border-2 border-magic-yellow"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-2xl font-black text-magic-purple text-center">
              🎉 ¡Nuevo accesorio!
            </p>
            <div className="animate-spin-slow text-6xl">✨</div>
            {newAccessories.map(a => (
              <p key={a} className="text-xl font-black text-amber-500 text-center">
                🦄 {ACCESSORY_LABEL[a]}
              </p>
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

- [ ] **Step 2: Commit**

```bash
git add src/pages/SessionResults.tsx
git commit -m "feat: SessionResults with star animation and accessory unlock modal"
```

---

## Task 17: UnicornCustomizer Page

**Files:**
- Create: `src/pages/UnicornCustomizer.tsx`

- [ ] **Step 1: Create `src/pages/UnicornCustomizer.tsx`**

```tsx
import type { AccessoryId, Screen, UnicornColor, UnicornEquipped } from '../types'
import { UNICORN_COLOR_HEX, ACCESSORY_LABEL, ACCESSORY_UNLOCK_HINT } from '../types'
import { useGameStore } from '../store/gameStore'
import UnicornAvatar from '../components/UnicornAvatar'
import StarParticles from '../components/StarParticles'

interface Props {
  onNavigate: (screen: Screen) => void
}

const COLORS: UnicornColor[] = ['white', 'lavender', 'pink', 'mint', 'yellow', 'sky']
const COLOR_LABEL: Record<UnicornColor, string> = {
  white: 'Blanca', lavender: 'Lila', pink: 'Rosa', mint: 'Menta', yellow: 'Amarilla', sky: 'Celeste',
}

const ACCESSORIES: Array<{ id: AccessoryId; slot: keyof UnicornEquipped; emoji: string }> = [
  { id: 'rainbow-horn',   slot: 'horn',  emoji: '🌈' },
  { id: 'golden-wings',  slot: 'wings', emoji: '🪽' },
  { id: 'flower-crown',  slot: 'horn',  emoji: '🌸' },
  { id: 'magic-cape',    slot: 'cape',  emoji: '🧣' },
  { id: 'glitter-sparkle', slot: 'horn', emoji: '✨' },
]

export default function UnicornCustomizer({ onNavigate }: Props) {
  const { unicorn, equipAccessory } = useGameStore()
  const { equipped, unlockedAccessories } = unicorn

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
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🎨 Color del cuerpo</p>
        <div className="flex gap-3 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => equipAccessory('bodyColor', c)}
              className={`
                w-11 h-11 rounded-full border-4 transition-all active:scale-90
                ${equipped.bodyColor === c ? 'border-magic-purple scale-110 shadow-lg' : 'border-white shadow'}
              `}
              style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
              title={COLOR_LABEL[c]}
            />
          ))}
        </div>
      </div>

      {/* Mane color */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🌈 Color de la melena</p>
        <div className="flex gap-3 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => equipAccessory('maneColor', c)}
              className={`
                w-11 h-11 rounded-full border-4 transition-all active:scale-90
                ${equipped.maneColor === c ? 'border-magic-purple scale-110 shadow-lg' : 'border-white shadow'}
              `}
              style={{ backgroundColor: UNICORN_COLOR_HEX[c] }}
              title={COLOR_LABEL[c]}
            />
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div className="relative z-10 bg-white/80 rounded-2xl p-4 w-full max-w-md border border-magic-purple/20 shadow">
        <p className="font-black text-magic-purple mb-3">🦄 Accesorios</p>
        <div className="flex flex-col gap-2">
          {ACCESSORIES.map(({ id, slot, emoji }) => {
            const unlocked = unlockedAccessories.includes(id)
            const isEquipped = equipped[slot] === id

            return (
              <button
                key={id}
                disabled={!unlocked}
                onClick={() => unlocked && equipAccessory(slot, isEquipped ? '' : id)}
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
      </div>

      <div className="h-4" />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/UnicornCustomizer.tsx
git commit -m "feat: UnicornCustomizer page with colors and accessories"
```

---

## Task 18: App Router + Final Integration

**Files:**
- Modify: `src/App.tsx` (replace placeholder with full router)

- [ ] **Step 1: Replace `src/App.tsx` with full router**

```tsx
import { useState } from 'react'
import type { Screen } from './types'
import Home from './pages/Home'
import FreeMode from './pages/FreeMode'
import ProgressiveMode from './pages/ProgressiveMode'
import PracticeSession from './pages/PracticeSession'
import SessionResults from './pages/SessionResults'
import UnicornCustomizer from './pages/UnicornCustomizer'

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  const navigate = (next: Screen) => setScreen(next)

  switch (screen.name) {
    case 'home':
      return <Home onNavigate={navigate} />

    case 'free-mode':
      return <FreeMode onNavigate={navigate} />

    case 'progressive-mode':
      return <ProgressiveMode onNavigate={navigate} />

    case 'practice-session':
      return (
        <PracticeSession
          table={screen.table}
          mode={screen.mode}
          onNavigate={navigate}
        />
      )

    case 'session-results':
      return (
        <SessionResults
          table={screen.table}
          correct={screen.correct}
          mode={screen.mode}
          onNavigate={navigate}
        />
      )

    case 'unicorn-customizer':
      return <UnicornCustomizer onNavigate={navigate} />
  }
}
```

- [ ] **Step 2: Run all tests**

```bash
docker-compose run --rm app npx vitest run
```

Expected: All tests PASS (game logic + StarRating).

- [ ] **Step 3: Start dev server and verify full app**

```bash
docker-compose up
```

Open `http://localhost:5173`. Walk through:
1. Home screen shows unicorn, total stars, 3 buttons
2. Práctica libre → tabla selector grid with stars
3. Tap tabla del 5 → session starts with multiple choice (mastery = 0%)
4. Answer 10 questions → SessionResults shows score + stars animation
5. Volver a Home → Modo progresivo → tabla 1 unlocked, rest locked
6. Mi unicornio → color pickers work, locked accessories show hints

- [ ] **Step 4: Test production build**

```bash
docker-compose -f docker-compose.prod.yml up --build
```

Open `http://localhost:80`. Verify app loads and works.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx
git commit -m "feat: App state-machine router — full game wired end to end"
```

---

## Self-Review

### Spec Coverage Check

| Spec requirement | Task |
|---|---|
| Tables 1–10 | Task 13 (FreeMode grid) |
| Free practice mode | Tasks 13, 15 |
| Progressive mode (sequential unlock) | Tasks 3, 9, 14 |
| Multiple choice when mastery < 80% | Task 11, 15 |
| Numeric keyboard when mastery ≥ 80% | Task 11, 15 |
| 10 questions per session | Tasks 3, 15 |
| 1★ ≥5/10, 2★ ≥7/10, 3★ 10/10 | Tasks 3, 16 |
| Stars never decrease | Task 4 (store) |
| 5 accessories with unlock conditions | Tasks 2, 3, 4, 17 |
| Unicorn SVG with color customization | Task 8 |
| Confetti on star gain | Task 16 |
| Accessory unlock modal | Task 16 |
| Unicorn customizer screen | Task 17 |
| Sound effects (correct/wrong/fanfare) | Task 6 |
| Star particles background | Task 5 |
| Nunito font, magic color palette | Tasks 1, 5 |
| Touch-friendly (min 80px buttons) | Tasks 11, 12, 13 |
| localStorage persistence | Task 4 (Zustand persist) |
| Docker dev + prod | Task 1 |
| PWA installable | Task 1 (vite-plugin-pwa) |
| Mode contrarreloj (v2) | Out of scope — not implemented ✅ |
