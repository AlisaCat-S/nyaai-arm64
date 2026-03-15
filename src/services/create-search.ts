import { mutate } from 'src/utils/zero-session'
import { search } from 'src/utils/searxng'
import { genId, genIds } from 'app/src-shared/utils/id'
import { mutators } from 'app/src-shared/mutators'
import { useGlobalSettingsStore } from 'src/stores/global-settings'

export async function createSearch(q: string, parentId: string) {
  const { settings } = useGlobalSettingsStore()
  const results = await search({ q, engines: settings?.searchEngines })
  const id = genId()
  await mutate(mutators.createSearch({
    ids: [id, ...genIds(3)],
    parentId,
    q,
    results,
  })).client
  return id
}

export async function createSearchRecord(entityId: string, q: string) {
  const { settings } = useGlobalSettingsStore()
  const results = await search({ q, engines: settings?.searchEngines })
  const id = genId()
  const aId = genId()
  await mutate(mutators.createSearchRecord({
    ids: [id, aId, genId()],
    entityId,
    q,
    results,
  })).client
  return id
}
