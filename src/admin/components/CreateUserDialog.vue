<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Create User') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <common-item :label="t('Name')">
            <q-input
              v-model="model.name"
              dense
            />
          </common-item>
          <common-item :label="t('Email')">
            <q-input
              v-model="model.email"
              type="email"
              dense
            />
          </common-item>
          <common-item :label="t('Password')">
            <q-input
              v-model="model.password"
              type="password"
              dense
            />
          </common-item>
          <common-item :label="t('Role')">
            <q-select
              v-model="model.role"
              :options="['user', 'admin']"
              dense
            />
          </common-item>
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
          :label="t('Create')"
          @click="createUser"
          :loading
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { t } from 'src/utils/i18n'
import { reactive, ref } from 'vue'
import { authClient } from 'src/utils/auth-client'
import CommonItem from '../../components/CommonItem.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const model = reactive({
  name: '',
  email: '',
  password: '',
  role: 'user' as 'user' | 'admin',
})

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const $q = useQuasar()
function createUser() {
  loading.value = true
  authClient.admin.createUser(model).then(() => {
    onDialogOK()
  }).catch(err => {
    console.error(err)
    $q.notify({
      message: t('Failed to create user: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>
