<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: plugin }"
  >
    <plugin-view :plugin />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import PluginView from './PluginView.vue'

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.mcpPlugin(props.id))
</script>
