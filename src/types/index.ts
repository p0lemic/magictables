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
  | { name: 'practice-session'; table: number; mode: 'free' | 'progressive'; ordered?: boolean }
  | { name: 'session-results'; table: number; correct: number; mode: 'free' | 'progressive' }
  | { name: 'unicorn-customizer' }
  | { name: 'table-reference' };

export const UNICORN_COLOR_HEX: Record<UnicornColor, string> = {
  white:    '#FFFFFF',
  lavender: '#E8D5FF',
  pink:     '#FFB3D9',
  mint:     '#B3FFE8',
  yellow:   '#FFF4B3',
  sky:      '#B3E8FF',
};

export const ACCESSORY_LABEL: Record<AccessoryId, string> = {
  'rainbow-horn':    'Cuerno Arcoíris',
  'golden-wings':    'Alas Doradas',
  'flower-crown':    'Corona de Flores',
  'magic-cape':      'Capa Mágica',
  'glitter-sparkle': 'Destello de Purpurina',
};

export const ACCESSORY_UNLOCK_HINT: Record<AccessoryId, string> = {
  'rainbow-horn':    'Consigue 1 estrella en cualquier tabla',
  'golden-wings':    'Consigue 3 estrellas en cualquier tabla',
  'flower-crown':    'Completa 5 tablas con ≥1 estrella',
  'magic-cape':      'Consigue ≥2 estrellas en todas las tablas',
  'glitter-sparkle': 'Consigue 3 estrellas en TODAS las tablas',
};
