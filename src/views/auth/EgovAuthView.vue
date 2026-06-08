<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Авторизация через eGov Mobile</h5>
      <h1 class="h1 font-bold" v-if="!isMobile">Отсканируйте QR-код</h1>
      <h1 class="h1 font-bold" v-else>Подтвердите в eGov Mobile</h1>
    </div>

    <div class="authorization-form__body">
      <!-- Загрузка -->
      <div v-if="loading && !qrCode">
        <p class="text-center text-gray-600">Загрузка...</p>
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
          <!-- QR изображение (только десктоп, скрыть при expired) -->
          <div v-if="!isMobile && !expired" class="p-4 bg-white border border-gray-200 rounded-2xl">
            <img :src="qrCodeSrc" alt="QR код для eGov Mobile" class="w-64 h-64" />
          </div>

          <!-- Статус -->
          <div v-if="expired" class="text-center">
            <p class="text-sm text-gray-500 mb-4">Время действия истекло</p>
            <button @click="initSession"
                class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-gray-800 rounded-full py-4">
              Попробовать снова
            </button>
          </div>

          <div v-else-if="status === 'pending'" class="text-center">
            <!-- documentsReady=false: eGov Mobile ещё не открыт юзером.
                 На десктопе подсказываем сканировать QR, на мобиле — нажать кнопку. -->
            <template v-if="!documentsReady">
              <p v-if="!isMobile" class="text-sm text-gray-600">Откройте eGov Mobile и отсканируйте QR-код</p>
              <p v-else class="text-sm text-gray-600">Нажмите кнопку ниже, чтобы открыть eGov Mobile</p>
            </template>
            <!-- documentsReady=true: eGov Mobile уже забрал документы — ждём подпись. -->
            <p v-else class="text-sm text-gray-600">Ожидание подтверждения в eGov Mobile...</p>
          </div>

          <div v-else-if="status === 'processing'" class="text-center">
            <p class="text-sm text-gray-600">Обработка данных...</p>
          </div>

          <!-- Таймер истечения (только десктоп) -->
          <div v-if="!isMobile && !expired && expiresIn > 0" class="text-xs text-gray-400">
            Действителен ещё {{ formatTime(expiresIn) }}
          </div>
        </div>

        <!-- Кнопка eGov Mobile. Показываем сразу, как только бэк отдал deep link.
             Гейтить documentsReady нельзя — флаг flip'ается ТОЛЬКО после того,
             как eGov Mobile уже забрал документы (т.е. юзер уже открыл приложение). -->
        <div v-if="egovMobileLink && !expired" class="mt-6 flex flex-col gap-3">
          <a
          :href="egovMobileLink"
          class="w-full flex items-center justify-center gap-3 text-sm bg-[#005baa] text-white font-medium hover:bg-[#004a8c] rounded-full py-4 transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
            </svg>
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

// Определяем мобильное устройство
const isMobile = ref(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768);

// Состояние
const loading = ref(false);
const error = ref('');
const sessionId = ref('');
const qrCode = ref('');
const egovMobileLink = ref('');
const status = ref('pending');
const expiresIn = ref(0);
const expired = ref(false);
const documentsReady = ref(false);

// Таймеры
let pollingInterval = null;
let expirationInterval = null;

// При возвращении в браузер (iOS замораживает JS в фоне) — проверяем статус
// и при необходимости перезапускаем polling, который мог быть приостановлен.
const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && sessionId.value && status.value === 'pending' && !expired.value) {
    checkStatusOnce();
    if (!pollingInterval) {
      startPolling();
    }
  }
};

onMounted(() => {
  initSession();
  document.addEventListener('visibilitychange', onVisibilityChange);
});

onUnmounted(() => {
  clearTimers();
  document.removeEventListener('visibilitychange', onVisibilityChange);
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
  expired.value = false;
  documentsReady.value = false;
  clearTimers();

  try {
    const response = await accountAPI.egovInit();
    const data = response.data;

    sessionId.value = data.session_id;
    qrCode.value = data.qr_code;
    egovMobileLink.value = data.egov_mobile_link || '';
    expiresIn.value = data.expires_in || 300;
    status.value = 'pending';

    // Сразу проверяем статус (документ может быть уже подготовлен на бэке)
    checkStatusOnce();

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

// Одноразовая проверка статуса (при возвращении из eGov Mobile или из фона)
const checkStatusOnce = async () => {
  if (!sessionId.value) return;
  try {
    const response = await accountAPI.egovCheckStatus(sessionId.value);
    const data = response.data;
    // Подхватываем готовность документов — иначе пользователь, вернувшийся
    // из фона на iOS, может не дождаться появления кнопки.
    if (data.documents_ready) {
      documentsReady.value = true;
    }
    if (data.status === 'email_verification_required') {
      clearTimers();
      handleEmailVerificationRequired(data);
    } else if (data.status === 'signed' || data.status === 'completed') {
      clearTimers();
      handleCompleted(data);
    }
  } catch (err) {
    console.error('Ошибка проверки статуса:', err);
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

      // Обновляем готовность документов
      if (data.documents_ready) {
        documentsReady.value = true;
      }

      // eGov-подпись прошла, но email не подтверждён → требуем подтверждение почты
      if (data.status === 'email_verification_required') {
        clearTimers();
        handleEmailVerificationRequired(data);
      }
      // Обрабатываем оба статуса: signed (новый юзер) и completed (существующий)
      else if (data.status === 'signed' || data.status === 'completed') {
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
      expired.value = true;
    }
  }, 1000);
};

// eGov-подпись прошла, но пользователь не подтвердил email → в кабинет не пускаем.
// Бэк уже переотправил ссылку, если прежняя протухла. Ведём на «проверьте почту».
const handleEmailVerificationRequired = (data) => {
  status.value = 'processing';
  if (data.email) {
    sessionStorage.setItem('registration_email', data.email);
  }
  router.push({ name: 'EmailSent' });
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