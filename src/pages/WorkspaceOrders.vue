<template>
  <q-page-container>
    <q-page p-4>
      <q-table
        :rows
        :columns
        :pagination="{ rowsPerPage: Infinity }"
        row-key="id"
        :no-data-label="t('No orders')"
        hide-pagination
        flat
        bg-sur-c-low
        mt-4
      />
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import type { QTableColumn } from 'quasar'
import { t } from 'src/utils/i18n'
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import { currencyPrefix } from 'app/src-shared/utils/functions'
import type { PlanInterval } from 'app/src-shared/utils/validators'
import { useWorkspaceStore } from 'src/stores/workspace'
import type { OrderProvider } from 'app/src-shared/utils/types'

const columns: QTableColumn[] = [
  { name: 'orderId', label: t('Order ID'), field: 'id', align: 'left' },
  { name: 'provider', label: t('Payment Method'), field: 'provider', format: formatProvider },
  { name: 'amount', label: t('Amount'), field: 'amount', format: (val, { provider }) => `${currencyPrefix(provider)}${val}` },
  { name: 'plan', label: t('Plan'), field: 'plan', format: val => val?.name },
  { name: 'planInterval', label: t('Plan Interval'), field: 'planInterval', format: formatInterval },
  { name: 'completedAt', label: t('Completed At'), field: 'completedAt', format: val => val ? new Date(val).toLocaleString() : t('Unpaid') },
]

const workspaceStore = useWorkspaceStore()
const { data: rows } = useQuery(queries.workspaceOrders({ workspaceId: workspaceStore.id! }))

function formatProvider({ type }: OrderProvider) {
  if (type === 'stripe') return t('Stripe')
  if (type === 'wxpay') return t('WeChat Pay')
  return ''
}

function formatInterval(interval: PlanInterval) {
  if (interval === 'monthly') return t('Monthly')
  if (interval === 'quarterly') return t('Quarterly')
  if (interval === 'yearly') return t('Yearly')
  return ''
}
</script>
