<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: chat }"
  >
    <chat-view :chat />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import { defineAsyncComponent } from 'vue'

const ChatViewPromise = import('./ChatView.vue')
const ChatView = defineAsyncComponent(() => ChatViewPromise)

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullChat(props.id))
</script>
