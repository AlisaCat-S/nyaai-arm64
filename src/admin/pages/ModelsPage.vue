<template>
  <q-page-container>
    <q-page p-4>
      <div
        flex
        gap-2
      >
        <q-btn
          icon="sym_o_add"
          :label="t('Add Model')"
          @click="addModel"
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
        :pagination="{ rowsPerPage: Infinity, sortBy: 'name' }"
        @row-click="(event, row) => updateModel(row)"
        binary-state-sort
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
import AddModelDialog from '../components/AddModelDialog.vue'
import UpdateModelDialog from '../components/UpdateModelDialog.vue'
import { idDateString } from 'app/src-shared/utils/id'
import { textBeginning } from 'src/utils/functions'

const columns: QTableColumn[] = [
  { name: 'name', label: t('Name'), field: 'name', sortable: true, align: 'left' },
  { name: 'label', label: t('Label'), field: 'label', sortable: true },
  { name: 'caption', label: t('Caption'), field: 'caption', format: val => val && textBeginning(val, 30) },
  { name: 'inputPrice', label: t('Input Price'), field: 'inputPrice', sortable: true },
  { name: 'outputPrice', label: t('Output Price'), field: 'outputPrice', sortable: true },
  { name: 'createdAt', label: t('Created At'), field: 'id', format: id => idDateString(id), sortable: true },
]

const { data: rows } = useQuery(queries.publicModels)

const $q = useQuasar()

function addModel() {
  $q.dialog({
    component: AddModelDialog,
  })
}
function updateModel(model: Row['model']) {
  $q.dialog({
    component: UpdateModelDialog,
    componentProps: {
      model,
    },
  })
}
</script>
