import { defineStore, acceptHMRUpdate } from 'pinia'
import { ref } from 'vue'
import { useWorkspaceStore } from 'src/stores/workspace'
import { until } from '@vueuse/core'

export const useRightDirStore = defineStore('rightDir', () => {
  const workspaceStore = useWorkspaceStore()
  const dirId = ref<string | null>(null)
  until(() => workspaceStore.id).toBeTruthy().then(id => {
    dirId.value ??= id
  })

  return {
    dirId,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRightDirStore, import.meta.hot))
}
