<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Pick a color') }}
        </div>
      </q-card-section>
      <q-card-section py-0>
        <div flex>
          <a-input
            type="number"
            label="Hue"
            v-model.number="model"
            class="grow"
            @keyup.enter="onDialogOK(model)"
          />
          <hct-preview-circle
            m-1
            :hue="model"
            :size="48"
          />
        </div>
        <div mt-2>
          <hue-slider v-model="model" />
        </div>
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
          :label="t('OK')"
          @click="onDialogOK(model)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'
import HctPreviewCircle from './HctPreviewCircle.vue'
import HueSlider from './HueSlider.vue'
import { t } from 'src/utils/i18n'
import AInput from './AInput'

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
})

const model = ref(props.value)

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>
