import type { Editor } from '@tiptap/vue-3'
import { assert } from 'app/src-shared/utils/functions'
import { z } from 'zod'
import { injectGlobal } from 'src/composables/provide-inject-global'
import type { Ref } from 'vue'
import { tool } from 'ai'

const spliceOptionsSchema = z.object({
  startBefore: z.string().optional().describe('If specified, editing will start before the node with this id.'),
  startAfter: z.string().optional().describe('If specified, editing will start after the node with this id.'),
  deleteTo: z.string().optional().describe('If specified, nodes will be deleted from the start position up to the node with this id (inclusive). By default, no nodes will be deleted.'),
  insert: z.string().optional().describe('If specified, this content will be inserted at the start position after the deletion operation (if any). Use markdown format. All GFM syntax is supported.'),
})
type SpliceOptions = z.infer<typeof spliceOptionsSchema>

function spliceDoc(editor: Editor, { startBefore, startAfter, deleteTo, insert }: SpliceOptions) {
  const doc = editor.$doc.node
  let from = null as number | null
  let to = null as number | null
  doc.descendants((node, pos) => {
    if (startBefore && node.attrs.id === startBefore) from = pos
    if (startAfter && node.attrs.id === startAfter) from = pos + node.nodeSize
    if (deleteTo && node.attrs.id === deleteTo) to = pos + node.nodeSize
  })
  assert(from != null, 'start node not found')
  if (deleteTo) assert(to != null, 'deleteTo node not found')
  if (insert) {
    const pos = to ? { from, to } : from
    editor.chain().insertContentAt(pos, insert, { contentType: 'markdown' }).run()
  } else {
    assert(to != null, 'no action specified')
    editor.chain().deleteRange({ from, to }).run()
  }
}

export const editPageSdkTool = tool({
  description: 'Use this tool to edit page content',
  inputSchema: z.object({
    edits: z.array(spliceOptionsSchema).describe('Array of edit operations executed in sequence'),
  }),
  execute({ edits }) {
    const editor = injectGlobal<Ref<Editor>>('pageEditor')
    if (!editor?.value) throw new Error('Page not active')
    for (const edit of edits) {
      spliceDoc(editor.value, edit)
    }
    return 'Page successfully edited'
  },
})
