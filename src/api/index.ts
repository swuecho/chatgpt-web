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
  sessionUuid: number,
  chatUuid: number,
  regenerate: boolean,
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
) {
  return post<T>({
    url: '/chat',
    data: { regenerate, prompt, options, sessionUuid: sessionUuid.toString(), chatUuid: chatUuid.toString() },
  })
}

export function fetchChatAPIProcess<T>(
  params: {
    sessionUuid: number
    chatUuid: number
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
