<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card min-w="300px">
      <q-card-section>
        <div class="text-h6">
          {{ t('Prompt Arguments') }}
        </div>
      </q-card-section>
      <q-form @submit="onDialogOK(args)">
        <q-card-section p-0>
          <a-input
            v-for="{ name, description, required } of arguments"
            :key="name"
            :label="name"
            :hint="description"
            v-model="args[name]"
            :required
            dense
            autogrow
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
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import AInput from './AInput'
import { reactive } from 'vue'

defineProps<{
  arguments: {
    name: string
    description?: string
    required?: boolean
  }[]
}>()

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const args = reactive<Record<string, any>>({})
</script>
