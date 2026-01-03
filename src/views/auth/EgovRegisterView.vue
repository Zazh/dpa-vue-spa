<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Регистрация через eGov Mobile</h5>
      <h1 class="h1 font-bold">Завершите регистрацию</h1>
    </div>

    <!-- Если нет данных eGov -->
    <div v-if="!registrationToken">
      <div class="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
        <span class="text-sm text-red-600">Данные eGov не найдены. Пожалуйста, начните авторизацию заново.</span>
      </div>
      <button
          @click="goToEgovAuth"
          class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 rounded-full py-4">
        Начать заново
      </button>
    </div>

    <!-- Форма регистрации -->
    <form v-else class="authorization-form__body" @submit.prevent="handleRegister">
      <div class="form">
        <!-- ФИО из eGov (readonly) -->
        <div class="form-field">
          <div class="input-field">
            <input
                type="text"
                id="last_name"
                v-model="formData.last_name"
                readonly
                class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 cursor-not-allowed"
                placeholder=" "/>
            <label
                for="last_name"
                class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                peer-focus:top-4 peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                transition-all duration-200 pointer-events-none">
              Фамилия
            </label>
          </div>
        </div>

        <div class="form-field">
          <div class="input-field">
            <input
                type="text"
                id="first_name"
                v-model="formData.first_name"
                readonly
                class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 cursor-not-allowed"
                placeholder=" "/>
            <label
                for="first_name"
                class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                peer-focus:top-4 peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                transition-all duration-200 pointer-events-none">
              Имя
            </label>
          </div>
        </div>

        <div class="form-field">
          <div class="input-field">
            <input
                type="text"
                id="middle_name"
                v-model="formData.middle_name"
                readonly
                class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 cursor-not-allowed"
                placeholder=" "/>
            <label
                for="middle_name"
                class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                peer-focus:top-4 peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                transition-all duration-200 pointer-events-none">
              Отчество
            </label>
          </div>
        </div>

        <!-- ИИН из eGov (readonly) -->
        <div class="form-field">
          <div class="input-field">
            <input
                type="text"
                id="iin"
                v-model="formData.iin"
                readonly
                class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 cursor-not-allowed"
                placeholder=" "/>
            <label
                for="iin"
                class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                peer-focus:top-4 peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                transition-all duration-200 pointer-events-none">
              ИИН
            </label>
          </div>
        </div>

        <div>
          <span class="text-sm text-gray-500">Данные получены из eGov Mobile</span>
        </div>
      </div>

      <div class="form">
        <h5 class="text-black text-lg font-medium">Контактная информация</h5>

        <!-- Email (активное поле) -->
        <div class="form-field">
          <div class="input-field">
            <input
                type="email"
                id="email"
                v-model="formData.email"
                required
                class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                :class="{ 'border-red-500': errors.email }"
                placeholder=" "/>
            <label
                for="email"
                class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                peer-focus:top-4 peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                transition-all duration-200 pointer-events-none">
              Email <span class="text-red-500">*</span>
            </label>
          </div>
          <div v-if="errors.email" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.email }}</span>
          </div>
          <div v-else class="pt-1">
            <span class="text-xs text-gray-700">Мы отправим подтверждение на эту почту</span>
          </div>
        </div>

        <!-- Телефон -->
        <div class="form-field">
          <div class="input-field">
            <input
                type="tel"
                id="phone"
                v-model="phoneDisplay"
                @input="handlePhoneInput"
                @focus="handlePhoneFocus"
                maxlength="18"
                class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                :class="{ 'border-red-500': errors.phone }"
                placeholder=" "/>
            <label
                for="phone"
                class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                peer-focus:top-4 peer-focus:text-xs
                peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                transition-all duration-200 pointer-events-none">
              Телефон
            </label>
          </div>
          <div v-if="errors.phone" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.phone }}</span>
          </div>
        </div>
      </div>

      <!-- Общая ошибка -->
      <div v-if="errors.general" class="mb-4">
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <span class="text-sm text-red-600">{{ errors.general }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <button
            type="submit"
            :disabled="loading"
            class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full py-4">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>

        <button
            type="button"
            @click="goBack"
            class="w-full text-sm text-center text-gray-600 underline hover:text-gray-800">
          Вернуться назад
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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { accountAPI } from '@/services/api.js';
import AuthLayout from '@/layouts/AuthLayout.vue';
import Politics from '@/components/ui/Politics.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';

usePageMeta('Регистрация через eGov', 'Завершите регистрацию');

const router = useRouter();
const loading = ref(false);

const registrationToken = ref('');
const phoneDisplay = ref('');

const formData = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  iin: '',
  email: '',
  phone: ''
});

const errors = ref({
  email: '',
  phone: '',
  general: ''
});

onMounted(() => {
  const token = sessionStorage.getItem('egov_registration_token');
  const dataStr = sessionStorage.getItem('egov_registration_data');

  if (!token || !dataStr) {
    registrationToken.value = '';
    return;
  }

  registrationToken.value = token;

  try {
    const data = JSON.parse(dataStr);

    // Логируем что пришло
    console.log('📦 registration_data от eGov:', data);
    console.log('Ключи:', Object.keys(data));

    formData.value.first_name = data.first_name || '';
    formData.value.last_name = data.last_name || '';
    formData.value.middle_name = data.middle_name || '';
    formData.value.iin = data.iin || '';
  } catch (e) {
    console.error('Ошибка парсинга данных eGov:', e);
    registrationToken.value = '';
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
  const value = event.target.value;
  let numbers = value.replace(/\D/g, '');

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

const clearErrors = () => {
  errors.value = { email: '', phone: '', general: '' };
};

const validateForm = () => {
  clearErrors();
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

const handleRegister = async () => {
  if (!validateForm()) return;

  loading.value = true;
  clearErrors();

  try {
    const payload = {
      registration_token: registrationToken.value,
      email: formData.value.email,
      phone: formData.value.phone || null
    };

    await accountAPI.egovCompleteRegistration(payload);

    // Очищаем данные eGov из sessionStorage
    sessionStorage.removeItem('egov_registration_token');
    sessionStorage.removeItem('egov_registration_data');

    // Сохраняем email для EmailSentView
    sessionStorage.setItem('registration_email', formData.value.email);

    // Переходим на страницу "письмо отправлено"
    router.push({ name: 'EmailSent' });

  } catch (err) {
    console.error('Ошибка регистрации:', err);

    if (err.response?.data) {
      const serverErrors = err.response.data;

      if (serverErrors.error) {
        errors.value.general = serverErrors.error;
      } else if (serverErrors.email) {
        errors.value.email = Array.isArray(serverErrors.email)
            ? serverErrors.email.join(', ')
            : serverErrors.email;
      } else if (serverErrors.phone) {
        errors.value.phone = Array.isArray(serverErrors.phone)
            ? serverErrors.phone.join(', ')
            : serverErrors.phone;
      } else {
        errors.value.general = 'Ошибка при регистрации. Попробуйте позже.';
      }
    } else {
      errors.value.general = 'Ошибка при регистрации. Попробуйте позже.';
    }
  } finally {
    loading.value = false;
  }
};

const goToEgovAuth = () => {
  router.push({ name: 'EgovAuth' });
};

const goBack = () => {
  router.push({ name: 'EgovAuth' });
};
</script>