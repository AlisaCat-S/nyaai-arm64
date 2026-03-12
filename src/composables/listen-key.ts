import { shortcutKeyMatch } from 'src/utils/functions'
import type { ShortcutKey } from 'src/utils/types'
import type { Ref } from 'vue'
import { onMounted, onUnmounted } from 'vue'

export function useListenKey(shortcutKey: Ref<ShortcutKey>, callback: () => void, prevent = true) {
  const listener = (event: KeyboardEvent) => {
    if (shortcutKeyMatch(shortcutKey.value, event)) {
      callback()
      prevent && event.preventDefault()
    }
  }
  const addListener = () => { document.addEventListener('keydown', listener) }
  const rmListener = () => { document.removeEventListener('keydown', listener) }
  onMounted(addListener)
  onUnmounted(rmListener)
}
