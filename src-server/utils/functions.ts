import { getLocale } from 'app/i18n'

export function getLocaleFromHeaders(headers?: Headers) {
  return getLocale(headers?.get('Accept-Language')?.split(',')[0] ?? '')
}
