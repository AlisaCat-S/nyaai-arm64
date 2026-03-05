<template>
  <div view-styles>
    <q-list>
      <setting-item
        :label="t('Chat Assistant')"
        :modified-in="state.chatAssistantId.modifiedIn"
        @reset="reset('chatAssistantId')"
      >
      <!-- TODO: Chat Assistant Select -->
      </setting-item>
      <setting-item
        :label="t('Chat Model')"
        :modified-in="state.chatModelId.modifiedIn"
        @reset="reset('chatModelId')"
      >
        <model-select
          :workspace-id="workspaceStore.id"
          :model-value="state.chatModelId.value"
          @update:model-value="update('chatModelId', $event)"
          dense
        />
      </setting-item>
      <setting-item
        :label="t('Translation Model')"
        :modified-in="state.translationModelId.modifiedIn"
        @reset="reset('translationModelId')"
      >
        <model-select
          :workspace-id="workspaceStore.id"
          :model-value="state.translationModelId.value"
          @update:model-value="update('translationModelId', $event)"
          dense
        />
      </setting-item>
      <setting-item
        :label="t('Chat Title Model')"
        :caption="t('Model used to generate chat title')"
        :modified-in="state.chatTitleModelId.modifiedIn"
        @reset="reset('chatTitleModelId')"
      >
        <model-select
          :workspace-id="workspaceStore.id"
          :model-value="state.chatTitleModelId.value"
          @update:model-value="update('chatTitleModelId', $event)"
          dense
        />
      </setting-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { t } from 'src/utils/i18n'
import { useThisEntityConf } from 'src/composables/entity-conf'
import { computed, provide } from 'vue'
import SettingItem from 'src/components/SettingItem.vue'
import ModelSelect from 'src/components/ModelSelect.vue'
import { entityName } from 'src/utils/defaults'
import type { SettingsScope } from 'src/utils/types'
import { useWorkspaceStore } from 'src/stores/workspace'

defineProps<{
  id: string
}>()

const { ancestors, state, update, reset } = useThisEntityConf()

provide('scopes', computed<SettingsScope[]>(() => ancestors.value.map(x => ({
  label: entityName(x),
  to: { query: { rightEntity: JSON.stringify({ type: 'folder', id: x.id }) } },
}))))

const workspaceStore = useWorkspaceStore()
</script>
