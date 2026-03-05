import { z } from 'zod'

const hue = z.number().min(0).max(360).optional()
export const avatarSchema = z.union([
  z.object({
    type: z.literal('svg'),
    name: z.string(),
    hue,
  }),
  z.object({
    type: z.literal('text'),
    text: z.string(),
    hue,
  }),
  z.object({
    type: z.literal('icon'),
    icon: z.string(),
    hue,
  }),
  z.object({
    type: z.literal('image'),
    itemId: z.string(),
    hue,
  }),
  z.object({
    type: z.literal('url'),
    url: z.string(),
    hue,
  }),
])
export type Avatar = z.infer<typeof avatarSchema>

export const entityTypeSchema = z.enum(['folder', 'chat', 'search', 'channel', 'assistant', 'provider', 'mcpPlugin', 'page', 'translation', 'item', 'shortcut'])
export type EntityType = z.infer<typeof entityTypeSchema>

export const messageTypeSchema = z.enum(['chat:user', 'chat:assistant', 'channel:assistant', 'channel:user', 'channel:draft'])
export type MessageType = z.infer<typeof messageTypeSchema>

export const workspaceRoleSchema = z.enum(['owner', 'admin', 'member', 'guest'])
export type WorkspaceRole = z.infer<typeof workspaceRoleSchema>

export const shortcutActionSchema = z.enum(['createNew', 'openLast'])
export type ShortcutAction = z.infer<typeof shortcutActionSchema>

export const toolCallStatusSchema = z.enum(['calling', 'failed', 'completed'])
export type ToolCallStatus = z.infer<typeof toolCallStatusSchema>

export const promptRoleSchema = z.enum(['system', 'user'])
export type PromptRole = z.infer<typeof promptRoleSchema>

export const memberDataSchema = z.object({
  leftDirId: z.string().nullable(),
})
export type MemberData = z.infer<typeof memberDataSchema>

export const searchResultSchema = z.object({
  title: z.string(),
  url: z.url(),
  content: z.string(),
})
export type SearchResult = z.infer<typeof searchResultSchema>

export const mcpTransportSchema = z.union([
  z.object({
    type: z.literal('http'),
    url: z.url(),
  }),
])
export type McpTransport = z.infer<typeof mcpTransportSchema>

export const entityOrderBySchema = z.tuple([z.enum(['id', 'name']), z.enum(['asc', 'desc'])])
export type EntityOrderBy = z.infer<typeof entityOrderBySchema>

export const entityListOptionsSchema = z.object({
  type: entityTypeSchema.nullish(),
  hidden: z.boolean().nullish(),
  orderBy: entityOrderBySchema.default(['id', 'desc']),
})
export type EntityListOptions = z.infer<typeof entityListOptionsSchema>

export const modelInputTypesSchema = z.object({
  user: z.array(z.string()),
  assistant: z.array(z.string()),
  tool: z.array(z.string()),
})
export type ModelInputTypes = z.infer<typeof modelInputTypesSchema>

export const paymentProviderSchema = z.enum(['stripe', 'wxpay'])
export type PaymentProvider = z.infer<typeof paymentProviderSchema>

export const planIntervalSchema = z.enum(['monthly', 'quarterly', 'yearly'])
export type PlanInterval = z.infer<typeof planIntervalSchema>

export const entityStartSchema = z.object({
  sortPriority: z.number(),
  name: z.string().nullable(),
  id: z.string(),
}).partial()
export type EntityStart = z.infer<typeof entityStartSchema>
