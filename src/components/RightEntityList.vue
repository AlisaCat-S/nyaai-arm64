<template>
  <entity-list
    v-model="dirId"
    @entity-click="onEntityClick"
    :list-options-override="{
      orderBy: ['id', mode === 'right' ? 'desc' : 'asc']
    }"
  >
    <template #actions>
      <q-btn
        v-if="mode === 'left'"
        icon="sym_o_add"
        :title="t('New Shortcut')"
        @click="createShortcut"
        flat
        un-size="32px"
        size="sm"
      />
    </template>
  </entity-list>
</template>

<script setup lang="ts">
import type { FullEntity } from 'app/src-shared/queries'
import EntityList from './EntityList.vue'
import { entityRoute } from 'src/utils/functions'
import { useActiveEntitiesStore } from 'src/stores/active-entities'
import { useRouter } from 'vue-router'
import { t } from 'src/utils/i18n'
import CreateShortcutDialog from './CreateShortcutDialog.vue'
import { useQuasar } from 'quasar'

const props = defineProps<{
  mode: 'left' | 'right' | 'page'
}>()

const dirId = defineModel<string>({ required: true })

const activeEntitiesStore = useActiveEntitiesStore()

const router = useRouter()
function onEntityClick({ type, id }: FullEntity) {
  if (type === 'shortcut') {
    activeEntitiesStore.runShortcut(id)
  } else {
    const link = entityRoute(type, id, props.mode === 'page' ? 'right' : 'left')
    link && router.push(link)
  }
}

const $q = useQuasar()
function createShortcut() {
  $q.dialog({
    component: CreateShortcutDialog,
    componentProps: {
      parentId: dirId.value,
    },
  })
}

</script>
