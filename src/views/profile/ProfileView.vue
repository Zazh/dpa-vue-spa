<template>
  <MainLayout>
    <section class="hero [ py-6 ]">
      <h1 class="display-1"><span id="hero-welcome">Добрый день</span>, <span class="" id="hero-student-name">{{ user?.first_name || 'Не указано' }}</span></h1>
    </section>

    <section class="courses [ py-8 ]">
      <div class="w-full">
        <ul class="courses-nav">
          <li><button class="courses-nav--item active">Все курсы</button></li>
          <li><button class="courses-nav--item">Мои курсы</button></li>
        </ul>
      </div>

      <div class="w-full">
        <div class="courses-content">
          <article class="courses-card col-span-full md:col-span-6 lg:col-span-4 base-card">
            <div class="card_body">
              <div class="title">
                <div class="w-full">
                  <h4 class="h4">Категория 1, дроны <br> до 250 гр.</h4>
                </div>
                <div>
                  <div class="size-12 rounded-lg flex justify-center items-center [ bg-green-600 ]">
                    <span class="font-mono text-xl text-white">I</span>
                  </div>
                </div>
              </div>
              <div class="progress">
                <div class="progress-info">
                  <ul class="progress-info__list">
                    <li class="progress-info__list--item">
                      <p>
                        <span class="lessons_count">30</span> <span class="lessons_count--text">уроков</span>
                      </p>
                    </li>
                    <li class="progress-info__list--item">
                      <span>
                        <svg class="size-4 mb-0.5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.5 4.5V7.5L9.75 9.75M14.25 7.5C14.25 11.2279 11.2279 14.25 7.5 14.25C3.77208 14.25 0.75 11.2279 0.75 7.5C0.75 3.77208 3.77208 0.75 7.5 0.75C11.2279 0.75 14.25 3.77208 14.25 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>
                      </span>
                      <p>
                        <span class="lessons_time">12</span> <span class="lessons_time--text">часов</span>
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <div class="dashboard-container">
      <div class="header-section">
        <button @click="handleLogout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Выйти
        </button>
      </div>

      <div v-if="loading" class="py-8 text-center">
        <p class="text-gray-600">Загрузка...</p>
      </div>

      <div v-else-if="error" class="py-8">
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>

      <div v-else-if="user" class="profile-card bg-white rounded-lg shadow p-6 mt-6">
        <h2 class="text-xl font-semibold mb-4">Информация о профиле</h2>

        <div class="profile-info space-y-3">
          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">Email:</span>
            <span class="value text-gray-900">{{ user.email }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">ФИО:</span>
            <span class="value text-gray-900">{{ user.full_name || 'Не указано' }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">Имя:</span>
            <span class="value text-gray-900">{{ user.first_name || 'Не указано' }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">Фамилия:</span>
            <span class="value text-gray-900">{{ user.last_name || 'Не указано' }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">Отчество:</span>
            <span class="value text-gray-900">{{ user.middle_name || 'Не указано' }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">ИИН:</span>
            <span class="value text-gray-900">{{ user.iin || 'Не указано' }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">Телефон:</span>
            <span class="value text-gray-900">{{ user.phone || 'Не указано' }}</span>
          </div>

          <div class="info-row flex justify-between py-2 border-b">
            <span class="label font-medium text-gray-700">Статус:</span>
            <span class="value">
              <span
                  :class="user.is_verified ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                {{ user.is_verified ? 'Подтвержден' : 'Не подтвержден' }}
              </span>
            </span>
          </div>

          <div class="info-row flex justify-between py-2">
            <span class="label font-medium text-gray-700">Дата регистрации:</span>
            <span class="value text-gray-900">{{ formatDate(user.date_joined) }}</span>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';

usePageMeta('Dashboard', 'Личный кабинет');

const router = useRouter();
const authStore = useAuthStore(); // ← ДОБАВЛЕНО

// ✅ ИЗМЕНЕНО: используем данные из Store
const user = computed(() => authStore.user);

// ✅ ИЗМЕНЕНО: logout через Store
const handleLogout = async () => {
  await authStore.logout(); // ← Теперь async и через Store
  router.push({ name: 'CheckEmail' });
};

const formatDate = (dateString) => {
  if (!dateString) return 'Не указано';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>