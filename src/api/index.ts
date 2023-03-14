import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import request from '@/utils/request/axios'
import { post } from '@/utils/request'

export function fetchChatConfig<T>() {
  return post<T>({
    url: '/config',
  })
}

export async function fetchChatAPI<T>(
  sessionUuid: string,
  chatUuid: string,
  regenerate: boolean,
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
) {
  return request.post(
    '/chat',
    { regenerate, prompt, options, sessionUuid, chatUuid },
  )
}

export function fetchChatAPIProcess<T>(
  params: {
    sessionUuid: string
    chatUuid: string
    prompt: string
    regenerate: boolean
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  return post<T>({
    url: '/chat_process',
    data: {
      sessionUuid: params.sessionUuid.toString(),
      chatUuid: params.chatUuid.toString(),
      regenerate: params.regenerate,
      prompt: params.prompt,
      options: params.options,
    },
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export async function fetchVerify(token: string) {
  try {
    const response = await request.post('/verify', { token })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const getChatSessionsByUserId = async () => {
  try {
    const response = await request.get('/chat_sessions/users')
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteChatSession = async (uuid: string) => {
  try {
    const response = await request.delete(`/uuid/chat_sessions/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const createChatSession = async (uuid: string, name: string) => {
  try {
    const response = await request.post('/uuid/chat_sessions', {
      uuid,
      topic: name,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const renameChatSession = async (uuid: string, name: string) => {
  try {
    const response = await request.put(`/uuid/chat_sessions/${uuid}`, { topic: name })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteChatMessage = async (uuid: string) => {
  try {
    const response = await request.delete(`/uuid/chat_messages/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteChatPrompt = async (uuid: string) => {
  try {
    const response = await request.delete(`/uuid/chat_prompts/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteChatData = async (chat: Chat.Chat) => {
  if (chat?.isPrompt)
    await deleteChatMessage(chat.uuid)
  else
    await deleteChatPrompt(chat.uuid)
}
export const getChatMessagesBySessionUUID = async (uuid: string) => {
  try {
    const response = await request.get(`/uuid/chat_messages/chat_sessions/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// getUserActiveChatSession
export const getUserActiveChatSession = async () => {
  try {
    const response = await request.get('/uuid/user_active_chat_session')
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// createOrUpdateUserActiveChatSession
export const createOrUpdateUserActiveChatSession = async (chatSessionUuid: string) => {
  try {
    const response = await request.put('/uuid/user_active_chat_session', {
      chatSessionUuid,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// postUserActiveChatSession
export const postUserActiveChatSession = async (chatSessionUuid: string) => {
  try {
    const response = await request.post('/uuid/user_active_chat_session', {
      chatSessionUuid,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// putUserActiveChatSession
export const putUserActiveChatSession = async (chatSessionUuid: string) => {
  try {
    const response = await request.put('/uuid/user_active_chat_session/', {
      chatSessionUuid,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}
