import { Plugin } from '@tiptap/pm/state'
import { Extension } from '@tiptap/vue-3'

export const PasteMarkdown = Extension.create({
  name: 'pasteMarkdown',

  addProseMirrorPlugins() {
    const { editor } = this
    return [
      new Plugin({
        props: {
          handlePaste(view, event) {
            if (editor.isActive('codeBlock')) return false
            const text = event.clipboardData?.getData('text/plain')

            if (!text) return false

            // Check if text looks like Markdown
            if (editor.markdown && looksLikeMarkdown(text)) {
              // Parse the Markdown text to Tiptap JSON using the Markdown manager
              const json = editor.markdown.parse(text)

              // Insert the parsed JSON content at cursor position
              editor.commands.insertContent(json)
              return true
            }

            return false
          },
        },
      }),
    ]
  },
})

function looksLikeMarkdown(text: string): boolean {
  const regs = [
    /^#{1,6}\s+.+$/m, // Headings
    /\*\*[^*]+\*\*|__[^*]+__/m, // Bold
    /\[.+\]\(.+\)/m, // Links
    /^[-*+]\s+.+$/m, // Lists
    /```[\s\S]+?```/, // Code block
    /\|\s*:?-{3,}:?\s?\|/m, // Table
    /\\\(.+?\\\)|\$[^$]+\$[^$]/m, // Latex inline
    /\\\[[\s\S]+?\\\]|\$\$[^$]+\$\$/, // Latex block
  ]
  return regs.some(reg => reg.test(text))
}
