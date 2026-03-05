// ---------------------------------------------------------------------------
// TipTap JSON document types (framework-agnostic, no BlockNote / React deps)
// ---------------------------------------------------------------------------

export interface TiptapMark {
  type: string
  attrs?: Record<string, any>
}

export interface TiptapNode {
  type: string
  attrs?: Record<string, any>
  content?: TiptapNode[]
  marks?: TiptapMark[]
  /** Only present on `text` nodes */
  text?: string
}

/** The root node returned by `editor.getJSON()` */
export type TiptapDocument = TiptapNode

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

/** Resolve an image URL to a Blob (e.g. fetch + cors proxy). */
export type ImageUrlResolver = (url: string) => Promise<Blob>

export interface TiptapDocxExporterOptions {
  /**
   * Custom image URL resolver.
   * Default: plain `fetch(url)` then `.blob()`.
   */
  imageResolver?: ImageUrlResolver

  /**
   * Document locale in OOXML format (e.g. "en-US", "zh-CN", "fr-FR").
   * Used to set the spell-check / hyphenation language in styles.xml.
   * Defaults to "en-US".
   */
  locale?: string
}

export type Writable<T> = {
  -readonly [K in keyof T]: T[K]
}
