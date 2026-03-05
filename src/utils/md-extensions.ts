import RefLink from 'src/components/RefLink.vue'
import EntityLink from 'src/components/EntityLink.vue'
import type { Component } from 'vue'

export interface MdExtension {
  name: string
  component: Component
  selector: string
  whiteList: [string, string[]]
  wrapper: string
  parseProps: (el: HTMLElement) => object
}

export const mdExtensions: MdExtension[] = [
  {
    name: 'entityLink',
    component: EntityLink,
    selector: 'a[data-entity-id]',
    whiteList: ['a', ['data-entity-id']],
    wrapper: 'span',
    parseProps: el => ({ id: el.dataset.entityId! }),
  },
  {
    name: 'refLink',
    component: RefLink,
    selector: 'ref-link[to]',
    whiteList: ['ref-link', ['to']],
    wrapper: 'span',
    parseProps: el => ({ to: el.getAttribute('to')! }),
  },
]
