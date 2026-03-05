<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Add Plan Price') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <price-input-items v-model="model" />
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
import { client } from 'src/utils/hc'
import { genId } from 'app/src-shared/utils/id'
import { DEFAULT_PLAN_ID } from 'app/src-shared/utils/config'
import PriceInputItems from './PriceInputItems.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const model = ref<Row['planPrice']>({
  id: genId(),
  enabled: true,
  planId: DEFAULT_PLAN_ID,
  provider: 'stripe',
  interval: 'monthly',
  priceId: null,
  amount: 10,
})

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const $q = useQuasar()
function add() {
  loading.value = true
  client.api.admin.addPlanPrice.$post({
    json: model.value,
  }).then(async res => {
    const data = await res.json()
    if ('error' in data) throw new Error(data.error)
    onDialogOK()
  }).catch(err => {
    $q.notify({
      message: t('Failed to add plan price: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>
