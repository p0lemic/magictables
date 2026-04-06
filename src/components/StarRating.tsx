interface Props {
  stars: number      // 0–3
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const SIZE = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' }

export default function StarRating({ stars, size = 'md', animated = false }: Props) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 3 }, (_, i) => (
        <span
          key={i}
          className={`${SIZE[size]} ${animated && i < stars ? 'animate-star-fill' : ''}`}
          style={animated ? { animationDelay: `${i * 0.2}s` } : undefined}
        >
          {i < stars ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  )
}
