<template>
  <q-select
    :model-value="model"
    @input-value="model = $event"
    :options="filteredOptions"
    @filter="filterFn"
    use-input
    hide-selected
    fill-input
    hide-dropdown-icon
    :input-debounce="0"
  >
    <template
      v-if="$slots.option"
      #option="slot"
    >
      <slot
        name="option"
        v-bind="slot"
      />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import type { QSelectProps } from 'quasar'
import { filterOptions } from 'src/utils/functions'
import { ref } from 'vue'

const props = defineProps<{
  options: string[]
}>()

const model = defineModel<string | null>()

const filteredOptions = ref(props.options)
const filterFn: QSelectProps['onFilter'] = (val, update) => {
  update(() => {
    filteredOptions.value = val ? filterOptions(props.options, val, x => x) : props.options
  })
}
</script>
