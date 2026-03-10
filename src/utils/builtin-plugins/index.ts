import type { BuiltinPluginManifest } from 'src/stores/plugins'
import { webPlugin } from './web'
import { mermaidPlugin } from './mermaid'

export const builtinPlugins: BuiltinPluginManifest[] = [webPlugin, mermaidPlugin]
