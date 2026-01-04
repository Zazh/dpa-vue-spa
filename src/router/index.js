import { createRouter, createWebHistory } from 'vue-router';

// Auth views
import CheckEmailView from '@/views/auth/CheckEmailView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import PasswordView from '@/views/auth/PasswordView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import EmailSentView from '@/views/auth/EmailSentView.vue';
import SetPasswordView from '@/views/auth/SetPasswordView.vue';
import PasswordResetRequestView from '@/views/auth/PasswordResetRequestView.vue';
import PasswordResetConfirmView from '@/views/auth/PasswordResetConfirmView.vue';

// Auth Egov
import EgovAuthView from '@/views/auth/EgovAuthView.vue';
import EgovRegisterView from '@/views/auth/EgovRegisterView.vue';

// Main views
import DashboardView from '@/views/courses/DashboardView.vue';
import ProfileView from '@/views/profile/ProfileView.vue';
import JoinGroupView from '@/views/groups/JoinGroupView.vue';

// Lesson views
import VideoLessonView from '@/views/lessons/VideoLessonView.vue';
import TextLessonView from '@/views/lessons/TextLessonView.vue';
import QuizLessonView from '@/views/lessons/QuizLessonView.vue';
import AssignmentLessonView from '@/views/lessons/AssignmentLessonView.vue';

const routes = [
    // ==================== AUTH ROUTES ====================
    {
        path: '/',
        name: 'CheckEmail',
        component: CheckEmailView,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        path: '/password',
        name: 'Password',
        component: PasswordView,
        meta: { requiresAuth: false }
    },
    {
        path: '/register',
        name: 'Register',
        component: RegisterView,
        meta: { requiresAuth: false }
    },
    {
        path: '/email-sent',
        name: 'EmailSent',
        component: EmailSentView,
        meta: { requiresAuth: false }
    },
    {
        path: '/set-password',
        name: 'SetPassword',
        component: SetPasswordView,
        meta: { requiresAuth: false }
    },
    {
        path: '/password-reset',
        name: 'PasswordReset',
        component: PasswordResetRequestView,
        meta: { requiresAuth: false }
    },
    {
        path: '/password-reset/confirm',
        name: 'PasswordResetConfirm',
        component: PasswordResetConfirmView,
        meta: { requiresAuth: false }
    },
    {
        path: '/egov-auth',
        name: 'EgovAuth',
        component: EgovAuthView,
        meta: { requiresAuth: false }
    },
    {
        path: '/egov-register',
        name: 'EgovRegister',
        component: EgovRegisterView,
        meta: { requiresAuth: false }
    },

    // ==================== GROUP ROUTES ====================
    {
        path: '/join/:token',
        name: 'JoinGroup',
        component: JoinGroupView,
        meta: { requiresAuth: false }
    },

    // ==================== MAIN ROUTES ====================
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true }
    },

    // ==================== COURSE ROUTES ====================
    {
        path: '/courses/:id',
        name: 'CourseDetail',
        component: () => import('@/views/courses/CourseDetailView.vue'),
        meta: { requiresAuth: true }
    },

    // ==================== LESSON ROUTES ====================
    {
        path: '/lessons/:id/video',
        name: 'VideoLesson',
        component: VideoLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/:id/text',
        name: 'TextLesson',
        component: TextLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/:id/quiz',
        name: 'QuizLesson',
        component: QuizLessonView,
        meta: { requiresAuth: true }
    },
    {
        path: '/lessons/:id/assignment',
        name: 'AssignmentLesson',
        component: AssignmentLessonView,
        meta: { requiresAuth: true }
    },

    // Payment должен быть первым (более специфичный путь)
    {
        path: '/checkout/pay/:token',
        name: 'Payment',
        component: () => import('@/views/checkout/PaymentView.vue'),
        meta: { title: 'Оплата' }
    },
    {
        path: '/checkout/:courseId',
        name: 'Checkout',
        component: () => import('@/views/checkout/CheckoutView.vue'),
        meta: { title: 'Оформление заказа' }
    },

    // ==================== 404 ====================
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }
        return { top: 0 };
    }
});

// ✅ ИСПРАВЛЕНО: Guard использует localStorage напрямую
router.beforeEach((to, from, next) => {
    // Простая проверка по токену
    const isAuthenticated = !!localStorage.getItem('access_token');

    if (to.meta.requiresAuth && !isAuthenticated) {
        console.log('🚫 Доступ запрещен, перенаправляем на CheckEmail');
        next({ name: 'CheckEmail' });
        return;
    }

    if (to.name === 'CheckEmail' && isAuthenticated) {
        console.log('✅ Уже авторизован, перенаправляем в Dashboard');
        next({ name: 'Dashboard' });
        return;
    }

    next();
});

export default router;