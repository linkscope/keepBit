import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false,
  locale: '',
  messages: {},
})

const localesMap = Object.fromEntries(
  Object.entries(import.meta.glob('../locale/*.json')).map(([path, loadLocale]) => [
    path.match(/([\w-]*)\.json$/)?.[1],
    loadLocale,
  ]),
)

const loadedLanguages = []

function setI18nLanguage(lang) {
  i18n.global.locale.value = lang
  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

export async function loadLanguageAsync(lang) {
  if (i18n.global.locale.value === lang) return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang)) return setI18nLanguage(lang)

  const mesaage = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, mesaage.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

loadLanguageAsync(localStorage.getItem('keepBit_lang') || 'zhCN')

export default i18n
