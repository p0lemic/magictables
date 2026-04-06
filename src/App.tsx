import { useState } from 'react'
import type { Screen } from './types'
import Home from './pages/Home'
import FreeMode from './pages/FreeMode'
import ProgressiveMode from './pages/ProgressiveMode'
import PracticeSession from './pages/PracticeSession'
import SessionResults from './pages/SessionResults'
import UnicornCustomizer from './pages/UnicornCustomizer'
import TableReference from './pages/TableReference'

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  const navigate = (next: Screen) => setScreen(next)

  switch (screen.name) {
    case 'home':
      return <Home onNavigate={navigate} />

    case 'free-mode':
      return <FreeMode onNavigate={navigate} />

    case 'progressive-mode':
      return <ProgressiveMode onNavigate={navigate} />

    case 'practice-session':
      return (
        <PracticeSession
          table={screen.table}
          mode={screen.mode}
          onNavigate={navigate}
        />
      )

    case 'session-results':
      return (
        <SessionResults
          table={screen.table}
          correct={screen.correct}
          mode={screen.mode}
          onNavigate={navigate}
        />
      )

    case 'unicorn-customizer':
      return <UnicornCustomizer onNavigate={navigate} />

    case 'table-reference':
      return <TableReference onNavigate={navigate} />
  }
}
