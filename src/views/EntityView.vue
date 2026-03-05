<template>
  <chat-view-wrapper
    v-if="type === 'chat'"
    :id
  />
  <search-view-wrapper
    v-else-if="type === 'search'"
    :id
  />
  <page-view-wrapper
    v-else-if="type === 'page'"
    :id
  />
  <translation-view-wrapper
    v-else-if="type === 'translation'"
    :id
  />
  <channel-view-wrapper
    v-else-if="type === 'channel'"
    :id
  />
  <item-view-wrapper
    v-else-if="type === 'item'"
    :id
  />
  <plugin-view-wrapper
    v-else-if="type === 'mcpPlugin'"
    :id
  />
  <provider-view-wrapper
    v-else-if="type === 'provider'"
    :id
  />
  <assistant-view-wrapper
    v-else-if="type === 'assistant'"
    :id
  />
  <dir-view
    v-else-if="type === 'folder'"
    :id
  />
</template>

<script setup lang="ts">
import type { Row } from '@rocicorp/zero'
import { provide, toRef } from 'vue'
import ChatViewWrapper from './ChatViewWrapper.vue'
import SearchViewWrapper from './SearchViewWrapper.vue'
import PageViewWrapper from './PageViewWrapper.vue'
import DirView from './DirView.vue'
import TranslationViewWrapper from './TranslationViewWrapper.vue'
import ChannelViewWrapper from './ChannelViewWrapper.vue'
import ItemViewWrapper from './ItemViewWrapper.vue'
import PluginViewWrapper from './PluginViewWrapper.vue'
import ProviderViewWrapper from './ProviderViewWrapper.vue'
import AssistantViewWrapper from './AssistantViewWrapper.vue'

const props = defineProps<{
  id: string
  type: Row['entity']['type']
  position: 'full' | 'left' | 'right'
}>()
provide('position', toRef(props, 'position'))
</script>
