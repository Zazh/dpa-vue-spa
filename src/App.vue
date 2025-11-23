<template>
  <router-view v-if="initialized" />
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Загрузка...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const initialized = ref(false);

onMounted(async () => {
  console.log('🚀 App.vue: Проверяем авторизацию...');
  await authStore.ensureAuth();
  initialized.value = true;
  console.log('✅ App.vue: Проверка завершена');
});
</script>