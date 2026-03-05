<template>
  <q-page-container>
    <q-page
      flex
      :style-fn="pageFhStyle"
    >
      <entity-view
        :type="($route.params.type as EntityType)"
        :id="($route.params.id as string)"
        :position="rightEntity ? 'left' : 'full'"
      />
      <entity-view
        v-if="rightEntity && $q.screen.gt.xs"
        :id="rightEntity.id"
        :type="rightEntity.type"
        position="right"
      />
    </q-page>
  </q-page-container>
  <q-drawer
    v-if="$q.screen.lt.sm"
    :model-value="!!rightEntity"
    @update:model-value="!$event && $router.replace({ query: {} })"
    bg-sur-c-low
    :breakpoint="Infinity"
    side="right"
    :width="$q.screen.width * 0.85"
  >
    <entity-view
      v-if="rightEntity"
      :id="rightEntity.id"
      :type="rightEntity.type"
      position="right"
    />
  </q-drawer>
</template>

<script setup lang="ts">
import type { EntityType } from 'app/src-shared/utils/validators'
import { pageFhStyle } from 'src/utils/functions'
import EntityView from 'src/views/EntityView.vue'
import { useRightEntity } from 'src/composables/right-entity'

const rightEntity = useRightEntity()
</script>
