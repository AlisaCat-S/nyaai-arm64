import { Hono } from 'hono'
import { auth } from './auth/auth'
import { db } from './utils/db'
import { user, plan, model, workspace, planPrice, globalSettings } from './schema'
import { and, eq } from 'drizzle-orm'
import { zValidator } from '@hono/zod-validator'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod'
import { avatarSchema, modelInputTypesSchema, paymentProviderSchema, planIntervalSchema } from 'app/src-shared/utils/validators'
import { z } from 'zod'
import { genId } from 'app/src-shared/utils/id'
import { PUBLIC_ROOT_ID } from 'app/src-shared/utils/config'

const adminModelSchema = createInsertSchema(model).omit({
  id: true,
  rootId: true,
  entityId: true,
}).extend({
  avatar: avatarSchema.nullish(),
  inputTypes: modelInputTypesSchema.nullish(),
})
export type AdminModel = z.infer<typeof adminModelSchema>

const app = new Hono()
  .post('/aquireRole', async c => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) return c.json({ error: 'Unauthorized' }, 401)
    const admin = await db.query.user.findFirst({
      where: { role: 'admin' },
    })
    if (admin) return c.json({ error: 'Admin already exists' }, 400)
    await db.update(user).set({ role: 'admin' }).where(eq(user.id, session.user.id))
    return c.json({ message: 'Admin role acquired' })
  })
  .post('/addPlan',
    zValidator('json', createInsertSchema(plan)),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const data = c.req.valid('json')
      await db.insert(plan).values(data)
      return c.json({ message: 'Plan created' })
    },
  )
  .post('/updatePlan',
    zValidator('json', createUpdateSchema(plan).required({ id: true })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id, ...updates } = c.req.valid('json')
      await db.update(plan).set(updates).where(eq(plan.id, id))
      return c.json({ message: 'Plan updated' })
    },
  )
  .post('/deletePlan',
    zValidator('json', z.object({ id: z.string() })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id } = c.req.valid('json')
      await db.delete(plan).where(eq(plan.id, id))
      return c.json({ message: 'Plan deleted' })
    },
  )
  .post('/addPlanPrice',
    zValidator('json', createInsertSchema(planPrice).extend({
      provider: paymentProviderSchema,
      interval: planIntervalSchema,
    })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const data = c.req.valid('json')
      await db.insert(planPrice).values(data)
      return c.json({ message: 'Plan price created' })
    },
  )
  .post('/updatePlanPrice',
    zValidator('json', createUpdateSchema(planPrice).extend({
      provider: paymentProviderSchema.optional(),
      interval: planIntervalSchema.optional(),
    }).required({ id: true })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id, ...updates } = c.req.valid('json')
      await db.update(planPrice).set(updates).where(eq(planPrice.id, id))
      return c.json({ message: 'Plan price updated' })
    },
  )
  .post('/deletePlanPrice',
    zValidator('json', z.object({ id: z.string() })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id } = c.req.valid('json')
      await db.delete(planPrice).where(eq(planPrice.id, id))
      return c.json({ message: 'Plan price deleted' })
    },
  )
  .post('/addModel',
    zValidator('json', adminModelSchema),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const props = c.req.valid('json')
      await db.insert(model).values({
        id: genId(),
        rootId: PUBLIC_ROOT_ID,
        entityId: PUBLIC_ROOT_ID,
        ...props,
      })
      return c.json({ message: 'Model created' })
    },
  )
  .post('/updateModel',
    zValidator('json', adminModelSchema.partial().extend({ id: z.string() })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id, ...updates } = c.req.valid('json')
      await db.update(model).set(updates).where(and(
        eq(model.id, id),
        eq(model.entityId, PUBLIC_ROOT_ID),
      ))
      return c.json({ message: 'Model updated' })
    },
  )
  .post('/deleteModel',
    zValidator('json', z.object({ id: z.string() })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id } = c.req.valid('json')
      await db.delete(model).where(and(
        eq(model.id, id),
        eq(model.entityId, PUBLIC_ROOT_ID),
      ))
      return c.json({ message: 'Model deleted' })
    },
  )
  .post('/updateWorkspace',
    zValidator('json', z.object({
      id: z.string(),
      name: z.string().optional(),
      planId: z.string().optional(),
      remainingMonths: z.int().nullish(),
    })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id, ...updates } = c.req.valid('json')
      await db.update(workspace).set(updates).where(eq(workspace.id, id))
      return c.json({ message: 'Workspace updated' })
    },
  )
  .post('/deleteWorkspace',
    zValidator('json', z.object({ id: z.string() })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id } = c.req.valid('json')
      await db.delete(workspace).where(eq(workspace.id, id))
      return c.json({ message: 'Workspace deleted' })
    },
  )
  .post('/updateGlobalSettings',
    zValidator('json', createUpdateSchema(globalSettings).required({ id: true })),
    async c => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers })
      if (session?.user.role !== 'admin') return c.json({ error: 'Unauthorized' }, 401)
      const { id, ...updates } = c.req.valid('json')
      await db.update(globalSettings).set(updates).where(eq(globalSettings.id, id))
      return c.json({ message: 'Global settings updated' })
    },
  )

export default app
