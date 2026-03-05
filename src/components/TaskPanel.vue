<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Tasks') }}
        </div>
      </q-card-section>
      <q-card-section
        p-0
        pb-2
      >
        <q-list>
          <q-item-label
            header
            py-2
          >
            {{ t('Running') }}
          </q-item-label>
          <task-item
            v-for="task of runningTasks"
            :key="task.id"
            :task
          />
          <q-item v-if="!runningTasks.length">
            <q-item-section text-on-sur-var>
              {{ t('No running tasks') }}
            </q-item-section>
          </q-item>
          <template v-if="otherTasks.length">
            <q-separator
              spaced
              inset
            />
            <q-item-label
              header
              py-2
            >
              {{ t('Ended') }}
            </q-item-label>
            <task-item
              v-for="task of otherTasks"
              :key="task.id"
              :task
              text-on-sur-var
            />
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import { computed } from 'vue'
import { tasks } from 'src/utils/tasks'
import TaskItem from './TaskItem.vue'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide } = useDialogPluginComponent()

const runningTasks = computed(() => tasks.filter(t => t.status === 'running').reverse())
const otherTasks = computed(() => tasks.filter(t => t.status !== 'running').reverse())
</script>
