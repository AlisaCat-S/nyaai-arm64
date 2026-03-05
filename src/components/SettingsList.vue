<template>
  <q-list>
    <q-item-label
      header
      id="ui"
    >
      {{ t('UI') }}
    </q-item-label>
    <setting-item
      icon="sym_o_dark_mode"
      :label="t('Appearance')"
      :modified-in="state.darkMode.modifiedIn"
      @reset="$emit('reset', 'darkMode')"
    >
      <q-select
        class="min-w-120px"
        filled
        dense
        :options="[
          { label: t('Follow System'), value: 'auto' },
          { label: t('Light'), value: false },
          { label: t('Dark'), value: true },
        ]"
        :model-value="state.darkMode.value"
        @update:model-value="$emit('update', 'darkMode', $event)"
        emit-value
        map-options
      />
    </setting-item>
    <setting-item
      icon="sym_o_palette"
      :label="t('Theme Color')"
      :modified-in="state.themeHue.modifiedIn"
      @reset="$emit('reset', 'themeHue')"
      clickable
      v-ripple
      @click="pickThemeHue"
    >
      <hct-preview-circle :hue="state.themeHue.value" />
    </setting-item>
  </q-list>
</template>

<script setup lang="ts">
import { t } from 'src/utils/i18n'
import type { Perfs } from 'src/stores/perfs'
import SettingItem from './SettingItem.vue'
import type { PerfsState } from 'src/composables/perfs-state'
import { useQuasar } from 'quasar'
import HueSliderDialog from './HueSliderDialog.vue'
import HctPreviewCircle from './HctPreviewCircle.vue'

const props = defineProps<{
  state: PerfsState<Perfs>
}>()

const emit = defineEmits<{
  update: [key: keyof Perfs, value: any]
  reset: [key: keyof Perfs]
}>()

const $q = useQuasar()
function pickThemeHue() {
  $q.dialog({
    component: HueSliderDialog,
    componentProps: { value: props.state.themeHue.value },
  }).onOk(hue => { emit('update', 'themeHue', hue) })
}
</script>
