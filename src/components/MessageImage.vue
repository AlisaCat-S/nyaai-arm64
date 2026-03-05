<template>
  <div
    pos-relative
    rd-md
    of-hidden
    cursor-pointer
    @click="viewImage"
  >
    <img
      v-if="url"
      :src="url"
      :title="entityName(entity)"
      :alt="entityName(entity)"
      w-a
      h-a
      max-w-full
      max-h-full
      block
    >
    <div
      v-if="removable"
      bg-gradient-top-a
      pos-absolute
      top-0
      left-0
      right-0
      h="30px"
    />
    <q-btn
      v-if="removable"
      icon="sym_o_close"
      pos-absolute
      top-0
      right-0
      text-0-0-0-a
      flat
      round
      dense
      size="sm"
      @click.prevent.stop="$emit('remove')"
    />
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import ViewImageDialog from './ViewImageDialog.vue'
import { useBlobURL } from 'src/composables/blob-url'
import { entityName } from 'src/utils/defaults'
import type { Row } from '@rocicorp/zero'

const props = defineProps<{
  entity: Row['entity']
  removable?: boolean
}>()

defineEmits(['remove'])

const url = useBlobURL(computed(() => props.entity.id))

const $q = useQuasar()
function viewImage() {
  $q.dialog({
    component: ViewImageDialog,
    componentProps: {
      url: url.value,
    },
  })
}
</script>
