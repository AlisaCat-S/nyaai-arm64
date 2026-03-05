<template>
  <slot
    v-if="data"
    :data
  />
  <hint-card
    v-else-if="status === 'complete'"
    img-url="/emotions/nachoneko/19.webp"
    :message="t('Nothing here...')"
  />
  <hint-card
    v-else-if="status === 'error'"
    img-url="/emotions/nachoneko/13.webp"
    :message="t('Error occurred when loading...')"
  />
</template>

<script setup lang="ts" generic="T">
import { t } from 'src/utils/i18n'
import HintCard from './HintCard.vue'
import type { ResultType } from '@rocicorp/zero'

defineProps<{
  data: T
  status: ResultType
}>()
</script>
