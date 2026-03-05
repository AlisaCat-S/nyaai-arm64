<template>
  <welcome-wrapper>
    <q-card
      flat
      bg-sur
      max-w="600px"
    >
      <q-card-section>
        <div class="text-h5">
          {{ t('Translation') }}
        </div>
      </q-card-section>
      <q-card-section>
        <div v-html="t('Please set your <strong>primary language</strong> and <strong>secondary language</strong> below. During translation, text in the primary language will be translated into the secondary language by default, and text in other languages will be translated into the primary language by default, eliminating the need to manually select the language each time.')" />
      </q-card-section>
      <q-card-section>
        <div
          flex
          gap-2
        >
          <autocomplete-input
            :label="t('Primary Language')"
            :options="conf.translationLanguageOptions"
            :model-value="conf.translationPrimaryLanguage"
            @update:model-value="update('translationPrimaryLanguage', $event)"
            filled
            class="flex-1"
          />
          <autocomplete-input
            :label="t('Secondary Language')"
            :options="conf.translationLanguageOptions"
            :model-value="conf.translationSecondaryLanguage"
            @update:model-value="update('translationSecondaryLanguage', $event)"
            filled
            class="flex-1"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div v-html="hint" />
      </q-card-section>
    </q-card>
  </welcome-wrapper>
</template>

<script setup lang="ts">
import AutocompleteInput from 'src/components/AutocompleteInput.vue'
import { useRootEntityConf } from 'src/composables/entity-conf'
import { t } from 'src/utils/i18n'
import WelcomeWrapper from './WelcomeWrapper.vue'

const { conf, update } = useRootEntityConf()

const hint = t('Then, click <strong>"New Translation"</strong> in the right sidebar to start translating.')
</script>
