<template>
  <state-header />
  <router-view />
  <right-drawer />
</template>

<script setup lang="ts">
import RightDrawer from 'src/components/RightDrawer.vue'
import StateHeader from 'src/components/StateHeader.vue'
</script>
