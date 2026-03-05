import type { Ref } from 'vue'
import { computed } from 'vue'

interface PerfState<T> {
  value: T
  outerValue: T
  modifiedIn: number | null
}

export type PerfsState<T extends object> = {
  [K in keyof T]: PerfState<T[K]>
}

export function usePerfsState<T extends object>(
  sources: Ref<Partial<T>[]>,
  defaultValue: T,
  emptyValues: any[] = [undefined],
) {
  const state = computed(() => Object.fromEntries(Object.entries(defaultValue).map(([k, v]) =>
    [k, sources.value.reduce((acc, cur, i) => {
      acc.outerValue = acc.value
      if (!emptyValues.includes(cur[k])) {
        acc.value = cur[k]
        acc.modifiedIn = i
      }
      return acc
    }, { value: v, outerValue: v, modifiedIn: null } as PerfState<T[keyof T]>)],
  )) as PerfsState<T>)
  const perfs = computed(() => Object.fromEntries(Object.entries(state.value).map(
    ([k, v]: [string, any]) => [k, v.value],
  )) as T)
  return { state, perfs }
}
