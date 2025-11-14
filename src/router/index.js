import { createRouter, createWebHistory } from 'vue-router';
import CheckEmailView from '@/views/CheckEmailView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import EmailSentView from '@/views/EmailSentView.vue';
import SetPasswordView from '@/views/SetPasswordView.vue';
import PasswordResetRequestView from '@/views/PasswordResetRequestView.vue';
import PasswordResetConfirmView from '@/views/PasswordResetConfirmView.vue';
import DashboardView from '@/views/DashboardView.vue';
import JoinGroupView from '@/views/JoinGroupView.vue';

import VideoLessonView from '@/views/lessons/VideoLessonView.vue'
import TextLessonView from '@/views/lessons/TextLessonView.vue'
import QuizLessonView from '@/views/lessons/QuizLessonView.vue'
import AssignmentLessonView from '@/views/lessons/AssignmentLessonView.vue'




const routes = [
    {
        path: '/',
        name: 'CheckEmail',
        component: CheckEmailView,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
    },
    {
        path: '/email-sent',
        name: 'EmailSent',
        component: EmailSentView,
    },
    {
        path: '/set-password',
        name: 'SetPassword',
        component: SetPasswordView,
    },
    {
        path: '/password-reset',
        name: 'PasswordReset',
        component: PasswordResetRequestView,
    },
    {
        path: '/reset-password',
        name: 'ResetPasswordConfirm',
        component: PasswordResetConfirmView,
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/join/:token',
        name: 'JoinGroup',
        component: JoinGroupView,
    },
    {
        path: '/courses/:id',
        name: 'CourseDetail',
        component: () => import('@/views/CourseDetailView.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/video/:id',
        name: 'VideoLesson',
        component: VideoLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/text/:id',
        name: 'TextLesson',
        component: TextLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/video/:id',
        name: 'VideoLesson',
        component: VideoLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/text/:id',
        name: 'TextLesson',
        component: TextLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/quiz/:id',
        name: 'QuizLesson',
        component: QuizLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/assignment/:id',
        name: 'AssignmentLesson',
        component: AssignmentLessonView,
        meta: { requiresAuth: true }
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Защита маршрутов
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'CheckEmail' });
    } else if (to.name === 'CheckEmail' && isAuthenticated) {
        next({ name: 'Dashboard' });
    } else {
        next();
    }
});

export default router;