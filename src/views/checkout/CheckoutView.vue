<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-lg mx-auto px-4">

      <!-- Заголовок -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Оформление заказа</h1>
        <p class="text-gray-600 mt-2" v-if="courseInfo">
          {{ courseInfo.course.title }}
        </p>
      </div>

      <!-- Загрузка -->
      <div v-if="loading" class="bg-white rounded-2xl p-8 shadow-sm text-center">
        <p class="text-gray-600">Загрузка...</p>
      </div>

      <!-- Ошибка загрузки курса -->
      <div v-else-if="loadError" class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
          <p class="text-red-600">{{ loadError }}</p>
        </div>
        <div class="mt-6 text-center">
          <router-link to="/" class="text-blue-600 underline">
            Вернуться на главную
          </router-link>
        </div>
      </div>

      <!-- Курс недоступен для покупки -->
      <div v-else-if="courseInfo && !courseInfo.is_available" class="bg-white rounded-2xl p-8 shadow-sm">
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-center">
          <p class="text-yellow-700">Онлайн-покупка этого курса временно недоступна</p>
        </div>
      </div>

      <!-- Форма -->
      <div v-else-if="courseInfo" class="bg-white rounded-2xl p-8 shadow-sm">

        <!-- Информация о курсе -->
        <div class="mb-6 p-4 bg-gray-50 rounded-xl">
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium text-gray-900">{{ courseInfo.course.title }}</p>
              <p class="text-sm text-gray-500" v-if="courseInfo.course.duration">
                {{ courseInfo.course.duration }}
              </p>
            </div>
            <div class="text-right">
              <p class="text-xl font-bold text-gray-900">
                {{ Number(courseInfo.price).toLocaleString() }} ₸
              </p>
            </div>
          </div>
        </div>

        <form @submit.prevent="handleSubmit">
          <!-- Email -->
          <div class="mb-4">
            <div class="relative">
              <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
                  class="peer w-full px-4 pt-7 pb-3 text-sm bg-gray-100 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-300 transition-all"
                  :class="{ 'border-red-500': errors.email }"
                  placeholder=" "
              />
              <label
                  for="email"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all pointer-events-none"
              >
                Email <span class="text-red-500">*</span>
              </label>
            </div>
            <p v-if="errors.email" class="mt-2 text-sm text-red-500">{{ errors.email }}</p>
          </div>

          <!-- Телефон -->
          <div class="mb-6">
            <div class="relative">
              <input
                  type="tel"
                  id="phone"
                  v-model="phoneDisplay"
                  @input="handlePhoneInput"
                  @focus="handlePhoneFocus"
                  maxlength="18"
                  class="peer w-full px-4 pt-7 pb-3 text-sm bg-gray-100 rounded-2xl border border-gray-200 focus:outline-none focus:border-gray-300 transition-all"
                  :class="{ 'border-red-500': errors.phone }"
                  placeholder=" "
              />
              <label
                  for="phone"
                  class="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all pointer-events-none"
              >
                Телефон
              </label>
            </div>
            <p v-if="errors.phone" class="mt-2 text-sm text-red-500">{{ errors.phone }}</p>
          </div>

          <!-- Общая ошибка -->
          <div v-if="errors.general" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p class="text-sm text-red-600">{{ errors.general }}</p>
          </div>

          <!-- Кнопка -->
          <button
              type="submit"
              :disabled="submitting"
              class="w-full py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ submitting ? 'Создание заказа...' : 'Перейти к оплате' }}
          </button>
        </form>

        <!-- Примечание -->
        <p class="mt-6 text-xs text-gray-500 text-center">
          Нажимая кнопку, вы соглашаетесь с условиями оферты
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { paymentsAPI } from '@/services/api.js';
import { useOrderCompletion } from '@/composables/useOrderCompletion.js';

const router = useRouter();
const route = useRoute();
const { setOrderToken } = useOrderCompletion();

// Состояние
const loading = ref(true);
const loadError = ref('');
const submitting = ref(false);
const courseInfo = ref(null);

const formData = ref({
  email: '',
  phone: ''
});

const phoneDisplay = ref('');

const errors = ref({
  email: '',
  phone: '',
  general: ''
});

// Загрузка информации о курсе
onMounted(async () => {
  const courseId = route.params.courseId;

  if (!courseId) {
    loadError.value = 'Курс не указан';
    loading.value = false;
    return;
  }

  try {
    const response = await paymentsAPI.getCourseInfo(courseId);
    courseInfo.value = response.data;
  } catch (err) {
    loadError.value = err.response?.data?.error || 'Ошибка загрузки курса';
  } finally {
    loading.value = false;
  }
});

// Форматирование телефона
const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';

  let formatted = '+7';
  if (numbers.length > 1) formatted += ' (' + numbers.substring(1, 4);
  if (numbers.length >= 5) formatted += ') ' + numbers.substring(4, 7);
  if (numbers.length >= 8) formatted += '-' + numbers.substring(7, 9);
  if (numbers.length >= 10) formatted += '-' + numbers.substring(9, 11);

  return formatted;
};

const handlePhoneInput = (event) => {
  let numbers = event.target.value.replace(/\D/g, '');

  if (numbers && numbers[0] !== '7') {
    numbers = '7' + numbers;
  }
  numbers = numbers.substring(0, 11);

  phoneDisplay.value = formatPhone(numbers);
  formData.value.phone = numbers ? '+' + numbers : '';

  if (errors.value.phone) errors.value.phone = '';
};

const handlePhoneFocus = () => {
  if (!phoneDisplay.value) {
    phoneDisplay.value = '+7 (';
    formData.value.phone = '+7';
  }
};

// Валидация
const validate = () => {
  errors.value = { email: '', phone: '', general: '' };
  let isValid = true;

  if (!formData.value.email.trim()) {
    errors.value.email = 'Email обязателен';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Введите корректный email';
    isValid = false;
  }

  if (formData.value.phone && formData.value.phone !== '+7') {
    const numbers = formData.value.phone.replace(/\D/g, '');
    if (numbers.length !== 11) {
      errors.value.phone = 'Телефон должен содержать 11 цифр';
      isValid = false;
    }
  }

  return isValid;
};

// Отправка формы
const handleSubmit = async () => {
  if (!validate()) return;

  submitting.value = true;
  errors.value.general = '';

  try {
    const response = await paymentsAPI.createOrder({
      course_slug: route.params.courseId,
      email: formData.value.email.toLowerCase().trim(),
      phone: formData.value.phone || ''
    });

    if (response.data.success) {
      // Сохраняем токен заказа
      setOrderToken(response.data.order_token);

      // Переходим на страницу оплаты
      router.push({
        name: 'Payment',
        params: { token: response.data.order_token }
      });
    }
  } catch (err) {
    errors.value.general = err.response?.data?.error || 'Ошибка создания заказа';
  } finally {
    submitting.value = false;
  }
};
</script>