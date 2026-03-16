<template>
  <q-list
    ref="listRef"
    @scroll="onScroll"
    of-y-auto
    p-2
  >
    <entity-item
      v-for="entity of entities"
      :key="entity.id"
      :entity
      clickable
      @click="selected.has(entity.id) ? selected.delete(entity.id) : selected.add(entity.id)"
      :selectable="selected.has(entity.id)"
      :selected="selected.has(entity.id)"
      @contextmenu="selected.add(entity.id)"
      max-w="600px"
      mx-a
    />
    <q-menu context-menu>
      <q-list ref="menuListRef">
        <menu-item
          :label="t('Restore')"
          icon="sym_o_restore_page"
          @click="restoreSelected"
        />
        <menu-item
          :label="t('Delete')"
          icon="sym_o_delete_forever"
          @click="deleteSelected"
          hover:text-err
        />
      </q-list>
    </q-menu>
    <q-item
      v-if="!list.length && status === 'complete'"
      min-h-0
    >
      <q-item-section text-on-sur-var>
        {{ t('No items') }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue'
import EntityItem from './EntityItem.vue'
import type { Row } from '@rocicorp/zero'
import type { EntityListOptions, EntityStart } from 'app/src-shared/utils/validators'
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import type { SpliceListOptions } from 'src/utils/functions'
import { spliceList } from 'src/utils/functions'
import MenuItem from './MenuItem.vue'
import { t } from 'src/utils/i18n'
import { QList, useQuasar } from 'quasar'
import { mutators } from 'app/src-shared/mutators'
import { mutate } from 'src/utils/zero-session'
import SelectDirDialog from './SelectDirDialog.vue'

const props = defineProps<{
  workspaceId: string
  listOptions: EntityListOptions
}>()

const entities = reactive<Row['entity'][]>([])

function spliceEntities(val: Row['entity'][], options: SpliceListOptions) {
  spliceList(entities, val, [['sortPriority', 'desc'], props.listOptions.orderBy, ['id', 'asc']], options)
}

const { data: list, status } = useQuery(() => queries.listTrash({
  workspaceId: props.workspaceId,
  ...props.listOptions,
  limit: 40,
}))
watch(list, val => {
  spliceEntities(val, { noMore: val.length < 40 })
}, { deep: 1, immediate: true })

const start = ref<EntityStart | null>(null)
const { data: more } = useQuery(() =>
  start.value
    ? queries.listTrash({
      workspaceId: props.workspaceId,
      ...props.listOptions,
      start: start.value,
      limit: 80,
    })
    : null)
watch(more, val => {
  val && spliceEntities(val, { start: start.value, noMore: val.length < 80 })
}, { deep: 1 })
watch([() => props.workspaceId, () => props.listOptions], () => {
  start.value = null
  entities.length = 0
})

function loadMore() {
  start.value = entities.at(-1)!
}
function onScroll(ev: Event) {
  const container = ev.target as HTMLElement
  if (container.scrollHeight - container.scrollTop - container.clientHeight < 200) {
    loadMore()
  }
}

const selected = reactive<Set<string>>(new Set())
const listRef = useTemplateRef('listRef')
const menuListRef = useTemplateRef('menuListRef')
function clickListener(ev: MouseEvent) {
  if (listRef.value?.$el?.contains(ev.target) || menuListRef.value?.$el?.contains(ev.target)) return
  selected.clear()
}
document.addEventListener('click', clickListener)
onUnmounted(() => {
  document.removeEventListener('click', clickListener)
})

const $q = useQuasar()
function deleteSelected() {
  const _selected = Array.from(selected)
  $q.dialog({
    title: t('Delete Permanently'),
    message: t('Are you sure you want to delete selected items from trash permanently?'),
    cancel: true,
    ok: {
      label: t('Delete'),
      color: 'negative',
      flat: true,
    },
  }).onOk(() => {
    mutate(mutators.deleteEntities({
      workspaceId: props.workspaceId,
      ids: _selected,
    }))
  })
}
function restoreSelected() {
  const _selected = Array.from(selected)
  $q.dialog({
    component: SelectDirDialog,
    componentProps: {
      title: t('Restore to'),
    },
  }).onOk((dirId: string) => {
    mutate(mutators.restoreEntities({
      workspaceId: props.workspaceId,
      ids: _selected,
      to: dirId,
    }))
  })
}
</script>
