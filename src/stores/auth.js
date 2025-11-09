// src/stores/auth.js
import { defineStore } from 'pinia'
import {
    login as apiLogin,
    profile as apiProfile,
    setTokens,
    restoreTokensFromStorage,
    clearTokens
} from '@/services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        initialized: false
    }),
    getters: {
        isAuthed: (s) => !!s.user
    },
    actions: {
        async ensureAuth() {
            // Не трогаем сервер, если токена нет — избежим лишнего 401
            const { access } = restoreTokensFromStorage()
            if (!access) {
                this.initialized = true
                return
            }
            const me = await apiProfile()
            if (me.ok) this.user = me.data
            else clearTokens() // токен неисправен — чистим
            this.initialized = true
        },

        async login(email, password) {
            const res = await apiLogin(email, password)
            if (!res.ok) return { ok: false, data: res.data }

            // Бэкенд отдал JWT и user
            const { access, refresh, user } = res.data || {}
            setTokens({ access, refresh })
            this.user = user || null
            return { ok: true }
        },

        logout() {
            this.user = null
            clearTokens()
            // если добавишь серверный logout — дерни его тут
        }
    }
})
