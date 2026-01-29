<template>
  <AuthLayout container-class="mt-3">
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Регистрация нового пользователя</h5>
      <h1 class="h1 font-bold">Завершите регистрацию</h1>
    </div>

    <form class="authorization-form__body" @submit.prevent="handleRegister">
      <div class="form">
        <!-- Фамилия -->
        <div class="form-field">
          <div class="input-field">
            <input  type="text"
                    id="last_name"
                    v-model="formData.last_name"
                    @input="validateName('last_name')"
                    required
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': errors.last_name }"
                    placeholder=" "/>

            <label  for="last_name"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all duration-200 pointer-events-none">
              Фамилия <span class="text-red-500">*</span>
            </label>
          </div>
          <div v-if="errors.last_name" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.last_name }}</span>
          </div>
        </div>

        <!-- Имя -->
        <div class="form-field">
          <div class="input-field">
            <input  type="text"
                    id="first_name"
                    v-model="formData.first_name"
                    @input="validateName('first_name')"
                    required
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': errors.first_name }"
                    placeholder=" "/>

            <label  for="first_name"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all duration-200 pointer-events-none">
              Имя <span class="text-red-500">*</span>
            </label>
          </div>
          <div v-if="errors.first_name" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.first_name }}</span>
          </div>
        </div>

        <!-- Отчество -->
        <div class="form-field">
          <div class="input-field">
            <input  type="text"
                    id="middle_name"
                    v-model="formData.middle_name"
                    @input="validateName('middle_name')"
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': errors.middle_name }"
                    placeholder=" "/>

            <label  for="middle_name"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                  peer-focus:top-4 peer-focus:text-xs
                  peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                  transition-all duration-200 pointer-events-none">
              Отчество
            </label>
          </div>
          <div v-if="errors.middle_name" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.middle_name }}</span>
          </div>
        </div>

        <!-- ИИН -->
        <div class="form-field">
          <div class="input-field">
            <input  type="text"
                    id="iin"
                    required
                    v-model="formData.iin"
                    maxlength="12"
                    @input="validateIIN"
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': errors.iin }"
                    placeholder=" "/>

            <label  for="iin"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                    peer-focus:top-4 peer-focus:text-xs
                    peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                    transition-all duration-200 pointer-events-none">
              ИИН <span class="text-red-500">*</span>
            </label>
          </div>
          <div v-if="errors.iin" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.iin }}</span>
          </div>
        </div>

        <div>
          <span class="text-sm text-gray-700">Должны совпадать с данными в удостоверении личности</span>
        </div>
      </div>

      <div class="form">
        <h5 class="text-black text-lg font-medium">Контактная информация</h5>

        <!-- Email (readonly) -->
        <div class="form-field">
          <div class="input-field">
            <input  type="email"
                    id="email"
                    v-model="formData.email"
                    required
                    readonly
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200 cursor-not-allowed"
                    :class="{ 'border-red-500': errors.email }"
                    placeholder=" "/>

            <label  for="email"
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
            <span class="text-xs text-gray-700">Мы отправим подтверждения и квитанции вам на почту</span>
          </div>
        </div>

        <!-- Телефон с маской -->
        <div class="form-field">
          <div class="input-field">
            <input  type="tel"
                    id="phone"
                    v-model="phoneDisplay"
                    @input="handlePhoneInput"
                    @focus="handlePhoneFocus"
                    maxlength="18"
                    placeholder=" "
                    class="peer w-full px-4 pt-7 pb-3 font-medium text-sm bg-gray-100 rounded-2xl border-1 border-gray-200 focus:outline-none focus:border-gray-300 focus:text-black transition-all duration-200"
                    :class="{ 'border-red-500': errors.phone }"/>

            <label  for="phone"
                    class="absolute left-4 top-1/2 font-medium -translate-y-1/2 text-sm text-gray-700
                    peer-focus:top-4 peer-focus:text-xs
                    peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs
                    transition-all duration-200 pointer-events-none">
              Телефон <span class="text-red-500">*</span>
            </label>
          </div>
          <div v-if="errors.phone" class="pt-3">
            <span class="text-sm text-red-500">{{ errors.phone }}</span>
          </div>

        </div>
      </div>

      <!-- Общая ошибка (если есть) -->
      <div v-if="errors.general" class="mb-4">
        <div class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <span class="text-sm text-red-600">{{ errors.general }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-6">
        <button type="submit" :disabled="loading" class="w-full text-sm bg-black text-white font-medium cursor-pointer hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full py-4">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <ul class="flex flex-col gap-3 text-center [ text-sm font-medium text-black underline ]">
          <li><a href="#" @click.prevent="goBack" class="hover:text-blue-600">У меня есть аккаунт</a></li>
        </ul>
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
import { usePageMeta } from '@/composables/usePageMeta.js';
import Politics from "@/components/ui/Politics.vue";

usePageMeta('Регистрация', 'Завершите регистрацию для доступа к платформе');

const router = useRouter();
const loading = ref(false);

// Объект для хранения ошибок по каждому полю
const errors = ref({
  first_name: '',
  last_name: '',
  middle_name: '',
  iin: '',
  email: '',
  phone: '',
  general: ''
});

const formData = ref({
  email: '',
  first_name: '',
  last_name: '',
  middle_name: '',
  iin: '',
  phone: '',
});

// Отображаемое значение телефона с маской
const phoneDisplay = ref('');

onMounted(() => {
  const savedEmail = sessionStorage.getItem('email');
  if (savedEmail) {
    formData.value.email = savedEmail;
  } else {
    router.push({ name: 'CheckEmail' });
  }
});

// Очистка всех ошибок
const clearErrors = () => {
  errors.value = {
    first_name: '',
    last_name: '',
    middle_name: '',
    iin: '',
    email: '',
    phone: '',
    general: ''
  };
};

// Валидация имен (кириллица, латиница, дефис и пробелы)
const validateName = (field) => {
  const value = formData.value[field];

  // Разрешаем кириллицу, латиницу, дефис и пробелы
  const cleanedValue = value.replace(/[^а-яёА-ЯЁa-zA-Z\s\-]/g, '');
  formData.value[field] = cleanedValue;

  // Очищаем ошибку при вводе
  if (errors.value[field]) {
    errors.value[field] = '';
  }
};

// Валидация ИИН (только цифры)
const validateIIN = (event) => {
  const value = event.target.value;
  formData.value.iin = value.replace(/\D/g, '');

  if (errors.value.iin) {
    errors.value.iin = '';
  }
};

// Форматирование телефона
const formatPhone = (value) => {
  // Убираем все кроме цифр
  const numbers = value.replace(/\D/g, '');

  // Если пусто, возвращаем пустую строку
  if (!numbers) return '';

  // Формируем маску +7 (XXX) XXX-XX-XX
  let formatted = '+7';

  if (numbers.length > 1) {
    formatted += ' (' + numbers.substring(1, 4);
  }
  if (numbers.length >= 5) {
    formatted += ') ' + numbers.substring(4, 7);
  }
  if (numbers.length >= 8) {
    formatted += '-' + numbers.substring(7, 9);
  }
  if (numbers.length >= 10) {
    formatted += '-' + numbers.substring(9, 11);
  }

  return formatted;
};

// Обработка ввода телефона
const handlePhoneInput = (event) => {
  const value = event.target.value;
  const numbers = value.replace(/\D/g, '');

  // Убеждаемся что первая цифра 7
  let cleanNumbers = numbers;
  if (numbers && numbers[0] !== '7') {
    cleanNumbers = '7' + numbers;
  }

  // Ограничиваем 11 цифрами (7 + 10 цифр номера)
  cleanNumbers = cleanNumbers.substring(0, 11);

  // Форматируем для отображения
  phoneDisplay.value = formatPhone(cleanNumbers);

  // Сохраняем чистое значение для отправки на сервер
  formData.value.phone = cleanNumbers ? '+' + cleanNumbers : '';

  // Очищаем ошибку
  if (errors.value.phone) {
    errors.value.phone = '';
  }
};

// При фокусе на поле телефона
const handlePhoneFocus = () => {
  if (!phoneDisplay.value) {
    phoneDisplay.value = '+7 (';
    formData.value.phone = '+7';
  }
};

// Клиентская валидация перед отправкой
const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!formData.value.last_name.trim()) {
    errors.value.last_name = 'Фамилия обязательна';
    isValid = false;
  } else if (!/^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(formData.value.last_name)) {
    errors.value.last_name = 'Фамилия должна содержать только буквы';
    isValid = false;
  }

// Валидация имени
  if (!formData.value.first_name.trim()) {
    errors.value.first_name = 'Имя обязательно';
    isValid = false;
  } else if (!/^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(formData.value.first_name)) {
    errors.value.first_name = 'Имя должно содержать только буквы';
    isValid = false;
  }

// Валидация отчества (если заполнено)
  if (formData.value.middle_name && !/^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(formData.value.middle_name)) {
    errors.value.middle_name = 'Отчество должно содержать только буквы';
    isValid = false;
  }

  // Валидация ИИН
  if (!formData.value.iin.trim()) {
    errors.value.iin = 'ИИН обязателен';
    isValid = false;
  } else if (formData.value.iin.length !== 12) {
    errors.value.iin = 'ИИН должен содержать ровно 12 цифр';
    isValid = false;
  } else if (!/^\d{12}$/.test(formData.value.iin)) {
    errors.value.iin = 'ИИН должен содержать только цифры';
    isValid = false;
  }

  // Валидация email
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email обязателен';
    isValid = false;
  }

  // Валидация телефона (обязательное поле)
  if (!formData.value.phone || formData.value.phone === '+7') {
    errors.value.phone = 'Телефон обязателен для заполнения';
    isValid = false;
  } else {
    const numbers = formData.value.phone.replace(/\D/g, '');
    if (numbers.length !== 11) {
      errors.value.phone = 'Телефон должен содержать 11 цифр';
      isValid = false;
    }
  }

  return isValid;
};

const handleRegister = async () => {
  // Клиентская валидация
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  clearErrors();

  try {
    // Получаем referral_token из localStorage если есть
    const referralToken = localStorage.getItem('referral_token');

    // Подготовка данных для отправки
    const payload = {
      email: formData.value.email,
      first_name: formData.value.first_name,
      last_name: formData.value.last_name,
      middle_name: formData.value.middle_name || '',
      iin: formData.value.iin,
      phone: formData.value.phone || null,
    };

    // Добавляем referral_token если есть
    if (referralToken) {
      payload.referral_token = referralToken;
    }

    // Отправляем с referral_token
    const response = await accountAPI.register(payload);

    sessionStorage.setItem('registration_email', formData.value.email);
    sessionStorage.removeItem('email');

    router.push({ name: 'EmailSent' });

  } catch (err) {
    console.log('Ошибка:', err.response?.data);

    if (err.response?.data) {
      const serverErrors = err.response.data;

      if (serverErrors.error) {
        errors.value.general = serverErrors.error;
      }
      else if (typeof serverErrors === 'object') {
        Object.keys(serverErrors).forEach(field => {
          const messages = serverErrors[field];
          const errorText = Array.isArray(messages) ? messages.join(', ') : messages;

          if (errors.value.hasOwnProperty(field)) {
            errors.value[field] = errorText;
          } else {
            if (!errors.value.general) {
              errors.value.general = '';
            }
            errors.value.general += `${field}: ${errorText}; `;
          }
        });
      }
    } else {
      errors.value.general = 'Ошибка при регистрации. Попробуйте позже.';
    }
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