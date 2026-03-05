import { debounce, throttle } from 'quasar'
import { diff, pick } from 'app/src-shared/utils/functions'
import type { Ref } from 'vue'
import { computed, onUnmounted, reactive, watch } from 'vue'

interface State<T extends object> {
  current: T
  pended: T
  mutateFn: () => void
  mutate: (() => void) & { cancel?: () => void }
}

interface Options {
  type: 'debounce' | 'throttle'
  wait: number
}

const cache = reactive<Record<string, State<object>>>(Object.create(null))

export function start<T extends object>(
  id: string,
  data: T,
  onMutate: (updates: Partial<T>) => void,
  { type, wait }: Options,
) {
  const mutateFn = () => {
    const updates = diff(cache[id].pended, cache[id].current)
    if (Object.keys(updates).length) {
      Object.assign(cache[id].pended, updates)
      onMutate(updates)
    }
  }
  const mutate = type === 'debounce' ? debounce(mutateFn, wait) : throttle(mutateFn, wait)
  cache[id] = {
    current: { ...data },
    pended: { ...data },
    mutateFn,
    mutate,
  }
}

export function update<T extends object>(id: string, updates: Partial<T>) {
  if (!cache[id]) return
  Object.assign(cache[id].current, updates)
  cache[id].mutate()
}

export function flush<T extends object>(id: string, updates?: Partial<T>) {
  if (!cache[id]) return
  cache[id].mutate.cancel?.()
  updates && Object.assign(cache[id].current, updates)
  cache[id].mutateFn()
}

export function finish<T extends object>(id: string, updates?: Partial<T>) {
  flush(id, updates)
  delete cache[id]
}

export function useProxy<T extends object>(source: Ref<T | null>, key: keyof T) {
  return computed(() => {
    const state = source.value && cache[source.value[key] as string]
    return (state ? { ...source.value, ...state.current } : source.value) as T | null
  })
}

export function useEditProxy<T extends object>(
  source: Ref<T>,
  keys: (keyof T)[],
  onMutate: (id: string, updates: Partial<T>) => void,
  options: Options,
) {
  const [key, ...dataKeys] = keys
  watch(() => pick(source.value, keys), (to, from) => {
    if (to[key] !== from?.[key]) {
      from && finish(from[key] as string)
      start(to[key] as string, pick(to, dataKeys), updates => onMutate(to[key] as string, updates), options)
    } else if (diff(to, from)) {
      const state = cache[to[key] as string]
      if (Object.keys(diff(state.pended, to)).length) {
        Object.assign(state.current, to)
        Object.assign(state.pended, to)
        state.mutate.cancel?.()
      }
    }
  }, { immediate: true })
  onUnmounted(() => {
    finish(source.value[key] as string)
  })
  return {
    value: useProxy(source, key) as Ref<T>,
    update: (updates: Partial<T>) => update(source.value[key] as string, updates),
    flush: (udpates?: Partial<T>) => flush(source.value[key] as string, udpates),
  }
}
