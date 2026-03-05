<template>
  <div
    :id
    flex
    rd
    of-hidden
  />
</template>

<script setup lang="ts">
import { genId } from 'app/src-shared/utils/id'
import { basicEditor } from 'prism-code-editor/setups'
import { onBeforeUnmount, onMounted, watch } from 'vue'
import type { PrismEditor } from 'prism-code-editor'
import 'prism-code-editor/prism/languages/common'
import 'prism-code-editor/prism/languages/vue'
import 'prism-code-editor/languages'

const id = `editor-${genId()}`

const props = defineProps<{
  modelValue: string
  language?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

let editor: PrismEditor | null = null
onMounted(() => {
  editor = basicEditor(
  `#${id}`,
  {
    language: props.language,
    value: props.modelValue,
    theme: 'atom-one-dark',
    onUpdate(value) {
      emit('update:modelValue', value)
    },
  },
  )
})
onBeforeUnmount(() => {
  editor?.remove()
  editor = null
})

watch(() => props.language, () => {
  if (!editor) return
  editor.setOptions({
    language: props.language,
  })
})

watch(() => props.modelValue, () => {
  if (!editor) return
  if (editor.value !== props.modelValue) {
    editor.setOptions({
      value: props.modelValue,
    })
  }
})
</script>
