<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Забыли пароль?</h5>
      <h1 class="font-medium text-left">Введите адрес электронной почты, связанный с вашим аккаунтом, и мы вышлем вам ссылку для изменения пароля</h1>
    </div>

    <form class="authorization-form__body" @submit.prevent="handleSubmit">
      <div class="form">
        <div class="form-field">
          <div class="input-field">
            <input  type="email"
                    id="email"
                    v-model="email"
                    required
                    :disabled="isTimerActive"
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'cursor-not-allowed': isTimerActive, 'border-red-500': error }"
                    placeholder=" "/>

            <label  for="email"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all duration-200 pointer-events-none">
               Email
            </label>
          </div>

          <div v-if="error" class="pt-3">
            <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <span class="text-sm text-red-600">{{ error }}</span>
            </div>
          </div>

          <div v-if="success" class="pt-3">
            <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <span class="text-sm text-green-600">{{ success }}</span>
            </div>
          </div>
        </div>

        <div class="mt-3 flex flex-col gap-3">
          <button
              type="submit"
              :disabled="loading || isTimerActive"
              class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full py-4">
            <span v-if="isTimerActive">
              Повторная отправка через {{ formatTime(remainingTime) }}
            </span>
            <span v-else>
              {{ loading ? 'Отправка...' : 'Отправить ссылку для сброса' }}
            </span>
          </button>

          <button @click.prevent="goToLogin" class="w-full text-sm bg-white border-1 border-gray-300 text-gray-700 font-medium cursor-pointer hover:bg-blue-600 hover:text-white disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full py-4">Вернуться ко входу</button>
        </div>
      </div>

      <div class="authorization-form__footer">
        <div class="text-center">
          <Politics />
        </div>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { accountAPI } from '@/services/api.js';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Politics from '@/components/ui/Politics.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';

usePageMeta('Восстановление пароля', 'Введите email для восстановления доступа');

const router = useRouter();
const email = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);

// Таймер
const remainingTime = ref(0); // в секундах
const timerInterval = ref(null);
const RESET_COOLDOWN = 5 * 60; // 5 минут в секундах

const isTimerActive = computed(() => remainingTime.value > 0);

onMounted(() => {
  // Проверяем есть ли активный таймер в localStorage
  const savedTimer = localStorage.getItem('password_reset_timer');
  const savedEmail = localStorage.getItem('password_reset_email');

  if (savedTimer && savedEmail) {
    const expiryTime = parseInt(savedTimer);
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = expiryTime - now;

    if (timeLeft > 0) {
      email.value = savedEmail;
      remainingTime.value = timeLeft;
      startTimer();
    } else {
      // Таймер истек, очищаем
      clearStoredTimer();
    }
  }
});

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
});

const startTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }

  timerInterval.value = setInterval(() => {
    remainingTime.value--;

    if (remainingTime.value <= 0) {
      clearInterval(timerInterval.value);
      clearStoredTimer();
    }
  }, 1000);
};

const clearStoredTimer = () => {
  localStorage.removeItem('password_reset_timer');
  localStorage.removeItem('password_reset_email');
  remainingTime.value = 0;
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

const handleSubmit = async () => {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    const response = await accountAPI.passwordResetRequest(email.value);

    success.value = response.data.message || 'Если указанный email зарегистрирован, то на него отправлена ссылка для сброса пароля.';

    // Запускаем таймер на 5 минут
    const expiryTime = Math.floor(Date.now() / 1000) + RESET_COOLDOWN;
    localStorage.setItem('password_reset_timer', expiryTime.toString());
    localStorage.setItem('password_reset_email', email.value);

    remainingTime.value = RESET_COOLDOWN;
    startTimer();

  } catch (err) {
    if (err.response?.data) {
      const errors = err.response.data;
      if (errors.error) {
        error.value = errors.error;
      } else if (errors.email) {
        error.value = Array.isArray(errors.email) ? errors.email.join(', ') : errors.email;
      } else {
        error.value = 'Ошибка при отправке запроса';
      }
    } else {
      error.value = 'Ошибка при отправке запроса. Попробуйте позже.';
    }
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push({ name: 'CheckEmail' });
};
</script>

<style scoped>
</style>