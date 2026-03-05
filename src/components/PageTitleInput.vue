<template>
  <input
    border-none
    outline-none
    bg-transparent
    text="27px"
    font-600
    color-inherit
    v-model="model"
    :placeholder="t('New page')"
  >
</template>

<script setup lang="ts">
import { t } from 'src/utils/i18n'

const model = defineModel<string>({ required: true })
</script>
