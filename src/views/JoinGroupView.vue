<template>
  <AuthLayout>
    <div class="authorization-form__header">
      <h5 class="font-medium text-gray-700">Переход по приглашению</h5>
      <h1 class="h1 font-bold">Загрузка...</h1>
    </div>

    <div class="py-8 text-center">
      <p class="text-gray-600">Обработка приглашения...</p>
    </div>
  </AuthLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { groupsAPI } from '@/services/api';
import AuthLayout from '@/layouts/AuthLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta('Приглашение в группу', 'Обработка приглашения');

const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const token = route.params.token;

  if (!token) {
    router.push({ name: 'CheckEmail' });
    return;
  }

  // Сохраняем токен в localStorage
  localStorage.setItem('referral_token', token);

  // Проверяем авторизацию
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (isAuthenticated) {
    // Авторизован → автоматически присоединяем к группе
    try {
      const response = await groupsAPI.joinGroup(token);
      localStorage.removeItem('referral_token');

      // 🆕 ДОБАВЬТЕ: Передаем сообщение об успехе
      const message = response.data.message || 'Вы успешно присоединились к группе';
      const groupName = response.data.enrollment?.group || '';

      router.push({
        name: 'Dashboard',
        query: {
          joined: 'true',
          message: message,
          group: groupName
        }
      });
    } catch (err) {
      console.error('Ошибка присоединения к группе:', err);
      localStorage.removeItem('referral_token');

      // 🆕 ДОБАВЬТЕ: Передаем ошибку
      const errorMsg = err.response?.data?.error || 'Не удалось присоединиться к группе';

      router.push({
        name: 'Dashboard',
        query: {
          error: errorMsg
        }
      });
    }
  } else {
    // НЕ авторизован → на CheckEmail для регистрации/входа
    router.push({ name: 'CheckEmail' });
  }
});
</script>