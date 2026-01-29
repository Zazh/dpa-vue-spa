<template>
  <article class="courses-card col-span-full md:col-span-6 lg:col-span-4 base-card">
    <div @click="openCourse" class="card_body">
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
              <p class="flex gap-1">
                <span class="lessons_count">{{ completedLessons }}/{{ totalLessons }}</span>
                <span class="lessons_count--text">{{ getLessonsWord(totalLessons) }}</span>
              </p>
            </li>

            <!-- Для completed показываем X/Y уроков -->
            <li v-else-if="cardState === 'completed'" class="progress-info__list--item">
              <p class="flex gap-1">
                <span class="lessons_count">{{ totalLessons }}/{{ totalLessons }}</span>
                <span class="lessons_count--text">{{ getLessonsWord(totalLessons) }}</span>
              </p>
            </li>

            <!-- Для not-started и "Все курсы" показываем просто количество -->
            <li v-else class="progress-info__list--item">
              <p class="flex gap-1">
                <span class="lessons_count">{{ totalLessons }}</span>
                <span class="lessons_count--text">{{ getLessonsWord(totalLessons) }}</span>
              </p>
            </li>

            <!-- Вторая колонка: для in-progress и locked показываем процент -->
            <li v-if="cardState === 'in-progress' || cardState === 'locked'" class="progress-info__list--item">
              <p class="flex gap-1">
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
              <p class="flex gap-1">
                <span class="lessons_time">{{ courseDuration || 'Не указано' }}</span>
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
    <div
        v-if="showFooter"
        class="card_footer"
        :class="{
      'cursor-pointer hover:bg-gray-50': cardState !== 'locked',
      'cursor-not-allowed': cardState === 'locked'
    }"
        @click="handleFooterClick"
    >
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

      <!-- ✅ Locked: Замочек + countdown -->
      <template v-else-if="cardState === 'locked'">
        <div class="icon">
          <svg class="h-7 text-orange-500" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 3a5 5 0 0 1 5 5v2.005c.77.015 1.246.07 1.635.268a2.5 2.5 0 0 1 1.092 1.092C20 11.9 20 12.6 20 14v3c0 1.4 0 2.1-.273 2.635a2.5 2.5 0 0 1-1.092 1.092C18.1 21 17.4 21 16 21H8c-1.4 0-2.1 0-2.635-.273a2.5 2.5 0 0 1-1.093-1.092C4 19.1 4 18.4 4 17v-3c0-1.4 0-2.1.272-2.635a2.5 2.5 0 0 1 1.093-1.092c.389-.199.865-.253 1.635-.268V8a5 5 0 0 1 5-5zm3 5v2H9V8a3 3 0 1 1 6 0z"/>
          </svg>
        </div>
        <p class="text-sm text-orange-600 leading-tight font-medium inline-block">
          <span class="pt-1 inline-flex">{{ timeUntilAvailable }}</span>
        </p>
      </template>

      <!-- Completed: Курс пройден -->
      <template v-else-if="cardState === 'completed'">
        <div class="icon">
          <svg class="h-7 text-green-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.707 8.707a1 1 0 0 0-1.414-1.414L11 12.586l-1.293-1.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4z"/>
          </svg>
        </div>
        <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
          <span class="pt-1 inline-flex">Курс пройден</span>
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

  // Отладка
  console.log('🎴 CourseCard mounted:', {
    title: courseTitle.value,
    nextLockedLesson: props.course.nextLockedLesson,
    hasAccess: hasAccess.value,
    cardState: cardState.value
  });

  intervalId = setInterval(() => {
    currentTime.value = Date.now();

    // Лог каждую минуту (или 10 сек для теста)
    if (props.course.nextLockedLesson) {
      console.log('⏱️ CourseCard tick, timeUntilAvailable:', timeUntilAvailable.value);
    }
  }, 10000);
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

const nextLessonTitle = computed(() => {
  return props.course.nextLockedLesson?.title || 'Следующий урок';
});

// Функция для перехода на урок
const openLesson = () => {
  if (!currentLesson.value) {
    openCourse();
    return;
  }

  // Используем type (не lesson_type)
  const lessonType = currentLesson.value.type;
  const lessonId = currentLesson.value.id;

  const routeMap = {
    'video': 'VideoLesson',
    'text': 'TextLesson',
    'quiz': 'QuizLesson',
    'assignment': 'AssignmentLesson'
  };

  const routeName = routeMap[lessonType];

  if (routeName) {
    router.push({
      name: routeName,
      params: { id: lessonId }
    });
  } else {
    console.warn('Неизвестный тип урока:', lessonType);
    openCourse();
  }
};

// Обработчик клика по footer
const handleFooterClick = (event) => {
  event.stopPropagation(); // Предотвращаем всплытие

  if (cardState.value === 'locked') {
    console.log('Урок заблокирован, переход запрещён');
    return; // Ничего не делаем
  }

  if (cardState.value === 'completed') {
    // Для завершённого курса - открываем курс
    openCourse();
    return;
  }

  // Для not-started и in-progress - открываем урок
  openLesson();
};

const hasAccess = computed(() => {
  // Для "Мои курсы" (showProgress=true) — всегда есть доступ
  if (props.showProgress) {
    return true;
  }

  // Для "Все курсы" — проверяем is_enrolled
  if (courseData.value.is_enrolled !== undefined) {
    return courseData.value.is_enrolled;
  }

  // Fallback на has_access если есть
  if (props.course.has_access !== undefined) {
    return props.course.has_access;
  }

  // По умолчанию — нет доступа
  return false;
});

// Живой обратный отсчет до разблокировки урока
const timeUntilAvailable = computed(() => {
  const availableAt = props.course.nextLockedLesson?.available_at;

  if (!availableAt) {
    return 'Следующий урок скоро будет доступен';
  }

  const availableDate = new Date(availableAt);
  const now = currentTime.value;
  const diffMs = availableDate - now;

  // ✅ Если время прошло - урок доступен
  if (diffMs <= 0) {
    return 'Урок уже доступен!';
  }

  // Переводим в секунды, минуты и часы
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  const remainingMinutes = diffMinutes % 60;

  // ✅ Если меньше минуты - показываем секунды
  if (diffMinutes === 0 && diffSeconds > 0) {
    return `Урок откроется меньше чем через минуту`;
  }

  // Форматируем вывод
  if (diffDays > 0) {
    return `Следующий урок через ${diffDays} ${getDaysWord(diffDays)} ${remainingHours} ч.`;
  } else if (diffHours > 0 && remainingMinutes > 0) {
    return `Следующий урок через ${diffHours} ч. ${remainingMinutes} мин.`;
  } else if (diffHours > 0) {
    return `Следующий урок через ${diffHours} ${getHoursWord(diffHours)}`;
  } else if (diffMinutes > 0) {
    return `Следующий урок через ${diffMinutes} ${getMinutesWord(diffMinutes)}`;
  } else {
    return 'Урок уже доступен!';
  }
});
// Определение состояния карточки
// Определение состояния карточки
const cardState = computed(() => {
  if (!props.showProgress) {
    return 'not-started';
  }

  const progress = parseFloat(progressPercentage.value);

  // Проверяем заблокированный урок
  if (props.course.nextLockedLesson) {
    const availableAt = props.course.nextLockedLesson.available_at;

    if (availableAt) {
      const diffMs = new Date(availableAt).getTime() - currentTime.value;

      // Если время ещё не прошло - locked
      if (diffMs > 0) {
        return 'locked';
      }
      // Если время прошло - не показываем locked, покажем in-progress
    }
  }

  if (progress >= 100) {
    return 'completed';
  }

  if (progress === 0) {
    return 'not-started';
  }

  return 'in-progress';
});

const getDaysWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'дней';
  }

  if (lastDigit === 1) {
    return 'день';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'дня';
  }

  return 'дней';
};


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
  // Если нет доступа к курсу и есть project_url — открываем продажник в новой вкладке
  if (!hasAccess.value && courseData.value.project_url) {
    window.open(courseData.value.project_url, '_blank');
    return;
  }

  // Если есть доступ — открываем первый урок или страницу курса
  router.push({ name: 'CourseDetail', params: { id: courseData.value.id } });
};
</script>