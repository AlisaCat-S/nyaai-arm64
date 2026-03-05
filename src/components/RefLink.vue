<template>
  <span
    inline-flex
    items-center
    align-mid
    h="1.2em"
    mx="0.4em"
    px="0.4em"
    bg-sur-c
    hover:bg-sur-dim
    transition="background-color 250"
    cursor-pointer
    rd-full
    @click="onClick"
  >
    <q-icon name="sym_o_link" />
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
}>()

function onClick() {
  const target = document.querySelector(`.search-result[data-index="${props.to}"]`)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    target.classList.add('bg-sur-c')
    setTimeout(() => {
      document.addEventListener('click', () => {
        target.classList.remove('bg-sur-c')
      }, { once: true })
    }, 0)
  }
}
</script>
