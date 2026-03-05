<template>
  <welcome-wrapper>
    <q-card
      flat
      bg-sur
      max-w="600px"
    >
      <q-card-section>
        <div class="text-h5">
          {{ t('Channel') }}
        </div>
      </q-card-section>
      <q-card-section>
        <div>
          {{ t('A channel is like a group chat for workspace members.') }}
        </div>
        <div>
          <ul
            pl-4
            my-2
          >
            <li>{{ t('For an individual, it can be used to transfer text/files between different devices.') }}</li>
            <li>{{ t('For a team, it can be used for collaborative communication.') }}</li>
            <li>{{ t('It can also be used for information archiving, as a timeline... its uses are limitless.') }}</li>
          </ul>
        </div>
        <div v-html="hint" />
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <q-item-label header>
            {{ t('Further') }}
          </q-item-label>
          <common-item
            :label="t('Invite members')"
            :caption="t('Invite your team to this workspace for collaboration.')"
            to="/workspace"
            rd
          />
        </q-list>
      </q-card-section>
    </q-card>
  </welcome-wrapper>
</template>

<script setup lang="ts">
import WelcomeWrapper from './WelcomeWrapper.vue'
import CommonItem from 'src/components/CommonItem.vue'
import { t } from 'src/utils/i18n'

const hint = t('Click <strong>"New Channel"</strong> in the right sidebar to create a channel.')
</script>
