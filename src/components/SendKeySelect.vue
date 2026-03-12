<template>
  <q-select
    v-model="model"
    :options
    emit-value
    map-options
  />
</template>
<script lang="ts" setup>
import type { ShortcutKey } from 'src/utils/types'

const model = defineModel<ShortcutKey>()

const options: { label: string, value: ShortcutKey }[] = [
  { label: 'Ctrl + Enter', value: { key: 'Enter', withCtrl: true } },
  { label: 'Shift + Enter', value: { key: 'Enter', withShift: true } },
  { label: 'Command + Enter', value: { key: 'Enter', withMeta: true } },
  { label: 'Enter', value: { key: 'Enter' } },
]
</script>
