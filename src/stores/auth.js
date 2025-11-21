// src/stores/auth.js
import { defineStore } from 'pinia';
import { accountAPI } from '@/services/api';

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
            // Проверяем есть ли токен
            const token = localStorage.getItem('access_token');
            if (!token) {
                this.initialized = true;
                return;
            }

            try {
                const res = await accountAPI.getProfile();
                this.user = res.data;
            } catch (err) {
                // Токен невалидный - очищаем
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                this.user = null;
            }

            this.initialized = true;
        },

        async login(email, password) {
            try {
                const res = await accountAPI.login(email, password);

                // Сохраняем токены
                localStorage.setItem('access_token', res.data.access);
                localStorage.setItem('refresh_token', res.data.refresh);

                // Сохраняем пользователя
                this.user = res.data.user || null;

                return { ok: true, data: res.data };
            } catch (err) {
                return {
                    ok: false,
                    data: err.response?.data
                };
            }
        },

        logout() {
            this.user = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            sessionStorage.removeItem('email');
        }
    }
});