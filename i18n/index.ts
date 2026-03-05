import enUS from './zh-CN.json'
import zhTW from './zh-TW.json'

export const langs = {
  'zh-CN': enUS,
  'zh-TW': zhTW,
}

export function getLocale(locale: string) {
  if (Object.keys(langs).includes(locale)) {
    return locale
  } else if (locale === 'zh-HK') {
    return 'zh-TW'
  } else if (locale.startsWith('zh')) {
    return 'zh-CN'
  } else {
    return 'en-US'
  }
}
