<template>
  <div
    view-styles
    flex="~ col"
  >
    <common-toolbar>
      <q-toolbar-title>
        {{ t('Edit Plugin') }}
      </q-toolbar-title>
    </common-toolbar>
    <q-list>
      <common-item :label="t('Enabled')">
        <q-toggle
          :model-value="plugin.enabled"
          @update:model-value="update({ enabled: $event })"
        />
      </common-item>
      <common-item label="URL">
        <q-input
          :model-value="plugin.transport.url"
          @change="update({ transport: { type: 'http', url: $event } })"
          filled
          dense
        />
      </common-item>
      <common-item :label="t('Request Timeout')">
        <q-input
          :model-value="plugin.requestTimeout"
          @change="update({ requestTimeout: parseNumber($event) })"
          type="number"
          :placeholder="DefaultRequestTimeout"
          filled
          dense
        />
      </common-item>
      <common-item :label="t('Reset Timeout on Progress')">
        <q-toggle
          :model-value="plugin.resetTimeoutOnProgress"
          @update:model-value="update({ resetTimeoutOnProgress: $event })"
        />
      </common-item>
      <common-item :label="t('Keep Alive Timeout')">
        <q-input
          :model-value="plugin.keepAliveTimeout"
          @change="update({ keepAliveTimeout: parseNumber($event) })"
          type="number"
          :placeholder="DefaultKeepAliveTimeout"
          filled
          dense
        />
      </common-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import CommonToolbar from 'src/components/CommonToolbar.vue'
import { t } from 'src/utils/i18n'
import type { Row } from '@rocicorp/zero'
import CommonItem from 'src/components/CommonItem.vue'
import { mutate } from 'src/utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import { DefaultKeepAliveTimeout, DefaultRequestTimeout } from 'src/composables/plugins'

const props = defineProps<{
  plugin: Row['mcpPlugin']
}>()

function parseNumber(val: string) {
  return parseFloat(val) || null
}

function update(updates: Partial<Row['mcpPlugin']>) {
  mutate(mutators.updateMcpPlugin({ id: props.plugin.id, ...updates }))
}
</script>
