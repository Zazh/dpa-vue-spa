<template>
  <MainLayout>
    <!-- Кнопка назад -->
    <section class="py-6 flex gap-8 items-center">
      <div>
        <button @click="goBack" class="btn-back">
          <span class="btn-back__icon">
            <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4949 0.743164L1.49487 9.74316L11.4949 18.7432" stroke="#fff" stroke-width="2"/>
            </svg>
          </span>
          <span class="btn-back__text">Назад</span>
        </button>
      </div>
    </section>

    <!-- Загрузка -->
    <section v-if="loading" class="py-8 text-center">
      <p class="text-gray-600">Загрузка курса...</p>
    </section>

    <!-- Ошибка -->
    <section v-else-if="error" class="py-8">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600">{{ error }}</p>
      </div>
    </section>

    <!-- Контент -->
    <section v-else class="w-full">
      <div class="courses-content">
        <!-- Левая колонка: Карточка курса -->
        <div class="lg:col-span-5 col-span-full">
          <div class="w-full lg:pr-12">
            <article class="courses-card">
              <div class="card_body">
                <div class="title">
                  <div class="w-full">
                    <h5 class="text-sm text-gray-700 font-bold mb-2">Курс</h5>
                    <h4 class="h3">{{ courseData?.title }}</h4>
                  </div>
                  <div>
                    <div class="size-12 rounded-lg flex justify-center items-center bg-green-600">
                      <span class="font-mono text-xl text-white">{{ courseData?.label || 'I' }}</span>
                    </div>
                  </div>
                </div>
                <div class="progress">
                  <div class="progress-info">
                    <ul class="progress-info__list">
                      <li class="progress-info__list--item">
                        <p>
                          <span class="lessons_count">{{ progressData?.completed_lessons_count }}/{{ totalLessons }}</span>
                          <span class="lessons_count--text">уроков</span>
                        </p>
                      </li>
                      <li class="progress-info__list--item">
                        <p>
                          <span class="lessons_time">{{ progressPercentage }}%</span>
                          <span class="lessons_time--text">пройдено</span>
                        </p>
                      </li>
                    </ul>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill">
                      <div class="progress-bar-fill__bar" :style="{ width: progressPercentage + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Правая колонка: Список модулей и уроков -->
        <div class="lg:col-span-7 col-span-full">
          <div class="program mt-14 lg:mt-0">
            <div class="program-block">
              <div>
                <h2 class="h2 font-medium text-gray-700">Список уроков</h2>
              </div>

              <div>
                <!-- Модули -->
                <ModuleItem
                    v-for="(module, index) in modules"
                    :key="module.id"
                    :module="module"
                    :module-number="index + 1"
                    :previous-module-completed="isPreviousModuleCompleted(index)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { coursesAPI } from '@/services/api.js';
import MainLayout from '@/layouts/MainLayout.vue';
import ModuleItem from '@/components/course/ModuleItem.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';

usePageMeta('Детали уроков', 'Личный кабинет');

const router = useRouter();
const route = useRoute();

const courseId = ref(parseInt(route.params.id));
const loading = ref(true);
const error = ref('');

// Данные курса и прогресса
const progressData = ref(null);
const modules = ref([]);

const courseData = computed(() => progressData.value?.course);
const progressPercentage = computed(() => {
  if (!progressData.value) return 0;
  return parseFloat(progressData.value.progress_percentage).toFixed(0);
});

const totalLessons = computed(() => {
  return modules.value.reduce((sum, module) => sum + module.total_lessons, 0);
});

// Загрузка данных
onMounted(async () => {
  await loadCourseProgress();
});

const loadCourseProgress = async () => {
  loading.value = true;
  error.value = '';

  try {
    console.log('📚 Загрузка прогресса курса:', courseId.value);
    const response = await coursesAPI.getCourseProgress(courseId.value);
    progressData.value = response.data;
    modules.value = response.data.modules || [];

    console.log('✅ Прогресс загружен:', progressData.value);
    console.log('📦 Модули:', modules.value);
  } catch (err) {
    console.error('❌ Ошибка загрузки курса:', err);

    if (err.response?.status === 404) {
      error.value = 'Курс не найден';
    } else if (err.response?.status === 401) {
      error.value = 'Необходима авторизация';
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.push({ name: 'CheckEmail' });
    } else {
      error.value = err.response?.data?.detail || 'Не удалось загрузить курс';
    }
  } finally {
    loading.value = false;
  }
};

// 🆕 ДОБАВЬТЕ: Проверка завершенности предыдущего модуля
const isPreviousModuleCompleted = (currentIndex) => {
  // Для первого модуля - нет предыдущего
  if (currentIndex === 0) {
    return false;
  }

  // Проверяем предыдущий модуль
  const previousModule = modules.value[currentIndex - 1];
  const completed = previousModule.completed_lessons;
  const total = previousModule.total_lessons;

  // Модуль завершен если все уроки пройдены
  return completed === total && total > 0;
};

const goBack = () => {
  router.push({ name: 'Dashboard' });
};
</script>