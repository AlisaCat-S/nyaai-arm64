<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Update Plan') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <plan-input-items v-model="model" />
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          color="err"
          :label="t('Delete')"
          @click="deletePlan"
          :loading="deleting"
          :disable="plan.id === DEFAULT_PLAN_ID"
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
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'
import type { Row } from '@rocicorp/zero'
import PlanInputItems from './PlanInputItems.vue'
import { client } from 'src/utils/hc'
import { DEFAULT_PLAN_ID } from 'app/src-shared/utils/config'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const props = defineProps<{
  plan: Row['plan']
}>()

const model = ref(extend<Row['plan']>(true, {}, props.plan))

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const $q = useQuasar()
function update() {
  loading.value = true
  client.api.admin.updatePlan.$post({
    json: model.value,
  }).then(async res => {
    const data = await res.json()
    if ('error' in data) throw new Error(data.error)
    onDialogOK()
  }).catch(err => {
    $q.notify({
      message: t('Failed to update plan: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
const deleting = ref(false)
function deletePlan() {
  $q.dialog({
    title: t('Delete Plan'),
    message: t('Are you sure you want to delete plan "{0}"?', props.plan.name),
    cancel: true,
    ok: {
      label: t('Delete'),
      color: 'negative',
      flat: true,
    },
  }).onOk(() => {
    deleting.value = true
    client.api.admin.deletePlan.$post({
      json: { id: props.plan.id },
    }).then(async res => {
      const data = await res.json()
      if ('error' in data) throw new Error(data.error)
      onDialogOK()
    }).catch(err => {
      $q.notify({
        message: t('Failed to delete plan: {0}', err.message),
        color: 'negative',
      })
    }).finally(() => {
      deleting.value = false
    })
  })
}
</script>
