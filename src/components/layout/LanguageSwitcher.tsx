import { Segmented } from 'antd'
import { useTranslation } from 'react-i18next'

import { changeLanguage, LANGUAGES, type Language } from '@/i18n'

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation()

  return (
    <Segmented<Language>
      size="small"
      value={i18n.language as Language}
      onChange={changeLanguage}
      aria-label={t('common.chooseLanguage')}
      options={LANGUAGES.map((language) => ({
        value: language,
        label: <span title={t(`common.languages.${language}`)}>{language.toUpperCase()}</span>,
      }))}
    />
  )
}
