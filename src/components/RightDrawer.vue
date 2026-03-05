<template>
  <q-drawer
    show-if-above
    bg-sur-c-low
    :breakpoint="uiStateStore.rightDrawerBreakpoint"
    side="right"
    v-model="uiStateStore.rightDrawerOpen"
  >
    <div
      flex="~ col"
      h-full
    >
      <template v-if="viewDirId">
        <right-entity-list
          mode="page"
          :root-id="(route.params.id as string)"
          v-model="viewDirId"
          max-h="40%"
          w-full
          mt-2
        />
        <q-separator spaced />
      </template>
      <new-entity-btns p-2 />
      <right-entity-list
        v-if="rightDirStore.dirId"
        flex-1
        min-h-0
        mode="right"
        v-model="rightDirStore.dirId"
        w-full
        py-2
      />
      <task-panel-btn
        pos-fixed
        bottom-2
        right-2
        bg-sur-c-low
        flat
        round
        dense
      />
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { useUiStateStore } from 'src/stores/ui-state'
import { useRightDirStore } from 'src/stores/right-dir'
import RightEntityList from 'src/components/RightEntityList.vue'
import NewEntityBtns from './NewEntityBtns.vue'
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'
import TaskPanelBtn from './TaskPanelBtn.vue'

const rightDirStore = useRightDirStore()
const uiStateStore = useUiStateStore()

const route = useRoute()
const viewDirId = ref()
watchEffect(() => {
  viewDirId.value = route.params.id
})
</script>
