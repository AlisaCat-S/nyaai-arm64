import { hc } from 'hono/client'
import type { AppType } from 'app/src-server/index'

export const client = hc<AppType>('/')
