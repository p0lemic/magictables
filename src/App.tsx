import { useState } from 'react'
import type { Screen } from './types'
import { useGameStore } from './store/gameStore'
import UserSelect from './pages/UserSelect'
import Home from './pages/Home'
import FreeMode from './pages/FreeMode'
import ProgressiveMode from './pages/ProgressiveMode'
import PracticeSession from './pages/PracticeSession'
import SessionResults from './pages/SessionResults'
import UnicornCustomizer from './pages/UnicornCustomizer'
import TableReference from './pages/TableReference'

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'user-select' })
  const { init, loaded, logout } = useGameStore()

  const navigate = (next: Screen) => setScreen(next)

  const handleLogin = async (userId: number) => {
    await init(userId)
    setScreen({ name: 'home' })
  }

  const handleLogout = () => {
    logout()
    setScreen({ name: 'user-select' })
  }

  // Brief blank while fetching state after login
  if (screen.name !== 'user-select' && !loaded) return null

  switch (screen.name) {
    case 'user-select':
      return <UserSelect onLogin={handleLogin} />

    case 'home':
      return <Home onNavigate={navigate} onLogout={handleLogout} />

    case 'free-mode':
      return <FreeMode onNavigate={navigate} />

    case 'progressive-mode':
      return <ProgressiveMode onNavigate={navigate} />

    case 'practice-session':
      return (
        <PracticeSession
          table={screen.table}
          mode={screen.mode}
          ordered={screen.ordered}
          difficulty={screen.difficulty}
          onNavigate={navigate}
        />
      )

    case 'session-results':
      return (
        <SessionResults
          table={screen.table}
          correct={screen.correct}
          mode={screen.mode}
          difficulty={screen.difficulty}
          onNavigate={navigate}
        />
      )

    case 'unicorn-customizer':
      return <UnicornCustomizer onNavigate={navigate} />

    case 'table-reference':
      return <TableReference onNavigate={navigate} />
  }
}
