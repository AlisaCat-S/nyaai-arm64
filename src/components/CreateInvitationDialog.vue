<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    no-refocus
  >
    <q-card style="width: min(90vw, 400px)">
      <q-card-section>
        <div class="text-h6">
          {{ t('Create Invitation Link') }}
        </div>
      </q-card-section>
      <q-card-section p-0>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>{{ t('Role') }}</q-item-label>
              <q-item-label caption>
                {{ t('What role will the new member be?') }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-select
                v-model="role"
                :options="[
                  { label: t('Guest'), value: 'guest', caption: t('Can read all content in the workspace') },
                  { label: t('Member'), value: 'member', caption: t('Can read and write all content in the workspace') },
                  { label: t('Admin'), value: 'admin', caption: t('Can read and write content, manage workspace members and settings') },
                ]"
                emit-value
                map-options
                dense
                class="w-100px"
              >
                <template #option="{ opt: { label, caption }, itemProps }">
                  <q-item
                    v-bind="itemProps"
                    w="250px"
                  >
                    <q-item-section>
                      <q-item-label>
                        {{ label }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ caption }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ t('Seats') }}
              </q-item-label>
              <q-item-label caption>
                {{ t('How many people can join with this link?') }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-input
                v-model.number="seats"
                type="number"
                dense
                class="w-100px"
              />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label>
                {{ t('Validity Period') }}
              </q-item-label>
              <q-item-label caption>
                {{ t('How long will this link be valid?') }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-input
                v-model.number="validityHours"
                type="number"
                dense
                :suffix="t('Hours')"
                class="w-100px"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          :label="t('Cancel')"
          @click="onDialogCancel"
        />
        <q-btn
          flat
          color="primary"
          :label="t('Create')"
          @click="createLink"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { t } from 'src/utils/i18n'
import { ref } from 'vue'
import type { WorkspaceRole } from 'app/src-shared/utils/validators'
import { mutate } from 'src/utils/zero-session'
import { mutators } from 'app/src-shared/mutators'
import { randomId } from 'app/src-shared/utils/id'
import { useWorkspaceStore } from 'src/stores/workspace'

defineEmits([
  ...useDialogPluginComponent.emits,
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const role = ref<Exclude<WorkspaceRole, 'owner'>>('member')
const seats = ref(1)
const validityHours = ref<number>(1)

const workspaceStore = useWorkspaceStore()

async function createLink() {
  const token = randomId()
  await mutate(mutators.createInvitation({
    token,
    workspaceId: workspaceStore.id!,
    role: role.value,
    expiresAt: Date.now() + validityHours.value * 60 * 60 * 1000,
    remainingSeats: seats.value,
  })).client
  onDialogOK(token)
}
</script>
