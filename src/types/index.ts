// ── Creature type ─────────────────────────────────────────────────────────────
export type CreatureType = 'unicorn' | 'dragon'

// ── Unicorn accessories ───────────────────────────────────────────────────────
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

// ── Dragon accessories ────────────────────────────────────────────────────────
export type DragonAccessoryId =
  // Easy (14)
  | 'dragon-spike-horns'
  | 'dragon-gem-horns'
  | 'dragon-crystal-wings'
  | 'dragon-back-spikes'
  | 'dragon-gold-collar'
  | 'dragon-bat-wings'
  | 'dragon-flower-horns'
  | 'dragon-star-back'
  | 'dragon-wave-wings'
  | 'dragon-gem-back'
  | 'dragon-royal-horns'
  | 'dragon-feather-wings'
  | 'dragon-sparkle-back'
  | 'dragon-gem-crown'
  // Hard exclusives (7)
  | 'dragon-flame-horns'
  | 'dragon-ice-wings'
  | 'dragon-thunder-back'
  | 'dragon-galaxy-wings'
  | 'dragon-cosmic-horns'
  | 'dragon-lava-back'
  | 'dragon-shadow-wings';

// ── Unicorn colors ────────────────────────────────────────────────────────────
export type UnicornColor =
  | 'white' | 'lavender' | 'pink' | 'mint' | 'yellow' | 'sky'
  // Hard mode exclusives
  | 'coral' | 'gold' | 'magic-purple' | 'silver' | 'ocean' | 'rainbow';

// ── Dragon colors ─────────────────────────────────────────────────────────────
export type DragonColor =
  | 'forest-green' | 'flame-red' | 'ocean-blue' | 'royal-purple' | 'obsidian' | 'silver-scales'
  // Hard mode exclusives
  | 'gold-scales' | 'ice-white' | 'lava-orange' | 'cosmic-violet' | 'rainbow-scales' | 'shadow-black';

// ── Progress ──────────────────────────────────────────────────────────────────
export interface TableProgress {
  stars: number;           // 0–3, best easy/progressive score
  masteryPercent: number;
  totalAttempts: number;
  totalCorrect: number;
  hardStars?: number;      // 0–3, best hard mode score (optional = backwards compatible)
}

// ── Unicorn equipped ──────────────────────────────────────────────────────────
export interface UnicornEquipped {
  horn: AccessoryId | null;
  wings: AccessoryId | null;
  cape: AccessoryId | null;
  bodyColor: UnicornColor;
  maneColor: UnicornColor;
}

// ── Dragon equipped ───────────────────────────────────────────────────────────
export interface DragonEquipped {
  horns: DragonAccessoryId | null;
  wings: DragonAccessoryId | null;
  back: DragonAccessoryId | null;
  scaleColor: DragonColor;
  bellyColor: DragonColor;
}

// ── Creature state ────────────────────────────────────────────────────────────
export interface UnicornState {
  creature: CreatureType;
  unlockedAccessories: AccessoryId[];
  equipped: UnicornEquipped;
  unlockedColors: UnicornColor[];
  dragonUnlockedAccessories: DragonAccessoryId[];
  dragonEquipped: DragonEquipped;
  dragonUnlockedColors: DragonColor[];
}

// ── Session ───────────────────────────────────────────────────────────────────
export interface SessionQuestion {
  a: number;
  b: number;
  answer: number;
}

// ── User (from server) ────────────────────────────────────────────────────────
export interface User {
  id: number
  name: string
  hasPin: boolean
  totalStars: number
  totalHardStars: number
  creature: CreatureType
  equipped: UnicornEquipped
  dragonEquipped: DragonEquipped
}

// ── Screen ────────────────────────────────────────────────────────────────────
export type Screen =
  | { name: 'user-select' }
  | { name: 'home' }
  | { name: 'free-mode' }
  | { name: 'progressive-mode' }
  | { name: 'practice-session'; table: number; mode: 'free' | 'progressive'; ordered?: boolean; difficulty?: 'easy' | 'hard' }
  | { name: 'session-results'; table: number; correct: number; mode: 'free' | 'progressive'; difficulty?: 'easy' | 'hard' }
  | { name: 'unicorn-customizer' }
  | { name: 'table-reference' };

// ── Unicorn color constants ───────────────────────────────────────────────────
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

// ── Dragon color constants ────────────────────────────────────────────────────
export const DRAGON_BASE_COLORS: DragonColor[] = ['forest-green', 'flame-red', 'ocean-blue', 'royal-purple', 'obsidian', 'silver-scales'];
export const DRAGON_HARD_COLORS: DragonColor[] = ['gold-scales', 'ice-white', 'lava-orange', 'cosmic-violet', 'rainbow-scales', 'shadow-black'];

export const DRAGON_COLOR_HEX: Record<DragonColor, string> = {
  'forest-green':   '#4CAF50',
  'flame-red':      '#E53935',
  'ocean-blue':     '#1E88E5',
  'royal-purple':   '#7B1FA2',
  'obsidian':       '#37474F',
  'silver-scales':  '#90A4AE',
  'gold-scales':    '#FFD700',
  'ice-white':      '#E3F2FD',
  'lava-orange':    '#FF6D00',
  'cosmic-violet':  '#6A1B9A',
  'rainbow-scales': '#FF4081',
  'shadow-black':   '#212121',
};

export const DRAGON_COLOR_LABEL: Record<DragonColor, string> = {
  'forest-green':   'Verde Bosque',
  'flame-red':      'Rojo Llama',
  'ocean-blue':     'Azul Océano',
  'royal-purple':   'Púrpura Real',
  'obsidian':       'Obsidiana',
  'silver-scales':  'Escamas Plateadas',
  'gold-scales':    'Escamas Doradas',
  'ice-white':      'Blanco Hielo',
  'lava-orange':    'Naranja Lava',
  'cosmic-violet':  'Violeta Cósmico',
  'rainbow-scales': 'Escamas Arcoíris',
  'shadow-black':   'Negro Sombra',
};

export const DRAGON_HARD_COLOR_UNLOCK_HINT: Partial<Record<DragonColor, string>> = {
  'gold-scales':    'Consigue 10 estrellas en modo difícil',
  'ice-white':      'Consigue 5 estrellas en modo difícil',
  'lava-orange':    'Consigue 18 estrellas en modo difícil',
  'cosmic-violet':  'Consigue 22 estrellas en modo difícil',
  'rainbow-scales': 'Consigue 28 estrellas en modo difícil',
  'shadow-black':   'Completa todas las tablas en modo difícil',
};

// ── Unicorn accessory constants ───────────────────────────────────────────────
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

// ── Dragon accessory constants ────────────────────────────────────────────────
export const DRAGON_ACCESSORY_LABEL: Record<DragonAccessoryId, string> = {
  'dragon-spike-horns':   'Cuernos de Pinchos',
  'dragon-gem-horns':     'Cuernos de Gemas',
  'dragon-crystal-wings': 'Alas de Cristal',
  'dragon-back-spikes':   'Pinchos Dorsales',
  'dragon-gold-collar':   'Collar Dorado',
  'dragon-bat-wings':     'Alas de Murciélago',
  'dragon-flower-horns':  'Cuernos Floridos',
  'dragon-star-back':     'Lomo Estelar',
  'dragon-wave-wings':    'Alas de Ola',
  'dragon-gem-back':      'Lomo de Gemas',
  'dragon-royal-horns':   'Cuernos Reales',
  'dragon-feather-wings': 'Alas de Plumas',
  'dragon-sparkle-back':  'Lomo Brillante',
  'dragon-gem-crown':     'Corona de Gemas',
  'dragon-flame-horns':   'Cuernos de Fuego',
  'dragon-ice-wings':     'Alas de Hielo',
  'dragon-thunder-back':  'Lomo de Trueno',
  'dragon-galaxy-wings':  'Alas Galaxia',
  'dragon-cosmic-horns':  'Cuernos Cósmicos',
  'dragon-lava-back':     'Lomo de Lava',
  'dragon-shadow-wings':  'Alas de Sombra',
};

export const DRAGON_ACCESSORY_UNLOCK_HINT: Record<DragonAccessoryId, string> = {
  'dragon-spike-horns':   'Consigue 1 estrella en cualquier tabla',
  'dragon-gem-horns':     'Consigue 1 estrella en 2 tablas',
  'dragon-crystal-wings': 'Consigue 1 estrella en 3 tablas',
  'dragon-back-spikes':   'Completa 5 tablas con ≥1 estrella',
  'dragon-gold-collar':   'Consigue 1 estrella en 7 tablas',
  'dragon-bat-wings':     'Consigue 1 estrella en todas las tablas',
  'dragon-flower-horns':  'Consigue 3 estrellas en cualquier tabla',
  'dragon-star-back':     'Consigue ≥2 estrellas en 3 tablas',
  'dragon-wave-wings':    'Consigue ≥2 estrellas en 5 tablas',
  'dragon-gem-back':      'Consigue ≥2 estrellas en 7 tablas',
  'dragon-royal-horns':   'Consigue ≥2 estrellas en todas las tablas',
  'dragon-feather-wings': 'Consigue 3 estrellas en 3 tablas',
  'dragon-sparkle-back':  'Consigue 3 estrellas en 7 tablas',
  'dragon-gem-crown':     'Consigue 3 estrellas en TODAS las tablas',
  'dragon-flame-horns':   'Consigue 1 estrella en modo difícil',
  'dragon-ice-wings':     'Consigue 3 estrellas en modo difícil',
  'dragon-thunder-back':  'Consigue 8 estrellas en modo difícil',
  'dragon-galaxy-wings':  'Consigue 12 estrellas en modo difícil',
  'dragon-cosmic-horns':  'Consigue 15 estrellas en modo difícil',
  'dragon-lava-back':     'Consigue 20 estrellas en modo difícil',
  'dragon-shadow-wings':  'Consigue 25 estrellas en modo difícil',
};
