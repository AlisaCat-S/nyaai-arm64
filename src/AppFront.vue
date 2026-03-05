<template>
  <q-layout view="lHr Lpr lFf">
    <main-drawer />
    <router-view />
    <navigation-dialog
      v-if="workspaceStore.id"
      v-model="panelOpen"
    />
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MainDrawer from './components/MainDrawer.vue'
import { useSetTheme } from './composables/set-theme'
import { usePerfsStore } from './stores/perfs'
import NavigationDialog from './components/NavigationDialog.vue'
import { useListenKey } from './composables/listen-key'
import { useWorkspaceStore } from './stores/workspace'

const perfsStore = usePerfsStore()
useSetTheme(computed(() => perfsStore.perfs.themeHue))

const workspaceStore = useWorkspaceStore()
const panelOpen = ref(false)
useListenKey(computed(() => perfsStore.perfs.navigationPanelShortcut), () => {
  panelOpen.value = !panelOpen.value
})

</script>
