<template>
  <a-input
    :model-value="modelValue"
    @change="$emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import AInput from './AInput'

defineProps<{
  modelValue
}>()
defineEmits(['update:modelValue'])
</script>
