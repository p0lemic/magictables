const PARTICLES = [
  { emoji: '⭐', size: 18, left: 5,  top: 10, duration: 3.2, delay: 0 },
  { emoji: '✨', size: 14, left: 15, top: 60, duration: 2.8, delay: 0.5 },
  { emoji: '⭐', size: 22, left: 25, top: 30, duration: 3.5, delay: 1 },
  { emoji: '💫', size: 16, left: 40, top: 75, duration: 2.5, delay: 0.3 },
  { emoji: '✨', size: 20, left: 55, top: 20, duration: 3.1, delay: 0.8 },
  { emoji: '⭐', size: 12, left: 65, top: 50, duration: 2.9, delay: 1.2 },
  { emoji: '💫', size: 18, left: 75, top: 15, duration: 3.3, delay: 0.2 },
  { emoji: '✨', size: 14, left: 85, top: 65, duration: 2.7, delay: 0.7 },
  { emoji: '⭐', size: 16, left: 92, top: 40, duration: 3.0, delay: 1.5 },
  { emoji: '💫', size: 20, left: 48, top: 88, duration: 2.6, delay: 0.4 },
]

export default function StarParticles() {
  return (
    <>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-0 select-none"
          style={{
            fontSize: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            opacity: 0.35,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </>
  )
}
