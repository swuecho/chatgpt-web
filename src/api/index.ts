import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    sessionUuid: number
    chatUuid: number
    prompt: string
    regenerate: boolean
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  return post<T>({
    url: '/chat_process',
    data: {
      sessionUuid: params.sessionUuid,
      chatUuid: params.chatUuid,
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
