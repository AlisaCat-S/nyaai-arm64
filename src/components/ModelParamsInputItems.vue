<template>
  <common-item
    label="temperature"
    :caption="t('For most providers, 0 means almost deterministic results, and higher values mean more randomness.')"
  >
    <a-input
      class="w-100px"
      :filled
      dense
      :model-value="modelValue.temperature"
      @update:model-value="$emit('update:modelValue', { ...modelValue, temperature: parseNumber($event) })"
      type="number"
      step="0.1"
    />
  </common-item>
  <common-item
    label="topP"
    :caption="t('Nucleus sampling. It is recommended to set either temperature or topP, but not both.')"
  >
    <a-input
      class="w-100px"
      :filled
      dense
      :model-value="modelValue.topP"
      @update:model-value="$emit('update:modelValue', { ...modelValue, topP: parseNumber($event) })"
      type="number"
      step="0.1"
    />
  </common-item>
  <common-item
    label="presencePenalty"
    :caption="t('The presence penalty affects the likelihood of the model to repeat information that is already in the prompt.')"
  >
    <a-input
      class="w-100px"
      :filled
      dense
      :model-value="modelValue.presencePenalty"
      @update:model-value="$emit('update:modelValue', { ...modelValue, presencePenalty: parseNumber($event) })"
      type="number"
      step="0.1"
    />
  </common-item>
  <common-item
    label="frequencyPenalty"
    :caption="t('The frequency penalty affects the likelihood of the model to repeatedly use the same words or phrases.')"
  >
    <a-input
      class="w-100px"
      :filled
      dense
      :model-value="modelValue.frequencyPenalty"
      @update:model-value="$emit('update:modelValue', { ...modelValue, frequencyPenalty: parseNumber($event) })"
      type="number"
      step="0.1"
    />
  </common-item>
  <common-item
    label="stopSequences"
    :caption="t('The stop sequences to use for stopping the text generation.')"
  >
    <q-select
      class="w-150px"
      :filled
      dense
      :model-value="modelValue.stopSequences"
      @update:model-value="$emit('update:modelValue', { ...modelValue, stopSequences: $event })"
      use-input
      use-chips
      multiple
      hide-dropdown-icon
      input-debounce="0"
      new-value-mode="add-unique"
    />
  </common-item>
  <common-item
    label="maxOutputTokens"
    :caption="t('Maximum number of tokens to generate.')"
  >
    <a-input
      class="w-150px"
      :filled
      dense
      :model-value="modelValue.maxOutputTokens"
      @update:model-value="$emit('update:modelValue', { ...modelValue, maxOutputTokens: parseNumber($event) })"
      type="number"
      clearable
    />
  </common-item>
  <common-item
    label="seed"
    :caption="t('The seed (integer) used for random sampling. If set and supported by the model, calls will generate deterministic results.')"
  >
    <a-input
      class="w-100px"
      :filled
      dense
      :model-value="modelValue.seed"
      @update:model-value="$emit('update:modelValue', { ...modelValue, seed: parseNumber($event) })"
      type="number"
      clearable
    />
  </common-item>
</template>

<script setup lang="ts">
import type { ModelSettings } from 'app/src-shared/utils/types'
import AInput from './AInput'
import CommonItem from './CommonItem.vue'
import { t } from 'src/utils/i18n'

defineProps<{
  modelValue: ModelSettings
  filled?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: ModelSettings]
}>()

function parseNumber(val: string) {
  return parseFloat(val) || undefined
}
</script>
