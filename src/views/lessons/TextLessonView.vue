<template>
  <MainLayout>
    <!-- Кнопка назад и заголовок -->
    <section class="py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-8">
      <div class="col-span-full md:col-span-2">
        <button @click="goBack" class="btn-back">
          <span class="btn-back__icon">
            <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4949 0.743164L1.49487 9.74316L11.4949 18.7432" stroke="#fff" stroke-width="2"/>
            </svg>
          </span>
          <span class="btn-back__text">Назад</span>
        </button>
      </div>
      <div class="col-span-full md:col-span-10 flex items-center">
        <h2 v-if="lesson" class="h2 font-bold text-black leading-tight mt-3">
          {{ lesson.title }}
        </h2>
      </div>
    </section>

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-xl">Загрузка урока...</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-xl text-red-600">{{ error }}</div>
    </div>

    <!-- Контент текстового урока -->
    <section v-else-if="lesson && text" class="w-full">
      <div class="courses-content">

        <!-- Основной контент -->
        <div class="col-span-full md:col-span-8 md:col-start-3">

          <!-- Информация о чтении -->
          <div class="mb-6 flex items-center gap-4 text-sm text-gray-600 flex-wrap">
            <span class="flex items-center gap-1">
              <svg class="w-5 h-5 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ text.estimated_reading_time }} мин. чтения
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-5 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              {{ text.word_count }} слов
            </span>
          </div>

          <!-- Описание урока (если есть) -->
          <div v-if="lesson.description" class="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p class="text-gray-700 text-lg">{{ lesson.description }}</p>
          </div>

          <!-- Контент урока -->
          <div
              class="prose prose-lg max-w-none lesson-content "
              v-html="text.content"
          ></div>

          <!-- Материалы к уроку -->
          <div v-if="materials?.length > 0" class="mt-12">
            <h3 class="text-2xl font-bold text-black mb-4">Материалы к уроку</h3>
            <ul class="flex flex-col gap-3">
              <li
                  v-for="material in materials"
                  :key="material.id"
                  class="border border-gray-300 rounded-md text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-colors"
              >
                <a
                    :href="material.file || material.url"
                    :download="material.file ? true : false"
                    target="_blank"
                    class="flex gap-4 items-center py-4 px-4 w-full"
                >
                  <span class="text-blue-600">
                    <svg class="h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id="File / File_Download">
                        <path id="Vector" d="M12 12V18M12 18L15 16M12 18L9 16M13 3.00087C12.9045 3 12.7973 3 12.6747 3H8.2002C7.08009 3 6.51962 3 6.0918 3.21799C5.71547 3.40973 5.40973 3.71547 5.21799 4.0918C5 4.51962 5 5.08009 5 6.2002V17.8002C5 18.9203 5 19.4801 5.21799 19.9079C5.40973 20.2842 5.71547 20.5905 6.0918 20.7822C6.5192 21 7.07899 21 8.19691 21H15.8031C16.921 21 17.48 21 17.9074 20.7822C18.2837 20.5905 18.5905 20.2842 18.7822 19.9079C19 19.4805 19 18.9215 19 17.8036V9.32568C19 9.20296 19 9.09561 18.9991 9M13 3.00087C13.2856 3.00347 13.4663 3.01385 13.6388 3.05526C13.8429 3.10425 14.0379 3.18526 14.2168 3.29492C14.4186 3.41857 14.5918 3.59182 14.9375 3.9375L18.063 7.06298C18.4089 7.40889 18.5809 7.58136 18.7046 7.78319C18.8142 7.96214 18.8953 8.15726 18.9443 8.36133C18.9857 8.53376 18.9963 8.71451 18.9991 9M13 3.00087V5.8C13 6.9201 13 7.47977 13.218 7.90759C13.4097 8.28392 13.7155 8.59048 14.0918 8.78223C14.5192 9 15.079 9 16.1969 9H18.9991M18.9991 9H19.0002" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                    </svg>
                  </span>
                  <div class="flex flex-col text-sm gap-1 font-medium flex-1">
                    <span class="leading-tight">{{ material.title }}</span>
                    <span v-if="material.description" class="leading-tight text-xs text-gray-600">
                      {{ material.description }}
                    </span>
                  </div>
                  <span class="text-blue-600">
                    <svg class="h-7" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3333C0 7.04793 -1.19209e-07 3.90524 1.95263 1.95263C3.90524 -1.19209e-07 7.04793 0 13.3333 0C19.6187 0 22.7615 -1.19209e-07 24.714 1.95263C26.6667 3.90524 26.6667 7.04793 26.6667 13.3333C26.6667 19.6187 26.6667 22.7615 24.714 24.714C22.7615 26.6667 19.6187 26.6667 13.3333 26.6667C7.04793 26.6667 3.90524 26.6667 1.95263 24.714C-1.19209e-07 22.7615 0 19.6187 0 13.3333ZM13.3333 5.66667C13.8856 5.66667 14.3333 6.11439 14.3333 6.66667V13.5857L16.6263 11.2929C17.0168 10.9024 17.6499 10.9024 18.0404 11.2929C18.4309 11.6835 18.4309 12.3165 18.0404 12.7071L14.0404 16.7071C13.8529 16.8947 13.5985 17 13.3333 17C13.0681 17 12.8137 16.8947 12.6263 16.7071L8.62623 12.7071C8.23571 12.3165 8.23571 11.6835 8.62623 11.2929C9.01675 10.9024 9.64992 10.9024 10.0404 11.2929L12.3333 13.5857V6.66667C12.3333 6.11439 12.7811 5.66667 13.3333 5.66667ZM8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21H18.6667C19.2189 21 19.6667 20.5523 19.6667 20C19.6667 19.4477 19.2189 19 18.6667 19H8Z" fill="currentColor"/>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { lessonsAPI } from '@/services/api';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta';

const route = useRoute();
const router = useRouter();

// Состояния
const loading = ref(true);
const error = ref(null);
const lesson = ref(null);
const text = ref(null);
const progress = ref(null);
const materials = ref([]);

usePageMeta('Текстовый урок', 'Личный кабинет');

// Загрузка урока
onMounted(async () => {
  await loadLesson();
});

// Загрузить урок
async function loadLesson() {
  try {
    loading.value = true;
    error.value = null;

    console.log('📥 Загружаем текстовый урок:', route.params.id);

    const response = await lessonsAPI.getLesson(route.params.id);

    lesson.value = response.data.lesson;
    text.value = response.data.text;
    progress.value = response.data.progress;
    materials.value = response.data.materials || [];

    console.log('✅ Текстовый урок загружен:', lesson.value.title);
    console.log('📝 Контент:', text.value);
    console.log('✅ Урок автоматически завершен при открытии');

  } catch (err) {
    console.error('❌ Ошибка загрузки урока:', err);
    error.value = err.response?.data?.error || 'Не удалось загрузить урок';
  } finally {
    loading.value = false;
  }
}

// Кнопка назад
function goBack() {
  router.back();
}
</script>

<style scoped>
/* Стили для текстового контента с HTML */
.lesson-content {
  line-height: 1.8;
  color: #374151;
}

.lesson-content :deep(h1) {
  font-size: 2.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #111827;
}

.lesson-content :deep(h2) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.875rem;
  color: #111827;
}

.lesson-content :deep(h3) {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.lesson-content :deep(p) {
  margin-bottom: 1.25rem;
}

.lesson-content :deep(ul),
.lesson-content :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
  list-style-position: outside;
}

.lesson-content :deep(ul) {
  list-style-type: disc;
}

.lesson-content :deep(ol) {
  list-style-type: decimal;
}

.lesson-content :deep(li) {
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
}

.lesson-content :deep(strong),
.lesson-content :deep(b) {
  font-weight: 600;
  color: #111827;
}

.lesson-content :deep(em),
.lesson-content :deep(i) {
  font-style: italic;
}

.lesson-content :deep(a) {
  color: #2563eb;
  text-decoration: underline;
}

.lesson-content :deep(a:hover) {
  color: #1d4ed8;
}

.lesson-content :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  font-family: ui-monospace, monospace;
  color: #1f2937;
}

.lesson-content :deep(pre) {
  background-color: #1f2937;
  color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1.25rem;
  font-family: ui-monospace, monospace;
}

.lesson-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}

.lesson-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding-left: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-style: italic;
  color: #6b7280;
  background-color: #f9fafb;
  margin: 1.5rem 0;
  border-radius: 0 0.25rem 0.25rem 0;
}

.lesson-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.lesson-content :deep(hr) {
  border: none;
  border-top: 2px solid #e5e7eb;
  margin: 2rem 0;
}

.lesson-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.lesson-content :deep(table th),
.lesson-content :deep(table td) {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.lesson-content :deep(table th) {
  background-color: #f3f4f6;
  font-weight: 600;
}
</style>