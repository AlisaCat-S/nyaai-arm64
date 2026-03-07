import { defineStore, acceptHMRUpdate } from 'pinia'
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'

export const useGlobalSettingsStore = defineStore('global-settings', () => {
  const { data: settings } = useQuery(queries.globalSettings())

  return {
    settings,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGlobalSettingsStore, import.meta.hot))
}
