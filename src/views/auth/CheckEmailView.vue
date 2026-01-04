<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Войдите или зарегистрируйтесь</h5>
      <h1 class="h1 font-bold">Добро пожаловать</h1>
    </div>

    <!-- Уведомление об оплате -->
    <div v-if="hasPaymentOrder" class="mb-6">
      <div class="p-4 bg-green-50 border border-green-200 rounded-2xl">
        <p class="text-sm text-green-700 font-medium">
          ✅ Оплата получена!
        </p>
        <p class="text-sm text-green-600 mt-1">
          Курс «{{ orderData.course_name }}» оплачен на сумму {{ Number(orderData.amount).toLocaleString() }} ₸.
          Войдите или зарегистрируйтесь для получения доступа.
        </p>
      </div>
    </div>

    <form class="authorization-form__body" @submit.prevent="handleSubmit">
      <div class="form">
        <!-- Уведомление о реферальной ссылке (опционально) -->
        <div v-if="hasReferralToken" class="mb-4">
          <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-700">
              <span>Вы приглашены на курс</span>
            </p>
          </div>
        </div>
        <div class="form-field">
          <div class="input-field">
            <input  type="email"
                    id="email"
                    v-model="email"
                    required
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    placeholder=" "/>

            <label  for="email"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all duration-200 pointer-events-none">
              Введите Email
            </label>
          </div>
          <div v-if="error" class="pt-3">
            <span class="text-sm text-red-500">{{ error }}</span>
          </div>
        </div>

        <div class="mt-3">
          <button
              type="submit"
              :disabled="loading"
              class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full py-4">
            {{ loading ? 'Проверка...' : 'Продолжить' }}
          </button>
        </div>
      </div>

      <div>
        <!-- Кнопка eGov Mobile -->
        <button
            type="button"
            @click="goToEgovAuth"
            class="w-full text-sm bg-white border border-gray-300 text-gray-700 font-medium cursor-pointer hover:bg-gray-50 rounded-full py-4">
          Войти через eGov Mobile
        </button>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { accountAPI } from '@/services/api.js';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Politics from '@/components/ui/Politics.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';

import { useOrderCompletion } from '@/composables/useOrderCompletion.js';


usePageMeta('Авторизуйтесь', 'Войдите в свой аккаунт для доступа к курсам');

const router = useRouter();
const email = ref('');
const error = ref('');
const loading = ref(false);

const { getOrderData, hasActiveOrder } = useOrderCompletion();

// Данные оплаченного заказа
const orderData = ref(null);
const hasPaymentOrder = computed(() => !!orderData.value);

// 🆕 Проверяем наличие реферального токена
const hasReferralToken = computed(() => {
  return !!localStorage.getItem('referral_token');
});

// 🆕 При монтировании компонента проверяем referral_token
onMounted(async () => {
  // 🆕 Проверяем наличие оплаченного заказа
  const data = await getOrderData();
  if (data && data.status === 'paid') {
    orderData.value = data;
    email.value = data.email; // Предзаполняем email
    console.log('✅ Найден оплаченный заказ:', data);
  }

  // Существующая логика referral_token
  const referralToken = localStorage.getItem('referral_token');
  if (referralToken) {
    console.log('✅ Обнаружен реферальный токен:', referralToken);
  }
});

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    console.log('📧 Отправка email:', email.value); // Отладка
    const response = await accountAPI.checkEmail(email.value);
    console.log('✅ Успешный ответ:', response.data); // Отладка

    sessionStorage.setItem('email', email.value);

    if (response.data.exists) {
      router.push({ name: 'Login' });
    } else {
      router.push({ name: 'Register' });
    }
  } catch (err) {
    console.error('❌ Полная ошибка:', err); // Отладка
    console.error('❌ Ответ сервера:', err.response); // Отладка
    console.error('❌ Данные ошибки:', err.response?.data); // Отладка

    error.value = err.response?.data?.error || 'Введите корректные данные Email';
  } finally {
    loading.value = false;
  }
};

const goToEgovAuth = () => {
  // Сохраняем referral_token если есть (он уже в localStorage)
  router.push({ name: 'EgovAuth' });
};
</script>

<style scoped>
</style>