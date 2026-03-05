<template>
  <q-btn
    @click="openTaskPanel"
    icon="sym_o_checklist"
    :title="t('Tasks')"
  >
    <q-badge
      v-if="runningTaskCount"
      :label="runningTaskCount"
      rounded
      floating
    />
  </q-btn>
</template>
<script lang="ts" setup>
import { t } from 'src/utils/i18n'
import { useQuasar } from 'quasar'
import TaskPanel from './TaskPanel.vue'
import { computed } from 'vue'
import { tasks } from 'src/utils/tasks'

const runningTaskCount = computed(() => tasks.filter(t => t.status === 'running').length)

const $q = useQuasar()
function openTaskPanel() {
  $q.dialog({
    component: TaskPanel,
  })
}
</script>
