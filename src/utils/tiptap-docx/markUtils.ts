// ---------------------------------------------------------------------------
// Mark → IRunPropertiesOptions conversion
// Handles all built-in TipTap marks:
//   bold, italic, underline, strike, code, link,
//   textStyle (color / fontSize / fontFamily), highlight, subscript, superscript
// ---------------------------------------------------------------------------

import type {
  IRunPropertiesOptions,
  ParagraphChild,
} from 'docx'
import {
  ExternalHyperlink,
  ShadingType,
  TextRun,
} from 'docx'
import type { TiptapMark, Writable } from './types.js'

// ---------------------------------------------------------------------------
// Helper: CSS colour string → six-digit hex WITHOUT leading "#"
// Accepts: "#rgb", "#rrggbb", "rgb(r,g,b)", named colours (not resolved here)
// ---------------------------------------------------------------------------
function cssColorToHex(value: string): string | undefined {
  if (!value) return undefined

  const clean = value.trim()

  // Already #rrggbb or #rgb
  if (clean.startsWith('#')) {
    const hex = clean.slice(1)
    if (hex.length === 6) return hex.toUpperCase()
    if (hex.length === 3) {
      return (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]).toUpperCase()
    }
    return undefined
  }

  // rgb(r, g, b) / rgba(r, g, b, a)
  const rgbMatch = clean.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch
    return (
      parseInt(r).toString(16).padStart(2, '0') +
      parseInt(g).toString(16).padStart(2, '0') +
      parseInt(b).toString(16).padStart(2, '0')
    ).toUpperCase()
  }

  return undefined
}

// ---------------------------------------------------------------------------
// Helper: CSS font-size string → half-points (docx `size` field)
// Accepts "12px", "1em", "14pt", bare number (treated as pt)
// ---------------------------------------------------------------------------
function cssFontSizeToHalfPoints(value: string | number): number | undefined {
  if (value === null || value === undefined) return undefined
  const str = String(value).trim()
  const numMatch = str.match(/^([\d.]+)\s*(px|pt|em|rem)?$/i)
  if (!numMatch) return undefined
  const num = parseFloat(numMatch[1])
  const unit = (numMatch[2] || 'pt').toLowerCase()
  let points: number
  if (unit === 'px') {
    points = num * 0.75
  } else if (unit === 'em' || unit === 'rem') {
    points = num * 12 // assume 12pt base
  } else {
    points = num // already pt
  }
  return Math.round(points * 2) // half-points
}

// ---------------------------------------------------------------------------
// Convert an array of marks to merged IRunPropertiesOptions
// Returns { runProps, isLink, linkHref } so the caller can wrap in Hyperlink
// ---------------------------------------------------------------------------
export interface MarksResult {
  runProps: IRunPropertiesOptions
  isLink: boolean
  linkHref?: string
}

// Mutable working type so we can build props incrementally
type RunPropsPatch = {
  [K in keyof IRunPropertiesOptions]: IRunPropertiesOptions[K];
}

export function marksToRunProps(marks: TiptapMark[] | undefined): MarksResult {
  // Build as a plain mutable object, then return as IRunPropertiesOptions
  const patch: Partial<Writable<RunPropsPatch>> = {}
  let isLink = false
  let linkHref: string | undefined

  if (!marks || marks.length === 0) {
    return { runProps: patch as IRunPropertiesOptions, isLink, linkHref }
  }

  for (const mark of marks) {
    switch (mark.type) {
      case 'bold':
        patch.bold = true
        break

      case 'italic':
        patch.italics = true
        break

      case 'underline':
        patch.underline = { type: 'single' }
        break

      case 'strike':
        patch.strike = true
        break

      case 'code':
        patch.style = 'VerbatimChar'
        break

      case 'subscript':
        patch.subScript = true
        break

      case 'superscript':
        patch.superScript = true
        break

      case 'highlight': {
        // TipTap Highlight attrs: { color: "#ffff00" } or no attrs (yellow)
        const color =
          mark.attrs?.color
            ? cssColorToHex(mark.attrs.color)
            : 'FFFF00'
        if (color) {
          patch.shading = {
            type: ShadingType.CLEAR,
            fill: color,
          }
        }
        break
      }

      case 'textStyle': {
        // TipTap TextStyle attrs: { color, fontSize, fontFamily }
        const attrs = mark.attrs ?? {}
        if (attrs.color) {
          const hex = cssColorToHex(attrs.color)
          if (hex) patch.color = hex
        }
        if (attrs.fontSize) {
          const hp = cssFontSizeToHalfPoints(attrs.fontSize)
          if (hp) patch.size = hp
        }
        if (attrs.fontFamily) {
          patch.font = attrs.fontFamily
        }
        break
      }

      case 'link': {
        isLink = true
        linkHref = mark.attrs?.href ?? ''
        patch.style = 'Hyperlink'
        break
      }

      default:
        // Unknown mark – ignore
        break
    }
  }

  return { runProps: patch as IRunPropertiesOptions, isLink, linkHref }
}

// ---------------------------------------------------------------------------
// Build inline DocxJS children (TextRun / ExternalHyperlink) from a text node
// ---------------------------------------------------------------------------
export function textNodeToChildren(
  text: string,
  marks: TiptapMark[] | undefined,
): ParagraphChild[] {
  const { runProps, isLink, linkHref } = marksToRunProps(marks)

  // Split hard-break characters into multiple runs (shouldn't normally occur
  // inside a text node – hard breaks are separate nodes – but just in case).
  const textRun = new TextRun({ ...runProps, text })

  if (isLink && linkHref !== undefined) {
    return [
      new ExternalHyperlink({
        link: linkHref,
        children: [textRun],
      }),
    ]
  }

  return [textRun]
}
