<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Two-Factor Authentication') }}
        </div>
      </q-card-section>
      <q-card-section py-0>
        {{ t('Please enter the TOTP code from your authenticator app.') }}
      </q-card-section>
      <q-card-section py-2>
        <q-input
          v-model="totp"
          :label="t('TOTP code')"
          type="number"
        />
        <q-checkbox
          v-model="trustDevice"
          :label="t('Trust this device')"
        />
      </q-card-section>
      <q-card-actions>
        <q-btn
          flat
          color="primary"
          :label="t('Use backup code')"
          @click="useBackupCode"
        />
        <q-space />
        <q-btn
          flat
          color="primary"
          :label="t('Verify')"
          :loading
          @click="verify"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { authClient } from 'src/utils/auth-client'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const totp = ref('')
const trustDevice = ref(false)

const $q = useQuasar()
const loading = ref(false)
async function verify() {
  loading.value = true

  const { error } = await authClient.twoFactor.verifyTotp({
    code: totp.value,
    trustDevice: trustDevice.value,
  })
  loading.value = false
  if (error) {
    console.error(error)
    $q.notify({
      message: t('Verification failed: {0}', error.message),
      color: 'negative',
    })
    return
  }
  onDialogOK()
}

function useBackupCode() {
  // TODO: use backup code
  onDialogCancel()
}
</script>
