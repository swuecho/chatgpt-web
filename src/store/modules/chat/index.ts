import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

import { getLocalState, setLocalState } from './helper'
import { router } from '@/router'
import { createChatSession, deleteChatMessage, deleteChatSession, getChatHistory, getChatSessionsByUserId, renameChatSession } from '@/api'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(),

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },

    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: string) => {
        if (uuid)
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
        return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    async syncHistory() {
      const sessions = await getChatSessionsByUserId(0)
      if (sessions.length <= 0)
        return

      this.history = []
      this.chat = []
      await sessions.forEach(async (r: Chat.History) => {
        this.history.unshift(r)
        const chatData = await getChatHistory(r.uuid)
        // chatData.uuid = chatData?.uuid
        this.chat.unshift({ uuid: r.uuid, data: chatData })
      })
      if (this.history.length === 0) {
        const uuid = uuidv4()
        this.addHistory({ title: 'New Chat', isEdit: false, uuid })
      }

      this.active = this.history[0].uuid
      this.reloadRoute(this.active)
    },
    addHistory(history: Chat.History, chatData: Chat.Chat[] = []) {
      createChatSession(history.uuid, history.title)
      this.history.unshift(history)
      this.chat.unshift({ uuid: history.uuid, data: chatData })
      this.active = history.uuid
      this.reloadRoute(history.uuid)
    },

    updateHistory(uuid: string, edit: Partial<Chat.History>) {
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.recordState()
        renameChatSession(this.history[index].uuid, this.history[index].title)
      }
    },

    async deleteHistory(index: number) {
      deleteChatSession(this.history[index].uuid)
      this.history.splice(index, 1)
      this.chat.splice(index, 1)

      if (this.history.length === 0) {
        this.active = null
        this.reloadRoute()
        return
      }

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
        return
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          this.active = uuid
          this.reloadRoute(uuid)
        }
      }

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
      }
    },

    async setActive(uuid: string) {
      this.active = uuid
      return await this.reloadRoute(uuid)
    },

    getChatByUuidAndIndex(uuid: string, index: number) {
      if (!uuid) {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    addChatByUuid(uuid: string, chat: Chat.Chat) {
      if (!uuid) {
        if (this.history.length === 0) {
          const uuid = uuidv4()
          createChatSession(uuid, chat.text)
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === 'New Chat') {
            this.history[0].title = chat.text
            renameChatSession(this.history[0].uuid, chat.text.substring(0, 20))
          }
          this.recordState()
        }
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[0].title === 'New Chat') {
          this.history[0].title = chat.text
          renameChatSession(this.history[0].uuid, chat.text.substring(0, 20))
        }
        this.recordState()
      }
    },

    updateChatByUuid(uuid: string, index: number, chat: Chat.Chat) {
      if (!uuid) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        this.recordState()
      }
    },

    updateChatPartialByUuid(uuid: string, index: number, chat: Partial<Chat.Chat>) {
      if (!uuid) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    async deleteChatByUuid(uuid: string, index: number) {
      if (!uuid) {
        if (this.chat.length) {
          const chatData = this.chat[0].data
          if (chatData)
            await deleteChatMessage(chatData[index].toString())
          chatData.splice(index, 1)
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        const chatData = this.chat[chatIndex].data
        if (chatData)
          await deleteChatMessage(chatData[index]?.uuid.toString())
        chatData.splice(index, 1)
        this.recordState()
      }
    },

    clearChatByUuid(uuid: string) {
      if (!uuid) {
        if (this.chat.length) {
          this.chat[0].data = []
          this.history[0].title = 'New Chat'
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.history[index].title = 'New Chat'
        this.recordState()
      }
    },

    async reloadRoute(uuid?: string) {
      this.recordState()
      await router.push({ name: 'Chat', params: { uuid } })
    },

    recordState() {
      setLocalState(this.$state)
    },
  },
})
