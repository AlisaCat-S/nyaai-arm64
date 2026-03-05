import { acceptHMRUpdate, defineStore } from 'pinia'
import { useWorkspaceStore } from './workspace'
import { queries } from 'app/src-shared/queries'
import { useQuery } from 'src/composables/zero/query'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { expandAncestors } from 'src/utils/functions'
import { useRunShortcut } from 'src/composables/run-shortcut'
import { useEntityStore } from './entity'

export const useActiveEntitiesStore = defineStore('active-entities', () => {
  const workspaceStore = useWorkspaceStore()
  const { data: shortcuts } = useQuery(
    () => workspaceStore.id ? queries.shortcuts(workspaceStore.id) : null,
    { emptyValue: [] },
  )
  const route = useRoute()
  const entityStore = useEntityStore()
  const entity = computed(() => entityStore.entity ?? entityStore.dirEntity)
  const path = computed(() => entity.value ? expandAncestors(entity.value).map(x => x.id) : [])
  const activeShortcuts = computed(() => shortcuts.value.filter(s =>
    (!s.dirId || path.value.includes(s.dirId)) &&
    (!s.type || s.type === route.params.type),
  ))
  const activeIds = computed(() => [
    ...activeShortcuts.value.map(s => s.id),
    entityStore.entity?.id,
    entityStore.rightEntity?.id,
  ].filter(Boolean))
  const _runShortcut = useRunShortcut()
  function runShortcut(id: string) {
    const shortcut = shortcuts.value.find(s => s.id === id)
    shortcut && _runShortcut(shortcut)
  }
  return { shortcuts, activeIds, runShortcut }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useActiveEntitiesStore, import.meta.hot))
}
