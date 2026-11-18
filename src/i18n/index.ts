import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import { en } from '@/locales/en'
import { vi, type Translation } from '@/locales/vi'

// Makes t('...') keys type-checked against the Vietnamese source file.
declare module 'i18next' {
  interface CustomTypeOptions {
    resources: { translation: Translation }
  }
}

export const LANGUAGES = ['vi', 'en'] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = 'vilab-language'

const readStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return LANGUAGES.find((language) => language === stored) ?? 'vi'
  } catch {
    return 'vi'
  }
}

export const changeLanguage = async (language: Language) => {
  try {
    localStorage.setItem(STORAGE_KEY, language)
  } catch {
    // Private browsing can block storage; the choice then lasts for this visit only.
  }
  await i18n.changeLanguage(language)
}

i18n.on('languageChanged', (language) => {
  document.documentElement.lang = language
})

// Resources are bundled, so initialise synchronously and render the first frame already translated.
void i18n.use(initReactI18next).init({
  resources: { vi: { translation: vi }, en: { translation: en } },
  lng: readStoredLanguage(),
  fallbackLng: 'vi',
  initAsync: false,
  // React already escapes rendered strings.
  interpolation: { escapeValue: false },
})

export { i18n }
