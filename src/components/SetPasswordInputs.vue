<template>
  <div>
    <q-input
      :label="t('Password')"
      type="password"
      v-model="password"
      :rules="[
        val => val.length >= 8 || t('Password must be at least 8 characters long'),
        val => /[a-zA-Z]/.test(val) || t('Password must contain at least one letter')
      ]"
      :filled
    />
    <q-input
      :label="t('Confirm Password')"
      type="password"
      v-model="confirmPassword"
      :rules="[
        val => val === password || t('Passwords do not match')
      ]"
      class="mt-2"
      :filled
    />
  </div>
</template>

<script setup lang="ts">
import { t } from 'src/utils/i18n'
import { ref } from 'vue'

defineProps<{
  filled?: boolean
}>()

const password = defineModel<string>()
const confirmPassword = ref('')
</script>
