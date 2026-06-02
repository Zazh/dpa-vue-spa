<template>
  <article class="courses-card col-span-full md:col-span-6 lg:col-span-4 base-card">
    <div @click="openOfflineCourse" class="card_body cursor-pointer">
      <div class="title">
        <div class="w-full">
          <h4 class="h4">{{ courseTitle }}</h4>
        </div>
        <div>
          <div class="size-12 rounded-lg flex justify-center items-center bg-amber-500">
            <span class="font-mono text-xl text-white">{{ courseLabel || 'O' }}</span>
          </div>
        </div>
      </div>

      <div class="progress">
        <div class="progress-info">
          <ul class="progress-info__list">
            <li class="progress-info__list--item">
              <span>
                <svg class="size-4 mb-0.5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 1.5V3M4.5 1.5V3M2.25 5.25H12.75M2.25 6.75C2.25 5.34987 2.25 4.6498 2.52248 4.11502C2.76217 3.64462 3.14462 3.26217 3.61502 3.02248C4.1498 2.75 4.84987 2.75 6.25 2.75H8.75C10.1501 2.75 10.8502 2.75 11.385 3.02248C11.8554 3.26217 12.2378 3.64462 12.4775 4.11502C12.75 4.6498 12.75 5.34987 12.75 6.75V9.25C12.75 10.6501 12.75 11.3502 12.4775 11.885C12.2378 12.3554 11.8554 12.7378 11.385 12.9775C10.8502 13.25 10.1501 13.25 8.75 13.25H6.25C4.84987 13.25 4.1498 13.25 3.61502 12.9775C3.14462 12.7378 2.76217 12.3554 2.52248 11.885C2.25 11.3502 2.25 10.6501 2.25 9.25V6.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
              <p class="flex gap-1">
                <span class="lessons_time">{{ trainingStartLabel }}</span>
              </p>
            </li>
          </ul>
        </div>

        <!-- Бейдж "Оффлайн / Выпускник" -->
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

    <div
        class="card_footer cursor-pointer"
        @click="openOfflineCourse"
    >
      <div class="icon">
        <svg class="w-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.27 2 2 8.27 2 16s6.27 14 14 14 14-6.27 14-14S23.73 2 16 2Zm0 6a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 16c-2.5 0-5-1.25-5-3.75V19c0-1.66 2.24-3 5-3s5 1.34 5 3v1.25C21 22.75 18.5 24 16 24Z" fill="currentColor"/>
        </svg>
      </div>
      <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
        <span class="pt-1 inline-flex">{{ footerText }}</span>
      </p>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  course: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const courseData = computed(() => props.course.course || props.course);
const courseTitle = computed(() => courseData.value.title);
const courseLabel = computed(() => courseData.value.label);

const trainingStartLabel = computed(() => {
  const date = props.course.training_start_date;
  if (!date) return 'Дата уточняется';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'Дата уточняется';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
});

const isGraduated = computed(() => {
  const g = props.course.graduate;
  return !!(g && g.status === 'graduated');
});

const footerText = computed(() => {
  return isGraduated.value ? 'Открыть карточку курса' : 'Открыть карточку курса';
});

const openOfflineCourse = () => {
  router.push({ name: 'OfflineCourseDetail', params: { id: courseData.value.id } });
};
</script>
