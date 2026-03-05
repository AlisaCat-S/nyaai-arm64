import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { z } from 'zod'

export function useJsonQuery<S extends z.ZodType>(key: string, schema: S) {
  const route = useRoute()
  return computed(() => {
    if (!route.query[key]) return null
    try {
      return schema.parse(JSON.parse(route.query[key] as string))
    } catch (err) {
      console.error(err)
      return null
    }
  })
}
