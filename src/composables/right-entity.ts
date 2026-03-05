import { useJsonQuery } from './json-query'
import { z } from 'zod'

export function useRightEntity() {
  return useJsonQuery('rightEntity', z.object({
    type: z.enum(['chat', 'search', 'page', 'channel', 'item', 'folder']),
    id: z.string(),
  }))
}
