<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h1 class="h1 font-bold [ mt-6 ]">Войти</h1>
    </div>

    <form class="authorization-form__body" @submit.prevent="handleLogin">
      <div class="form">
        <div class="form-field">
          <div class="input-field">
            <input  :type="showPassword ? 'text' : 'password'"
                    id="password"
                    v-model="password"
                    required
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    placeholder=" "/>

            <label  for="password"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all duration-200 pointer-events-none">
              Введите пароль
            </label>

            <button type="button"
                    @click="togglePassword"
                    class="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors">
              <!-- Иконка перечеркнутого глаза (когда пароль скрыт) -->
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>

              <!-- Иконка обычного глаза (когда пароль показан) -->
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          <div v-if="error" class="pt-3">
            <span class="text-sm text-red-500">{{ error }}</span>
          </div>
        </div>

        <div class="mt-3">
          <button type="submit" :disabled="loading" class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 rounded-full py-4">
            {{ loading ? 'Вход...' : 'Продолжить' }}
          </button>
        </div>
      </div>

      <div>
        <ul class="flex flex-col gap-3 [ text-sm font-medium text-black underline ]">
          <li><button @click.prevent="goToPasswordReset" class="hover:text-blue-600 cursor-pointer">Забыли пароль?</button></li>
          <li><button @click.prevent="goBack" class="hover:text-blue-600 cursor-pointer">Ввести другой Email</button></li>
        </ul>
      </div>
    </form>

  </AuthLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { groupsAPI } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';
import { useOrderCompletion } from '@/composables/useOrderCompletion.js';


usePageMeta('Введите пароль от существующего аккаунта', 'Войдите в свой пароль для доступа к курсам');

const router = useRouter();
const authStore = useAuthStore();
const { checkAndCompleteOrder } = useOrderCompletion();

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const showPassword = ref(false);

onMounted(() => {
  const savedEmail = sessionStorage.getItem('email');
  if (savedEmail) {
    email.value = savedEmail;
  } else {
    router.push({ name: 'CheckEmail' });
  }
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const goToPasswordReset = () => {
  router.push({ name: 'PasswordReset' });
};

const handleLogin = async () => {
  error.value = '';
  loading.value = true;

  try {
    // ✅ ИЗМЕНЕНО: используем authStore вместо accountAPI
    const result = await authStore.login(email.value, password.value);

    if (!result.ok) {
      error.value = result.data?.error || 'Введите корректные данные';
      loading.value = false;
      return;
    }

    // Store уже сохранил токены и пользователя!
    const orderResult = await checkAndCompleteOrder();
    if (orderResult.hasOrder) {
      if (orderResult.success) {
        console.log('✅ Зачислен на курс:', orderResult.courseName);
      } else {
        console.error('❌ Ошибка зачисления:', orderResult.error);
      }
    }

    // Проверяем наличие referral_token
    const referralToken = localStorage.getItem('referral_token');

    if (referralToken) {
      try {
        await groupsAPI.joinGroup(referralToken);
        localStorage.removeItem('referral_token');
      } catch (joinErr) {
        console.error('Ошибка присоединения к группе:', joinErr);
        localStorage.removeItem('referral_token');
      }
    }

    router.push({ name: 'Dashboard' });

  } catch (err) {
    console.error('Unexpected error:', err);
    error.value = 'Ошибка при входе в систему';
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  sessionStorage.removeItem('email');
  router.push({ name: 'CheckEmail' });
};
</script>
<style scoped>

</style>