<template>
  <q-page-container>
    <q-page p-4>
      <div
        flex
        gap-2
      >
        <q-btn
          icon="sym_o_add"
          :label="t('Add Plan')"
          @click="addPlan"
          unelevated
          bg-pri-c
          text-on-pri-c
          no-caps
          ml-a
        />
      </div>
      <q-table
        :rows
        :columns
        table-class="cursor-pointer"
        hide-bottom
        :pagination="{ rowsPerPage: Infinity }"
        @row-click="(event, row) => updatePlan(row)"
        row-key="id"
        flat
        bg-sur-c-low
        mt-4
      />
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import { useQuasar } from 'quasar'
import { t } from 'src/utils/i18n'
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import type { Row } from '@rocicorp/zero'
import AddPlanDialog from '../components/AddPlanDialog.vue'
import UpdatePlanDialog from '../components/UpdatePlanDialog.vue'
import { formatBytes } from 'src/utils/functions'
import { currencyPrefix } from 'app/src-shared/utils/functions'

const columns: QTableColumn[] = [
  { name: 'id', label: t('ID'), field: 'id' },
  { name: 'name', label: t('Name'), field: 'name' },
  {
    name: 'prices',
    label: t('Monthly Price'),
    field: 'prices',
    format: formatMonthlyPrice,
  },
  { name: 'maxMembers', label: t('Max Members'), field: 'maxMembers' },
  { name: 'storageLimit', label: t('File Storage Limit'), field: 'storageLimit', format: formatBytes },
  { name: 'fileSizeLimit', label: t('File Size Limit'), field: 'fileSizeLimit', format: formatBytes },
  { name: 'quotaLimit', label: t('Monthly AI Quota'), field: 'quotaLimit', format: val => `$${val}` },
]

const { data: rows } = useQuery(queries.plans())

const $q = useQuasar()

function addPlan() {
  $q.dialog({
    component: AddPlanDialog,
  })
}
function updatePlan(plan: Row['plan']) {
  $q.dialog({
    component: UpdatePlanDialog,
    componentProps: {
      plan,
    },
  })
}

function formatMonthlyPrice(prices: Row['planPrice'][]) {
  return prices
    .filter(p => p.interval === 'monthly')
    .map(p => currencyPrefix(p.provider) + p.amount)
    .join(' / ')
}
</script>
