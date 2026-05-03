import type { DragonEquipped } from '../types'
import { DRAGON_COLOR_HEX } from '../types'

interface Props {
  equipped: DragonEquipped
  size?: number
  floating?: boolean
}

export default function DragonAvatar({ equipped, size = 200, floating = false }: Props) {
  const scaleColor = DRAGON_COLOR_HEX[equipped.scaleColor]
  const bellyColor = DRAGON_COLOR_HEX[equipped.bellyColor]
  const hornsId = equipped.horns
  const wingsId = equipped.wings
  const backId  = equipped.back

  // ── Belly color (slightly lighter) ────────────────────────────────────────
  const belly = bellyColor

  // ── Wings (behind body) ───────────────────────────────────────────────────
  function renderWings() {
    if (!wingsId) return null

    if (wingsId === 'dragon-crystal-wings') return (
      <>
        <ellipse cx="136" cy="97" rx="28" ry="17"
          fill="#b3e8ff" opacity="0.80" transform="rotate(-25 136 97)" />
        <ellipse cx="140" cy="112" rx="20" ry="11"
          fill="#e0f7ff" opacity="0.65" transform="rotate(-10 140 112)" />
      </>
    )
    if (wingsId === 'dragon-bat-wings') return (
      <>
        <ellipse cx="133" cy="95" rx="32" ry="20"
          fill="#4a1a7a" opacity="0.88" transform="rotate(-28 133 95)" />
        <ellipse cx="138" cy="113" rx="24" ry="13"
          fill="#2d0a4f" opacity="0.78" transform="rotate(-12 138 113)" />
        <line x1="115" y1="100" x2="133" y2="88" stroke="#7b2fa0" strokeWidth="2" opacity="0.6" />
        <line x1="120" y1="112" x2="136" y2="104" stroke="#7b2fa0" strokeWidth="1.5" opacity="0.5" />
      </>
    )
    if (wingsId === 'dragon-wave-wings') return (
      <>
        <ellipse cx="136" cy="96" rx="30" ry="18"
          fill="#1e88e5" opacity="0.82" transform="rotate(-22 136 96)" />
        <ellipse cx="140" cy="112" rx="22" ry="12"
          fill="#42a5f5" opacity="0.70" transform="rotate(-8 140 112)" />
        <text x="112" y="100" fontSize="12" opacity="0.7">〜</text>
      </>
    )
    if (wingsId === 'dragon-feather-wings') return (
      <>
        <ellipse cx="136" cy="94" rx="34" ry="20"
          fill="#ff8f00" opacity="0.85" transform="rotate(-22 136 94)" />
        <ellipse cx="140" cy="112" rx="26" ry="14"
          fill="#ffb300" opacity="0.72" transform="rotate(-10 140 112)" />
        <ellipse cx="138" cy="125" rx="18" ry="9"
          fill="#ffe082" opacity="0.60" transform="rotate(0 138 125)" />
      </>
    )
    if (wingsId === 'dragon-ice-wings') return (
      <>
        <ellipse cx="136" cy="95" rx="32" ry="19"
          fill="#b3e5fc" opacity="0.90" transform="rotate(-24 136 95)" />
        <ellipse cx="140" cy="112" rx="24" ry="13"
          fill="#e1f5fe" opacity="0.75" transform="rotate(-8 140 112)" />
        <text x="114" y="98" fontSize="14" opacity="0.85">❄️</text>
        <text x="126" y="112" fontSize="10" opacity="0.70">❄️</text>
      </>
    )
    if (wingsId === 'dragon-galaxy-wings') return (
      <>
        <ellipse cx="136" cy="94" rx="34" ry="20"
          fill="#1a0533" opacity="0.90" transform="rotate(-22 136 94)" />
        <ellipse cx="140" cy="112" rx="26" ry="14"
          fill="#4a1a7a" opacity="0.80" transform="rotate(-10 140 112)" />
        <text x="116" y="98" fontSize="10" opacity="0.85">✨</text>
        <text x="128" y="112" fontSize="8" opacity="0.70">⭐</text>
      </>
    )
    if (wingsId === 'dragon-shadow-wings') return (
      <>
        <ellipse cx="136" cy="95" rx="33" ry="20"
          fill="#212121" opacity="0.92" transform="rotate(-26 136 95)" />
        <ellipse cx="140" cy="113" rx="25" ry="13"
          fill="#37474f" opacity="0.82" transform="rotate(-10 140 113)" />
      </>
    )

    // Default wing for any other wing accessory
    return (
      <>
        <ellipse cx="136" cy="97" rx="28" ry="17"
          fill={scaleColor} opacity="0.70" transform="rotate(-22 136 97)" />
        <ellipse cx="140" cy="113" rx="21" ry="11"
          fill={scaleColor} opacity="0.55" transform="rotate(-8 140 113)" />
      </>
    )
  }

  // ── Horns ─────────────────────────────────────────────────────────────────
  function renderHorns() {
    if (!hornsId) {
      // Default: two small bumps
      return (
        <>
          <polygon points="52,56 60,56 56,38" fill={scaleColor} stroke="#888" strokeWidth="1" />
          <polygon points="64,56 72,56 68,38" fill={scaleColor} stroke="#888" strokeWidth="1" />
        </>
      )
    }
    if (hornsId === 'dragon-spike-horns') return (
      <>
        <polygon points="50,56 58,56 54,36" fill="#5d4037" stroke="#3e2723" strokeWidth="1" />
        <polygon points="62,56 70,56 66,36" fill="#5d4037" stroke="#3e2723" strokeWidth="1" />
        <polygon points="74,58 80,58 77,44" fill="#5d4037" stroke="#3e2723" strokeWidth="1" />
      </>
    )
    if (hornsId === 'dragon-gem-horns') return (
      <>
        <polygon points="52,56 60,56 56,38" fill="#7b1fa2" stroke="#4a148c" strokeWidth="1" />
        <polygon points="64,56 72,56 68,38" fill="#7b1fa2" stroke="#4a148c" strokeWidth="1" />
        <text x="50" y="44" fontSize="8">💎</text>
        <text x="62" y="44" fontSize="8">💎</text>
      </>
    )
    if (hornsId === 'dragon-flower-horns') return (
      <>
        <polygon points="52,56 60,56 56,40" fill="#4caf50" stroke="#2e7d32" strokeWidth="1" />
        <polygon points="64,56 72,56 68,40" fill="#4caf50" stroke="#2e7d32" strokeWidth="1" />
        <text x="46" y="44" fontSize="10">🌸</text>
        <text x="62" y="42" fontSize="10">🌺</text>
      </>
    )
    if (hornsId === 'dragon-gold-collar') return (
      <>
        <polygon points="52,56 60,56 56,40" fill="#FFD700" stroke="#f9a825" strokeWidth="1" />
        <polygon points="64,56 72,56 68,40" fill="#FFD700" stroke="#f9a825" strokeWidth="1" />
        {/* collar around neck */}
        <ellipse cx="72" cy="116" rx="20" ry="7" fill="#FFD700" opacity="0.85" />
        <ellipse cx="72" cy="116" rx="20" ry="7" fill="none" stroke="#f9a825" strokeWidth="1.5" />
      </>
    )
    if (hornsId === 'dragon-royal-horns') return (
      <>
        <polygon points="52,56 60,56 56,36" fill="#ffd700" stroke="#f9a825" strokeWidth="1" />
        <polygon points="64,56 72,56 68,36" fill="#ffd700" stroke="#f9a825" strokeWidth="1" />
        <text x="52" y="54" fontSize="14">👑</text>
      </>
    )
    if (hornsId === 'dragon-gem-crown') return (
      <>
        <text x="44" y="56" fontSize="20">💍</text>
        <text x="70" y="50" fontSize="10" opacity="0.8">✨</text>
      </>
    )
    if (hornsId === 'dragon-flame-horns') return (
      <>
        <polygon points="50,56 58,56 54,34" fill="#ff4500" stroke="#e64a19" strokeWidth="1" />
        <polygon points="64,56 72,56 68,34" fill="#ff4500" stroke="#e64a19" strokeWidth="1" />
        <text x="44" y="38" fontSize="10">🔥</text>
        <text x="62" y="36" fontSize="10">🔥</text>
      </>
    )
    if (hornsId === 'dragon-cosmic-horns') return (
      <>
        <polygon points="52,56 60,56 56,34" fill="#6a1b9a" stroke="#4a148c" strokeWidth="1" />
        <polygon points="64,56 72,56 68,34" fill="#4d96ff" stroke="#1565c0" strokeWidth="1" />
        <text x="44" y="36" fontSize="9">✨</text>
        <text x="64" y="34" fontSize="9">💫</text>
      </>
    )

    // Default for any other horn accessory
    return (
      <>
        <polygon points="52,56 60,56 56,38" fill={scaleColor} stroke="#888" strokeWidth="1" />
        <polygon points="64,56 72,56 68,38" fill={scaleColor} stroke="#888" strokeWidth="1" />
      </>
    )
  }

  // ── Back accessories ───────────────────────────────────────────────────────
  function renderBack() {
    if (!backId) return null

    if (backId === 'dragon-back-spikes') return (
      <>
        <polygon points="85,100  90,100  87,88"  fill="#5d4037" />
        <polygon points="100,96  105,96  102,84" fill="#5d4037" />
        <polygon points="116,94  121,94  118,82" fill="#5d4037" />
        <polygon points="132,96  137,96  134,84" fill="#5d4037" />
        <polygon points="147,100 152,100 149,88" fill="#5d4037" />
      </>
    )
    if (backId === 'dragon-star-back') return (
      <>
        <text x="88"  y="102" fontSize="12" opacity="0.85">⭐</text>
        <text x="110" y="98"  fontSize="10" opacity="0.75">✨</text>
        <text x="132" y="102" fontSize="12" opacity="0.85">⭐</text>
      </>
    )
    if (backId === 'dragon-gem-back') return (
      <>
        <text x="88"  y="102" fontSize="10">💎</text>
        <text x="110" y="98"  fontSize="10">💎</text>
        <text x="132" y="102" fontSize="10">💎</text>
      </>
    )
    if (backId === 'dragon-sparkle-back') return (
      <>
        <text x="84"  y="102" fontSize="12" opacity="0.9">✨</text>
        <text x="106" y="97"  fontSize="10" opacity="0.8">💫</text>
        <text x="128" y="102" fontSize="12" opacity="0.9">✨</text>
        <text x="150" y="100" fontSize="9"  opacity="0.7">⭐</text>
      </>
    )
    if (backId === 'dragon-thunder-back') return (
      <>
        <text x="88"  y="102" fontSize="14" opacity="0.9">⚡</text>
        <text x="112" y="97"  fontSize="11" opacity="0.8">⚡</text>
        <text x="134" y="102" fontSize="14" opacity="0.9">⚡</text>
      </>
    )
    if (backId === 'dragon-lava-back') return (
      <>
        <ellipse cx="90"  cy="99" rx="8" ry="5" fill="#ff6d00" opacity="0.75" />
        <ellipse cx="113" cy="96" rx="8" ry="5" fill="#ff8f00" opacity="0.75" />
        <ellipse cx="136" cy="99" rx="8" ry="5" fill="#ff6d00" opacity="0.75" />
        <text x="86"  y="103" fontSize="10" opacity="0.7">🔥</text>
        <text x="130" y="103" fontSize="10" opacity="0.7">🔥</text>
      </>
    )

    return null
  }

  return (
    <div
      className={floating ? 'animate-float' : ''}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>

        {/* Wings behind body */}
        {renderWings()}

        {/* Body (round, chubby dragon) */}
        <ellipse cx="115" cy="138" rx="58" ry="42" fill={scaleColor} stroke="#00000022" strokeWidth="1.5" />

        {/* Belly (lighter center) */}
        <ellipse cx="105" cy="145" rx="38" ry="28" fill={belly} opacity="0.55" />

        {/* Neck */}
        <ellipse cx="72" cy="110" rx="18" ry="24" fill={scaleColor} stroke="#00000022" strokeWidth="1" />

        {/* Head */}
        <ellipse cx="62" cy="82" rx="30" ry="26" fill={scaleColor} stroke="#00000022" strokeWidth="1.5" />

        {/* Snout */}
        <ellipse cx="40" cy="90" rx="14" ry="10" fill={scaleColor} stroke="#00000015" strokeWidth="1" />
        <ellipse cx="37" cy="91" rx="5" ry="3" fill={belly} opacity="0.6" />
        <ellipse cx="43" cy="91" rx="5" ry="3" fill={belly} opacity="0.6" />

        {/* Nostrils */}
        <ellipse cx="37" cy="92" rx="1.5" ry="1" fill="#00000040" />
        <ellipse cx="43" cy="92" rx="1.5" ry="1" fill="#00000040" />

        {/* Ear frills */}
        <polygon points="82,62 92,58 88,48" fill={scaleColor} stroke="#00000020" strokeWidth="1" />
        <polygon points="84,62 90,60 88,52" fill={belly} opacity="0.5" />

        {/* Horns */}
        {renderHorns()}

        {/* Eye */}
        <ellipse cx="52" cy="79" rx="6" ry="5" fill="#ffe082" />
        <circle cx="52" cy="79" r="3.5" fill="#1a1a2e" />
        <circle cx="53.5" cy="77.5" r="1.5" fill="white" />
        {/* Eyelashes */}
        <line x1="47" y1="74" x2="45" y2="71" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="51" y1="73" x2="50" y2="70" stroke="#1a1a2e" strokeWidth="1.5" strokeLinecap="round" />

        {/* Back accessories (on top of body) */}
        {renderBack()}

        {/* Legs */}
        <rect x="78"  y="168" width="14" height="26" rx="7" fill={scaleColor} stroke="#00000022" strokeWidth="1" />
        <rect x="97"  y="168" width="14" height="26" rx="7" fill={scaleColor} stroke="#00000022" strokeWidth="1" />
        <rect x="130" y="165" width="14" height="26" rx="7" fill={scaleColor} stroke="#00000022" strokeWidth="1" />
        <rect x="149" y="165" width="14" height="26" rx="7" fill={scaleColor} stroke="#00000022" strokeWidth="1" />

        {/* Claws */}
        <rect x="76"  y="191" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="83"  y="191" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="95"  y="191" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="102" y="191" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="128" y="188" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="135" y="188" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="147" y="188" width="5" height="5" rx="2" fill="#37474f" />
        <rect x="154" y="188" width="5" height="5" rx="2" fill="#37474f" />

        {/* Tail */}
        <path d="M170 132 Q195 112 190 90 Q185 70 176 78 Q169 88 174 118"
          fill={scaleColor} opacity="0.90" />
        <path d="M168 136 Q190 120 185 98 Q180 76 172 84"
          stroke={scaleColor} strokeWidth="6" fill="none"
          strokeLinecap="round" opacity="0.6" />
        {/* Tail spike */}
        <polygon points="186,76 194,70 196,82" fill="#5d4037" opacity="0.85" />

      </svg>
    </div>
  )
}
