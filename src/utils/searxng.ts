import ky from 'ky'

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
  const { results } = await ky.get('/api/searxng', {
    searchParams: {
      q,
      engines,
      time_range: timeRange,
      language,
    },
  }).json<any>()
  return results.map(({ title, url, content, publishedDate, thumbnail, engine }) => ({
    title,
    url,
    content,
    publishedDate,
    thumbnail,
    engine,
  }))
}
