// ---------------------------------------------------------------------------
// TipTap → DOCX exporter
// Uses docxjs (https://docx.js.org) for document generation.
// ---------------------------------------------------------------------------

import type {
  ISectionOptions,
  ParagraphChild,
} from 'docx'
import {
  AlignmentType,
  CheckBox,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from 'docx'

import { textNodeToChildren } from './markUtils.js'
import type {
  ImageUrlResolver,
  TiptapDocument,
  TiptapDocxExporterOptions,
  TiptapNode,
} from './types.js'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** 1 pt = 20 twips. Default tab stop = 16 pt × 1.5 em. */
const DEFAULT_TAB_STOP =
  /* default font size (pt) */ 16 *
  /* 1.5 em */ 1.5 *
  /* pt → twips */ 20

// ---------------------------------------------------------------------------
// Internal traversal context
// ---------------------------------------------------------------------------
interface TraversalContext {
  /** Current list type (undefined when not inside a list) */
  listType?: 'bullet' | 'ordered' | 'task'
  /** 0-based nesting level inside lists */
  listLevel: number
  /**
   * Optional style name that will be applied to paragraph-like blocks.
   * Used to propagate "BlockQuote" through blockquote's children.
   */
  paragraphStyle?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Collect all inline content (text / hardBreak / inline images inside a node)
 * and return the corresponding ParagraphChild array.
 * This is used for paragraph-like nodes that contain inline content.
 */
function collectInlineChildren(
  node: TiptapNode,
  imageResolver: ImageUrlResolver,
  pendingAsyncRuns: Array<Promise<void>>,
): ParagraphChild[] {
  const children: ParagraphChild[] = []

  for (const child of node.content ?? []) {
    switch (child.type) {
      case 'text':
        children.push(...textNodeToChildren(child.text ?? '', child.marks))
        break

      case 'hardBreak':
        children.push(new TextRun({ break: 1 }))
        break

      case 'image': {
        // Non-external inline images can appear inside blocks in some schemas.
        // We queue an async resolution and leave a placeholder TextRun that
        // gets replaced by the real ImageRun after the async pass completes.
        // However, since docx Paragraph children are fixed arrays, we use a
        // two-pass approach: record the position and splice in the final image.
        // For simplicity, we push a placeholder and replace it in-place.
        const placeholder = new TextRun({ text: '' })
        children.push(placeholder as unknown as ParagraphChild)

        const idx = children.length - 1
        pendingAsyncRuns.push(
          (async () => {
            try {
              const blob = await imageResolver(child.attrs?.src ?? '')
              const arrayBuf = await blob.arrayBuffer()
              const alt = child.attrs?.alt ?? ''
              const title = child.attrs?.title ?? ''
              const width = child.attrs?.width ?? 200
              const height = child.attrs?.height ?? 150
              children[idx] = new ImageRun({
                data: arrayBuf,
                type: 'png',
                transformation: { width, height },
                altText: alt
                  ? { name: alt, title: title || alt, description: alt }
                  : undefined,
              })
            } catch {
              children[idx] = new TextRun({
                text: `[image: ${child.attrs?.src ?? ''}]`,
              })
            }
          })(),
        )
        break
      }

      default:
        // Embedded inline node types we don't recognise – skip
        break
    }
  }

  return children
}

/**
 * Map TipTap alignment attr value → docxjs AlignmentType
 */
function mapAlignment(
  textAlign?: string,
): 'center' | 'right' | 'distribute' | undefined {
  switch (textAlign) {
    case 'center':
      return AlignmentType.CENTER
    case 'right':
      return AlignmentType.RIGHT
    case 'justify':
      return AlignmentType.DISTRIBUTE
    default:
      return undefined
  }
}

// ---------------------------------------------------------------------------
// Main conversion function (recursive)
// Returns an array of block-level items: Paragraph | Table
// Some operations are async (image loading), so the function is async.
// ---------------------------------------------------------------------------
async function transformNodes(
  nodes: TiptapNode[],
  ctx: TraversalContext,
  imageResolver: ImageUrlResolver,
): Promise<Array<Paragraph | Table>> {
  const result: Array<Paragraph | Table> = []

  for (const node of nodes) {
    switch (node.type) {
      // ---- Leaf / inline containers ----------------------------------------
      case 'paragraph': {
        const pendingAsyncRuns: Array<Promise<void>> = []
        const inlineChildren = collectInlineChildren(
          node,
          imageResolver,
          pendingAsyncRuns,
        )
        await Promise.all(pendingAsyncRuns)

        result.push(
          new Paragraph({
            style: ctx.paragraphStyle,
            alignment: mapAlignment(node.attrs?.textAlign),
            children: inlineChildren,
            ...(ctx.listType
              ? {
                  numbering: {
                    reference:
                      ctx.listType === 'ordered'
                        ? 'tiptap-numbered-list'
                        : 'tiptap-bullet-list',
                    level: ctx.listLevel,
                  },
                }
              : {}),
          }),
        )
        break
      }

      case 'heading': {
        const level = (node.attrs?.level ?? 1) as 1 | 2 | 3 | 4 | 5 | 6
        const headingStyleMap = {
          1: HeadingLevel.HEADING_1,
          2: HeadingLevel.HEADING_2,
          3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4,
          5: HeadingLevel.HEADING_5,
          6: HeadingLevel.HEADING_6,
        }
        const pendingAsyncRuns: Array<Promise<void>> = []
        const inlineChildren = collectInlineChildren(
          node,
          imageResolver,
          pendingAsyncRuns,
        )
        await Promise.all(pendingAsyncRuns)

        result.push(
          new Paragraph({
            heading: headingStyleMap[level],
            alignment: mapAlignment(node.attrs?.textAlign),
            children: inlineChildren,
          }),
        )
        break
      }

      case 'blockquote': {
        // Propagate "BlockQuote" style down so all paragraph descendants
        // inside this blockquote get the correct paragraph style.
        const inner = await transformNodes(
          node.content ?? [],
          { ...ctx, paragraphStyle: 'BlockQuote' },
          imageResolver,
        )
        result.push(...inner)
        break
      }

      case 'codeBlock': {
        // Code block – gather all text content (ignoring marks)
        const lines: string[] = []
        for (const child of node.content ?? []) {
          if (child.type === 'text') {
            lines.push(...(child.text ?? '').split('\n'))
          }
        }
        const runs = lines.map(
          (line, i) =>
            new TextRun({
              text: line,
              break: i > 0 ? 1 : 0,
            }),
        )
        result.push(
          new Paragraph({
            style: 'SourceCode',
            children: runs,
          }),
        )
        break
      }

      case 'horizontalRule': {
        result.push(
          new Paragraph({
            border: {
              top: { color: 'auto', space: 1, style: 'single', size: 6 },
            },
            children: [],
          }),
        )
        break
      }

      // ---- Image (block-level) --------------------------------------------
      case 'image': {
        const src: string = node.attrs?.src ?? ''
        const alt: string = node.attrs?.alt ?? ''
        const title: string = node.attrs?.title ?? ''
        const requestedWidth: number | undefined = node.attrs?.width
          ? parseInt(String(node.attrs.width))
          : undefined
        const requestedHeight: number | undefined = node.attrs?.height
          ? parseInt(String(node.attrs.height))
          : undefined

        try {
          const blob = await imageResolver(src)
          const arrayBuf = await blob.arrayBuffer()

          // Default fallback dimensions
          const width = requestedWidth ?? 400
          const height = requestedHeight ?? 300

          result.push(
            new Paragraph({
              children: [
                new ImageRun({
                  data: arrayBuf,
                  type: 'png',
                  transformation: { width, height },
                  altText: alt
                    ? { name: alt, title: title || alt, description: alt }
                    : undefined,
                }),
              ],
            }),
          )
        } catch {
          // Fallback: render as hyperlink text
          result.push(
            new Paragraph({
              children: [
                new ExternalHyperlink({
                  link: src,
                  children: [
                    new TextRun({ text: alt || src, style: 'Hyperlink' }),
                  ],
                }),
              ],
            }),
          )
        }
        break
      }

      // ---- Lists -----------------------------------------------------------
      case 'bulletList': {
        const items = await transformNodes(
          node.content ?? [],
          { listType: 'bullet', listLevel: ctx.listLevel },
          imageResolver,
        )
        result.push(...items)
        break
      }

      case 'orderedList': {
        const items = await transformNodes(
          node.content ?? [],
          { listType: 'ordered', listLevel: ctx.listLevel },
          imageResolver,
        )
        result.push(...items)
        break
      }

      case 'listItem': {
        // The first child of listItem is typically a paragraph; subsequent
        // children may be nested lists. We propagate the current list context
        // to the paragraph and increment the level for nested lists.
        const children = node.content ?? []
        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (i === 0 && child.type === 'paragraph') {
            // The paragraph itself becomes the list-item paragraph
            const pendingAsyncRuns: Array<Promise<void>> = []
            const inlineChildren = collectInlineChildren(
              child,
              imageResolver,
              pendingAsyncRuns,
            )
            await Promise.all(pendingAsyncRuns)

            result.push(
              new Paragraph({
                // listItem paragraphs use numbering style, not blockquote style
                alignment: mapAlignment(child.attrs?.textAlign),
                children: inlineChildren,
                numbering: ctx.listType
                  ? {
                      reference:
                        ctx.listType === 'ordered'
                          ? 'tiptap-numbered-list'
                          : 'tiptap-bullet-list',
                      level: ctx.listLevel,
                    }
                  : undefined,
              }),
            )
          } else {
            // Nested list or other block content → recurse with incremented level
            const nested = await transformNodes(
              [child],
              { ...ctx, listLevel: ctx.listLevel + 1 },
              imageResolver,
            )
            result.push(...nested)
          }
        }
        break
      }

      // ---- Task list -------------------------------------------------------
      case 'taskList': {
        const items = await transformNodes(
          node.content ?? [],
          { listType: 'task', listLevel: ctx.listLevel },
          imageResolver,
        )
        result.push(...items)
        break
      }

      case 'taskItem': {
        const checked: boolean = node.attrs?.checked === true
        const children = node.content ?? []

        for (let i = 0; i < children.length; i++) {
          const child = children[i]
          if (i === 0 && child.type === 'paragraph') {
            const pendingAsyncRuns: Array<Promise<void>> = []
            const inlineChildren = collectInlineChildren(
              child,
              imageResolver,
              pendingAsyncRuns,
            )
            await Promise.all(pendingAsyncRuns)

            result.push(
              new Paragraph({
                children: [
                  new CheckBox({ checked }),
                  new TextRun({ text: ' ' }),
                  ...inlineChildren,
                ],
                indent: {
                  left: DEFAULT_TAB_STOP * (ctx.listLevel + 1),
                },
              }),
            )
          } else {
            const nested = await transformNodes(
              [child],
              { ...ctx, listLevel: ctx.listLevel + 1 },
              imageResolver,
            )
            result.push(...nested)
          }
        }
        break
      }

      // ---- Table -----------------------------------------------------------
      case 'table': {
        const tableRows: TableRow[] = []
        for (const rowNode of node.content ?? []) {
          if (rowNode.type !== 'tableRow') continue
          const cells: TableCell[] = []
          for (const cellNode of rowNode.content ?? []) {
            if (
              cellNode.type !== 'tableCell' &&
              cellNode.type !== 'tableHeader'
            ) { continue }

            const colspan: number = cellNode.attrs?.colspan ?? 1
            const rowspan: number = cellNode.attrs?.rowspan ?? 1

            const cellChildren = await transformNodes(
              cellNode.content ?? [],
              { listType: undefined, listLevel: 0 },
              imageResolver,
            )

            cells.push(
              new TableCell({
                columnSpan: colspan > 1 ? colspan : undefined,
                rowSpan: rowspan > 1 ? rowspan : undefined,
                shading:
                  cellNode.attrs?.background
                    ? {
                        type: ShadingType.CLEAR,
                        fill: (cellNode.attrs.background as string).replace(
                          '#',
                          '',
                        ),
                      }
                    : undefined,
                children:
                  cellChildren.length > 0
                    ? (cellChildren as Paragraph[])
                    : [new Paragraph({})],
              }),
            )
          }
          tableRows.push(new TableRow({ children: cells }))
        }

        result.push(
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        )
        break
      }

      // ---- Misc -----------------------------------------------------------
      default:
        // For any unknown node, try to recurse into its children
        if (node.content && node.content.length > 0) {
          const inner = await transformNodes(
            node.content,
            ctx,
            imageResolver,
          )
          result.push(...inner)
        }
        break
    }
  }

  return result
}

// ---------------------------------------------------------------------------
// Default image resolver – plain fetch
// ---------------------------------------------------------------------------
const defaultImageResolver: ImageUrlResolver = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`)
  return res.blob()
}

// ---------------------------------------------------------------------------
// TiptapDocxExporter
// ---------------------------------------------------------------------------

type DocumentOptions = Partial<ConstructorParameters<typeof Document>[0]>

export class TiptapDocxExporter {
  private readonly imageResolver: ImageUrlResolver
  private readonly locale: string

  public constructor(options: TiptapDocxExporterOptions = {}) {
    this.imageResolver = options.imageResolver ?? defaultImageResolver
    this.locale = (options.locale ?? 'en-US').trim() || 'en-US'
  }

  // ---- Default document config -------------------------------------------

  private buildNumberingConfig(): DocumentOptions['numbering'] {
    return {
      config: [
        {
          reference: 'tiptap-numbered-list',
          levels: Array.from({ length: 9 }, (_, i) => ({
            start: 1,
            level: i,
            format: LevelFormat.DECIMAL,
            text: `%${i + 1}.`,
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: {
                  left: DEFAULT_TAB_STOP * (i + 1),
                  hanging: DEFAULT_TAB_STOP,
                },
              },
            },
          })),
        },
        {
          reference: 'tiptap-bullet-list',
          levels: Array.from({ length: 9 }, (_, i) => ({
            start: 1,
            level: i,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: {
                  left: DEFAULT_TAB_STOP * (i + 1),
                  hanging: DEFAULT_TAB_STOP,
                },
              },
            },
          })),
        },
      ],
    }
  }

  private buildDefaultDocumentOptions(): DocumentOptions {
    return {
      numbering: this.buildNumberingConfig(),
    }
  }

  // ---- Public API --------------------------------------------------------

  /**
   * Convert a TipTap JSON document to a docxjs `Document` instance.
   * Use this when you need to post-process the document before packing.
   */
  public async toDocxJsDocument(
    doc: TiptapDocument,
    options: {
      sectionOptions?: Omit<ISectionOptions, 'children'>
      documentOptions?: DocumentOptions
    } = {},
  ): Promise<Document> {
    const topLevelNodes =
      doc.type === 'doc' ? (doc.content ?? []) : [doc]

    const children = await transformNodes(topLevelNodes, { listLevel: 0 }, this.imageResolver)

    const defaultDocOptions = this.buildDefaultDocumentOptions()

    return new Document({
      ...defaultDocOptions,
      ...options.documentOptions,
      sections: [
        {
          ...options.sectionOptions,
          children,
        },
      ],
    })
  }

  /**
   * Convert a TipTap JSON document to a `Blob` (.docx binary).
   *
   * @example
   * ```ts
   * const exporter = new TiptapDocxExporter();
   * const blob = await exporter.toBlob(editor.getJSON());
   * const url = URL.createObjectURL(blob);
   * const a = document.createElement("a");
   * a.href = url;
   * a.download = "document.docx";
   * a.click();
   * ```
   */
  public async toBlob(
    doc: TiptapDocument,
    options: {
      sectionOptions?: Omit<ISectionOptions, 'children'>
      documentOptions?: DocumentOptions
    } = {},
  ): Promise<Blob> {
    const document = await this.toDocxJsDocument(doc, options)

    // docxjs requires a Buffer global in some environments (e.g. browser/Vite).
    type G = typeof globalThis & { Buffer?: unknown }
    const g = globalThis as G
    const prevBuffer = g.Buffer
    try {
      if (!g.Buffer) {
        g.Buffer = (await import('buffer')).Buffer
      }
      return Packer.toBlob(document)
    } finally {
      g.Buffer = prevBuffer
    }
  }

  /**
   * Convert a TipTap JSON document to a Node.js `Buffer` (.docx binary).
   * Suitable for server-side usage (Node / Bun / Deno with Node compat).
   */
  public async toBuffer(
    doc: TiptapDocument,
    options: {
      sectionOptions?: Omit<ISectionOptions, 'children'>
      documentOptions?: DocumentOptions
    } = {},
  ): Promise<Buffer> {
    const document = await this.toDocxJsDocument(doc, options)
    return Packer.toBuffer(document)
  }
}
