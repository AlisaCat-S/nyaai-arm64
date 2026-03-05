<template>
  <q-chip
    :label="entityName(entity)"
    :removable
    icon="sym_o_description"
    icon-remove="sym_o_close"
    @remove="$emit('remove')"
    @click="$router.push({ query: { rightEntity: JSON.stringify({ type: entity.type, id: entity.id }) } })"
    clickable
    max-w="360px"
  />
</template>

<script setup lang="ts">
import type { Row } from '@rocicorp/zero'
import { entityName } from 'src/utils/defaults'

defineProps<{
  entity: Row['entity']
  removable?: boolean
}>()

defineEmits(['remove'])
</script>
