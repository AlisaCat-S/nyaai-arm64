import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { useEntityStore } from './entity'
import { mutate } from '../utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import { useQuery } from 'src/composables/zero/query'
import { useWorkspaceStore } from './workspace'
import { queries } from 'app/src-shared/queries'

export const useRecentEntitiesStore = defineStore('recent-entities', () => {
  const entityStore = useEntityStore()
  const workspaceStore = useWorkspaceStore()
  const { data: accesses } = useQuery(() => workspaceStore.id ? queries.entityAccesses(workspaceStore.id) : null)
  watch(() => entityStore.entity?.id, id => {
    if (!id) return
    mutate(mutators.accessEntity({
      entityId: id,
      time: Date.now(),
    }))
  })
  const entities = computed(() => accesses.value?.map(a => a.entity!) ?? [])

  return { accesses, entities }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRecentEntitiesStore, import.meta.hot))
}
