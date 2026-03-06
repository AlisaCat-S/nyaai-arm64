<template>
  <node-view-wrapper as="span">
    <entity-link
      :id="node.attrs.entityId"
      @update-attrs="updateAttributes"
      @delete-node="deleteNode"
    />
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { nodeViewProps, NodeViewWrapper } from '@tiptap/vue-3'
import EntityLink from 'src/components/EntityLink.vue'

defineProps(nodeViewProps)
</script>
