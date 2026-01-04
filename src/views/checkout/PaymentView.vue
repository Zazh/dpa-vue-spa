<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-lg mx-auto px-4">

      <!-- Загрузка -->
      <div v-if="loading" class="bg-white rounded-2xl p-8 shadow-sm text-center">
        <p class="text-gray-600">Загрузка...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="error" class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="text-center mb-6">
          <div class="text-5xl mb-4">❌</div>
          <h1 class="text-xl font-bold text-gray-900">{{ error }}</h1>
        </div>
        <div class="text-center">
          <router-link to="/" class="text-blue-600 underline">
            Вернуться на главную
          </router-link>
        </div>
      </div>

      <!-- Заказ истёк -->
      <div v-else-if="orderStatus === 'expired'" class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="text-center mb-6">
          <div class="text-5xl mb-4">⏰</div>
          <h1 class="text-xl font-bold text-gray-900">Время оплаты истекло</h1>
          <p class="text-gray-600 mt-2">Пожалуйста, оформите заказ заново</p>
        </div>
        <div class="text-center">
          <button
              @click="goBack"
              class="px-6 py-3 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Оформить заново
          </button>
        </div>
      </div>

      <!-- Оплата получена -->
      <div v-else-if="orderStatus === 'paid'" class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="text-center mb-6">
          <div class="text-5xl mb-4">✅</div>
          <h1 class="text-xl font-bold text-gray-900">Оплата получена!</h1>
          <p class="text-gray-600 mt-2">Перенаправляем на регистрацию...</p>
        </div>
      </div>

      <!-- Страница оплаты -->
      <div v-else-if="paymentData" class="bg-white rounded-2xl p-8 shadow-sm">

        <!-- Заголовок -->
        <div class="text-center mb-6">
          <h1 class="text-xl font-bold text-gray-900">Оплата через Kaspi</h1>
          <p class="text-gray-600 mt-1">{{ paymentData.order.course_name }}</p>
        </div>

        <!-- Сумма -->
        <div class="text-center mb-6">
          <p class="text-3xl font-bold text-gray-900">
            {{ Number(paymentData.order.amount).toLocaleString() }} ₸
          </p>
        </div>

        <!-- Таймер -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span class="text-gray-600">Осталось:</span>
            <span class="font-mono font-bold" :class="timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'">
              {{ formatTime(timeRemaining) }}
            </span>
          </div>
        </div>

        <!-- QR-код (заглушка) -->
        <div class="flex justify-center mb-6">
          <div class="p-4 bg-white border-2 border-gray-200 rounded-2xl">
            <!-- В production здесь будет реальный QR -->
            <div class="w-64 h-64 bg-gray-100 rounded-xl flex items-center justify-center">
              <div class="text-center text-gray-500">
                <div class="text-4xl mb-2">📱</div>
                <p class="text-sm">QR-код Kaspi</p>
                <p class="text-xs mt-1">(тестовый режим)</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Инструкция -->
        <div class="text-center mb-6 text-sm text-gray-600">
          <p>Откройте приложение Kaspi.kz</p>
          <p>и отсканируйте QR-код</p>
        </div>

        <!-- Кнопка Kaspi (deeplink) -->
        <div v-if="paymentData.kaspi_deeplink" class="mb-4">

          <a :href="paymentData.kaspi_deeplink"
          class="block w-full py-4 bg-red-500 text-white font-medium rounded-full text-center hover:bg-red-600 transition-colors"
          >
          Открыть Kaspi
          </a>
        </div>

        <!-- DEV: Кнопка симуляции оплаты -->
        <div v-if="isDev" class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-xs text-gray-500 text-center mb-3">Режим разработки</p>
          <button
              @click="simulatePayment"
              :disabled="simulating"
              class="w-full py-3 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 disabled:bg-gray-400 transition-colors"
          >
            {{ simulating ? 'Обработка...' : '✅ Симулировать оплату' }}
          </button>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { paymentsAPI } from '@/services/api.js';
import { useOrderCompletion } from '@/composables/useOrderCompletion.js';

const router = useRouter();
const route = useRoute();
const { setOrderToken } = useOrderCompletion();

// Состояние
const loading = ref(true);
const error = ref('');
const paymentData = ref(null);
const orderStatus = ref('pending');
const timeRemaining = ref(0);
const simulating = ref(false);

// Таймеры
let pollingInterval = null;
let countdownInterval = null;

// Dev mode
const isDev = computed(() => import.meta.env.DEV);

onMounted(async () => {
  const token = route.params.token;

  if (!token) {
    error.value = 'Заказ не найден';
    loading.value = false;
    return;
  }

  // Сохраняем токен на случай если пользователь обновит страницу
  setOrderToken(token);

  await loadPaymentData(token);
});

onUnmounted(() => {
  clearTimers();
});

const clearTimers = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

// Загрузка данных оплаты
const loadPaymentData = async (token) => {
  try {
    const response = await paymentsAPI.getPaymentData(token);

    if (response.data.error) {
      if (response.data.status === 'expired') {
        orderStatus.value = 'expired';
      } else if (response.data.redirect) {
        // Уже оплачен — редиректим
        orderStatus.value = 'paid';
        redirectToAuth();
      } else {
        error.value = response.data.error;
      }
      loading.value = false;
      return;
    }

    paymentData.value = response.data;
    timeRemaining.value = response.data.time_remaining;

    // Запускаем polling и countdown
    startPolling(token);
    startCountdown();

  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка загрузки';
  } finally {
    loading.value = false;
  }
};

// Polling статуса
const startPolling = (token) => {
  pollingInterval = setInterval(async () => {
    try {
      const response = await paymentsAPI.getOrderStatus(token);

      if (response.data.status === 'paid') {
        clearTimers();
        orderStatus.value = 'paid';
        redirectToAuth();
      } else if (response.data.status === 'expired') {
        clearTimers();
        orderStatus.value = 'expired';
      }

      // Обновляем время
      timeRemaining.value = response.data.time_remaining;

    } catch (err) {
      console.error('Polling error:', err);
    }
  }, 5000); // каждые 5 секунд
};

// Countdown
const startCountdown = () => {
  countdownInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearTimers();
      orderStatus.value = 'expired';
    }
  }, 1000);
};

// Форматирование времени
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Редирект на авторизацию
const redirectToAuth = () => {
  setTimeout(() => {
    router.push({ name: 'CheckEmail' });
  }, 1500);
};

// Вернуться назад
const goBack = () => {
  // Очищаем токен и возвращаемся
  localStorage.removeItem('payment_order_token');
  router.back();
};

// DEV: Симуляция оплаты
const simulatePayment = async () => {
  simulating.value = true;

  try {
    await paymentsAPI.simulatePayment(route.params.token);

    // Сразу показываем успех
    clearTimers();
    orderStatus.value = 'paid';
    redirectToAuth();

  } catch (err) {
    console.error('Simulate error:', err);
    alert(err.response?.data?.error || 'Ошибка симуляции');
  } finally {
    simulating.value = false;
  }
};
</script>