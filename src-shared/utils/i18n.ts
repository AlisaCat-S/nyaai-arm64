import { initI18n } from 'i18n-pro'
import { langs } from 'app/i18n'

const {
  t,
} = initI18n({
  namespace: 'shared',
  langs,
})

export const {
  withLocale,
} = t
