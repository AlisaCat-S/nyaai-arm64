<template>
  <q-page-container>
    <q-page p-4>
      <div
        flex
        gap-2
      >
        <plan-select
          v-model="planId"
          :label="t('Plan')"
          clearable
          dense
          class="w-120px"
        />
        <q-btn
          icon="sym_o_add"
          :label="t('Add Price')"
          @click="addPrice"
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
        @row-click="(event, row) => updatePrice(row)"
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
import AddPriceDialog from '../components/AddPriceDialog.vue'
import UpdatePriceDialog from '../components/UpdatePriceDialog.vue'
import { computed, ref } from 'vue'
import { currencyPrefix } from 'app/src-shared/utils/functions'
import PlanSelect from '../components/PlanSelect.vue'

const columns: QTableColumn[] = [
  { name: 'plan', label: t('Plan'), field: 'plan' },
  { name: 'provider', label: t('Provider'), field: 'provider' },
  { name: 'interval', label: t('Interval'), field: 'interval' },
  { name: 'amount', label: t('Amount'), field: 'amount', format: (val, row) => currencyPrefix(row.provider) + val },
  { name: 'priceId', label: t('Price ID'), field: 'priceId' },
]

const planId = ref<string | null>(null)

const { data: plans } = useQuery(queries.plans)
const rows = computed(() => plans.value
  .flatMap(plan => plan.prices.map(price => ({ ...price, plan: plan.name })))
  .filter(price => !planId.value || price.planId === planId.value),
)

const $q = useQuasar()

function addPrice() {
  $q.dialog({
    component: AddPriceDialog,
  })
}
function updatePrice(price: Row['planPrice']) {
  $q.dialog({
    component: UpdatePriceDialog,
    componentProps: {
      price,
    },
  })
}
</script>
