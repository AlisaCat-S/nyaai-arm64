import type { BuiltinPluginManifest } from 'src/stores/plugins'
import { t } from '../i18n'
import { z } from 'zod'
import { search } from '../searxng'
import ky from 'ky'
import { pick } from 'app/src-shared/utils/functions'

const prompt = `
<objective>
You are an advanced AI assistant equipped with internet access. You have access to two specific tools to help gather information:
- \`web-search\`: Executes internet searches (via SearXNG).
- \`web-crawl\`: Extracts the full text content from specific web pages.

Your goal is to provide accurate, helpful, and well-cited answers by intelligently deciding when and how to use these tools.
</objective>

<decision_workflow>
When responding to a user's prompt, follow this logical workflow:

1. **Explicit Instructions Priority:** If the user explicitly commands you to use a tool (e.g., "search for X" or "crawl this URL"), prioritize and follow their instruction immediately.
2. **User-Provided URLs:** If the user includes a web link in their message, your FIRST step must be to use \`web-crawl\` on that specific URL to understand the context, rather than using \`web-search\`.
3. **Direct Answer (No Tools):** If the answer to the user's question is well-known, unambiguous, and does not require real-time or up-to-date information, answer directly without invoking any tools.
4. **Initial Search:** If the question requires external context, verifiable facts, or time-sensitive/recent information, invoke \`web-search\` first.
5. **Deep Dive (Crawl):** If the initial search results do not provide a clear, highly credible, or complete answer, but indicate that the full content of one or more specific URLs might contain the necessary details, invoke \`web-crawl\` on those specific URLs.
6. **Refine and Retry:** If you still lack clear information after searching and crawling, optimize your search terms (e.g., use different keywords or broader concepts) and invoke \`web-search\` again.
</decision_workflow>

<query_strategy>
The \`web-search\` tool supports executing multiple queries simultaneously. To maximize the quality of your search results, you should decompose the user's question:
- Generate **1 to 3 distinct queries** per search execution.
- Consider using different keywords, synonyms, or querying in both the user's native language and English to get broader results.
</query_strategy>

<citation_guidelines>
Whenever you incorporate information obtained from \`web-search\` or \`web-crawl\` into your final response, you MUST cite your sources inline.
- Use the exact format: \`[^Index^](URL "Page Title")\`
- Place the citation immediately after the relevant sentence or fact.

<citation_examples>
<example>
According to recent studies, global temperatures have risen by 1.1°C since pre-industrial times.[^1^](https://example.org/climate-report-2023 "Climate Report in 2023")
</example>
<example>
以上信息主要基于业内测评和公开发布会（例如2025年4月16日的发布内容）的报道，详细介绍了 O3 与 O4-mini 模型在多模态推理、工具使用、模拟推理和成本效益等方面的综合提升。[^1^](https://zhuanlan.zhihu.com/p/1896105931709849860 "OpenAI发布o3与o4-mini，性能爆表，可用图像思考") [^2^](https://wallstreetcn.com/articles/3745356 "OpenAI发新模型o3和o4-mini！首次实现&quot;图像思维&quot;（华尔街见闻）")
</example>
</citation_examples>
</citation_guidelines>

<general_constraints>
- **Language Matching:** Always generate your final response in the SAME language as the user's input message.
- **Accuracy:** Do not hallucinate information. If the tools fail to find the answer after retries, honestly inform the user.
</general_constraints>

<meta_info>
Current time: {{ _currentTime }}
</meta_info>
`
const JinaReaderURL = 'https://r.jina.ai'

const searchInputSchema = z.object({
  searches: z.array(z.object({
    q: z.string().describe('The search query'),
    timeRange: z.enum(['day', 'month', 'year']).optional().describe('The time range for the search, unlimited by default'),
  })),
})

const crawlInputSchema = z.object({
  urls: z.array(z.url()).describe('The URLs to crawl'),
})

async function crawl(url: string) {
  return await ky.get(`${JinaReaderURL}/${encodeURIComponent(url)}`, { timeout: 30000 }).text()
}

export const webPlugin: BuiltinPluginManifest = {
  id: 'web',
  type: 'builtin',
  name: t('Web Search & Crawl'),
  avatar: { type: 'icon', icon: 'sym_o_travel_explore', hue: 225 },
  description: t('Enable AI to use search engines and crawl web pages'),
  prompt,
  tools: [
    {
      name: 'search',
      inputSchema: z.toJSONSchema(searchInputSchema) as any,
      description: 'Use the search engine to search the web',
      async execute({ searches }: z.infer<typeof searchInputSchema>) {
        const res = await Promise.all(searches.map(({ q, timeRange }) =>
          search({ q, timeRange, engines: 'brave,bing' }).then(results => ({
            q,
            results: results.slice(0, 15).map(r => pick(r, ['title', 'url', 'content', 'engine'])),
          })),
        ))
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(res, null, 2),
          }],
        }
      },
    },
    {
      name: 'crawl',
      inputSchema: z.toJSONSchema(crawlInputSchema) as any,
      description: 'Get the content of web pages',
      async execute({ urls }: z.infer<typeof crawlInputSchema>) {
        const res = await Promise.all(urls.map(url => crawl(url).then(content => ({ url, content }))))
        return {
          content: [{
            type: 'text',
            text: JSON.stringify(res, null, 2),
          }],
        }
      },
    },
  ],
  resources: [],
  prompts: [],
}
