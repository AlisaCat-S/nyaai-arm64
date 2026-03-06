import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import EditorCodeBlock from './EditorCodeBlock.vue'
import { common, createLowlight } from 'lowlight'

const lowlight = createLowlight(common)

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return VueNodeViewRenderer(EditorCodeBlock as any)
  },
}).configure({
  lowlight,
})
