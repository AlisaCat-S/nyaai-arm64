<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Add MCP Server') }}
        </div>
      </q-card-section>
      <q-form @submit="onDialogOK(model)">
        <q-card-section p-0>
          <q-list>
            <common-item :label="t('Name')">
              <q-input
                v-model="model.name"
                dense
                required
              />
            </common-item>
            <common-item label="URL">
              <q-input
                v-model="model.url"
                type="url"
                required
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
            :label="t('Add')"
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
import CommonItem from 'src/components/CommonItem.vue'
import { reactive } from 'vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const model = reactive({
  name: '',
  url: '',
})
</script>
