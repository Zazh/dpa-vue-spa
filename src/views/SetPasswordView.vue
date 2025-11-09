<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Завершите регистрацию</h5>
      <h1 class="h1 font-bold">Придумайте пароль</h1>
    </div>

    <div v-if="!tokenValid" class="error">
      <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
        <span class="text-sm text-red-600">{{ errorMessage }}</span>
      </div>
    </div>

    <form class="authorization-form__body" v-else @submit.prevent="handleSetPassword">
      <div class="form">
        <!-- Первое поле пароля -->
        <div class="form-field">
          <div class="input-field">
            <input  :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="password"
                    required
                    minlength="8"
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': error }"
                    placeholder=" "/>

            <label  for="password"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                    peer-focus:top-4 peer-focus:text-xs
                    peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                    transition-all duration-200 pointer-events-none">
              Введите пароль
            </label>

            <button type="button"
                    @click="showPassword = !showPassword"
                    class="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors">
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Второе поле пароля -->
        <div class="form-field">
          <div class="input-field">
            <input  :type="showPasswordConfirm ? 'text' : 'password'"
                    id="password_confirm"
                    v-model="password_confirm"
                    required
                    minlength="8"
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': error }"
                    placeholder=" "/>

            <label  for="password_confirm"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                    peer-focus:top-4 peer-focus:text-xs
                    peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                    transition-all duration-200 pointer-events-none">
              Повторите пароль
            </label>

            <button type="button"
                    @click="showPasswordConfirm = !showPasswordConfirm"
                    class="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors">
              <svg v-if="!showPasswordConfirm" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>

              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="error" class="pt-3">
          <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <span class="text-sm text-red-600">{{ error }}</span>
          </div>
        </div>
      </div>

      <div class="p-6 border-1 border-gray-200 rounded-2xl">
        <h5 class="text-black font-medium">Ваш пароль должен содержать</h5>
        <ul class="pt-4 grid grid-cols-2 gap-y-3 gap-x-4">
          <li class="flex items-center text-sm gap-2" :class="passwordValidation.minLength ? 'text-green-600' : 'text-gray-700'">
            <span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.38162 9.1711L8.32899 11.6974L12.9606 6.64479M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="mt-1 font-medium">Не менее 8 символов</span>
          </li>
          <li class="flex items-center text-sm gap-2" :class="passwordValidation.hasLowerCase ? 'text-green-600' : 'text-gray-700'">
            <span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.38162 9.1711L8.32899 11.6974L12.9606 6.64479M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="mt-1 font-medium">1 строчная буква</span>
          </li>
          <li class="flex items-center text-sm gap-2" :class="passwordValidation.hasUpperCase ? 'text-green-600' : 'text-gray-700'">
            <span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.38162 9.1711L8.32899 11.6974L12.9606 6.64479M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="mt-1 font-medium">1 заглавная буква</span>
          </li>
          <li class="flex items-center text-sm gap-2" :class="passwordValidation.passwordsMatch ? 'text-green-600' : 'text-gray-700'">
            <span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.38162 9.1711L8.32899 11.6974L12.9606 6.64479M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="currentColor" stroke-width="1.5"/>
              </svg>
            </span>
            <span class="mt-1 font-medium">Пароли совпадают</span>
          </li>
        </ul>
      </div>

      <div v-if="success" class="mb-4">
        <div class="p-3 bg-green-50 border border-green-200 rounded-lg">
          <span class="text-sm text-green-600">{{ success }}</span>
        </div>
      </div>

      <div>
        <button type="submit" :disabled="loading || !isPasswordValid" class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full py-4">
          {{ loading ? 'Сохранение...' : 'Продолжить' }}
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { accountAPI } from '@/services/api';
import AuthLayout from "@/layouts/AuthLayout.vue";
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta('Установка пароля', 'Создайте надежный пароль для вашего аккаунта');

const router = useRouter();
const route = useRoute();

const password = ref('');
const password_confirm = ref('');
const error = ref('');
const success = ref('');
const loading = ref(false);
const tokenValid = ref(true);
const errorMessage = ref('');
const token = ref('');
const userEmail = ref('');
const showPassword = ref(false);
const showPasswordConfirm = ref(false);

onMounted(() => {
  token.value = route.query.token;

  if (!token.value) {
    tokenValid.value = false;
    errorMessage.value = 'Токен не найден. Проверьте ссылку из email.';
  }
});

// Валидация пароля в реальном времени
const passwordValidation = computed(() => {
  const pwd = password.value;
  const pwdConfirm = password_confirm.value;

  return {
    minLength: pwd.length >= 8,
    hasLowerCase: /[a-z]/.test(pwd),
    hasUpperCase: /[A-Z]/.test(pwd),
    // Проверка совпадения: оба поля заполнены и совпадают
    passwordsMatch: pwd.length > 0 && pwdConfirm.length > 0 && pwd === pwdConfirm
  };
});

// Проверка валидности пароля
const isPasswordValid = computed(() => {
  return passwordValidation.value.minLength &&
      passwordValidation.value.hasLowerCase &&
      passwordValidation.value.hasUpperCase &&
      passwordValidation.value.passwordsMatch;
});

const handleSetPassword = async () => {
  error.value = '';
  success.value = '';

  // Проверка совпадения паролей
  if (password.value !== password_confirm.value) {
    error.value = 'Пароли не совпадают';
    return;
  }

  loading.value = true;

  try {
    // 🆕 ДОБАВЬТЕ: Получаем referral_token из localStorage если есть
    const referralToken = localStorage.getItem('referral_token');

    // Шаг 1: Устанавливаем пароль (С referral_token если есть)
    const setPasswordResponse = await accountAPI.setPassword(
        token.value,
        password.value,
        password_confirm.value,
        referralToken  // 🆕 ДОБАВЬТЕ: Передаем referral_token
    );

    userEmail.value = setPasswordResponse.data.email;
    success.value = 'Пароль установлен! Выполняется вход в систему...';

    // 🆕 ДОБАВЬТЕ: Очищаем referral_token после использования
    localStorage.removeItem('referral_token');

    // Шаг 2: Автоматически авторизуем пользователя
    try {
      const loginResponse = await accountAPI.login(userEmail.value, password.value);

      // Сохраняем токены
      localStorage.setItem('access_token', loginResponse.data.access);
      localStorage.setItem('refresh_token', loginResponse.data.refresh);

      // Переходим на dashboard
      setTimeout(() => {
        router.push({ name: 'Dashboard' });
      }, 1000);

    } catch (loginErr) {
      // Если автоматический вход не удался, перенаправляем на страницу входа
      success.value = 'Пароль установлен! Переход на страницу входа...';
      setTimeout(() => {
        sessionStorage.setItem('email', userEmail.value);
        router.push({ name: 'Login' });
      }, 2000);
    }

  } catch (err) {
    if (err.response?.data) {
      const errors = err.response.data;
      if (errors.error) {
        error.value = errors.error;
      } else if (typeof errors === 'object') {
        const errorMessages = Object.entries(errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ');
        error.value = errorMessages;
      } else {
        error.value = 'Ошибка при установке пароля';
      }
    } else {
      error.value = 'Ошибка при установке пароля';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
</style>