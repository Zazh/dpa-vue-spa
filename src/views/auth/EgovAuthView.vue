<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Авторизация через eGov Mobile</h5>
      <h1 class="h1 font-bold">Отсканируйте QR-код</h1>
    </div>

    <div class="authorization-form__body">
      <!-- Загрузка -->
      <div v-if="loading && !qrCode">
        <p class="text-center text-gray-600">Загрузка QR-кода...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error">
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <span class="text-sm text-red-600">{{ error }}</span>
        </div>
        <button
            @click="initSession"
            class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 rounded-full py-4">
          Попробовать снова
        </button>
      </div>

      <!-- QR код -->
      <div v-else-if="qrCode">
        <div class="flex flex-col items-center gap-4">
          <!-- QR изображение -->
          <div class="p-4 bg-white border border-gray-200 rounded-2xl">
            <img :src="qrCodeSrc" alt="QR код для eGov Mobile" class="w-64 h-64" />
          </div>

          <!-- Статус -->
          <div v-if="status === 'pending'" class="text-center">
            <p class="text-sm text-gray-600">Откройте приложение eGov Mobile и отсканируйте QR-код</p>
            <p class="text-xs text-gray-400 mt-2">Ожидание подтверждения...</p>
          </div>

          <div v-else-if="status === 'processing'" class="text-center">
            <p class="text-sm text-gray-600">Обработка данных...</p>
          </div>

          <!-- Таймер истечения -->
          <div v-if="expiresIn > 0" class="text-xs text-gray-400">
            QR-код действителен ещё {{ formatTime(expiresIn) }}
          </div>
        </div>

        <!-- Ссылки для мобильных -->
        <div class="mt-6 flex flex-col gap-3">
          <a
          v-if="egovMobileLink"
          :href="egovMobileLink"
          class="w-full text-sm text-center bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 rounded-full py-4 block">
          Открыть eGov Mobile
          </a>
        </div>
      </div>

      <!-- Кнопка назад -->
      <div class="mt-6">
        <button
            @click="goBack"
            class="w-full text-sm text-center text-gray-600 underline hover:text-gray-800">
          Вернуться к входу по Email
        </button>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { accountAPI } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';
import { useOrderCompletion } from '@/composables/useOrderCompletion.js';

usePageMeta('Вход через eGov Mobile', 'Авторизуйтесь с помощью eGov Mobile');

const router = useRouter();
const authStore = useAuthStore();
const { checkAndCompleteOrder } = useOrderCompletion();

// Состояние
const loading = ref(false);
const error = ref('');
const sessionId = ref('');
const qrCode = ref('');
const egovMobileLink = ref('');
const status = ref('pending');
const expiresIn = ref(0);

// Таймеры
let pollingInterval = null;
let expirationInterval = null;

onMounted(() => {
  initSession();
});

onUnmounted(() => {
  clearTimers();
});

const clearTimers = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  if (expirationInterval) {
    clearInterval(expirationInterval);
    expirationInterval = null;
  }
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Инициализация сессии
const initSession = async () => {
  loading.value = true;
  error.value = '';
  clearTimers();

  try {
    const response = await accountAPI.egovInit();
    const data = response.data;

    sessionId.value = data.session_id;
    qrCode.value = data.qr_code;
    egovMobileLink.value = data.egov_mobile_link || '';
    expiresIn.value = data.expires_in || 300;
    status.value = 'pending';

    // Запускаем polling статуса
    startPolling();

    // Запускаем таймер истечения
    startExpirationTimer();

  } catch (err) {
    console.error('Ошибка инициализации eGov:', err);
    error.value = err.response?.data?.error || 'Не удалось загрузить QR-код. Попробуйте позже.';
  } finally {
    loading.value = false;
  }
};

// Polling статуса
const startPolling = () => {
  pollingInterval = setInterval(async () => {
    if (!sessionId.value) return;

    try {
      const response = await accountAPI.egovCheckStatus(sessionId.value);
      const data = response.data;

      console.log('📡 eGov status:', data.status);

      // Обрабатываем оба статуса: signed (новый юзер) и completed (существующий)
      if (data.status === 'signed' || data.status === 'completed') {
        clearTimers();
        handleCompleted(data);
      } else if (data.status === 'error' || data.status === 'expired') {
        clearTimers();
        error.value = 'Сессия истекла или произошла ошибка. Попробуйте снова.';
        qrCode.value = '';
      }
      // pending — продолжаем polling

    } catch (err) {
      console.error('Ошибка проверки статуса:', err);
    }
  }, 2000);
};

// Таймер истечения QR
const startExpirationTimer = () => {
  expirationInterval = setInterval(() => {
    expiresIn.value--;

    if (expiresIn.value <= 0) {
      clearTimers();
      error.value = 'QR-код истёк. Пожалуйста, обновите страницу.';
      qrCode.value = '';
    }
  }, 1000);
};

// Обработка успешной подписи
const handleCompleted = async (data) => {
  console.log('🎉 handleCompleted вызван, data:', data);

  status.value = 'processing';

  if (data.user_exists === false) {
    // Новый пользователь — переходим на регистрацию
    console.log('👤 Новый пользователь, переходим на EgovRegister');

    sessionStorage.setItem('egov_registration_token', data.registration_token);
    sessionStorage.setItem('egov_registration_data', JSON.stringify(data.registration_data));

    router.push({ name: 'EgovRegister' });

  } else {
    // Существующий пользователь — авторизуем
    console.log('✅ Существующий пользователь, авторизуем');
    console.log('📦 Полученные данные:', {
      access: data.access,
      refresh: data.refresh,
      user: data.user
    });

    // Сохраняем токены
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);

    // Если user пришёл — используем его, иначе загружаем профиль
    if (data.user && data.user.id) {
      authStore.user = data.user;
    } else {
      // Загружаем профиль с сервера
      try {
        await authStore.ensureAuth();
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
      }
    }

    // 🆕 Проверяем и завершаем оплаченный заказ
    const orderResult = await checkAndCompleteOrder();
    if (orderResult.hasOrder) {
      if (orderResult.success) {
        console.log('✅ Зачислен на курс:', orderResult.courseName);
      } else {
        console.error('❌ Ошибка зачисления:', orderResult.error);
      }
    }

    // Проверяем реферальный токен
    const referralToken = localStorage.getItem('referral_token');
    if (referralToken) {
      try {
        const { groupsAPI } = await import('@/services/api.js');
        await groupsAPI.joinGroup(referralToken);
      } catch (err) {
        console.error('Ошибка присоединения к группе:', err);
      }
      localStorage.removeItem('referral_token');
    }

    router.push({ name: 'Dashboard' });
  }
};

// Computed для QR с правильным форматом
const qrCodeSrc = computed(() => {
  if (!qrCode.value) return '';

  // Если уже есть data: префикс — возвращаем как есть
  if (qrCode.value.startsWith('data:')) {
    return qrCode.value;
  }

  // Иначе добавляем префикс для PNG
  return `data:image/png;base64,${qrCode.value}`;
});

const goBack = () => {
  clearTimers();
  router.push({ name: 'CheckEmail' });
};
</script>