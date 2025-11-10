import axios from 'axios';

const API_BASE_URL = 'http://localhost:8007/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor для добавления токена
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
};

export const coursesAPI = {
    // Все курсы (каталог)
    getAllCourses: () => api.get('/courses/'),

    // Мои курсы (с прогрессом)
    getMyCourses: () => api.get('/courses/my/'),

    // Детали курса
    getCourseDetail: (courseId) => api.get(`/courses/${courseId}/`),

    // Прогресс по курсу
    getCourseProgress: (courseId) => api.get(`/courses/${courseId}/progress/`),

    // Детали урока
    getLessonDetail: (lessonId) => api.get(`/lessons/${lessonId}/`),

    // Завершить урок
    completeLesson: (lessonId) => api.post(`/lessons/${lessonId}/complete/`),

    // Прогресс видео
    updateVideoProgress: (lessonId, data) => api.post(`/lessons/${lessonId}/video-progress/`, data),
};

export const groupsAPI = {
    // Получить информацию о группе по токену (БЕЗ авторизации)
    getGroupInfo: (token) => axios.get(`${API_BASE_URL}/groups/info/${token}/`),

    // Присоединиться к группе (С авторизацией)
    joinGroup: (token) => api.post(`/groups/join/${token}/`),
};

export const lessonsAPI = {
    // Получить урок по ID
    getLesson: (id) => api.get(`/lessons/${id}/`),

    // Обновить прогресс видео
    updateVideoProgress: (id, data) => api.post(`/lessons/${id}/video-progress/`, data),

    // Отметить урок как завершенный
    completeLesson: (id) => api.post(`/lessons/${id}/complete/`),
};

export const quizzesAPI = {
    // Начать попытку
    startQuiz(quizId) {
        return api.post(`/quizzes/${quizId}/start/`);
    },

    // Получить все попытки пользователя
    getAttempts() {
        return api.get('/quizzes/attempts/');
    },

    // Получить детали попытки
    getAttempt(attemptId) {
        return api.get(`/quizzes/attempts/${attemptId}/`);
    },

    // Отправить ответы
    submitAnswers(attemptId, answers) {
        return api.post(`/quizzes/attempts/${attemptId}/submit/`, { answers });
    }
};



export default api;