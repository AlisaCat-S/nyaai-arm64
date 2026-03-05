<template>
  <q-select
    v-model="model"
    :options
    map-options
    emit-value
  />
</template>

<script setup lang="ts">
import type { EntityType } from 'app/src-shared/utils/validators'

const model = defineModel<EntityType | null>()

const options = [
  { label: 'All', value: null },
  { label: 'Chat', value: 'chat' },
  { label: 'Search', value: 'search' },
  { label: 'Page', value: 'page' },
  { label: 'File', value: 'file' },
  { label: 'Channel', value: 'channel' },
  { label: 'Translation', value: 'translation' },
  { label: 'Folder', value: 'folder' },
]
</script>
