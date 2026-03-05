<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: search }"
  >
    <search-view :search />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import SearchView from './SearchView.vue'

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.searchWithRecords(props.id))
</script>
