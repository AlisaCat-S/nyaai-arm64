<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: provider }"
  >
    <provider-view :provider />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import ProviderView from './ProviderView.vue'

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullProvider(props.id))
</script>
