import { defineStore } from 'pinia'
import { loginUser, registerUser } from '../services/authService'

interface AuthState {
  token: string | null
  tokenType: string | null
  isLoggedIn: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('token'),
    tokenType: localStorage.getItem('tokenType'),
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  }),

  getters: {
    getIsLoggedIn(): boolean {
      return this.isLoggedIn
    },
    getToken(): string | null {
      return this.token
    },
    getTokenType(): string | null {
      return this.tokenType
    },
  },

  actions: {
    async register(email: string, password: string) {
      try {
        const response = await registerUser(email, password)
        this._setAuthData(response)
        return response
      } catch (error) {
        this._clearAuth()
        throw error
      }
    },

    async login(email: string, password: string) {
      try {
        const response = await loginUser(email, password)
        this._setAuthData(response)
        return response
      } catch (error) {
        this._clearAuth()
        throw error
      }
    },

    logout() {
      this._clearAuth()
    },

    _setAuthData(authData: { access_token: string; token_type: string }) {
      this.token = authData.access_token
      this.tokenType = authData.token_type
      this.isLoggedIn = true

      localStorage.setItem('token', authData.access_token)
      localStorage.setItem('tokenType', authData.token_type)
      localStorage.setItem('isLoggedIn', 'true')
    },

    _clearAuth() {
      this.token = null
      this.tokenType = null
      this.isLoggedIn = false

      localStorage.removeItem('token')
      localStorage.removeItem('tokenType')
      localStorage.removeItem('isLoggedIn')
    },
  },
})
