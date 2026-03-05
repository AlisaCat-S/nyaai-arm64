import { hashStream, hashProofStream, uint8ArrayToBase64 } from 'app/src-shared/utils/functions'
import { createSHA256 } from 'hash-wasm'

export async function hashBlob(blob: Blob, mode: 'full' | 'proof' = 'full') {
  const hasher = await createSHA256()
  hasher.init()
  const handler = mode === 'full' ? hashStream : hashProofStream
  await handler(hasher, blob.stream())
  return uint8ArrayToBase64(hasher.digest('binary'))
}
