<template>
  <q-list
    of-y-auto
    p-2
  >
    <entity-item
      v-for="entity of entities"
      :key="entity.id"
      :entity
      max-w="600px"
      mx-a
    >
      <template #actions>
        <div flex>
          <copy-btn
            :title="t('Copy Link')"
            icon="sym_o_link"
            :value="getLink(entity)"
            flat
            round
            size="sm"
          />
          <q-btn
            :title="t('Open')"
            icon="sym_o_open_in_new"
            flat
            round
            size="sm"
            :to="entityRoute(entity.type, entity.id)"
          />
          <q-btn
            :title="t('Unpublish')"
            icon="sym_o_block"
            @click="unpublish(entity)"
            flat
            round
            size="sm"
          />
        </div>
      </template>
    </entity-item>
    <q-item
      v-if="!data.length && status === 'complete'"
      min-h-0
    >
      <q-item-section text-on-sur-var>
        {{ t('There are no published items. Right-click on the items in the right sidebar to publish it to the public internet.') }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { useQuery } from 'src/composables/zero/query'
import { queries } from 'app/src-shared/queries'
import EntityItem from './EntityItem.vue'
import { computed } from 'vue'
import CopyBtn from './CopyBtn.vue'
import { entityRoute } from 'src/utils/functions'
import type { Row } from '@rocicorp/zero'
import { t } from 'src/utils/i18n'
import { useQuasar } from 'quasar'
import { mutate } from 'src/utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import { entityName } from 'src/utils/defaults'

const props = defineProps<{
  workspaceId: string
}>()

const { data, status } = useQuery(() => queries.publishedEntities(props.workspaceId))
const entities = computed(() => data.value.filter(e => e.id === e.pubRoot))

function getLink({ type, id }: Row['entity']) {
  return `${location.origin}/${type}/${id}`
}

const $q = useQuasar()
function unpublish(entity: Row['entity']) {
  $q.dialog({
    title: t('Unpublish'),
    message: t('After unpublishing it, "{0}" and all its sub-items will no longer be publicly visible.', entityName(entity)),
    cancel: true,
    ok: t('Unpublish'),
  }).onOk(() => {
    mutate(mutators.unpublishEntity(entity.id))
  })
}
</script>
