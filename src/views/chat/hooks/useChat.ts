import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: number, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: number, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: number, index: number, chat: Chat.Chat) => {
    console.warn(uuid, index, chat)
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatPartial = (uuid: number, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatPartialByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatPartial,
    getChatByUuidAndIndex,
  }
}
