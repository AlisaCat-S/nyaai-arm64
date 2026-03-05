import type { LanguageModel } from 'ai'
import type { Avatar } from 'app/src-shared/utils/validators'
import ky from 'ky'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { t } from 'src/utils/i18n'
import type { InferSchema, ObjectSchema } from './types'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export interface ProviderType<S extends ObjectSchema> {
  label: string
  description?: string
  avatar: Avatar
  schema: S
  initialSettings?: Partial<InferSchema<S>>
  getModelList?: (settings: InferSchema<S>) => Promise<string[]>
  model: {
    language: (settings: InferSchema<S>, model: string) => LanguageModel
  }
}

function providerType<S extends ObjectSchema>(pt: ProviderType<S>) {
  return pt
}

async function getModelListCompatible({ baseURL, apiKey }: InferSchema<typeof commonSchema>) {
  const { data } = await ky.get(`${baseURL}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  }).json<any>()
  return data.map(m => m.id)
}

const BaseURLs = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  google: 'https://generativelanguage.googleapis.com/v1beta',
  ollama: 'http://localhost:11434/api',
  openrouter: 'https://openrouter.ai/api/v1',
}

const commonSchema = {
  baseURL: {
    type: 'string',
    format: 'url',
    title: t('API Address'),
    width: '225px',
  },
  apiKey: {
    type: 'string',
    title: 'API Key',
    format: 'password',
    width: '225px',
  },
} satisfies ObjectSchema

export const providerTypes = {
  'openai-compatible': providerType({
    label: 'OpenAI Compatible',
    avatar: { type: 'svg', name: 'openai', hue: 160 },
    schema: {
      ...commonSchema,
      baseURL: {
        ...commonSchema.baseURL,
        placeholder: BaseURLs.openai,
      },
    },
    getModelList: ({ baseURL, apiKey }) => getModelListCompatible({ baseURL: baseURL ?? BaseURLs.openai, apiKey }),
    model: {
      language: (settings, model) => createOpenAICompatible({
        name: 'openai-compatible',
        includeUsage: true,
        ...settings,
        baseURL: settings.baseURL ?? BaseURLs.openai,
      }).languageModel(model),
    },
  }),
  openai: providerType({
    label: 'OpenAI',
    avatar: { type: 'svg', name: 'openai' },
    schema: {
      ...commonSchema,
      baseURL: {
        ...commonSchema.baseURL,
        placeholder: BaseURLs.openai,
      },
      responsesApi: {
        type: 'boolean',
        title: t('Use Responses API'),
      },
    },
    initialSettings: {
      responsesApi: true,
    },
    getModelList: ({ baseURL, apiKey }) => getModelListCompatible({ baseURL: baseURL ?? BaseURLs.openai, apiKey }),
    model: {
      language: (settings, model) => {
        const openai = createOpenAI(settings)
        return settings.responsesApi ? openai.responses(model) : openai.chat(model)
      },
    },
  }),
  anthropic: providerType({
    label: 'Anthropic',
    avatar: { type: 'svg', name: 'anthropic' },
    schema: {
      ...commonSchema,
      baseURL: {
        ...commonSchema.baseURL,
        placeholder: BaseURLs.anthropic,
      },
    },
    getModelList: async (settings) => {
      const { baseURL = BaseURLs.anthropic } = settings
      if (!settings.apiKey) throw new Error(t('Please enter API key'))
      const { data } = await ky.get(`${baseURL}/models`, {
        headers: {
          'x-api-key': settings.apiKey,
          'anthropic-version': '2023-06-01',
        },
      }).json<any>()
      return data.map(m => m.id)
    },
    model: {
      language: (settings, model) => createAnthropic(settings).languageModel(model),
    },
  }),
  google: providerType({
    label: 'Google',
    avatar: { type: 'svg', name: 'google-c' },
    schema: {
      ...commonSchema,
      baseURL: {
        ...commonSchema.baseURL,
        placeholder: BaseURLs.google,
      },
    },
    getModelList: async (settings) => {
      const { baseURL = BaseURLs.google } = settings
      if (!settings.apiKey) throw new Error(t('Please enter API key'))
      const { models } = await ky.get(`${baseURL}/models`, {
        headers: {
          'x-goog-api-key': settings.apiKey,
        },
      }).json<any>()
      return models
        .filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => m.name.split('/').at(-1))
    },
    model: {
      language: (settings, model) => createGoogleGenerativeAI(settings).languageModel(model),
    },
  }),
}
export type ProviderTypeKeys = keyof typeof providerTypes

export const translationLanguageOptions = [
  'en-US',
  'es-ES',
  'fr-FR',
  'de-DE',
  'it-IT',
  'pt-BR',
  'ru-RU',
  'zh-CN',
  'zh-TW',
  'ja-JP',
  'ko-KR',
]
