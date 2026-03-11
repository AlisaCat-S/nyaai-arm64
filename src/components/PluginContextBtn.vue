<template>
  <q-btn
    v-if="show"
    icon="sym_o_attachment"
    :title="t('Plugin Context')"
  >
    <q-menu>
      <q-list>
        <template
          v-for="(plugin, id) in plugins"
          :key="id"
        >
          <q-item-label
            header
            py-2
          >
            {{ pluginTitle(id) }}
          </q-item-label>
          <q-item
            v-for="prompt of plugin.prompts"
            :key="prompt.name"
            min-h="40px"
            clickable
            @click="callPrompt(prompt)"
            v-close-popup
            max-w="300px"
          >
            <q-item-section avatar>
              <q-icon
                name="sym_o_prompt_suggestion"
                :title="t('Prompt')"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ prompt.name }}
              </q-item-label>
              <q-item-label
                v-if="prompt.description"
                caption
                lines="2"
              >
                {{ prompt.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-for="resource of plugin.resources"
            :key="resource.uri"
            min-h="40px"
            clickable
            @click="callResource(resource)"
            v-close-popup
            max-w="300px"
          >
            <q-item-section avatar>
              <q-icon
                name="sym_o_description"
                :title="t('Resource')"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ resource.name }}
              </q-item-label>
              <q-item-label
                v-if="resource.description"
                caption
                lines="2"
              >
                {{ resource.description }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
import type { Plugins } from 'src/composables/plugins'
import { usePluginsStore } from 'src/stores/plugins'
import type { PluginPrompt, PluginResource } from 'app/src-shared/utils/types'
import PromptArgsDialog from './PromptArgsDialog.vue'
import type { GetPromptResult } from '@modelcontextprotocol/sdk/types.js'
import { base64ToUint8Array } from 'app/src-shared/utils/functions'
import { computed } from 'vue'
import { t } from 'src/utils/i18n'

const props = defineProps<{
  plugins: Plugins
}>()

const pluginsStore = usePluginsStore()

const show = computed(() => {
  return Object.values(props.plugins).some(plugin => plugin.prompts.length || plugin.resources.length)
})

function pluginTitle(id: string) {
  const plugin = pluginsStore.plugins.find(p => p.id === id)
  return plugin ? plugin.name : id
}

const $q = useQuasar()
function callPrompt(prompt: PluginPrompt) {
  function handleResult(res: GetPromptResult) {
    const files: File[] = []
    for (const { content } of res.messages) {
      if (content.type === 'text') {
        emit('addItem', {
          name: prompt.name,
          text: content.text,
        })
      } else if (content.type === 'image' || content.type === 'audio') {
        files.push(new File(
          [base64ToUint8Array(content.data)],
          `${prompt.name}.${content.mimeType.split('/')[1]}`,
          { type: content.mimeType },
        ))
      } else if (content.type === 'resource') {
        const { resource } = content
        const name = resource.uri.split('/').at(-1)!
        if ('text' in resource) {
          emit('addItem', {
            name,
            text: `<resource uri="${resource.uri}">\n${resource.text}\n</resource>`,
          })
        } else {
          files.push(new File(
            [base64ToUint8Array(resource.blob)],
            name,
            { type: resource.mimeType },
          ))
        }
      } else if (content.type === 'resource_link') {
        emit('addItem', {
          name: prompt.name,
          text: `<resource_link uri="${content.uri}" name="${content.name}" />`,
        })
      }
    }
    files.length && emit('addFiles', files)
  }
  if (prompt.arguments?.length) {
    $q.dialog({
      component: PromptArgsDialog,
      componentProps: {
        arguments: prompt.arguments,
      },
    }).onOk(args => {
      prompt.execute(args).then(handleResult)
    })
  } else {
    prompt.execute({}).then(handleResult)
  }
}
async function callResource(resource: PluginResource) {
  const res = await resource.execute()
  const files: File[] = []
  for (const content of res.contents) {
    const name = resource.uri.split('/').at(-1)!
    if ('text' in content) {
      emit('addItem', {
        name,
        text: content.text,
      })
    } else {
      files.push(new File(
        [base64ToUint8Array(content.blob)],
        name,
        { type: content.mimeType },
      ))
    }
  }
  files.length && emit('addFiles', files)
}

const emit = defineEmits<{
  addItem: [{
    name: string
    mimeType?: string
    text?: string
  }]
  addFiles: [File[]]
}>()
</script>
