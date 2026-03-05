<template>
  <view-wrapper
    :data
    :status
    v-slot="{ data: translation }"
  >
    <translation-view :translation />
  </view-wrapper>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import ViewWrapper from 'src/components/ViewWrapper.vue'
import TranslationView from './TranslationView.vue'

const props = defineProps<{
  id: string
}>()

const { data, status } = useQuery(() => queries.fullTranslation(props.id))
</script>
