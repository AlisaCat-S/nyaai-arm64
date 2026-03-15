<template>
  <q-layout view="lHr Lpr lFf">
    <router-view />
  </q-layout>
</template>

<script setup lang="ts">
import { useSetTheme } from 'src/composables/set-theme'
import { watch } from 'vue'
import { DEFAULT_HUE } from 'src/utils/config'
import { authClient, session } from 'src/utils/auth-client'
import { useRouter } from 'vue-router'
import { client } from 'src/utils/hc'
import { useQuasar } from 'quasar'
import { t } from 'src/utils/i18n'

useSetTheme(DEFAULT_HUE)

const router = useRouter()
const $q = useQuasar()
watch(() => session.value.data?.user.id, async () => {
  const { data, isPending } = session.value
  if (isPending) return
  if (!data) {
    router.replace('/auth/sign-in')
    return
  }
  if (data.user.role !== 'admin') {
    const res = await client.api.admin.aquireRole.$post()
    if (!res.ok) {
      $q.notify({
        message: t('You need to be an admin to access this page'),
        color: 'negative',
      })
      return
    }
    await authClient.getSession({ query: { disableCookieCache: true } })
  }
}, { immediate: true })
</script>
