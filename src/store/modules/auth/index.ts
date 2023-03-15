import { defineStore } from 'pinia'
import { getToken, removeToken, setToken } from './helper'
import { store } from '@/store'

export interface AuthState {
  token: string | undefined
  expiresIn: number
  session: { auth: boolean }
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: getToken(),
    expiresIn: 0,
    session: { auth: true },
  }),

  actions: {
    getToken() {
      return this.token
    },
    setToken(token: string) {
      this.token = token
      setToken(token)
    },
    removeExpiresIn() {
      this.expiresIn = 0
    },
    setExpiresIn(expiresIn: number) {
      this.expiresIn = expiresIn
    },
    getExpiresIn() {
      return this.expiresIn
    },
    removeToken() {
      this.token = undefined
      removeToken()
    },
  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
