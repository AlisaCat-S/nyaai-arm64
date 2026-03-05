<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label
        caption
        v-if="caption"
      >
        {{ caption }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <slot />
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
defineProps<{
  label: string
  caption?: string
}>()
</script>
