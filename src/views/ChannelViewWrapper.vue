<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: channel }"
  >
    <channel-view :channel />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import { watchEffect, defineAsyncComponent } from 'vue'
import { mutate } from 'src/utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import { genId } from 'app/src-shared/utils/id'

const ChannelViewPromise = import('./ChannelView.vue')
const ChannelView = defineAsyncComponent(() => ChannelViewPromise)

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullChannel(props.id))

watchEffect(() => {
  if (status.value === 'complete' && !data.value?.message) {
    mutate(mutators.createDraftMessage({
      id: genId(),
      channelId: props.id,
    }))
  }
})
</script>
