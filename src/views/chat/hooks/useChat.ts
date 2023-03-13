import { useChatStore } from '@/store'

export function useChat() {
  const chatStore = useChatStore()

  const getChatByUuidAndIndex = (uuid: string, index: number) => {
    return chatStore.getChatByUuidAndIndex(uuid, index)
  }

  const addChat = (uuid: string, chat: Chat.Chat) => {
    chatStore.addChatByUuid(uuid, chat)
  }

  const updateChat = (uuid: string, index: number, chat: Chat.Chat) => {
    console.warn(uuid, index, chat)
    chatStore.updateChatByUuid(uuid, index, chat)
  }

  const updateChatPartial = (uuid: string, index: number, chat: Partial<Chat.Chat>) => {
    chatStore.updateChatPartialByUuid(uuid, index, chat)
  }

  return {
    addChat,
    updateChat,
    updateChatPartial,
    getChatByUuidAndIndex,
  }
}
