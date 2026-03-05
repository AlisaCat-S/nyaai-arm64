<template>
  <common-item :label="t('Name')">
    <q-input
      v-model="model.name"
      dense
      class="w-120px"
    />
  </common-item>
  <common-item :label="t('Max Members')">
    <q-input
      type="number"
      v-model.number="model.maxMembers"
      dense
      class="w-120px"
    />
  </common-item>
  <common-item :label="t('File Storage Limit')">
    <number-unit-input
      v-model="model.storageLimit"
      :multiplier="1024 * 1024 * 1024"
      suffix="GB"
      dense
      class="w-120px"
    />
  </common-item>
  <common-item :label="t('File Size Limit')">
    <number-unit-input
      v-model="model.fileSizeLimit"
      :multiplier="1024 * 1024"
      suffix="MB"
      dense
      class="w-120px"
    />
  </common-item>
  <common-item :label="t('Monthly AI Quota')">
    <q-input
      type="number"
      v-model.number="model.quotaLimit"
      prefix="$"
      dense
      class="w-120px"
    />
  </common-item>
</template>
<script setup lang="ts">
import { t } from 'src/utils/i18n'
import NumberUnitInput from './NumberUnitInput.vue'
import type { Row } from '@rocicorp/zero'
import CommonItem from '../../components/CommonItem.vue'

const model = defineModel<Row['plan']>({ required: true })
</script>
