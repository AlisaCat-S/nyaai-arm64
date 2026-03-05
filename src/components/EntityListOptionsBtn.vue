<template>
  <q-btn
    icon="sym_o_sort"
    @click="openDialog"
  />
</template>

<script setup lang="ts">
import type { EntityListOptions } from 'app/src-shared/utils/validators'
import { useQuasar } from 'quasar'
import EntityListOptionsDialog from 'app/src/components/EntityListOptionsDialog.vue'

const $q = useQuasar()
const model = defineModel<EntityListOptions>()

function openDialog() {
  $q.dialog({
    component: EntityListOptionsDialog,
    componentProps: {
      value: model.value,
    },
  }).onOk(val => {
    model.value = val
  })
}
</script>
