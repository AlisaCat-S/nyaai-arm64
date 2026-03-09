<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card min-w="300px">
      <q-card-section>
        <div class="text-h6">
          {{ t('Message Info') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <common-item label="ID">
            {{ message.id }}
          </common-item>
          <common-item :label="t('Created At')">
            {{ idDateString(message.id) }}
          </common-item>
          <common-item
            :label="t('Sent At')"
            v-if="message.sentAt"
          >
            {{ new Date(message.sentAt).toLocaleString() }}
          </common-item>
          <common-item
            :label="t('Edited At')"
            v-if="message.editedAt"
          >
            {{ new Date(message.editedAt).toLocaleString() }}
          </common-item>
          <q-item>
            <q-item-section>
              {{ t('Text Length') }}
            </q-item-section>
            <q-item-section side>
              {{ message.text.length }}
            </q-item-section>
          </q-item>
          <q-item v-if="message.modelName">
            <q-item-section>
              {{ t('Model') }}
            </q-item-section>
            <q-item-section side>
              {{ message.modelName }}
            </q-item-section>
          </q-item>
          <q-item v-if="message.usage">
            <q-item-section>
              {{ t('Token Usage') }}
            </q-item-section>
            <q-item-section side>
              {{ t('Input: ') }}{{ message.usage.inputTokens }}, {{ t('Output: ') }}{{ message.usage.outputTokens }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          :label="t('OK')"
          @click="onDialogOK"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import { idDateString } from 'app/src-shared/utils/id'
import type { Row } from '@rocicorp/zero'
import CommonItem from './CommonItem.vue'

defineProps<{
  message: Row['message']
}>()

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()

</script>
