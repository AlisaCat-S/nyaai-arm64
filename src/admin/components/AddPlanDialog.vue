<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Add Plan') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <common-item label="ID">
            <q-input
              v-model="model.id"
              class="w-120px"
              dense
            />
          </common-item>
          <plan-input-items v-model="model" />
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
          :label="t('Add')"
          @click="add"
          :loading
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'
import type { Row } from '@rocicorp/zero'
import PlanInputItems from './PlanInputItems.vue'
import { client } from 'src/utils/hc'
import { sizeBytes } from 'app/src-shared/utils/functions'
import CommonItem from '../../components/CommonItem.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const model = ref<Row['plan']>({
  id: '',
  name: '',
  maxMembers: 10,
  storageLimit: sizeBytes('1T'),
  fileSizeLimit: sizeBytes('5G'),
  quotaLimit: 10,
})

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const $q = useQuasar()
function add() {
  loading.value = true
  client.api.admin.addPlan.$post({
    json: model.value,
  }).then(async res => {
    const data = await res.json()
    if ('error' in data) throw new Error(data.error)
    onDialogOK()
  }).catch(err => {
    $q.notify({
      message: t('Failed to add plan: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>
