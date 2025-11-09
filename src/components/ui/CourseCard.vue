<template>
  <article @click="openCourse" class="courses-card col-span-full md:col-span-6 lg:col-span-4 base-card">
    <div class="card_body">
      <div class="title">
        <div class="w-full">
          <h4 class="h4">
            <span>{{ courseTitle }}</span>
            <span v-if="courseDescription">, {{ truncateText(courseDescription, 100) }}</span>
          </h4>
        </div>
        <div>
          <div class="size-12 rounded-lg flex justify-center items-center bg-green-600">
            <span class="font-mono text-xl text-white">{{ courseLabel || 'I' }}</span>
          </div>
        </div>
      </div>

      <div class="progress">
        <div class="progress-info">
          <ul class="progress-info__list">
            <!-- Для in-progress и locked показываем X/Y уроков -->
            <li v-if="cardState === 'in-progress' || cardState === 'locked'" class="progress-info__list--item">
              <p>
                <span class="lessons_count">{{ completedLessons }}/{{ totalLessons }}</span>
                <span class="lessons_count--text">{{ getLessonsWord(totalLessons) }}</span>
              </p>
            </li>

            <!-- Для completed показываем X/Y уроков -->
            <li v-else-if="cardState === 'completed'" class="progress-info__list--item">
              <p>
                <span class="lessons_count">{{ totalLessons }}/{{ totalLessons }}</span>
                <span class="lessons_count--text">{{ getLessonsWord(totalLessons) }}</span>
              </p>
            </li>

            <!-- Для not-started и "Все курсы" показываем просто количество -->
            <li v-else class="progress-info__list--item">
              <p>
                <span class="lessons_count">{{ totalLessons }}</span>
                <span class="lessons_count--text">{{ getLessonsWord(totalLessons) }}</span>
              </p>
            </li>

            <!-- Вторая колонка: для in-progress и locked показываем процент -->
            <li v-if="cardState === 'in-progress' || cardState === 'locked'" class="progress-info__list--item">
              <p>
                <span class="lessons_time">{{ progressPercentage }}%</span>
                <span class="lessons_time--text">пройдено</span>
              </p>
            </li>

            <!-- Для остальных состояний показываем часы -->
            <li v-else class="progress-info__list--item">
              <span>
                <svg class="size-4 mb-0.5" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 4.5V7.5L9.75 9.75M14.25 7.5C14.25 11.2279 11.2279 14.25 7.5 14.25C3.77208 14.25 0.75 11.2279 0.75 7.5C0.75 3.77208 3.77208 0.75 7.5 0.75C11.2279 0.75 14.25 3.77208 14.25 7.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
              <p>
                <span class="lessons_time">{{ formatDuration(courseDuration) }}</span>
                <span class="lessons_time--text">{{ getHoursWord(courseDuration || 0) }}</span>
              </p>
            </li>
          </ul>
        </div>

        <!-- Progress bar (для in-progress И locked) -->
        <div v-if="cardState === 'in-progress' || cardState === 'locked'" class="progress-bar">
          <div class="progress-bar-fill">
            <div class="progress-bar-fill__bar" :style="{ width: progressPercentage + '%' }"></div>
          </div>
        </div>

        <!-- Progress completed badges (только для completed) -->
        <div v-if="cardState === 'completed'" class="progress-completed">
          <ul class="progress-completed__list">
            <li class="progress-completed__list--item">
              <span>
                <svg class="h-4 mb-0.5" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.125 13.5H7.875C10.7034 13.5 12.1177 13.5 12.9963 12.6213C13.875 11.7427 13.875 10.3285 13.875 7.5V2.99854C13.7661 3.00006 13.6132 3.00004 13.5 3.00001H1.5C1.38679 3.00004 1.2339 3.00006 1.125 2.99854V7.5C1.125 10.3285 1.125 11.7427 2.00368 12.6213C2.88236 13.5 4.29657 13.5 7.125 13.5ZM9.79462 6.37462C10.0015 6.14287 9.98137 5.7873 9.74962 5.58045C9.51787 5.37352 9.1623 5.39362 8.95545 5.62537L6.69645 8.15542L6.04462 7.42537C5.83769 7.19362 5.4821 7.17352 5.25037 7.38045C5.01864 7.5873 4.99851 7.94287 5.20541 8.17462L6.27682 9.37462C6.38355 9.49417 6.53618 9.5625 6.69645 9.5625C6.85665 9.5625 7.00927 9.49417 7.116 9.37462L9.79462 6.37462Z" fill="#3D3BFF"/>
                  <path d="M0 1.5C0 0.792892 4.47035e-08 0.439342 0.219667 0.219667C0.439342 4.47035e-08 0.792892 0 1.5 0H13.5C14.2071 0 14.5606 4.47035e-08 14.7803 0.219667C15 0.439342 15 0.792892 15 1.5C15 2.20711 15 2.56066 14.7803 2.78033C14.5606 3 14.2071 3.00001 13.5 3.00001H1.5C0.792893 3.00001 0.439342 3 0.219667 2.78033C4.47035e-08 2.56066 0 2.20711 0 1.5Z" fill="currentColor"/>
                </svg>
              </span>
              <p>Архивный курс</p>
            </li>
            <li class="progress-completed__list--item">
              <span>
                <svg class="size-5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.16909 2.7729C8.0664 1.51662 9.93353 1.51662 10.8309 2.7729L10.9738 2.9729C11.1316 3.194 11.3969 3.31239 11.6669 3.28239L12.3036 3.21164C13.7367 3.05241 14.9476 4.26329 14.7884 5.69635L14.7176 6.33311C14.6876 6.60315 14.806 6.86831 15.0271 7.02623L15.2271 7.16909C16.4834 8.0664 16.4834 9.93353 15.2271 10.8309L15.0271 10.9738C14.806 11.1316 14.6876 11.3969 14.7176 11.6669L14.7884 12.3036C14.9476 13.7367 13.7367 14.9476 12.3036 14.7884L11.6669 14.7176C11.3969 14.6876 11.1316 14.806 10.9738 15.0271L10.8309 15.2271C9.93353 16.4834 8.06648 16.4834 7.16909 15.2271L7.02623 15.0271C6.86831 14.806 6.60315 14.6876 6.33311 14.7176L5.69635 14.7884C4.26329 14.9476 3.05241 13.7367 3.21164 12.3036L3.28239 11.6669C3.31239 11.3969 3.194 11.1316 2.9729 10.9738L2.7729 10.8309C1.51662 9.93353 1.51662 8.06648 2.7729 7.16909L2.9729 7.02623C3.194 6.86831 3.31239 6.60315 3.28239 6.33311L3.21164 5.69635C3.05241 4.26329 4.26329 3.05241 5.69635 3.21164L6.33311 3.28239C6.60315 3.31239 6.86831 3.194 7.02623 2.9729L7.16909 2.7729ZM11.7803 6.96967C12.0732 7.26257 12.0732 7.73745 11.7803 8.03032L8.91615 10.8945C8.54827 11.2625 7.95173 11.2625 7.58385 10.8945L6.21967 9.53032C5.92678 9.23745 5.92678 8.76255 6.21967 8.46968C6.51257 8.1768 6.98744 8.1768 7.28033 8.46968L8.25 9.43935L10.7197 6.96967C11.0126 6.67678 11.4875 6.67678 11.7803 6.96967Z" fill="#2F8152"/>
                </svg>
              </span>
              <p>Пройдено</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Card footer (условно в зависимости от состояния) -->
    <div v-if="showFooter" class="card_footer">
      <!-- Not started: Начать первый урок -->
      <template v-if="cardState === 'not-started'">
        <div class="icon">
          <svg class="w-8" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C24.8367 2 31.9999 9.16327 32 18C32 26.8367 24.8367 34 16 34C7.16327 33.9999 0 26.8367 0 18C5.16377e-05 9.1633 7.1633 2.00005 16 2ZM13.9092 11.8467C12.6935 11.1292 11.2002 12.0632 11.2002 13.541V22.459C11.2002 23.9369 12.6935 24.8709 13.9092 24.1533L21.4619 19.6943C22.7127 18.9558 22.7127 17.0442 21.4619 16.3057L13.9092 11.8467Z" fill="currentColor"/>
          </svg>
        </div>
        <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
          <span class="pt-1 inline-flex">Начать первый урок</span>
        </p>
      </template>

      <!-- In progress: Продолжить + название урока -->
      <template v-else-if="cardState === 'in-progress'">
        <div class="icon">
          <svg class="w-8" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C24.8367 2 31.9999 9.16327 32 18C32 26.8367 24.8367 34 16 34C7.16327 33.9999 0 26.8367 0 18C5.16377e-05 9.1633 7.1633 2.00005 16 2ZM13.9092 11.8467C12.6935 11.1292 11.2002 12.0632 11.2002 13.541V22.459C11.2002 23.9369 12.6935 24.8709 13.9092 24.1533L21.4619 19.6943C22.7127 18.9558 22.7127 17.0442 21.4619 16.3057L13.9092 11.8467Z" fill="currentColor"/>
          </svg>
        </div>
        <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
          <span class="pt-1 inline-flex">Продолжить: {{ currentLessonTitle }}</span>
        </p>
      </template>

      <!-- Locked: Замочек + время до разблокировки -->
      <template v-else-if="cardState === 'locked'">
        <div class="icon">
          <svg class="w-7 text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C9.79086 2 8 3.79086 8 6V8H6C4.89543 8 4 8.89543 4 10V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V10C20 8.89543 19.1046 8 18 8H16V6C16 3.79086 14.2091 2 12 2ZM14 8V6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6V8H14ZM12 13C11.4477 13 11 13.4477 11 14V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V14C13 13.4477 12.5523 13 12 13Z" fill="currentColor"/>
          </svg>
        </div>
        <p class="text-sm text-gray-500 leading-tight font-medium inline-block">
          <span class="pt-1 inline-flex">Будет доступно {{ timeUntilAvailable }}</span>
        </p>
      </template>

      <!-- Completed: Скачать сертификат -->
      <template v-else-if="cardState === 'completed'">
        <div class="icon">
          <svg class="h-7" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3333C0 7.04793 -1.19209e-07 3.90524 1.95263 1.95263C3.90524 -1.19209e-07 7.04793 0 13.3333 0C19.6187 0 22.7615 -1.19209e-07 24.714 1.95263C26.6667 3.90524 26.6667 7.04793 26.6667 13.3333C26.6667 19.6187 26.6667 22.7615 24.714 24.714C22.7615 26.6667 19.6187 26.6667 13.3333 26.6667C7.04793 26.6667 3.90524 26.6667 1.95263 24.714C-1.19209e-07 22.7615 0 19.6187 0 13.3333ZM13.3333 5.66667C13.8856 5.66667 14.3333 6.11439 14.3333 6.66667V13.5857L16.6263 11.2929C17.0168 10.9024 17.6499 10.9024 18.0404 11.2929C18.4309 11.6835 18.4309 12.3165 18.0404 12.7071L14.0404 16.7071C13.8529 16.8947 13.5985 17 13.3333 17C13.0681 17 12.8137 16.8947 12.6263 16.7071L8.62623 12.7071C8.23571 12.3165 8.23571 11.6835 8.62623 11.2929C9.01675 10.9024 9.64992 10.9024 10.0404 11.2929L12.3333 13.5857V6.66667C12.3333 6.11439 12.7811 5.66667 13.3333 5.66667ZM8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21H18.6667C19.2189 21 19.6667 20.5523 19.6667 20C19.6667 19.4477 19.2189 19 18.6667 19H8Z" fill="currentColor"/>
          </svg>
        </div>
        <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
          <span class="pt-1 inline-flex">Скачать сертификат</span>
        </p>
      </template>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  course: {
    type: Object,
    required: true
  },
  showProgress: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

// Текущее время для обратного отсчета
const currentTime = ref(Date.now());
let intervalId = null;

// Обновляем время сразу при монтировании и затем периодически
onMounted(() => {
  currentTime.value = Date.now();

  // Обновляем каждую минуту (для продакшена)
  intervalId = setInterval(() => {
    currentTime.value = Date.now();
  }, 60000); // 60000 = 1 минута, можно изменить на 1000 для теста (1 секунда)
});

// Очищаем интервал при размонтировании
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// Обработка разных форматов данных
const courseData = computed(() => {
  if (props.course.course) {
    return props.course.course;
  }
  return props.course;
});

const courseTitle = computed(() => courseData.value.title);
const courseDescription = computed(() => courseData.value.description);
const courseLabel = computed(() => courseData.value.label);
const courseDuration = computed(() => courseData.value.duration);

const progressPercentage = computed(() => {
  if (props.showProgress && props.course.progress_percentage !== undefined) {
    return parseFloat(props.course.progress_percentage).toFixed(0);
  }
  return 0;
});

const completedLessons = computed(() => props.course.completed_lessons || 0);

const totalLessons = computed(() => {
  if (props.course.total_lessons) {
    return props.course.total_lessons;
  }
  return courseData.value.lessons_count || 0;
});

const currentLesson = computed(() => props.course.current_lesson || null);
const currentLessonTitle = computed(() => currentLesson.value?.title || 'Следующий урок');

const hasAccess = computed(() => {
  if (props.course.has_access !== undefined) {
    return props.course.has_access;
  }
  return true;
});

// Живой обратный отсчет до разблокировки урока
const timeUntilAvailable = computed(() => {
  const availableAt = props.course.nextLockedLesson?.available_at;

  if (!availableAt) {
    return 'скоро';
  }

  const availableDate = new Date(availableAt);
  const now = currentTime.value;
  const diffMs = availableDate - now;

  // Если время уже прошло
  if (diffMs <= 0) {
    return 'доступен сейчас';
  }

  // Переводим в минуты и часы
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  // Форматируем вывод
  if (diffHours > 0 && remainingMinutes > 0) {
    return `через ${diffHours} ч. ${remainingMinutes} мин.`;
  } else if (diffHours > 0) {
    return `через ${diffHours} ${getHoursWord(diffHours)}`;
  } else if (diffMinutes > 0) {
    return `через ${diffMinutes} ${getMinutesWord(diffMinutes)}`;
  } else {
    return 'доступен сейчас';
  }
});

// Определение состояния карточки
const cardState = computed(() => {
  // Для "Всех курсов" - всегда not-started
  if (!props.showProgress) {
    return 'not-started';
  }

  const progress = parseFloat(progressPercentage.value);

  // Если есть заблокированный урок и прогресс > 0 - locked
  if (!hasAccess.value && progress > 0) {
    return 'locked';
  }

  // Если прогресс 100% - completed
  if (progress >= 100) {
    return 'completed';
  }

  // Если прогресс 0% - not-started
  if (progress === 0) {
    return 'not-started';
  }

  // Иначе - in-progress
  return 'in-progress';
});

// Показывать ли footer
const showFooter = computed(() => {
  return props.showProgress;
});

// Вспомогательные функции

const truncateText = (text, length) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

const formatDuration = (duration) => {
  if (!duration) return 0;
  const num = parseFloat(duration);
  if (num % 1 === 0) {
    return Math.floor(num);
  }
  return num;
};

const getLessonsWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'уроков';
  }

  if (lastDigit === 1) {
    return 'урок';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'урока';
  }

  return 'уроков';
};

const getHoursWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'часов';
  }

  if (lastDigit === 1) {
    return 'час';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'часа';
  }

  return 'часов';
};

const getMinutesWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'минут';
  }

  if (lastDigit === 1) {
    return 'минута';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'минуты';
  }

  return 'минут';
};

const openCourse = () => {
  router.push({ name: 'CourseDetail', params: { id: courseData.value.id } });
};
</script>