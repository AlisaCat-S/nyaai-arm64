<template>
  <q-select
    v-model="model"
    :options
    map-options
    emit-value
  />
</template>

<script setup lang="ts">
import { queries } from 'app/src-shared/queries'
import { useQuery } from 'src/composables/zero/query'
import { computed } from 'vue'

const model = defineModel<string | null>()

const { data: plans } = useQuery(queries.plans())
const options = computed(() => plans.value.map(plan => ({ label: plan.name, value: plan.id })))
</script>
