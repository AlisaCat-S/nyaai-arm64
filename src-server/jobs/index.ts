import { Cron } from 'croner'
import { mergePatches } from './merge-patches'
import { resetQuota } from './reset-quota'
import { cleanBlobs } from './clean-blobs'
import { log } from '../utils/functions'

function wrapJob(fn: () => Promise<void>) {
  return async function() {
    log(`Running job: ${fn.name}`)
    await fn()
    log(`Finished job: ${fn.name}`)
  }
}

export function initJobs() {
  return {
    mergePatches: new Cron('0 */5 * * * *', { protect: true }, wrapJob(mergePatches)),
    resetQuota: new Cron('10 */5 * * * *', { protect: true }, wrapJob(resetQuota)),
    cleanBlobs: new Cron('20 0 * * * *', { protect: true }, wrapJob(cleanBlobs)),
  }
}
