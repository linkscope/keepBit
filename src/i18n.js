import { createI18n } from 'vue-i18n'

// 初始化 i18n 实例
const i18n = createI18n({
  legacy: false,
  locale: '', // 初始语言为空
  messages: {}, // 动态加载语言包
})

// 动态引入语言文件
const localesMap = Object.fromEntries(
    Object.entries(import.meta.glob('../locale/*.json')).map(([path, loadLocale]) => [
      path.match(/([\w-]*)\.json$/)?.[1],
      loadLocale,
    ]),
)

const loadedLanguages = []

// 根据国家代码映射到语言
const regionToLocale = {
  CN: 'zhCN', // 中国大陆
  TW: 'zhTW', // 台湾
  HK: 'zhTW', // 香港
  JP: 'jaJP', // 日本
  KR: 'koKR', // 韩国
  TH: 'thTH', // 泰国
  VN: 'viVN', // 越南
  ID: 'idID', // 印尼
  MY: 'msMS', // 马来西亚
  US: 'enUS', // 美国
  GB: 'enUS', // 英国
}

// 设置语言
function setI18nLanguage(lang) {
  i18n.global.locale.value = lang
  document.querySelector('html')?.setAttribute('lang', lang)
  return lang
}

// 动态加载语言文件
export async function loadLanguageAsync(lang) {
  if (i18n.global.locale.value === lang) return setI18nLanguage(lang)

  if (loadedLanguages.includes(lang)) return setI18nLanguage(lang)

  const message = await localesMap[lang]()
  i18n.global.setLocaleMessage(lang, message.default)
  loadedLanguages.push(lang)
  return setI18nLanguage(lang)
}

// 获取用户地理位置并设置默认语言
async function setDefaultLanguage() {
  try {
    // 获取用户的国家代码
    const response = await fetch('https://get.geojs.io/v1/ip/country.json')
    const data = await response.json()
    const userRegion = data.country // 国家代码（如 CN, US, JP）
    const lang = regionToLocale[userRegion] || 'enUS' // 根据国家代码映射语言，默认英语

    localStorage.setItem('keepBit_lang', lang) // 将语言存储到 localStorage
    await loadLanguageAsync(lang) // 加载语言文件并设置语言
  } catch (error) {
    console.error('Error fetching user region:', error)
    const fallbackLang = 'enUS' // 请求失败时使用的默认语言
    localStorage.setItem('keepBit_lang', fallbackLang)
    await loadLanguageAsync(fallbackLang)
  }
}

// 根据 IP 设置默认语言
setDefaultLanguage()

export default i18n
