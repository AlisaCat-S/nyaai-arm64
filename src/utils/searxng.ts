import ky from 'ky'

const SearxngBaseURL = 'https://searxng.ai-nya.com/search'

interface SearchOptions {
  q: string
  engines?: string
  timeRange?: string
  language?: string
}

interface SearchResult {
  title: string
  url: string
  content: string
  publishedDate: string
  thumbnail: string
  engine: string
}

export async function search({ q, engines, timeRange, language }: SearchOptions): Promise<SearchResult[]> {
  const url = new URL(SearxngBaseURL, location.origin)
  url.searchParams.set('format', 'json')
  url.searchParams.set('q', q)
  engines && url.searchParams.set('engines', engines)
  timeRange && url.searchParams.set('time_range', timeRange)
  language && url.searchParams.set('language', language)
  const { results } = await ky.get(url).json<any>()
  return results.map(({ title, url, content, publishedDate, thumbnail, engine }) => ({
    title,
    url,
    content,
    publishedDate,
    thumbnail,
    engine,
  }))
}
