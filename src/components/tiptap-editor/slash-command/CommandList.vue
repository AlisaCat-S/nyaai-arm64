<template>
  <q-list
    bg-sur-c
    shadow-default
  >
    <template v-if="items.length">
      <menu-item
        :class="{ 'bg-sur-dim': index === selectedIndex }"
        v-for="(item, index) in items"
        :key="index"
        @click="selectItem(index)"
        :label="item.title"
        :icon="item.icon"
      />
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MenuItem from 'src/components/MenuItem.vue'

interface Item {
  title: string
  icon: string
}

interface Props {
  items: Item[]
  command: (item: Item) => void
}

const props = defineProps<Props>()

const selectedIndex = ref(0)

watch(() => props.items, () => {
  selectedIndex.value = 0
})

const onKeyDown = ({ event }: { event: KeyboardEvent }): boolean => {
  if (event.key === 'ArrowUp') {
    upHandler()
    return true
  }

  if (event.key === 'ArrowDown') {
    downHandler()
    return true
  }

  if (event.key === 'Enter') {
    enterHandler()
    return true
  }

  return false
}

const upHandler = () => {
  selectedIndex.value = (selectedIndex.value + props.items.length - 1) % props.items.length
}

const downHandler = () => {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length
}

const enterHandler = () => {
  selectItem(selectedIndex.value)
}

const selectItem = (index: number) => {
  const item = props.items[index]

  if (item) {
    props.command(item)
  }
}

defineExpose({
  onKeyDown,
})
</script>
