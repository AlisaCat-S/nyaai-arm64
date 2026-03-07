import { DEFAULT_PLAN_ID, PUBLIC_ROOT_ID } from 'app/src-shared/utils/config'
import { db } from './db'
import { entity, globalSettings, plan, provider } from '../schema'
import { entityDefaultProps } from 'app/src-shared/mutators'
import { sizeBytes } from 'app/src-shared/utils/functions'

export async function seed() {
  await db.insert(globalSettings).values({
    id: 'default',
    freeModelReqLimit: 60,
    freeModelLimitWindow: 3600 * 1000,
    maxWorkspacesPerUser: 10,
    oauthProviders: [],
  }).onConflictDoNothing()
  await db.insert(plan).values({
    id: DEFAULT_PLAN_ID,
    name: 'Default',
    maxMembers: 10,
    storageLimit: sizeBytes('1T'),
    fileSizeLimit: sizeBytes('5G'),
    quotaLimit: 10,
  }).onConflictDoNothing()
  await db.insert(entity).values({
    ...entityDefaultProps,
    id: PUBLIC_ROOT_ID,
    rootId: PUBLIC_ROOT_ID,
    pubRoot: PUBLIC_ROOT_ID,
    parentId: null,
    type: 'folder',
    name: 'Public',
  }).onConflictDoNothing()
  await db.insert(provider).values({
    id: PUBLIC_ROOT_ID,
    rootId: PUBLIC_ROOT_ID,
    type: 'openai-compatible',
    settings: {
      baseURL: '/api/v1',
    },
  }).onConflictDoNothing()
  // TODO: move to migrations
  /* await db.insert(mergePatchesRule).values([
    {
      offset: timeMs('2h'),
      period: timeMs('10m'),
      gap: timeMs('1m'),
      lastTime: Date.now(),
    },
    {
      offset: timeMs('2d'),
      period: timeMs('1d'),
      gap: timeMs('1h'),
      lastTime: Date.now(),
    },
    {
      offset: timeMs('1M'),
      period: timeMs('1w'),
      gap: timeMs('1d'),
      lastTime: Date.now(),
    },
  ]) */
}
