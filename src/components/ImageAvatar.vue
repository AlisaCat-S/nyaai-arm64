<template>
  <q-avatar>
    <img
      v-if="url"
      :src="url"
    >
  </q-avatar>
</template>

<script setup lang="ts">
import { useBlobURL } from 'src/composables/blob-url'
import { toRef } from 'vue'

const props = defineProps<{
  itemId: string
}>()

const url = useBlobURL(toRef(props, 'itemId'))
</script>
