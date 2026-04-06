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
  const hornId  = equipped.horn
  const wingsId = equipped.wings
  const capeId  = equipped.cape

  // ── Horn fill & defs ──────────────────────────────────────────────────────
  function hornFill() {
    if (hornId === 'rainbow-horn')  return 'url(#rainbowGrad)'
    if (hornId === 'crystal-horn')  return 'url(#crystalGrad)'
    if (hornId === 'star-bow')      return '#fee440'
    if (hornId === 'glitter-sparkle') return '#FFD700'
    return '#fee440'
  }

  // ── Mane color (rainbow-mane overrides) ──────────────────────────────────
  const mane1 = capeId === 'rainbow-mane' ? 'url(#maneRainbow)' : maneColor
  const mane2 = capeId === 'rainbow-mane' ? 'url(#maneRainbow)' : maneColor

  // ── Wings (behind body) ───────────────────────────────────────────────────
  function renderWings() {
    if (wingsId === 'golden-wings') return (
      <>
        <ellipse cx="165" cy="110" rx="30" ry="18"
          fill="#FFD700" opacity="0.85" transform="rotate(-20 165 110)" />
        <ellipse cx="170" cy="125" rx="25" ry="14"
          fill="#FFE55C" opacity="0.75" transform="rotate(-10 170 125)" />
      </>
    )
    if (wingsId === 'fairy-wings') return (
      <>
        <ellipse cx="162" cy="105" rx="22" ry="14"
          fill="#f0abff" opacity="0.70" transform="rotate(-25 162 105)" />
        <ellipse cx="166" cy="122" rx="18" ry="10"
          fill="#e879f9" opacity="0.55" transform="rotate(-10 166 122)" />
      </>
    )
    if (wingsId === 'phoenix-wings') return (
      <>
        <ellipse cx="165" cy="100" rx="34" ry="20"
          fill="#ff6b2b" opacity="0.88" transform="rotate(-22 165 100)" />
        <ellipse cx="170" cy="118" rx="28" ry="16"
          fill="#ff9e2b" opacity="0.75" transform="rotate(-10 170 118)" />
        <ellipse cx="168" cy="132" rx="20" ry="10"
          fill="#ffd93d" opacity="0.65" transform="rotate(0 168 132)" />
      </>
    )
    return null
  }

  // ── Cape-slot accessories (behind body) ───────────────────────────────────
  function renderCapeBack() {
    if (capeId === 'magic-cape') return (
      <ellipse cx="115" cy="148" rx="65" ry="30" fill="#c77dff" opacity="0.7" />
    )
    return null
  }

  // ── Horn / head decoration ────────────────────────────────────────────────
  function renderHornArea() {
    // Accessories that replace the horn with emoji decorations
    if (hornId === 'flower-crown') return (
      <>
        <text x="35" y="62" fontSize="14">🌸</text>
        <text x="55" y="55" fontSize="12">🌺</text>
        <text x="72" y="58" fontSize="14">🌸</text>
      </>
    )
    if (hornId === 'princess-crown') return (
      <text x="40" y="60" fontSize="22">👑</text>
    )
    if (hornId === 'diamond-crown') return (
      <>
        <text x="44" y="58" fontSize="20">💎</text>
        <text x="32" y="70" fontSize="10" opacity="0.8">✨</text>
        <text x="72" y="66" fontSize="10" opacity="0.8">✨</text>
      </>
    )

    // Horn polygon + per-accessory extras
    return (
      <>
        {(hornId === 'rainbow-horn' || hornId === 'crystal-horn') && (
          <defs>
            {hornId === 'rainbow-horn' && (
              <linearGradient id="rainbowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#ff6b6b" />
                <stop offset="25%"  stopColor="#ffd93d" />
                <stop offset="50%"  stopColor="#6bcb77" />
                <stop offset="75%"  stopColor="#4d96ff" />
                <stop offset="100%" stopColor="#c77dff" />
              </linearGradient>
            )}
            {hornId === 'crystal-horn' && (
              <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#e0f7ff" />
                <stop offset="50%"  stopColor="#a8d8f0" />
                <stop offset="100%" stopColor="#7ec8e3" />
              </linearGradient>
            )}
          </defs>
        )}

        <polygon
          points="57,56 67,56 62,28"
          fill={hornFill()}
          stroke={hornId === 'crystal-horn' ? '#87ceeb' : '#f0c000'}
          strokeWidth="1"
        />

        {hornId === 'rainbow-horn' && (
          <>
            <text x="38" y="22" fontSize="12" opacity="0.8">✨</text>
            <text x="70" y="14" fontSize="10" opacity="0.6">⭐</text>
            <text x="88" y="24" fontSize="8"  opacity="0.7">💫</text>
          </>
        )}
        {hornId === 'crystal-horn' && (
          <>
            <text x="38" y="22" fontSize="10" opacity="0.7">❄️</text>
            <text x="72" y="20" fontSize="8"  opacity="0.6">💙</text>
          </>
        )}
        {hornId === 'star-bow' && (
          <>
            <text x="34" y="58" fontSize="14">⭐</text>
            <text x="68" y="54" fontSize="12">⭐</text>
            <text x="52" y="44" fontSize="10">✨</text>
          </>
        )}
        {hornId === 'glitter-sparkle' && (
          <>
            <text x="28" y="22" fontSize="12" opacity="0.9">✨</text>
            <text x="70" y="18" fontSize="10" opacity="0.8">💫</text>
            <text x="90" y="36" fontSize="10" opacity="0.7">⭐</text>
            <text x="20" y="50" fontSize="8"  opacity="0.7">✨</text>
            <text x="150" y="80" fontSize="10" opacity="0.6">💫</text>
            <text x="140" y="50" fontSize="8"  opacity="0.5">✨</text>
          </>
        )}
      </>
    )
  }

  // ── Tail (sparkle-tail override) ──────────────────────────────────────────
  function renderTail() {
    const tailFill   = capeId === 'sparkle-tail' ? '#f9a8d4' : maneColor
    const tailStroke = capeId === 'sparkle-tail' ? '#f472b6' : maneColor
    return (
      <>
        <path d="M170 130 Q192 108 186 90 Q180 74 173 80 Q167 90 172 115"
          fill={tailFill} opacity={capeId === 'sparkle-tail' ? 1 : 0.88} />
        <path d="M168 133 Q188 118 183 100 Q178 82 170 88"
          stroke={tailStroke} strokeWidth="5" fill="none"
          strokeLinecap="round" opacity="0.6" />
        {capeId === 'sparkle-tail' && (
          <>
            <text x="178" y="90"  fontSize="10" opacity="0.9">✨</text>
            <text x="185" y="110" fontSize="8"  opacity="0.8">💫</text>
            <text x="170" y="75"  fontSize="8"  opacity="0.7">⭐</text>
          </>
        )}
      </>
    )
  }

  // ── Hooves (magic-shoes override) ─────────────────────────────────────────
  function renderHooves() {
    const hoof = capeId === 'magic-shoes' ? '#f472b6' : '#c8a0e0'
    return (
      <>
        <rect x="78"  y="187" width="13" height="8" rx="4" fill={hoof} />
        <rect x="97"  y="187" width="13" height="8" rx="4" fill={hoof} />
        <rect x="130" y="184" width="13" height="8" rx="4" fill={hoof} />
        <rect x="148" y="184" width="13" height="8" rx="4" fill={hoof} />
        {capeId === 'magic-shoes' && (
          <>
            <text x="72"  y="202" fontSize="9">👟</text>
            <text x="128" y="200" fontSize="9">👟</text>
          </>
        )}
      </>
    )
  }

  // ── Rainbow mane defs ─────────────────────────────────────────────────────
  function renderManeDefs() {
    if (capeId !== 'rainbow-mane') return null
    return (
      <defs>
        <linearGradient id="maneRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#ff6b6b" />
          <stop offset="33%"  stopColor="#ffd93d" />
          <stop offset="66%"  stopColor="#6bcb77" />
          <stop offset="100%" stopColor="#4d96ff" />
        </linearGradient>
      </defs>
    )
  }

  return (
    <div
      className={floating ? 'animate-float' : ''}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
        {renderManeDefs()}

        {/* Cape / accessories behind body */}
        {renderCapeBack()}

        {/* Wings behind body */}
        {renderWings()}

        {/* Body */}
        <ellipse cx="115" cy="135" rx="58" ry="40" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1.5" />

        {/* Neck */}
        <ellipse cx="72" cy="108" rx="18" ry="22" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />

        {/* Head */}
        <circle cx="62" cy="82" r="28" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1.5" />

        {/* Ear */}
        <polygon points="78,64 88,64 83,50" fill={bodyColor} stroke="#e0c8f0" strokeWidth="1" />
        <polygon points="80,64 86,64 83,54" fill={maneColor} opacity="0.6" />

        {/* Horn / head decoration */}
        {renderHornArea()}

        {/* Mane strands */}
        <path d="M75 60 Q88 75 82 98 Q76 112 70 124"
          stroke={mane1} strokeWidth="9" fill="none"
          strokeLinecap="round" opacity="0.9" />
        <path d="M82 57 Q98 73 91 100 Q85 116 80 128"
          stroke={mane2} strokeWidth="6" fill="none"
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
        {renderHooves()}

        {/* Tail */}
        {renderTail()}
      </svg>
    </div>
  )
}
