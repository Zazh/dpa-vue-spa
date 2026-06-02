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
            <article class="courses-card base-card">
              <div class="card_body">
                <div class="title">
                  <div class="w-full">
                    <h5 class="text-sm text-gray-700 font-bold mb-2">Оффлайн-курс</h5>
                    <h4 class="h3">{{ course?.title }}</h4>
                  </div>
                  <div>
                    <div class="size-12 rounded-lg flex justify-center items-center bg-amber-500">
                      <span class="font-mono text-xl text-white">{{ course?.label || 'O' }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="course?.description" class="mt-4">
                  <p class="text-sm text-gray-700 leading-relaxed">{{ course.description }}</p>
                </div>

                <div class="progress mt-6">
                  <div class="progress-completed">
                    <ul class="progress-completed__list">
                      <li class="progress-completed__list--item">
                        <span>
                          <svg class="size-5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 1.5 11.3 6.16l5.2.76-3.75 3.66.88 5.17L9 13.31l-4.63 2.44.88-5.17L1.5 6.92l5.2-.76L9 1.5Z" fill="#F59E0B"/>
                          </svg>
                        </span>
                        <p>Оффлайн-курс</p>
                      </li>
                      <li v-if="isGraduated" class="progress-completed__list--item">
                        <span>
                          <svg class="size-5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.16909 2.7729C8.0664 1.51662 9.93353 1.51662 10.8309 2.7729L10.9738 2.9729C11.1316 3.194 11.3969 3.31239 11.6669 3.28239L12.3036 3.21164C13.7367 3.05241 14.9476 4.26329 14.7884 5.69635L14.7176 6.33311C14.6876 6.60315 14.806 6.86831 15.0271 7.02623L15.2271 7.16909C16.4834 8.0664 16.4834 9.93353 15.2271 10.8309L15.0271 10.9738C14.806 11.1316 14.6876 11.3969 14.7176 11.6669L14.7884 12.3036C14.9476 13.7367 13.7367 14.9476 12.3036 14.7884L11.6669 14.7176C11.3969 14.6876 11.1316 14.806 10.9738 15.0271L10.8309 15.2271C9.93353 16.4834 8.06648 16.4834 7.16909 15.2271L7.02623 15.0271C6.86831 14.806 6.60315 14.6876 6.33311 14.7176L5.69635 14.7884C4.26329 14.9476 3.05241 13.7367 3.21164 12.3036L3.28239 11.6669C3.31239 11.3969 3.194 11.1316 2.9729 10.9738L2.7729 10.8309C1.51662 9.93353 1.51662 8.06648 2.7729 7.16909L2.9729 7.02623C3.194 6.86831 3.31239 6.60315 3.28239 6.33311L3.21164 5.69635C3.05241 4.26329 4.26329 3.05241 5.69635 3.21164L6.33311 3.28239C6.60315 3.31239 6.86831 3.194 7.02623 2.9729L7.16909 2.7729ZM11.7803 6.96967C12.0732 7.26257 12.0732 7.73745 11.7803 8.03032L8.91615 10.8945C8.54827 11.2625 7.95173 11.2625 7.58385 10.8945L6.21967 9.53032C5.92678 9.23745 5.92678 8.76255 6.21967 8.46968C6.51257 8.1768 6.98744 8.1768 7.28033 8.46968L8.25 9.43935L10.7197 6.96967C11.0126 6.67678 11.4875 6.67678 11.7803 6.96967Z" fill="#2F8152"/>
                          </svg>
                        </span>
                        <p>Выпускник</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <a
                  v-if="certificateUrl"
                  :href="certificateUrl"
                  target="_blank"
                  download
                  class="card_footer cursor-pointer"
              >
                <div class="icon">
                  <svg class="h-7" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3333C0 7.04793 -1.19209e-07 3.90524 1.95263 1.95263C3.90524 -1.19209e-07 7.04793 0 13.3333 0C19.6187 0 22.7615 -1.19209e-07 24.714 1.95263C26.6667 3.90524 26.6667 7.04793 26.6667 13.3333C26.6667 19.6187 26.6667 22.7615 24.714 24.714C22.7615 26.6667 19.6187 26.6667 13.3333 26.6667C7.04793 26.6667 3.90524 26.6667 1.95263 24.714C-1.19209e-07 22.7615 0 19.6187 0 13.3333ZM13.3333 5.66667C13.8856 5.66667 14.3333 6.11439 14.3333 6.66667V13.5857L16.6263 11.2929C17.0168 10.9024 17.6499 10.9024 18.0404 11.2929C18.4309 11.6835 18.4309 12.3165 18.0404 12.7071L14.0404 16.7071C13.8529 16.8947 13.5985 17 13.3333 17C13.0681 17 12.8137 16.8947 12.6263 16.7071L8.62623 12.7071C8.23571 12.3165 8.23571 11.6835 8.62623 11.2929C9.01675 10.9024 9.64992 10.9024 10.0404 11.2929L12.3333 13.5857V6.66667C12.3333 6.11439 12.7811 5.66667 13.3333 5.66667ZM8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21H18.6667C19.2189 21 19.6667 20.5523 19.6667 20C19.6667 19.4477 19.2189 19 18.6667 19H8Z" fill="currentColor"/>
                  </svg>
                </div>
                <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
                  <span class="pt-1 inline-flex">Скачать сертификат</span>
                </p>
              </a>
            </article>
          </div>
        </div>

        <!-- Правая колонка: Информация об обучении -->
        <div class="lg:col-span-7 col-span-full">
          <div class="program mt-14 lg:mt-0">
            <div class="program-block">
              <div>
                <h2 class="h2 font-medium text-gray-700">Информация об обучении</h2>
              </div>

              <div class="flex flex-col gap-4 mt-4">
                <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-xs uppercase text-gray-500 font-medium mb-1">Группа</p>
                  <p class="text-base text-gray-900 font-medium">{{ groupName || 'Группа не назначена' }}</p>
                </div>

                <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-xs uppercase text-gray-500 font-medium mb-1">Дата начала обучения</p>
                  <p class="text-base text-gray-900 font-medium">{{ formattedStartDate }}</p>
                </div>

                <div v-if="course?.duration" class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-xs uppercase text-gray-500 font-medium mb-1">Длительность</p>
                  <p class="text-base text-gray-900 font-medium">{{ course.duration }}</p>
                </div>

                <div v-if="instructor" class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p class="text-xs uppercase text-gray-500 font-medium mb-2">Инструктор</p>
                  <p class="text-base text-gray-900 font-medium">{{ instructor.name }}</p>
                </div>

                <div v-if="graduate" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-xs uppercase text-green-700 font-medium mb-1">Статус выпуска</p>
                  <p class="text-base text-green-900 font-medium">{{ graduateStatusLabel }}</p>
                  <p v-if="graduate.final_score !== null" class="text-sm text-green-800 mt-1">
                    Итоговая оценка: {{ graduate.final_score }}
                  </p>
                </div>

                <!-- Карточка итогового теста -->
                <div
                    v-if="finalExam"
                    class="p-4 border rounded-lg"
                    :class="finalExamCardClass"
                >
                  <p class="text-xs uppercase font-medium mb-1" :class="finalExamLabelClass">Итоговый тест</p>

                  <template v-if="finalExam.status === 'passed'">
                    <p class="text-base font-medium text-green-900">Тест успешно сдан</p>
                    <p class="text-sm text-green-800 mt-1">
                      Проходной балл: {{ finalExam.passing_score }}%
                    </p>
                  </template>

                  <template v-else-if="finalExam.status === 'failed_no_retries'">
                    <p class="text-base font-medium text-red-900">Все попытки исчерпаны</p>
                    <p class="text-sm text-red-800 mt-1">
                      Использовано попыток: {{ finalExam.attempts_used }} из {{ finalExam.max_attempts }}.
                      Обратитесь к инструктору.
                    </p>
                  </template>

                  <template v-else-if="finalExam.status === 'in_progress'">
                    <p class="text-base font-medium text-blue-900">Тест в процессе прохождения</p>
                    <button
                        type="button"
                        class="mt-3 inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium"
                        @click="goToFinalExam"
                    >
                      Продолжить тест
                    </button>
                  </template>

                  <template v-else-if="finalExam.status === 'available'">
                    <p class="text-base font-medium text-gray-900">Тест доступен сейчас</p>
                    <p v-if="finalExam.available_until" class="text-sm text-gray-700 mt-1">
                      Окно закрывается: {{ formatDateTime(finalExam.available_until) }}
                    </p>
                    <p class="text-sm text-gray-700 mt-1">
                      Попыток осталось:
                      {{ finalExam.max_attempts > 0 ? (finalExam.max_attempts - finalExam.attempts_used) : '∞' }}
                    </p>
                    <button
                        type="button"
                        class="mt-3 inline-flex items-center justify-center rounded-md bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium"
                        @click="goToFinalExam"
                    >
                      Пройти итоговый тест
                    </button>
                  </template>

                  <template v-else>
                    <p class="text-base font-medium text-gray-900">
                      Откроется {{ finalExam.available_at ? formatDateTime(finalExam.available_at) : 'по расписанию' }}
                    </p>
                    <p v-if="finalExam.available_until" class="text-sm text-gray-700 mt-1">
                      Закроется: {{ formatDateTime(finalExam.available_until) }}
                    </p>
                    <p v-if="finalExam.schedule_message" class="text-sm text-gray-700 mt-1">
                      {{ finalExam.schedule_message }}
                    </p>
                  </template>
                </div>
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
import { usePageMeta } from '@/composables/usePageMeta.js';

usePageMeta('Оффлайн-курс', 'Информация об оффлайн-курсе');

const router = useRouter();
const route = useRoute();

const courseId = ref(parseInt(route.params.id));
const loading = ref(true);
const error = ref('');

const course = ref(null);
const group = ref(null);
const instructor = ref(null);
const graduate = ref(null);
const finalExam = ref(null);

const groupName = computed(() => group.value?.name || '');

const finalExamCardClass = computed(() => {
  const status = finalExam.value?.status;
  if (status === 'passed') return 'bg-green-50 border-green-200';
  if (status === 'failed_no_retries') return 'bg-red-50 border-red-200';
  if (status === 'in_progress') return 'bg-blue-50 border-blue-200';
  if (status === 'available') return 'bg-amber-50 border-amber-200';
  return 'bg-gray-50 border-gray-200';
});

const finalExamLabelClass = computed(() => {
  const status = finalExam.value?.status;
  if (status === 'passed') return 'text-green-700';
  if (status === 'failed_no_retries') return 'text-red-700';
  if (status === 'in_progress') return 'text-blue-700';
  if (status === 'available') return 'text-amber-700';
  return 'text-gray-500';
});

const formatDateTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const goToFinalExam = () => {
  if (!finalExam.value?.lesson_id) return;
  router.push(`/lessons/${finalExam.value.lesson_id}/quiz`);
};

const formattedStartDate = computed(() => {
  const date = group.value?.training_start_date;
  if (!date) return 'Дата уточняется';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'Дата уточняется';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
});

const isGraduated = computed(() => graduate.value?.status === 'graduated');

const certificateUrl = computed(() => graduate.value?.certificate?.file_url || '');

const graduateStatusLabel = computed(() => {
  if (!graduate.value) return '';
  const map = {
    'completed': 'Обучение завершено',
    'graduated': 'Выпускник',
  };
  return map[graduate.value.status] || graduate.value.status;
});

onMounted(async () => {
  await loadOfflineCourse();
});

const loadOfflineCourse = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await coursesAPI.getOfflineCourseInfo(courseId.value);
    course.value = response.data.course;
    group.value = response.data.group;
    instructor.value = response.data.instructor || null;
    graduate.value = response.data.graduate;
    finalExam.value = response.data.final_exam || null;
  } catch (err) {
    console.error('Ошибка загрузки оффлайн-курса:', err);
    if (err.response?.status === 403) {
      error.value = err.response.data?.error || 'У вас нет доступа к этому курсу';
    } else if (err.response?.status === 404) {
      error.value = 'Курс не найден';
    } else {
      error.value = err.response?.data?.detail || 'Не удалось загрузить курс';
    }
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  router.push({ name: 'Dashboard' });
};
</script>
