// based on https://github.com/rocicorp/mono/tree/main/packages/zero-solid

import type {
  DefaultSchema,
  HumanReadable,
  PullRow,
  QueryOrQueryRequest,
  ReadonlyJSONValue,
  Schema,
  TTL,
} from '@rocicorp/zero'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'
import type { QueryError, QueryStatus, VueView } from './view'

import { addContextToQuery, asQueryInternals } from '@rocicorp/zero/bindings'
import {
  computed,
  onScopeDispose,
  shallowRef,
  toRaw,
  toValue,
  watch,
  watchEffect,
} from 'vue'
import { vueViewFactory } from './view'
import { zRef } from 'src/utils/zero-session'
import type { Context } from 'app/src-shared/utils/types'

const DEFAULT_TTL_MS = 1_000 * 60 * 5

export interface UseQueryOptions<EmptyValue> {
  ttl?: TTL | undefined
  emptyValue?: EmptyValue
  onNotFound?: () => void
}

export interface QueryResult<TReturn> {
  data: ComputedRef<TReturn>
  status: ComputedRef<QueryStatus>
  error: ComputedRef<QueryError & { retry: () => void } | undefined>
}

export function useQuery<
  TTable extends keyof TSchema['tables'] & string,
  TInput extends ReadonlyJSONValue | undefined,
  TOutput extends ReadonlyJSONValue | undefined,
  TSchema extends Schema = DefaultSchema,
  TReturn = PullRow<TTable, TSchema>,
  TEmpty = undefined,
>(
  query: MaybeRefOrGetter<QueryOrQueryRequest<TTable, TInput, TOutput, TSchema, TReturn, Context>>,
  options?: MaybeRefOrGetter<UseQueryOptions<TEmpty>>,
): QueryResult<HumanReadable<TReturn>>
export function useQuery<
  TTable extends keyof TSchema['tables'] & string,
  TInput extends ReadonlyJSONValue | undefined,
  TOutput extends ReadonlyJSONValue | undefined,
  TSchema extends Schema = DefaultSchema,
  TReturn = PullRow<TTable, TSchema>,
  TEmpty = undefined,
>(
  query: MaybeRefOrGetter<QueryOrQueryRequest<TTable, TInput, TOutput, TSchema, TReturn, Context> | null>,
  options?: MaybeRefOrGetter<UseQueryOptions<TEmpty>>,
): QueryResult<HumanReadable<TReturn> | TEmpty>
export function useQuery<
  TTable extends keyof TSchema['tables'] & string,
  TInput extends ReadonlyJSONValue | undefined,
  TOutput extends ReadonlyJSONValue | undefined,
  TSchema extends Schema = DefaultSchema,
  TReturn = PullRow<TTable, TSchema>,
  TEmpty = undefined,
>(
  query: MaybeRefOrGetter<QueryOrQueryRequest<TTable, TInput, TOutput, TSchema, TReturn, Context> | null>,
  options?: MaybeRefOrGetter<UseQueryOptions<TEmpty>>,
): QueryResult<HumanReadable<TReturn> | TEmpty> {
  const ttl = computed(() => toValue(options)?.ttl ?? DEFAULT_TTL_MS)
  const view = shallowRef<VueView | null>(null)
  const refetchKey = shallowRef(0)

  const q = shallowRef()
  watch(
    [
      () => toValue(query),
      zRef,
    ],
    ([query, z]) => {
      q.value = query && addContextToQuery(query, toRaw(z).context)
    },
    { immediate: true },
  )

  const qi = computed(() => q.value && asQueryInternals(q.value))
  const hash = computed(() => qi.value?.hash())

  watch(
    [
      zRef,
      hash,
      refetchKey,
    ],
    ([z]) => {
      view.value?.destroy()
      if (!q.value) {
        view.value = null
        return
      }
      view.value = toRaw(z).materialize(toValue(q), vueViewFactory, { ttl: toValue(ttl) })
    },
    { immediate: true },
  )

  watch(ttl, (ttl) => {
    toValue(view)?.updateTTL(ttl)
  })

  onScopeDispose(() => {
    view.value?.destroy()
  })

  watchEffect(() => {
    !view.value?.data && view.value?.status === 'complete' && toValue(options)?.onNotFound?.()
  })

  return {
    data: computed(() => (view.value?.data ?? toValue(options)?.emptyValue) as HumanReadable<TReturn> | TEmpty),
    status: computed(() => view.value?.status ?? 'unknown'),
    error: computed(() => view.value?.error
      ? {
          retry: () => { refetchKey.value++ },
          ...view.value.error,
        }
      : undefined,
    ),
  }
}
