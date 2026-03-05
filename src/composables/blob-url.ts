import { getBlob } from 'src/utils/blob-cache'
import type { Ref } from 'vue'
import { onUnmounted, ref, watch } from 'vue'

const objectURLs: {
  [id: string]: { url: string, active: number }
} = {}

export async function mount(id: string) {
  if (objectURLs[id]) {
    objectURLs[id].active++
    return objectURLs[id].url
  } else {
    const blob = await getBlob(id)
    const url = URL.createObjectURL(blob)
    objectURLs[id] = { url, active: 1 }
    return url
  }
}
export function unmount(id: string) {
  if (!objectURLs[id]) return
  objectURLs[id].active--
  if (objectURLs[id].active === 0) {
    URL.revokeObjectURL(objectURLs[id].url)
    delete objectURLs[id]
  }
}

export function useBlobURL(id: Ref<string | null>) {
  const url = ref<string | null>(null)
  let promise: Promise<any> | null = null
  watch(id, (to, from) => {
    if (from) promise!.then(() => unmount(from))
    if (to) {
      promise = mount(to).then(u => {
        if (id.value === to) url.value = u
      })
    }
  }, { immediate: true })
  onUnmounted(() => {
    id.value && promise!.then(() => unmount(id.value!))
  })
  return url
}
