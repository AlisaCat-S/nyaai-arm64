import type { BuiltinPluginManifest } from 'src/stores/plugins'
import { t } from '../i18n'

export const mermaidPlugin: BuiltinPluginManifest = {
  id: 'mermaid',
  type: 'builtin',
  name: t('Mermaid Diagram'),
  avatar: { type: 'icon', icon: 'sym_o_account_tree', hue: 15 },
  description: t('Make AI use mermaid syntax to create diagrams in responses'),
  prompt: 'In the answer, if you need to draw a chart, you can directly use mermaid syntax to create the chart, which can be rendered normally.',
  tools: [],
  resources: [],
  prompts: [],
}
