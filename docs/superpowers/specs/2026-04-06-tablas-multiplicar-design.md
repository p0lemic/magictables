# Tablas de Multiplicar — Juego Educativo

**Fecha:** 2026-04-06
**Objetivo:** Aplicación web para que una niña de 7 años aprenda y memorice las tablas de multiplicar del 1 al 10 mediante un juego con unicornios, logros y personalización.

---

## Stack Técnico

- **Frontend:** React 18 + Vite + TypeScript
- **Estilos:** Tailwind CSS
- **Estado global:** Zustand (persistido en `localStorage`)
- **PWA:** `vite-plugin-pwa` (instalable en iPad)
- **Contenedor:** Docker con `node:20-alpine` para desarrollo, `nginx:alpine` para producción

### Docker

- `docker-compose.yml` — desarrollo con hot-reload, puerto 5173
- `docker-compose.prod.yml` — build + nginx, puerto 80
- `Dockerfile` — multi-stage: build con Node, serve con nginx

---

## Estructura de Carpetas

```
maths/
├── docker-compose.yml
├── docker-compose.prod.yml
├── Dockerfile
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── StarRating.tsx
│   │   ├── ConfettiAnimation.tsx
│   │   ├── UnicornAvatar.tsx
│   │   ├── ProgressMap.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── MultipleChoiceInput.tsx
│   │   └── NumericKeyboard.tsx
│   ├── hooks/
│   │   └── useSound.ts
│   ├── store/
│   │   └── gameStore.ts
│   ├── types/
│   │   └── index.ts
│   └── pages/
│       ├── Home.tsx
│       ├── FreeMode.tsx
│       ├── ProgressiveMode.tsx
│       ├── PracticeSession.tsx
│       ├── SessionResults.tsx
│       └── UnicornCustomizer.tsx
```

---

## Pantallas y Flujo

### Pantalla de Inicio (`Home`)
- Botón **"Práctica libre"** → selección de tabla → sesión de práctica
- Botón **"Modo progresivo"** → continúa desde el último punto guardado
- Botón **"Mi unicornio"** → pantalla de personalización
- Muestra resumen de progreso: estrellas totales ganadas

### Selección de Tabla (Práctica Libre)
- Grid con las 10 tablas (1–10)
- Cada tabla muestra sus estrellas actuales (0–3)
- Todas desbloqueadas en este modo

### Mapa Progresivo (`ProgressiveMode`)
- Las 10 tablas como nodos en un camino
- Tabla 1 siempre desbloqueada
- Tabla N+1 se desbloquea cuando tabla N tiene ≥ 2 estrellas
- Nodos bloqueados visualmente atenuados con candado

### Sesión de Práctica (`PracticeSession`)
- 10 preguntas por sesión, generadas aleatoriamente de la tabla elegida
- **Modo de entrada:**
  - Opción múltiple (4 botones) si dominio de tabla < 80%
  - Teclado numérico si dominio ≥ 80%
  - El dominio se calcula como: (aciertos históricos / intentos históricos) × 100
- Feedback inmediato: animación verde + sonido en acierto, roja + sonido en fallo
- Muestra la respuesta correcta cuando falla
- Barra de progreso de la sesión (pregunta X de 10)

### Resultados de Sesión (`SessionResults`)
- Puntuación: X/10 correctas
- Animación de estrellas llenándose (1, 2 o 3):
  - 1 estrella: ≥ 5/10
  - 2 estrellas: ≥ 7/10
  - 3 estrellas: 10/10
- Si se mejora la puntuación guardada, actualiza el récord
- Si se desbloquea un accesorio: modal de celebración con confetti y accesorio girando
- Botones: "Repetir" / "Otra tabla" / "Inicio"

### Mi Unicornio (`UnicornCustomizer`)
- Unicornio SVG con zonas de color intercambiables (cuerpo, melena, cuerno, alas, capa)
- Solo se pueden seleccionar accesorios desbloqueados; los bloqueados se muestran con candado y pista de cómo desbloquearlos
- Cambios guardados automáticamente

---

## Sistema de Progreso y Logros

### Estrellas por Tabla
Cada tabla guarda su mejor puntuación (0–3 estrellas). Solo sube, nunca baja.

### Accesorios Desbloqueables
| Condición | Accesorio |
|---|---|
| Primera tabla con ≥ 1★ | Cuerno de arcoíris |
| Primera tabla con 3★ | Alas doradas |
| 5 tablas completadas (≥ 1★) | Corona de flores |
| Todas las tablas con ≥ 2★ | Capa mágica |
| Todas las tablas con 3★ | Destello de purpurina |

### Modo Contrarreloj (v2 — fuera de scope inicial)
- Se reserva para una segunda iteración una vez el juego base esté completo
- La UI de práctica libre tendrá un botón "Modo rápido" deshabilitado con tooltip "¡Próximamente!" cuando la tabla tenga ≥ 2★

---

## Estado Global (Zustand)

```typescript
// Accesorios disponibles
type AccessoryId = 'rainbow-horn' | 'golden-wings' | 'flower-crown' | 'magic-cape' | 'glitter-sparkle';

// Colores de paleta predefinida (no color libre)
type UnicornColor = 'white' | 'lavender' | 'pink' | 'mint' | 'yellow' | 'sky';

interface GameState {
  // Progreso por tabla (índice 1-10)
  tables: Record<number, {
    stars: number;          // 0-3, mejor histórico
    masteryPercent: number; // (totalCorrect / totalAttempts) × 100
    totalAttempts: number;
    totalCorrect: number;
  }>;

  // Unicornio
  unicorn: {
    unlockedAccessories: AccessoryId[];
    equipped: {
      horn: AccessoryId | null;
      wings: AccessoryId | null;
      cape: AccessoryId | null;
      bodyColor: UnicornColor;
      maneColor: UnicornColor;
    };
  };

  // Acciones
  recordSessionResult: (table: number, correct: number) => void;
  equipAccessory: (slot: string, value: string) => void;
}
```

---

## Diseño Visual

### Paleta
- Fondo: degradado lila → rosa (`#f0e6ff → #ffe6f0`)
- Primario: `#9b5de5` (púrpura mágico)
- Acento 1: `#f72585` (rosa chicle)
- Acento 2: `#fee440` (amarillo estrella)
- Acento 3: `#00f5d4` (turquesa)

### Tipografía
- **Nunito** (Google Fonts) — redondeada, amigable para niños
- Tamaño de pregunta: 48–64px
- Botones de respuesta: texto 28–32px

### Interacción Táctil
- Botones de respuesta: mínimo 80px de alto
- Touch targets generosos en todo la UI
- Sin hover-only interactions

### Animaciones
- Fondo: partículas de estrellas flotantes (CSS)
- Acierto: rebote verde + destello
- Fallo: vibración roja + respuesta correcta visible 1.5s
- Estrellas: se llenan una a una con sonido
- Desbloqueo de accesorio: confetti + modal con elemento rotando
- Transición entre pantallas: fade suave (200ms)

### Sonido (Web Audio API)
- Sonido de acierto: tono agradable ascendente
- Sonido de fallo: tono suave descendente (no estresante)
- Fanfarria al ganar estrellas
- Volumen controlable; inicia silenciado hasta primer toque (política de autoplay)

---

## Docker

### `Dockerfile` (multi-stage)
```
Stage 1 (builder): node:20-alpine → npm ci → npm run build
Stage 2 (serve):   nginx:alpine → copia dist/ → expone 80
```

### `docker-compose.yml` (desarrollo)
```yaml
services:
  app:
    build:
      context: .
      target: builder
    command: npm run dev -- --host
    ports: ["5173:5173"]
    volumes: [".:/app", "/app/node_modules"]
```

### `docker-compose.prod.yml` (producción)
```yaml
services:
  app:
    build: .
    ports: ["80:80"]
```
