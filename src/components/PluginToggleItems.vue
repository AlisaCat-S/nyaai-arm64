<template>
  <q-item
    v-for="{ id, name, avatar } of store.plugins"
    :key="id"
    clickable
    @click="$emit(
      'update:modelValue',
      modelValue.includes(id) ? modelValue.filter(x => x !== id) : [...modelValue, id]
    )"
    min-h="40px"
    py-1
  >
    <q-item-section
      avatar
      min-w-0
      pr-3
      ml--1
    >
      <a-avatar
        :avatar
        size="27px"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>
        {{ name }}
      </q-item-label>
      <q-item-label
        v-if="status && modelValue.includes(id)"
        caption
      >
        {{ statusText(status[id]) }}
      </q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-checkbox
        :model-value="modelValue.includes(id)"
        dense
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { PluginStatus } from 'src/composables/plugins'
import { usePluginsStore } from 'src/stores/plugins'
import { t } from 'src/utils/i18n'
import AAvatar from './AAvatar.vue'

defineProps<{
  modelValue: string[]
  status?: Record<string, PluginStatus>
}>()

defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const store = usePluginsStore()

function statusText(status: PluginStatus) {
  if (status === 'starting') return t('Starting...')
  if (status === 'ready') return t('Started')
  if (status === 'failed') return t('Failed to start')
}
</script>
