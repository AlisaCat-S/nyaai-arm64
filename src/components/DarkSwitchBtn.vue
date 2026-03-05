<template>
  <q-btn
    flat
    dense
    round
    :icon="curr.icon"
    :title="curr.title"
    @click="switchDark"
  />
</template>

<script setup lang="ts">
import { usePerfsStore } from 'src/stores/perfs'
import { t } from 'src/utils/i18n'
import { computed } from 'vue'
const store = usePerfsStore()

const options = new Map()
options.set('auto', { title: t('Switch to Dark'), icon: 'sym_o_dark_mode', next: true })
options.set(true, { title: t('Switch to Light'), icon: 'sym_o_light_mode', next: false })
options.set(false, { title: t('Switch to Auto'), icon: 'sym_o_brightness_auto', next: 'auto' })

const curr = computed(() => options.get(store.perfs.darkMode))

function switchDark() {
  store.update({
    updates: { darkMode: curr.value.next },
    scope: 'local',
  })
}
</script>
