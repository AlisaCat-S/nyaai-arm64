import { computed, type Ref } from 'vue'
import { useProxy } from './state-proxy'
import { arrayToMap } from 'src/utils/functions'
import { getChatChain } from 'src/utils/chat-tools'
import type { FullChat } from 'app/src-shared/queries'

export function useChatRes(chat: Ref<FullChat>) {
  const chain = computed(() => getChatChain(chat.value))
  function getMessageAt(index: number) {
    return chain.value.at(index) ? chat.value.messages.find(m => m.id === chain.value.at(index))! : null
  }
  const streamableMessage = useProxy(computed(() => getMessageAt(-2)), 'id')
  const editableMessage = useProxy(computed(() => getMessageAt(-1)), 'id')
  const messageMap = computed(() => {
    const map = arrayToMap(chat.value.messages, m => m.id)
    if (streamableMessage.value) map[streamableMessage.value.id] = streamableMessage.value
    if (editableMessage.value) map[editableMessage.value.id] = editableMessage.value
    return map
  })
  return {
    getMessageAt,
    chain,
    messageMap,
  }
}
