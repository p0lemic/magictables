export type { Language, Translations } from './types'
export { LanguageProvider, useLanguage } from './context'
export { es } from './es'
export { ca } from './ca'

import { useLanguage } from './context'
import { es } from './es'
import { ca } from './ca'

export function useTranslation() {
  const { lang, toggle } = useLanguage()
  const t = lang === 'ca' ? ca : es
  return { t, lang, toggle }
}
