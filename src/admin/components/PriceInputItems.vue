<template>
  <common-item :label="t('Enabled')">
    <q-toggle
      v-model="model.enabled"
      dense
    />
  </common-item>
  <common-item :label="t('Plan')">
    <plan-select
      v-model="model.planId"
      dense
    />
  </common-item>
  <common-item :label="t('Payment Provider')">
    <q-select
      v-model="model.provider"
      :options="['stripe', 'wxpay']"
      dense
    />
  </common-item>
  <common-item :label="t('Billing Interval')">
    <q-select
      v-model="model.interval"
      :options="['monthly', 'quarterly', 'yearly']"
      dense
    />
  </common-item>
  <common-item :label="t('Amount')">
    <q-input
      v-model.number="model.amount"
      type="number"
      dense
      :prefix="currencyPrefix(model.provider)"
      class="w-120px"
    />
  </common-item>
  <common-item :label="t('Stripe Price ID')">
    <q-input
      v-model="model.priceId"
      dense
      clearable
      class="w-120px"
    />
  </common-item>
</template>
<script setup lang="ts">
import { t } from 'src/utils/i18n'
import type { Row } from '@rocicorp/zero'
import CommonItem from '../../components/CommonItem.vue'
import PlanSelect from './PlanSelect.vue'
import { currencyPrefix } from 'app/src-shared/utils/functions'

const model = defineModel<Row['planPrice']>({ required: true })
</script>
