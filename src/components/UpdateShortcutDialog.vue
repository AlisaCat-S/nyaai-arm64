<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Edit Shortcut') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
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
          :label="t('Update')"
          @click="update"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'
import { mutate } from 'src/utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import ShortcutInputItems from './ShortcutInputItems.vue'
import { useActiveEntitiesStore } from 'src/stores/active-entities'

const props = defineProps<{
  id: string
}>()

const activeEntitiesStore = useActiveEntitiesStore()
const model = ref({
  ...activeEntitiesStore.shortcuts.find(s => s.id === props.id),
})

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

function update() {
  mutate(mutators.updateShortcut({
    id: props.id,
    ...model.value,
  })).client.then(onDialogOK)
}
</script>
