<template>
  <q-header
    v-if="store.message && show"
    bg-err-c
    text-on-err-c
  >
    <q-toolbar>
      <q-icon
        name="sym_o_error"
        text="1.2em"
        mx-2
      />
      <span>{{ store.message }}</span>
      <q-btn
        flat
        round
        size="sm"
        icon="sym_o_close"
        @click="show = false"
        ml-a
      />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { useReadonlyStateStore } from 'src/stores/readonly-state'
import { ref } from 'vue'

const store = useReadonlyStateStore()
const show = ref(true)
</script>
