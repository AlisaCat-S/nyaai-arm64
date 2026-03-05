<template>
  <common-item
    :label="t('Type')"
    :caption="t('Will open/create a item of this type')"
  >
    <entity-type-select
      v-model="model.type"
      dense
    />
  </common-item>
  <select-dir-item
    v-model="model.dirId"
    :label="t('Directory')"
    :caption="t('Will open/create a item in this directory')"
  />
  <common-item
    :label="t('Action')"
    :caption="t('The Action to perform when the shortcut is clicked')"
  >
    <q-select
      v-model="model.action"
      :options="[
        {
          label: t('Open Last Item'),
          value: 'openLast'
        },
        {
          label: t('Create New Item'),
          value: 'createNew'
        },
        {
          label: t('No Action'),
          value: null
        }
      ]"
      map-options
      emit-value
      dense
    />
  </common-item>
</template>

<script setup lang="ts">
import { t } from 'src/utils/i18n'
import CommonItem from './CommonItem.vue'
import EntityTypeSelect from './EntityTypeSelect.vue'
import type { Row } from '@rocicorp/zero'
import SelectDirItem from './SelectDirItem.vue'

const model = defineModel<Partial<Row['shortcut']>>({ required: true })
</script>
