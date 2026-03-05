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
      <q-card-actions>
        <q-btn
          flat
          color="err"
          :label="t('Delete')"
          @click="deletePrice"
          :loading="deleting"
        />
        <q-space />
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
import PriceInputItems from './PriceInputItems.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const props = defineProps<{
  price: Row['planPrice']
}>()

const model = ref<Row['planPrice']>({ ...props.price })

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const $q = useQuasar()
function update() {
  loading.value = true
  client.api.admin.updatePlanPrice.$post({
    json: model.value,
  }).then(async res => {
    const data = await res.json()
    if ('error' in data) throw new Error(data.error)
    onDialogOK()
  }).catch(err => {
    $q.notify({
      message: t('Failed to update plan price: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
const deleting = ref(false)
function deletePrice() {
  $q.dialog({
    title: t('Delete Price'),
    message: t('Are you sure you want to delete this price?'),
    cancel: true,
    ok: {
      label: t('Delete'),
      color: 'negative',
      flat: true,
    },
  }).onOk(() => {
    deleting.value = true
    client.api.admin.deletePlanPrice.$post({
      json: { id: props.price.id },
    }).then(async res => {
      const data = await res.json()
      if ('error' in data) throw new Error(data.error)
      onDialogOK()
    }).catch(err => {
      $q.notify({
        message: t('Failed to delete price: {0}', err.message),
        color: 'negative',
      })
    }).finally(() => {
      deleting.value = false
    })
  })
}
</script>
