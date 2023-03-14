import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import axios from 'axios'
import { post } from '@/utils/request'

const baseURL = import.meta.env.VITE_GLOB_API_URL

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
  return post<T>({
    url: '/chat',
    data: { regenerate, prompt, options, sessionUuid, chatUuid },
  })
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

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export const getChatSessionsByUserId = async (userId: number) => {
  try {
    const response = await axios.get(`${baseURL}/chat_sessions/users/${userId}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteChatSession = async (uuid: string) => {
  try {
    const response = await axios.delete(`${baseURL}/uuid/chat_sessions/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const createChatSession = async (uuid: string, name: string) => {
  try {
    const response = await axios.post(`${baseURL}/uuid/chat_sessions`, {
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
    const response = await axios.put(`${baseURL}/uuid/chat_sessions/${uuid}`, { topic: name })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const deleteChatMessage = async (uuid: string) => {
  try {
    const response = await axios.delete(`${baseURL}/uuid/chat_messages/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

export const getChatMessagesBySessionUUID = async (uuid: string) => {
  try {
    const response = await axios.get(`${baseURL}/uuid/chat_messages/chat_sessions/${uuid}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// getUserActiveChatSession
export const getUserActiveChatSession = async (userId: number) => {
  try {
    const response = await axios.get(`${baseURL}/uuid/user_active_chat_session/${userId}`)
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// createOrUpdateUserActiveChatSession
export const createOrUpdateUserActiveChatSession = async (userId: number, chatSessionUuid: string) => {
  try {
    const response = await axios.put(`${baseURL}/uuid/user_active_chat_session`, {
      chatSessionUuid,
      userId,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// postUserActiveChatSession
export const postUserActiveChatSession = async (userId: number, chatSessionUuid: string) => {
  try {
    const response = await axios.post(`${baseURL}/uuid/user_active_chat_session`, {
      chatSessionUuid,
      userId,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}

// putUserActiveChatSession
export const putUserActiveChatSession = async (userId: number, chatSessionUuid: string) => {
  try {
    const response = await axios.put(`${baseURL}/uuid/user_active_chat_session/${userId}`, {
      chatSessionUuid,
    })
    return response.data
  }
  catch (error) {
    console.error(error)
    throw error
  }
}
