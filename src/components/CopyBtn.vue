<template>
  <q-btn
    :icon="currIcon"
    @click="copy"
    :title="t('Copy')"
  />
</template>
<script setup lang="ts">
import { copyToClipboard, Notify } from 'quasar'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'

const props = defineProps<{
  value: string
  icon?: string
}>()

const normalIcon = props.icon ?? 'sym_o_content_copy'
const currIcon = ref(normalIcon)

function copy() {
  copyToClipboard(props.value).then(() => {
    currIcon.value = 'sym_o_check'
    setTimeout(() => {
      currIcon.value = normalIcon
    }, 2000)
  }).catch(() => {
    Notify.create({
      message: t('copyBtn.copyFailed'),
      color: 'negative',
    })
  })
}
</script>
