import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'

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
