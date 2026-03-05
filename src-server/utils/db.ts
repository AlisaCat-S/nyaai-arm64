import { drizzle } from 'drizzle-orm/node-postgres'
import { DATABASE_URL } from './config'
import { relations } from '../schema/relations'
import * as schema from '../schema'

export const db = drizzle(DATABASE_URL, { schema, relations })
