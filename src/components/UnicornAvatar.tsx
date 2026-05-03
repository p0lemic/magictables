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
    if (hornId === 'flame-horn')    return 'url(#flameGrad)'
    if (hornId === 'cosmic-horn')   return 'url(#cosmicGrad)'
    if (hornId === 'star-bow')      return '#fee440'
    if (hornId === 'glitter-sparkle') return '#FFD700'
    return '#fee440'
  }

  // ── Mane color (rainbow-mane overrides) ──────────────────────────────────
  const mane1 = capeId === 'rainbow-mane' ? 'url(#maneRainbow)' : maneColor
  const mane2 = capeId === 'rainbow-mane' ? 'url(#maneRainbow)' : maneColor

  // ── Wings (behind body) ───────────────────────────────────────────────────
  // Wings anchor at (136, 105) — upper-back of the body
  function renderWings() {
    if (wingsId === 'golden-wings') return (
      <>
        <ellipse cx="136" cy="102" rx="30" ry="18"
          fill="#FFD700" opacity="0.85" transform="rotate(-20 136 102)" />
        <ellipse cx="141" cy="117" rx="25" ry="14"
          fill="#FFE55C" opacity="0.75" transform="rotate(-10 141 117)" />
      </>
    )
    if (wingsId === 'fairy-wings') return (
      <>
        <ellipse cx="133" cy="97" rx="22" ry="14"
          fill="#f0abff" opacity="0.70" transform="rotate(-25 133 97)" />
        <ellipse cx="137" cy="114" rx="18" ry="10"
          fill="#e879f9" opacity="0.55" transform="rotate(-10 137 114)" />
      </>
    )
    if (wingsId === 'phoenix-wings') return (
      <>
        <ellipse cx="136" cy="94" rx="34" ry="20"
          fill="#ff6b2b" opacity="0.88" transform="rotate(-22 136 94)" />
        <ellipse cx="141" cy="112" rx="28" ry="16"
          fill="#ff9e2b" opacity="0.75" transform="rotate(-10 141 112)" />
        <ellipse cx="139" cy="126" rx="20" ry="10"
          fill="#ffd93d" opacity="0.65" transform="rotate(0 139 126)" />
      </>
    )
    if (wingsId === 'dragon-wings') return (
      <>
        <ellipse cx="136" cy="94" rx="36" ry="22"
          fill="#2d6a4f" opacity="0.90" transform="rotate(-28 136 94)" />
        <ellipse cx="141" cy="112" rx="28" ry="14"
          fill="#1b4332" opacity="0.80" transform="rotate(-12 141 112)" />
        <line x1="118" y1="100" x2="136" y2="90" stroke="#52b788" strokeWidth="2" opacity="0.6" />
        <line x1="122" y1="112" x2="140" y2="104" stroke="#52b788" strokeWidth="1.5" opacity="0.5" />
      </>
    )
    if (wingsId === 'thunder-wings') return (
      <>
        <ellipse cx="136" cy="98" rx="32" ry="19"
          fill="#ffd000" opacity="0.88" transform="rotate(-22 136 98)" />
        <ellipse cx="140" cy="114" rx="25" ry="13"
          fill="#ffb700" opacity="0.75" transform="rotate(-8 140 114)" />
        <text x="122" y="100" fontSize="16" opacity="0.95">⚡</text>
        <text x="135" y="115" fontSize="11" opacity="0.80">⚡</text>
      </>
    )
    return null
  }

  // ── Cape-slot accessories (behind body) ───────────────────────────────────
  function renderCapeBack() {
    if (capeId === 'magic-cape') return (
      <ellipse cx="115" cy="148" rx="65" ry="30" fill="#c77dff" opacity="0.7" />
    )
    if (capeId === 'galaxy-cape') return (
      <>
        <defs>
          <linearGradient id="galaxyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#1a0533" />
            <stop offset="40%"  stopColor="#4a1a7a" />
            <stop offset="100%" stopColor="#0d1b4b" />
          </linearGradient>
        </defs>
        <ellipse cx="115" cy="148" rx="68" ry="32" fill="url(#galaxyGrad)" opacity="0.85" />
        <text x="80"  y="148" fontSize="8" opacity="0.8">⭐</text>
        <text x="110" y="142" fontSize="6" opacity="0.7">✨</text>
        <text x="130" y="152" fontSize="8" opacity="0.8">💫</text>
        <text x="150" y="143" fontSize="6" opacity="0.6">⭐</text>
      </>
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
    if (hornId === 'star-tiara') return (
      <>
        <text x="35" y="60" fontSize="13">⭐</text>
        <text x="54" y="52" fontSize="17">⭐</text>
        <text x="72" y="60" fontSize="13">⭐</text>
        <text x="46" y="68" fontSize="9" opacity="0.7">✨</text>
      </>
    )
    if (hornId === 'ice-crown') return (
      <>
        <text x="36" y="60" fontSize="14">❄️</text>
        <text x="55" y="52" fontSize="18">👑</text>
        <text x="74" y="60" fontSize="12">❄️</text>
        <text x="46" y="70" fontSize="9" opacity="0.7">💙</text>
      </>
    )

    // Horn polygon + per-accessory extras
    return (
      <>
        {(hornId === 'rainbow-horn' || hornId === 'crystal-horn' || hornId === 'flame-horn' || hornId === 'cosmic-horn') && (
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
            {hornId === 'flame-horn' && (
              <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%"   stopColor="#ff4500" />
                <stop offset="50%"  stopColor="#ff8c00" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
            )}
            {hornId === 'cosmic-horn' && (
              <linearGradient id="cosmicGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#6a0dad" />
                <stop offset="50%"  stopColor="#4d96ff" />
                <stop offset="100%" stopColor="#c77dff" />
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
        {hornId === 'flame-horn' && (
          <>
            <text x="38" y="22" fontSize="13" opacity="0.95">🔥</text>
            <text x="62" y="16" fontSize="10" opacity="0.8">🔥</text>
            <text x="26" y="42" fontSize="9"  opacity="0.7">🔥</text>
          </>
        )}
        {hornId === 'cosmic-horn' && (
          <>
            <text x="34" y="20" fontSize="11" opacity="0.9">💫</text>
            <text x="66" y="16" fontSize="9"  opacity="0.8">⭐</text>
            <text x="82" y="30" fontSize="9"  opacity="0.7">✨</text>
            <text x="22" y="44" fontSize="8"  opacity="0.7">🌟</text>
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
