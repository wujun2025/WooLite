import { useState, useEffect } from 'react'
import { useAppStore } from '../store'
import { TranslationKeys } from '../types'

// 导入语言包
import zhCN from '../locales/zh-CN'
import zhTW from '../locales/zh-TW'
import enUS from '../locales/en-US'

type LanguagePack = Record<keyof TranslationKeys, string>

const languagePacks: Record<string, LanguagePack> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  'en-US': enUS
}

export const useTranslation = () => {
  const language = useAppStore(state => state.language)
  const [translations, setTranslations] = useState<LanguagePack>(zhCN)

  useEffect(() => {
    setTranslations(languagePacks[language] || zhCN)
  }, [language])

  const t = (key: keyof TranslationKeys): string => {
    return translations[key] || key
  }

  return { t, language }
}