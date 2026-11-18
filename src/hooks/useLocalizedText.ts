import { useTranslation } from 'react-i18next'

import type { LocalizedText } from '@/types/api'

// Content from the API carries every language; fall back to Vietnamese, the source language.
export const useLocalizedText = () => {
  const { i18n } = useTranslation()
  return (text: LocalizedText | null | undefined) =>
    text ? (i18n.language === 'en' ? text.en : null) ?? text.vi : ''
}
