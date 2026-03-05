import { reactive } from 'vue'

export interface Task<T = any> {
  id: string
  title: string
  link?: string
  promise: Promise<T>
  status: 'running' | 'completed' | 'failed' | 'aborted'
  progress?: number
  progressText?: string
  errorText?: string
  abort(): void
}

interface Ctx {
  abortSignal: AbortSignal
  updateProgress(updates: Pick<Task, 'progress' | 'progressText'>): void
}

type TaskInit = Pick<Task, 'id' | 'title' | 'link'>

export const tasks = reactive<Task[]>([])

export function createTask<A extends any[], R>(
  { id, title, link }: TaskInit,
  fn: (ctx: Ctx, ...args: A) => Promise<R>,
  ...args: A
): Task<R> {
  const abortController = new AbortController()
  const promise = fn({
    abortSignal: abortController.signal,
    updateProgress: (updates: Pick<Task, 'progress' | 'progressText'>) => {
      Object.assign(task, updates)
    },
  }, ...args)
  const task: Task<R> = reactive({
    id,
    title,
    link,
    promise,
    status: 'running',
    abort: () => {
      abortController.abort()
      task.status = 'aborted'
    },
  })
  tasks.push(task)
  promise.then(() => {
    task.status = 'completed'
  }).catch(err => {
    task.errorText = err.message
    if (task.status === 'aborted') return
    task.status = 'failed'
  })
  return task
}

export function withTask<A extends any[], R>(fn: (ctx: Ctx, ...args: A) => Promise<R>) {
  return (taskInit: TaskInit, ...args: A) => createTask(taskInit, fn, ...args)
}

export function removeTask(task: Task) {
  tasks.splice(tasks.indexOf(task), 1)
}
