import type { Editor } from '@tiptap/vue-3'
import type { NodeSerializerAsync } from '@krytro/prosemirror-docx'
import { DocxSerializerAsync, defaultMarks, defaultAsyncNodes } from '@krytro/prosemirror-docx'
import { Packer } from 'docx'
import ky from 'ky'
import { TiptapDocxExporter } from './tiptap-docx'

const nodeSerializer: NodeSerializerAsync = {
  ...defaultAsyncNodes,
  hardBreak: defaultAsyncNodes.hard_break,
  codeBlock: defaultAsyncNodes.code_block,
  orderedList: defaultAsyncNodes.ordered_list,
  listItem: defaultAsyncNodes.list_item,
  bulletList: defaultAsyncNodes.bullet_list,
  horizontalRule: defaultAsyncNodes.horizontal_rule,
  inlineMath(state, node) {
    state.math(node.attrs.latex, { inline: true })
  },
  blockMath(state, node) {
    state.math(node.attrs.latex, { inline: false })
  },
}

const docxSerializer = new DocxSerializerAsync(nodeSerializer, defaultMarks)

export async function exportDocx(editor: Editor) {
  const doc = await docxSerializer.serializeAsync(editor.state.doc, {
    async getImageBuffer(src) {
      return await ky.get(src).bytes()
    },
  })
  return await Packer.toBlob(doc)
}

export async function exportDocx2(editor: Editor) {
  const exporter = new TiptapDocxExporter()
  return await exporter.toBlob(editor.getJSON())
}
