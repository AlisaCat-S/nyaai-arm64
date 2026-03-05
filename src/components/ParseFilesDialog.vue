<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
  >
    <q-card min-w="320px">
      <q-card-section>
        <div class="text-h6">
          {{ t('Parse Files') }}
        </div>
      </q-card-section>
      <q-card-section :class="{ 'px-0': $q.screen.xs }">
        <q-list>
          <q-item
            v-for="(file, index) in props.files"
            :key="index"
          >
            <q-item-section
              avatar
              max-w="xs:125px sm:200px"
              pr-3
            >
              <q-item-label
                text-ellipsis
                of-hidden
                whitespace-nowrap
              >
                {{ file.name }}
              </q-item-label>
              <q-item-label
                caption
                text-ellipsis
                of-hidden
                whitespace-nowrap
              >
                {{ file.type }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              v-if="parserSelected[index]?.rangeInput"
              min-w="80px"
            >
              <a-input
                v-model="rangeInputs[index]"
                :label="parserSelected[index].rangeInput.label"
                :placeholder="parserSelected[index].rangeInput.placeholder"
                :mask="parserSelected[index].rangeInput.mask"
                dense
              />
            </q-item-section>
            <q-item-section
              side
              important:pl-2
            >
              <q-select
                v-if="parserOptions[index].length"
                v-model="parserSelected[index]"
                @update:model-value="rangeInputs[index] = null"
                :options="parserOptions[index]"
                :label="t('Parser')"
                dense
              >
                <template #option="{ opt, itemProps }">
                  <q-item
                    v-bind="itemProps"
                    min-h="40px"
                  >
                    <q-item-section>
                      <q-item-label>
                        {{ opt.label }}
                      </q-item-label>
                      <q-item-label caption>
                        {{ opt.caption }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              <div
                v-else
                text-err
              >
                {{ t('No parser available for this file type') }}
              </div>
            </q-item-section>
          </q-item>
        </q-list>
        <div>
          <q-checkbox
            v-model="withFile"
            :label="t('Upload original file at the same time')"
          />
        </div>
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
          :loading="loading"
          :disable="!parserSelected.some(x => x)"
          :label="t('Parse')"
          @click="parse"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { fileParsers } from 'src/utils/file-parse'
import { mimeTypeMatch } from 'src/utils/functions'
import { t } from 'src/utils/i18n'
import { computed, reactive, ref } from 'vue'
import AInput from './AInput'

const props = defineProps<{
  files: File[]
}>()

defineEmits([
  ...useDialogPluginComponent.emits,
])

const parserOptions = computed(() => props.files.map(file =>
  fileParsers.filter(fp => mimeTypeMatch(file.type, fp.acceptTypes)),
))
const parserSelected = reactive(props.files.map((val, index) => parserOptions.value[index][0]))
const rangeInputs = reactive(props.files.map(() => null))

const loading = ref(false)
const $q = useQuasar()

async function parse() {
  loading.value = true
  const results = await Promise.all(parserSelected.map(async (parser, index) => {
    if (!parser) return []
    const file = props.files[index]
    return await parser.execute(file, {
      withFile: withFile.value,
      range: rangeInputs[index],
    }).catch(err => {
      console.error(err)
      $q.notify({
        message: t('Failed to parse "{0}": {1}', file.name, err.message),
        color: 'negative',
      })
      return []
    })
  }))
  loading.value = false
  onDialogOK(results.flat())
}

const withFile = ref(false)

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
</script>
