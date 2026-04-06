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

export interface User {
  id: number
  name: string
  hasPin: boolean
  totalStars: number
  equipped: UnicornEquipped
}

// State-machine router screens
export type Screen =
  | { name: 'user-select' }
  | { name: 'home' }
  | { name: 'free-mode' }
  | { name: 'progressive-mode' }
  | { name: 'practice-session'; table: number; mode: 'free' | 'progressive'; ordered?: boolean; difficulty?: 'easy' | 'hard' }
  | { name: 'session-results'; table: number; correct: number; mode: 'free' | 'progressive'; difficulty?: 'easy' | 'hard' }
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
};
