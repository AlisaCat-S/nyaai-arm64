import { getLocale } from 'app/i18n'
import type { WorkspaceRole } from 'app/src-shared/utils/validators'

export function getLocaleFromHeaders(headers?: Headers) {
  return getLocale(headers?.get('Accept-Language')?.split(',')[0] ?? '')
}

export function withReadable(userId: string) {
  return {
    member: {
      userId,
    },
  }
}

export function withWritable(userId: string) {
  return {
    member: {
      userId,
      role: {
        in: ['owner', 'admin', 'member'] satisfies WorkspaceRole[],
      },
    },
  }
}
