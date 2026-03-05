<template>
  <q-item
    item-rd
    min-h="40px"
    py-0
    px-3
    border="pri 2px"
    :class="{ 'border-solid': selected }"
    class="group"
  >
    <q-item-section
      avatar
      min-w-0
      pr-3
    >
      <a-avatar
        :avatar="entityAvatar(entity)"
        size="27px"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label
        text-ellipsis
        whitespace-nowrap
        overflow-hidden
        :title="entityName(entity)"
      >
        {{ entityName(entity) }}
      </q-item-label>
    </q-item-section>
    <q-item-section
      side
      important:pl-2
    >
      <q-icon
        v-if="selectable"
        :name="selected ? 'sym_o_check_circle' : 'sym_o_circle'"
        :class="selected ? 'text-pri icon-fill' : 'text-on-sur-var icon-unfill'"
      />
      <slot
        v-else
        name="actions"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import type { Row } from '@rocicorp/zero'
import AAvatar from './AAvatar.vue'
import { entityAvatar, entityName } from 'src/utils/defaults'

defineProps<{
  entity: Row['entity']
  selectable?: boolean
  selected?: boolean
}>()
</script>
