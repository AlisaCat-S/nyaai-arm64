import { Hono } from 'hono'
import { auth } from './auth'
 
const app = new Hono()
 
// 中间件：禁止新用户注册（但允许现有用户登录）
app.use('/*', async (c, next) => {
  const disableSignUp = process.env.DISABLE_SIGN_UP === 'true'
  // better-auth 的注册端点通常是 /sign-up/email
  if (disableSignUp && c.req.path.includes('/sign-up')) {
    return c.json({ error: 'Registration is disabled' }, 403)
  }
  await next()
})
 
app.on(['POST', 'GET'], '/*', (c) => auth.handler(c.req.raw))
 
export default app
