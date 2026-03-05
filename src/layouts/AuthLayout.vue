<template>
  <q-header
    v-if="$route.meta.title"
    bg-sur-c-low
    text-on-sur
  >
    <q-toolbar>
      <q-toolbar-title>{{ $route.meta.title }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page-container>
    <q-page
      max-w="500px"
      mx-a
      px-3
      flex="~ col"
      justify-center
    >
      <router-view />
      <div h="100px" />
    </q-page>
  </q-page-container>
</template>
