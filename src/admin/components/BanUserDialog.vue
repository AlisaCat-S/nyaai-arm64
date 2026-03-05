<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Ban User') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <common-item :label="t('Ban Reason')">
            <q-input
              v-model="reason"
              dense
              field-sizing-content
              min-w="120px"
            />
          </common-item>
          <common-item :label="t('Ban Period')">
            <q-input
              v-model.number="periodDays"
              type="number"
              :placeholder="t('Forever')"
              :suffix="t('Days')"
              dense
              class="w-120px"
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
          :label="t('Ban')"
          @click="banUser"
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
import { authClient } from 'src/utils/auth-client'
import type { UserWithRole } from 'better-auth/plugins'
import { timeMs } from 'app/src-shared/utils/functions'
import CommonItem from '../../components/CommonItem.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const props = defineProps<{
  user: UserWithRole
}>()

const reason = ref('')
const periodDays = ref<number | null>(null)

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const loading = ref(false)
const $q = useQuasar()
function banUser() {
  loading.value = true
  authClient.admin.banUser({
    userId: props.user.id,
    banReason: reason.value,
    banExpiresIn: periodDays.value ? periodDays.value * timeMs('1d') : undefined,
  }).then(() => {
    onDialogOK()
  }).catch(err => {
    console.error(err)
    $q.notify({
      message: t('Failed to ban user: {0}', err.message),
      color: 'negative',
    })
  }).finally(() => {
    loading.value = false
  })
}
</script>
