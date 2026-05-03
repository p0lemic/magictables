import { createContext, useContext, useState } from 'react'
import type { Language } from './types'

interface LanguageContextValue {
  lang: Language
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    const stored = localStorage.getItem('tablas-language')
    return stored === 'ca' ? 'ca' : 'es'
  })

  const toggle = () => {
    setLang(prev => {
      const next: Language = prev === 'es' ? 'ca' : 'es'
      localStorage.setItem('tablas-language', next)
      return next
    })
  }

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
