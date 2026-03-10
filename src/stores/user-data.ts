import { defineStore, acceptHMRUpdate } from 'pinia'
import { mutate, user } from '../utils/zero-session'
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import { mutators } from 'app/src-shared/mutators'
import { computed, watch } from 'vue'

export const useUserDataStore = defineStore('user-data', () => {
  const { data, status } = useQuery(() => user.id ? queries.userData() : null)
  const t = Date.now()

  console.log('query user id', user.id)

  watch(data, val => {
    console.log('User data updated', val, `took ${Date.now() - t}ms`)
  }, { deep: true, immediate: true })

  async function updateData(updates: Record<string, any>) {
    await mutate(mutators.updateUserData({ updates })).client
  }
  return {
    lastWorkspaceId: computed(() => data.value?.lastWorkspaceId),
    data: computed(() => data.value?.data),
    perfs: computed(() => data.value?.perfs),
    status,
    updateData,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserDataStore, import.meta.hot))
}
