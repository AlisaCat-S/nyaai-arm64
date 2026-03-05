<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: item }"
  >
    <item-view
      :item
      :key="item.id"
    />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import { defineAsyncComponent } from 'vue'

const ItemView = defineAsyncComponent(() => import('./ItemView.vue'))

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullItem(props.id))
</script>
