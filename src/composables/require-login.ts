import { user } from 'src/utils/zero-session'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useRequireLogin() {
  const route = useRoute()
  const router = useRouter()
  watch(() => user.id, id => {
    if (!id) router.replace({ path: '/auth/sign-in', query: { redirect: route.fullPath } })
  }, { immediate: true })
}
