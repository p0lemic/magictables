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
          fill={equipped.horn === 'rainbow-horn' ? 'url(#rainbowGrad)' : '#fee440'}
          stroke="#f0c000" strokeWidth="1"
        />
        {equipped.horn === 'rainbow-horn' && (
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

        {/* Sparkle emojis when rainbow horn equipped */}
        {equipped.horn === 'rainbow-horn' && (
          <>
            <text x="38" y="22" fontSize="12" opacity="0.8">✨</text>
            <text x="70" y="14" fontSize="10" opacity="0.6">⭐</text>
            <text x="88" y="24" fontSize="8"  opacity="0.7">💫</text>
          </>
        )}

        {/* Flower crown when flower-crown equipped in horn slot */}
        {equipped.horn === 'flower-crown' && (
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
