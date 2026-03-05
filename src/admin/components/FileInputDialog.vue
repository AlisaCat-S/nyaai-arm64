<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <q-list>
          <file-input-area
            :image
            :multiple
            @input="onDialogOK"
          />
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import FileInputArea from 'src/components/FileInputArea.vue'

defineProps<{
  image?: boolean
  multiple?: boolean
}>()

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>
