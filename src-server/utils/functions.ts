import { getLocale } from 'app/i18n'

export function getLocaleFromHeaders(headers?: Headers) {
  return getLocale(headers?.get('Accept-Language')?.split(',')[0] ?? '')
}

export function log(message: string, ...rest: string[]) {
  console.log(new Date().toISOString(), '-', message, ...rest)
}
