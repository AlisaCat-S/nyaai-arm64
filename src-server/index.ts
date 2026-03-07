import { Hono } from 'hono'
import { logger } from 'hono/logger'
import auth from './auth/routes'
import zero from './zero/routes'
import s3 from './s3'
import ai from './ai'
import { seed } from './utils/seed'
import admin from './admin'
import payment from './payment'
import searxng from './searxng'

seed()

export const app = new Hono().basePath('/api')
  .route('/auth', auth)
  .route('/zero', zero)
  .route('/s3', s3)
  .route('/v1', ai)
  .route('/admin', admin)
  .route('/payment', payment)
  .route('/searxng', searxng)
  .use(logger())

export default app

export type AppType = typeof app
