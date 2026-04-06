import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders 3 filled stars for stars=3', () => {
    render(<StarRating stars={3} />)
    expect(screen.getAllByText('⭐')).toHaveLength(3)
    expect(screen.queryByText('☆')).toBeNull()
  })

  it('renders 1 filled and 2 empty stars for stars=1', () => {
    render(<StarRating stars={1} />)
    expect(screen.getAllByText('⭐')).toHaveLength(1)
    expect(screen.getAllByText('☆')).toHaveLength(2)
  })

  it('renders 3 empty stars for stars=0', () => {
    render(<StarRating stars={0} />)
    expect(screen.getAllByText('☆')).toHaveLength(3)
    expect(screen.queryByText('⭐')).toBeNull()
  })
})
