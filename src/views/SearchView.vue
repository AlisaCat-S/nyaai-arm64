<template>
  <div
    flex="~ col"
    view-styles
  >
    <div p-2>
      <common-toolbar
        bg-sur
        px-0
      >
        <form
          @submit.prevent="searchSubmit"
          grow
        >
          <q-input
            v-model="q"
            outlined
            enterkeyhint="search"
            dense
          />
        </form>
      </common-toolbar>
      <div flex>
        <q-pagination
          v-if="search.records.length > 1"
          :model-value="search.currentIndex + 1"
          @update:model-value="switchRecord($event - 1)"
          :max="search.records.length"
          input
          :boundary-links="false"
        />
        <q-space />
        <model-select
          :model-value="conf.chatModelId"
          @update:model-value="switchModel($event)"
          :workspace-id="workspaceStore.id"
          dense
        />
      </div>
    </div>
    <div
      v-if="record?.results"
      of-auto
      grow
    >
      <div
        v-for="(item, index) in record.results"
        :key="item.url"
        p-4
        transition="background-color 250"
        class="search-result"
        :data-index="index"
      >
        <div flex>
          <img
            :src="getFavicon(item.url)"
            size="20px"
            mr-2
          >
          <div
            text="on-sur-var ellipsis"
            of-hidden
            whitespace-nowrap
          >
            {{ decodeURI(item.url) }}
          </div>
        </div>
        <a
          un-text="lg pri visited:sec"
          :href="item.url"
          target="_blank"
          block
          my-1
          class="result-item-title"
        >
          {{ item.title }}
        </a>
        <div
          text-sm
          class="result-item-content"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch, watchEffect } from 'vue'
import Mark from 'mark.js'
import { createSearchRecord } from 'src/services/create-search'
import { type SearchWithRecords } from 'app/src-shared/queries'
import { mutate } from 'src/utils/zero-session'
import { useThisEntityConf } from 'src/composables/entity-conf'
import { mutators } from 'app/src-shared/mutators'
import { getFavicon } from 'src/utils/functions'
import { useRouter } from 'vue-router'
import ModelSelect from 'src/components/ModelSelect.vue'
import CommonToolbar from 'src/components/CommonToolbar.vue'
import { useWorkspaceStore } from 'src/stores/workspace'

const props = defineProps<{
  search: SearchWithRecords
}>()

const record = computed(() => props.search.records[props.search.currentIndex])

const q = ref('')
watchEffect(() => {
  q.value = record.value.q
})

async function searchSubmit() {
  const index = props.search.records.length
  await createSearchRecord(props.search.id, q.value)
  await switchRecord(index)
  await mutate(mutators.updateEntity({
    id: props.search.id,
    name: q.value,
  })).client
}

watch(() => record.value.results, val => val && mark(record.value.q))

function mark(text: string) {
  nextTick(() => {
    const instance = new Mark(document.querySelectorAll('.result-item-title, .result-item-content'))
    instance.unmark({
      done() {
        instance.mark(text, { element: 'strong' })
      },
    })
  })
}

const { conf } = useThisEntityConf()

function switchModel(id: string | null) {
  mutate(mutators.updateEntityConf({
    id: props.search.id,
    updates: { chatModelId: id },
  }))
}

async function switchRecord(index: number) {
  await mutate(mutators.updateSearch({
    id: props.search.id,
    currentIndex: index,
  })).client
}

const router = useRouter()
watch(() => record.value.id, id => {
  router.replace({
    query: {
      rightEntity: JSON.stringify({ type: 'chat', id }),
    },
  })
}, { immediate: true })

const workspaceStore = useWorkspaceStore()
</script>
