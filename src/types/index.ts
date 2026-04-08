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
  totalHardStars: number
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
