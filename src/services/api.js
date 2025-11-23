import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8007/api';

// Проверка что переменная задана (только в dev режиме)
if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
    console.warn('⚠️ VITE_API_BASE_URL не задан! Используется значение по умолчанию.');
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Флаг для предотвращения множественных запросов на refresh
let isRefreshing = false;
// Очередь запросов, ожидающих обновления токена
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// ============================================
// REQUEST INTERCEPTOR - добавляет токен
// ============================================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============================================
// RESPONSE INTERCEPTOR - обрабатывает 401 и обновляет токен
// ============================================
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log('🔴 INTERCEPTOR СРАБОТАЛ!', {
            status: error.response?.status,
            url: error.config?.url,
            message: error.response?.data
        });

        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const publicEndpoints = [
                '/account/login/',
                '/account/register/',
                '/account/check-email/',
                '/account/token/refresh/'
            ];

            if (publicEndpoints.some(ep => originalRequest.url.includes(ep))) {
                console.log('⏭️ Публичный endpoint, не обновляем токен');
                return Promise.reject(error);
            }

            if (isRefreshing) {
                console.log('⏳ Токен уже обновляется, добавляем в очередь');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return api(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
                console.log('❌ Refresh токен отсутствует!');
                localStorage.removeItem('access_token');
                isRefreshing = false;
                window.location.href = '/';
                return Promise.reject(error);
            }

            console.log('🔄 Обновляем access токен...');

            try {
                const response = await axios.post(`${API_BASE_URL}/account/token/refresh/`, {
                    refresh: refreshToken
                });

                const { access } = response.data;
                localStorage.setItem('access_token', access);
                console.log('✅ Токен успешно обновлен!');

                processQueue(null, access);

                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.log('❌ Не удалось обновить токен:', refreshError.response?.data);

                processQueue(refreshError, null);

                // Удаляем токены только если refresh провалился
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                window.location.href = '/';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

// ============================================
// API ENDPOINTS
// ============================================

export const accountAPI = {
    checkEmail: (email) => api.post('/account/check-email/', { email }),
    login: (email, password) => api.post('/account/login/', { email, password }),
    register: (data) => api.post('/account/register/', data),
    setPassword: (token, password, password_confirm, referral_token = null) => {
        const payload = { token, password, password_confirm };
        if (referral_token) {
            payload.referral_token = referral_token;
        }
        return api.post('/account/set-password/', payload);
    },
    passwordResetRequest: (email) => api.post('/account/password-reset/', { email }),
    passwordResetConfirm: (token, password, password_confirm) =>
        api.post('/account/password-reset/confirm/', { token, password, password_confirm }),
    getProfile: () => api.get('/account/profile/'),
    updateProfile: (data) => api.patch('/account/profile/', data),
    // ✅ ДОБАВЛЕНО: logout на backend
    logout: (refreshToken) => api.post('/account/logout/', { refresh: refreshToken }),
};

export const coursesAPI = {
    getAllCourses: () => api.get('/courses/'),
    getMyCourses: () => api.get('/courses/my/'),
    getCourseDetail: (courseId) => api.get(`/courses/${courseId}/`),
    getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress/`),
    getLessonDetail: (lessonId) => api.get(`/lessons/${lessonId}/`),
    completeLesson: (lessonId) => api.post(`/lessons/${lessonId}/complete/`),
    updateVideoProgress: (lessonId, data) => api.post(`/lessons/${lessonId}/video-progress/`, data),
};

export const groupsAPI = {
    getGroupInfo: (token) => axios.get(`${API_BASE_URL}/groups/info/${token}/`),
    joinGroup: (token) => api.post(`/groups/join/${token}/`),
};

export const lessonsAPI = {
    getLesson: (id) => api.get(`/lessons/${id}/`),
    updateVideoProgress: (id, data) => api.post(`/lessons/${id}/video-progress/`, data),
    completeLesson: (id) => api.post(`/lessons/${id}/complete/`),
};

export const quizzesAPI = {
    startQuiz(quizId) {
        return api.post(`/quizzes/${quizId}/start/`);
    },
    getAttempts() {
        return api.get('/quizzes/attempts/');
    },
    getAttempt(attemptId) {
        return api.get(`/quizzes/attempts/${attemptId}/`);
    },
    submitAnswers(attemptId, answers) {
        return api.post(`/quizzes/attempts/${attemptId}/submit/`, { answers });
    }
};

export const assignmentsAPI = {
    submitAssignment(assignmentId, formData) {
        return api.post(`/assignments/${assignmentId}/submit/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    getMySubmissions() {
        return api.get('/assignments/my-submissions/');
    },
    getSubmission(submissionId) {
        return api.get(`/assignments/submissions/${submissionId}/`);
    },
    addComment(submissionId, message) {
        return api.post(`/assignments/submissions/${submissionId}/comment/`, { message });
    }
};

export default api;