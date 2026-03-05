<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Update Model') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <model-input-items v-model="model" />
        </q-list>
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          color="err"
          :label="t('Delete')"
          @click="deleteModel"
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
import { client } from 'src/utils/hc'
import type { AdminModel } from 'app/src-server/admin'
import ModelInputItems from './ModelInputItems.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const props = defineProps<{
  model: AdminModel & { id: string }
}>()

const model = ref({ ...props.model })

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const deleting = ref(false)
const $q = useQuasar()
function update() {
  loading.value = true
  client.api.admin.updateModel.$post({
    json: model.value,
  }).then(async res => {
    const data = await res.json()
    if ('error' in data) throw new Error(data.error)
    onDialogOK()
  }).catch(err => {
    $q.notify({
      message: t('Failed to update model: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
function deleteModel() {
  $q.dialog({
    title: t('Delete Model'),
    message: t('Are you sure you want to delete model {0}?', props.model.name),
    cancel: true,
    ok: {
      label: t('Delete'),
      color: 'negative',
      flat: true,
    },
  }).onOk(() => {
    deleting.value = true
    client.api.admin.deleteModel.$post({
      json: { id: props.model.id },
    }).then(async res => {
      const data = await res.json()
      if ('error' in data) throw new Error(data.error)
      onDialogOK()
    }).catch(err => {
      $q.notify({
        message: t('Failed to delete model: {0}', err.message),
        color: 'negative',
      })
    }).finally(() => {
      deleting.value = false
    })
  })
}
</script>
