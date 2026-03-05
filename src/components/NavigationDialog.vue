<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    position="top"
    :transition-duration="200"
  >
    <q-card
      bg-sur
      style="width: min(90vw, 500px)"
      py-2
    >
      <navigation-panel />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import NavigationPanel from './NavigationPanel.vue'

const { dialogRef, onDialogHide } = useDialogPluginComponent()
</script>
