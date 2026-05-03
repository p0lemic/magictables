import type { UnicornState } from '../types'
import UnicornAvatar from './UnicornAvatar'
import DragonAvatar from './DragonAvatar'

interface Props {
  state: UnicornState
  size?: number
  floating?: boolean
}

export default function CreatureAvatar({ state, size = 200, floating = false }: Props) {
  if (state.creature === 'dragon') {
    return <DragonAvatar equipped={state.dragonEquipped} size={size} floating={floating} />
  }
  return <UnicornAvatar equipped={state.equipped} size={size} floating={floating} />
}
