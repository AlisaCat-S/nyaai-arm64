import { onUnmounted } from 'vue'

const store = new Map<string, any>()
export function provideGlobal<T>(key: string, value: T) {
  store.set(key, value)
  onUnmounted(() => {
    store.delete(key)
  })
}
export function injectGlobal<T>(key: string): T | undefined {
  return store.get(key)
}
