// src/stores/auth.js
import { defineStore } from 'pinia';
import { accountAPI } from '@/services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        initialized: false
    }),

    getters: {
        isAuthed: (s) => !!s.user,
        userName: (s) => s.user?.first_name || 'Пользователь'
    },

    actions: {
        // Проверка авторизации при загрузке приложения
        async ensureAuth() {
            let token = null;
            try {
                token = localStorage.getItem('access_token');
            } catch (e) {
                // Safari private mode / blocked cookies
                this.initialized = true;
                return;
            }

            if (!token) {
                this.initialized = true;
                return;
            }

            console.log('📝 Access token есть');

            try {
                console.log('🌐 Запрашиваем профиль...');
                const res = await accountAPI.getProfile();
                this.user = res.data;
                console.log('✅ Профиль загружен:', this.user.email);
            } catch (err) {
                console.log('❌ Ошибка загрузки профиля:', err.response?.status);

                // ✅ ИСПРАВЛЕНО: НЕ удаляем токены!
                // Пусть interceptor сам решит что делать
                // Если interceptor не смог обновить - он сам удалит и редиректнет

                this.user = null;
            } finally {
                this.initialized = true;
            }
        },

        // Вход
        async login(email, password) {
            try {
                const res = await accountAPI.login(email, password);

                // Сохраняем токены
                try {
                    localStorage.setItem('access_token', res.data.access);
                    localStorage.setItem('refresh_token', res.data.refresh);
                } catch (e) { /* storage unavailable */ }

                // Сохраняем пользователя
                this.user = res.data.user || null;

                console.log('✅ Вход выполнен:', this.user.email);

                return { ok: true, data: res.data };
            } catch (err) {
                console.error('❌ Ошибка входа:', err.response?.data);
                return {
                    ok: false,
                    data: err.response?.data
                };
            }
        },

        // Выход (с отправкой на backend)
        async logout() {
            try {
                let refreshToken = null;
                try { refreshToken = localStorage.getItem('refresh_token'); } catch (e) { /* */ }

                if (refreshToken) {
                    // Отправляем refresh токен на сервер для блокировки
                    await accountAPI.logout(refreshToken);
                    console.log('✅ Токен заблокирован на сервере');
                }
            } catch (err) {
                // Ошибка не критична - все равно удаляем локально
                console.warn('⚠️ Не удалось заблокировать токен на сервере:', err);
            } finally {
                // В любом случае очищаем локальное хранилище
                this.user = null;
                try {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    sessionStorage.removeItem('email');
                } catch (e) { /* storage unavailable */ }
                console.log('✅ Локальные данные очищены');
            }
        }
    }
});