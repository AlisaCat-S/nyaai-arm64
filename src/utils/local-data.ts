import { localReactive } from 'src/composables/local-reactive'

export const localData = localReactive('local-data', {
  locale: null as 'en-US' | 'zh-CN' | 'zh-TW' | null,
})
