<template>
  <common-item :label="t('Name')">
    <q-input
      v-model="model.name"
      dense
      class="w-180px"
    />
  </common-item>
  <common-item :label="t('Label')">
    <q-input
      v-model="model.label"
      clearable
      dense
      class="w-180px"
    />
  </common-item>
  <common-item :label="t('Caption')">
    <q-input
      v-model="model.caption"
      clearable
      dense
      class="w-180px"
    />
  </common-item>
  <common-item :label="t('Sort Priority')">
    <q-input
      type="number"
      v-model.number="model.sortPriority"
      clearable
      dense
      class="w-180px"
    />
  </common-item>
  <common-item :label="t('Input Price')">
    <q-input
      type="number"
      v-model.number="model.inputPrice"
      prefix="$"
      suffix="/ M Tokens"
      clearable
      dense
      class="w-180px"
    />
  </common-item>
  <common-item :label="t('Output Price')">
    <q-input
      type="number"
      v-model.number="model.outputPrice"
      prefix="$"
      suffix="/ M Tokens"
      clearable
      dense
      class="w-180px"
    />
  </common-item>
</template>
<script setup lang="ts">
import { t } from 'src/utils/i18n'
import type { AdminModel } from 'app/src-server/admin'
import CommonItem from '../../components/CommonItem.vue'

const model = defineModel<AdminModel>({ required: true })
</script>
