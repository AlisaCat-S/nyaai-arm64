<template>
  <q-input
    type="number"
    :model-value="modelValue / multiplier"
    @update:model-value="update($event as string)"
    :suffix
  />
</template>
<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  multiplier: number
  suffix: string
}>()
const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

function update(val: string) {
  emit('update:modelValue', parseFloat(val) * props.multiplier)
}
</script>
