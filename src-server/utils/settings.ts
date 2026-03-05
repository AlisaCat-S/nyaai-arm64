import { assert } from 'app/src-shared/utils/functions'
import { db } from './db'

export async function getGlobalSettings() {
  const settings = await db.query.globalSettings.findFirst()
  assert(settings, 'Global settings not found')
  return settings
}
