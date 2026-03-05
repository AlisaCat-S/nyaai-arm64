<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: assistant }"
  >
    <assistant-view :assistant />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import AssistantView from './AssistantView.vue'

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullAssistant(props.id))
</script>
