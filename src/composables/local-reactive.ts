import { watch, reactive } from 'vue'
import { LocalStorage } from 'quasar'

export function localReactive<T extends object>(key: string, value: T) {
  const val = reactive({
    ...value,
    ...LocalStorage.getItem<T>(key) || {},
  })
  let flag = false
  watch(val, () => {
    if (flag) {
      flag = false
      return
    }
    LocalStorage.setItem(key, val)
  })
  window.addEventListener('storage', event => {
    if (event.key === key) {
      flag = true
      Object.assign(val, LocalStorage.getItem<T>(key))
    }
  })
  return val
}
