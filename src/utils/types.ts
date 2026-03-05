export type Writable<T> = {
  -readonly [P in keyof T]: T[P]
}

export interface SettingsScope {
  label: string
  to: any
}

type MetaProps = {
  title: string
  description?: string
}
type StringSchema = {
  type: 'string'
  format?: 'email' | 'password' | 'url'
  placeholder?: string
  width?: string
} & MetaProps
type NumberSchema = {
  type: 'number'
  placeholder?: string
} & MetaProps
type BooleanSchema = {
  type: 'boolean'
} & MetaProps

export type TypeSchema = StringSchema | NumberSchema | BooleanSchema
export type ObjectSchema = Record<string, TypeSchema>

type SchemaPrimitive<T extends TypeSchema> =
  T extends { type: 'string' } ? string :
    T extends { type: 'number' } ? number :
      T extends { type: 'boolean' } ? boolean :
        never

export type InferSchema<S> =
  S extends ObjectSchema ? { [K in keyof S]: InferSchema<S[K]> } :
    S extends TypeSchema ? SchemaPrimitive<S> | undefined :
      never

export type LayoutPosition = 'full' | 'left' | 'right'

export interface ShortcutKey {
  key: string
  withCtrl?: boolean
  withShift?: boolean
  withAlt?: boolean
  withMeta?: boolean
}
