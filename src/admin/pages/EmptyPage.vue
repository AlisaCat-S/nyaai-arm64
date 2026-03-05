<template>
  <div />
</template>
<script setup lang="ts">
import { user } from 'src/utils/zero-session'
import { useRouter } from 'vue-router'

const router = useRouter()
router.replace(user.id ? '/users' : '/auth/sign-in')
</script>
