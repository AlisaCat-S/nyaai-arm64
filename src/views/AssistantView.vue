<template>
  <div
    view-styles
    flex="~ col"
  >
    <common-toolbar>
      <q-toolbar-title text-lg>
        {{ entityName(entity) }}
      </q-toolbar-title>
    </common-toolbar>
    <div of-y-auto>
      <q-list py-2>
        <q-item>
          <q-item-section avatar>
            {{ t('Prompt') }}
          </q-item-section>
          <q-item-section pl-2>
            <a-input
              :model-value="assistant.prompt"
              @update:model-value="update({ prompt: $event })"
              filled
              autogrow
              clearable
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            {{ t('Prompt Template') }}
          </q-item-section>
          <q-item-section pl-2>
            <a-input
              :model-value="assistant.promptTemplate"
              @update:model-value="update({ promptTemplate: $event })"
              filled
              autogrow
              clearable
            />
          </q-item-section>
        </q-item>
        <common-item :label="t('Prompt Role')">
          <q-select
            :model-value="assistant.promptRole"
            @update:model-value="update({ promptRole: $event })"
            :options="[
              { label: t('User'), value: 'user' },
              { label: t('System'), value: 'system' },
            ]"
            map-options
            emit-value
            dense
            filled
          />
        </common-item>
        <common-item :label="t('Model')">
          <model-select
            :workspace-id="workspaceStore.id"
            :model-value="assistant.modelId"
            @update:model-value="update({ modelId: $event })"
            dense
            filled
            clearable
          />
        </common-item>
        <q-separator spaced />
        <q-item-label header>
          {{ t('Plugins') }}
        </q-item-label>
        <plugin-toggle-items
          :model-value="assistant.plugins"
          @update:model-value="update({ plugins: $event })"
        />
        <q-separator spaced />
        <q-item-label header>
          {{ t('Generation Settings') }}
        </q-item-label>
        <generation-settings-input-items
          :model-value="assistant.streamSettings"
          @update:model-value="update({ streamSettings: $event })"
          filled
        />
        <q-separator spaced />
        <q-item-label header>
          {{ t('Model Parameters') }}
        </q-item-label>
        <model-params-input-items
          :model-value="assistant.streamSettings"
          @update:model-value="update({ streamSettings: $event })"
          filled
        />
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Row } from '@rocicorp/zero'
import { mutators } from 'app/src-shared/mutators'
import type { FullAssistant } from 'app/src-shared/queries'
import AInput from 'src/components/AInput'
import CommonItem from 'src/components/CommonItem.vue'
import CommonToolbar from 'src/components/CommonToolbar.vue'
import GenerationSettingsInputItems from 'src/components/GenerationSettingsInputItems.vue'
import ModelParamsInputItems from 'src/components/ModelParamsInputItems.vue'
import ModelSelect from 'src/components/ModelSelect.vue'
import PluginToggleItems from 'src/components/PluginToggleItems.vue'
import { useThisEntityConf } from 'src/composables/entity-conf'
import { mutate } from 'src/utils/zero-session'
import { useWorkspaceStore } from 'src/stores/workspace'
import { entityName } from 'src/utils/defaults'
import { t } from 'src/utils/i18n'

const props = defineProps<{
  assistant: FullAssistant
}>()

const { entity } = useThisEntityConf()

function update(updates: Partial<Row['assistant']>) {
  mutate(mutators.updateAssistant({ id: props.assistant.id, ...updates }))
}

const workspaceStore = useWorkspaceStore()
</script>
