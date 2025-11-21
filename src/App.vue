<template>
  <router-view v-if="authStore.initialized" />
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Загрузка...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(async () => {
  // Проверяем авторизацию при загрузке приложения
  await authStore.ensureAuth();
});
</script>

<style>
/* Можно добавить глобальные стили если нужно */
</style>