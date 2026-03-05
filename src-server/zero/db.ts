import { schema } from 'app/src-shared/schema.gen'
import { zeroDrizzle } from '@rocicorp/zero/server/adapters/drizzle'
import { db } from '../utils/db'

export const zdb = zeroDrizzle(schema, db)
