<template>
  <q-select
    :model-value="perfsStore.perfs.sendMessageKey"
    @update:model-value="update"
    :options
    emit-value
    map-options
  />
</template>
<script lang="ts" setup>
import { usePerfsStore } from 'src/stores/perfs'
import type { ShortcutKey } from 'src/utils/types'

const perfsStore = usePerfsStore()
function update(shortcut: ShortcutKey) {
  perfsStore.update({
    updates: { sendMessageKey: shortcut },
    scope: 'user',
  })
}

const options: { label: string, value: ShortcutKey }[] = [
  { label: 'Ctrl + Enter', value: { key: 'Enter', withCtrl: true } },
  { label: 'Shift + Enter', value: { key: 'Enter', withShift: true } },
  { label: 'Command + Enter', value: { key: 'Enter', withMeta: true } },
  { label: 'Enter', value: { key: 'Enter' } },
]
</script>
