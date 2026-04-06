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
