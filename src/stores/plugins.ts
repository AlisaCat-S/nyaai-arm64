import { defineStore, acceptHMRUpdate } from 'pinia'
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import { useWorkspaceStore } from './workspace'
import type { Avatar, McpTransport } from 'app/src-shared/utils/validators'
import { computed } from 'vue'
import { builtinPlugins } from 'src/utils/builtin-plugins'
import { entityAvatar, entityName } from 'src/utils/defaults'
import type { PluginPrompt, PluginResource, PluginTool } from 'app/src-shared/utils/types'

export interface McpPluginManifest {
  id: string
  type: 'mcp'
  name: string
  avatar: Avatar
  transport: McpTransport
  requestTimeout?: number | null
  resetTimeoutOnProgress?: boolean | null
  keepAliveTimeout?: number | null
}
export interface BuiltinPluginManifest {
  id: string
  type: 'builtin'
  name: string
  avatar: Avatar
  tools: PluginTool[]
  resources: PluginResource[]
  prompts: PluginPrompt[]
}
export type PluginManifest = McpPluginManifest | BuiltinPluginManifest

export const usePluginsStore = defineStore('plugins', () => {
  const workspaceStore = useWorkspaceStore()
  const { data: mcpPlugins } = useQuery(() => workspaceStore.id ? queries.mcpPlugins(workspaceStore.id) : null, {
    emptyValue: [],
  })
  const plugins = computed<PluginManifest[]>(() => [
    ...builtinPlugins,
    ...mcpPlugins.value.map(({ id, transport, requestTimeout, resetTimeoutOnProgress, keepAliveTimeout, entity }) => ({
      id,
      type: 'mcp' as const,
      name: entityName(entity),
      avatar: entityAvatar(entity),
      transport,
      requestTimeout,
      resetTimeoutOnProgress,
      keepAliveTimeout,
    })) satisfies McpPluginManifest[],
  ])

  return {
    plugins,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePluginsStore, import.meta.hot))
}
