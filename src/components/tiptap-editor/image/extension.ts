import TiptapImage from '@tiptap/extension-image'
import { ResizableNodeView } from '@tiptap/vue-3'
import { mount, unmount } from 'src/composables/blob-url'

export const Image = TiptapImage.extend({
  addNodeView() {
    if (!this.options.resize || !this.options.resize.enabled || typeof document === 'undefined') {
      return null
    }

    const { directions, minWidth, minHeight, alwaysPreserveAspectRatio } = this.options.resize

    return ({ node, getPos, HTMLAttributes, editor }) => {
      const el = document.createElement('img')

      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        if (value != null) {
          switch (key) {
            case 'width':
            case 'height':
            case 'src':
              break
            default:
              el.setAttribute(key, value)
              break
          }
        }
      })
      const itemId = HTMLAttributes.src.match(/\/s3\/items\/([\w-]+)/)?.[1]

      let promise: Promise<void> | null = null
      if (itemId) promise = mount(itemId).then(url => { el.src = url })
      else el.src = HTMLAttributes.src

      const nodeView = new ResizableNodeView({
        element: el,
        editor,
        node,
        getPos,
        onResize: (width, height) => {
          el.style.width = `${width}px`
          el.style.height = `${height}px`
        },
        onCommit: (width, height) => {
          const pos = getPos()
          if (pos === undefined) {
            return
          }

          this.editor
            .chain()
            .setNodeSelection(pos)
            .updateAttributes(this.name, {
              width,
              height,
            })
            .run()
        },
        onUpdate: (updatedNode) => {
          if (updatedNode.type !== node.type) {
            return false
          }

          return true
        },
        options: {
          directions,
          min: {
            width: minWidth,
            height: minHeight,
          },
          preserveAspectRatio: alwaysPreserveAspectRatio === true,
        },
      })

      const dom = nodeView.dom

      // when image is loaded, show the node view to get the correct dimensions
      dom.style.visibility = 'hidden'
      dom.style.pointerEvents = 'none'
      el.onload = () => {
        dom.style.visibility = ''
        dom.style.pointerEvents = ''
      }

      return {
        ...nodeView,
        dom,
        destroy() {
          nodeView.destroy()
          itemId && promise!.then(() => unmount(itemId))
        },
      }
    }
  },
}).configure({
  resize: {
    enabled: true,
    alwaysPreserveAspectRatio: true,
    directions: ['left', 'right'],
  },
})
