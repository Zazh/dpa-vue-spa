// src/stores/authFlow.js
import { defineStore } from 'pinia'

export const useAuthFlowStore = defineStore('authFlow', {
    state: () => ({ email: '' }),
    actions: {
        setEmail(v) { this.email = (v || '').trim() },
        clear() { this.email = '' }
    }
})
