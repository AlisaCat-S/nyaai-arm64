<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Create Shortcut') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <common-item :label="t('Name')">
            <a-input
              v-model="model.name"
              dense
            />
          </common-item>
          <shortcut-input-items v-model="model" />
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          :label="t('Cancel')"
          @click="onDialogCancel"
        />
        <q-btn
          flat
          color="primary"
          :label="t('Create')"
          @click="create"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import CommonItem from './CommonItem.vue'
import { reactive } from 'vue'
import type { EntityType } from 'app/src-shared/utils/validators'
import { mutate } from 'src/utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import { genId } from 'app/src-shared/utils/id'
import AInput from './AInput'
import ShortcutInputItems from './ShortcutInputItems.vue'

const props = defineProps<{
  parentId: string
}>()

const model = reactive({
  name: '',
  type: null as EntityType | null,
  dirId: null as string | null,
  action: 'openLast' as 'openLast' | 'createNew' | null,
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function create() {
  mutate(mutators.createShortcut({
    id: genId(),
    parentId: props.parentId,
    ...model,
  })).client.then(onDialogOK)
}
</script>
