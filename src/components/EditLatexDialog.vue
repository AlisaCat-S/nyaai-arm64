<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section pb-0>
        <div class="text-h6">
          {{ t('Edit Latex') }}
        </div>
      </q-card-section>
      <q-card-section py-2>
        <q-input
          v-model="latex"
          autofocus
          @keydown.enter="onDialogOK(latex)"
        />
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
          :label="t('OK')"
          @click="onDialogOK(latex)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const props = defineProps<{
  value: string
}>()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const latex = ref(props.value)
</script>
