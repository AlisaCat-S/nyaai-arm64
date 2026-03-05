import { config, type MdPreviewProps, XSSPlugin } from 'md-editor-v3'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import LinkAttr from 'markdown-it-link-attributes'
import { usePerfsStore } from 'src/stores/perfs'
import { genId } from 'app/src-shared/utils/id'
import { mdExtensions } from 'src/utils/md-extensions'
import katex from 'katex'
import hljs from 'highlight.js/lib/core'
import { common } from 'lowlight'
import 'katex/dist/katex.min.css'

for (const [name, grammar] of Object.entries(common)) {
  hljs.registerLanguage(name, grammar)
}

config({
  editorConfig: {
    languageUserDefined: {
      'zh-CN': {
        copyCode: {
          text: 'content_copy',
          successTips: 'check',
          failTips: 'error',
        },
      },
    },
  },
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'xss',
        plugin: XSSPlugin,
        options: {
          extendedWhiteList: Object.fromEntries(mdExtensions.map(x => x.whiteList)),
        },
      },
      {
        type: 'linkAttr',
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            return !href.startsWith('#')
          },
          attrs: {
            target: '_blank',
          },
        },
      },
    ]
  },
  editorExtensions: {
    highlight: {
      instance: hljs,
    },
    katex: {
      instance: katex,
    },
  },
})

export function useMdProps() {
  const $q = useQuasar()
  const perfsStore = usePerfsStore()
  const id = `md-${genId()}`
  const mdHeadingId = ({ text, level, index }) => `${text}-${level}-${index}`
  return {
    mdPreviewProps: computed(() => ({
      id,
      theme: $q.dark.isActive ? 'dark' : 'light',
      previewTheme: perfsStore.perfs.mdPreviewTheme,
      codeTheme: perfsStore.perfs.mdCodeTheme,
      autoFoldThreshold: perfsStore.perfs.mdAutoFoldThreshold ?? Infinity,
      noMermaid: perfsStore.perfs.mdNoMermaid,
      mdHeadingId,
    } satisfies Partial<MdPreviewProps>)),
    mdCatalogProps: computed(() => ({
      editorId: id,
      mdHeadingId,
    })),
  }
}
