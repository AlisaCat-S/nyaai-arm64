import { acceptHMRUpdate, defineStore } from 'pinia'
import { useQuery } from 'src/composables/zero/query'
import { zql } from 'app/src-shared/schema.gen'
import { arrayToMap } from 'src/utils/functions'
import { computed } from 'vue'
import type { Row } from '@rocicorp/zero'

export const useLocalEntitiesStore = defineStore('local-entities', () => {
  const { data: entities } = useQuery(zql.entity)
  const entityMap = computed(() => arrayToMap(entities.value, e => e.id))

  function getAncestors(entity: Row['entity']): Row['entity'][] {
    if (!entity.parentId) return []
    const parent = entityMap.value[entity.parentId]
    if (!parent) return []
    return [...getAncestors(parent), parent]
  }

  return { entities, entityMap, getAncestors }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocalEntitiesStore, import.meta.hot))
}
