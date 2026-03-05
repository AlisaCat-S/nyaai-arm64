import { initI18n } from 'i18n-pro'
import { nextTick, watch } from 'vue'
import { Quasar } from 'quasar'
import { localData } from 'src/utils/local-data'
import { getLocale, langs } from 'app/i18n'
import { getEnglishPlural } from './english-plural'

const langList = import.meta.glob('../../node_modules/quasar/lang/(en-US|zh-CN|zh-TW).js')

function setQuasarLang(language) {
  try {
    langList[`../../node_modules/quasar/lang/${language}.js`]().then((lang: any) => {
      Quasar.lang.set(lang.default)
    })
  } catch (err) {
    // Requested Quasar Language Pack does not exist,
    // let's not break the app, so catching error
    console.error('Request Quasar Language Page failed:', err)
  }
}

export const locale = localData.locale ?? getLocale(navigator.language)
setQuasarLang(locale)
watch(() => localData.locale, async () => {
  await nextTick()
  location.reload()
})

export const {
  t,
} = initI18n({
  namespace: 'frontend',
  locale,
  langs,
  formatTime({ payload }) {
    return new Date(payload as number).toLocaleString()
  },
  formatDate({ payload }) {
    return new Date(payload as number).toLocaleString()
  },
  formatPlural({ locale, text, payload, keyword }) {
    if (locale.startsWith('en') && payload as number > 1) {
      return `${payload as number} ${getEnglishPlural(keyword)}`
    }
    return text
  },
})
