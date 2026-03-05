<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: page }"
  >
    <page-view
      :page
      :key="page.id"
    />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import { defineAsyncComponent } from 'vue'

const PageViewPromise = import('./PageView.vue')
const PageView = defineAsyncComponent(() => PageViewPromise)

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullPage(props.id))
</script>
