<template>
  <div
      @click="handleLessonClick"
      class="lesson-card"
      :class="lessonClasses">
    <!-- Изображение/Превью урока -->
    <div class="lesson-card__image-block" :class="cardBackgroundClass">

      <!-- ============================================ -->
      <!-- 🎬 ВИДЕО УРОК -->
      <!-- ============================================ -->
      <template v-if="lessonType === 'video'">
        <!-- Оверлей с кнопкой плей -->
        <div v-if="!isLocked" class="lesson-card__overflow">
          <svg class="size-10" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2C24.8367 2 31.9999 9.16327 32 18C32 26.8367 24.8367 34 16 34C7.16327 33.9999 0 26.8367 0 18C5.16377e-05 9.1633 7.1633 2.00005 16 2ZM13.9092 11.8467C12.6935 11.1292 11.2002 12.0632 11.2002 13.541V22.459C11.2002 23.9369 12.6935 24.8709 13.9092 24.1533L21.4619 19.6943C22.7127 18.9558 22.7127 17.0442 21.4619 16.3057L13.9092 11.8467Z" fill="currentColor"/>
          </svg>
        </div>

        <!-- Превью изображение -->
        <div class="lesson-card__pictures">
          <img
              class="object-cover"
              src="@/assets/images/video-example.png"
              alt="Video preview"
              @error="handleImageError">
        </div>

        <!-- Длительность видео -->
        <div v-if="videoDuration" class="lesson-card__duration">
          <span class="text-white bg-gray-700 text-sm rounded-md py-2 px-3">
            {{ videoDuration }}
          </span>
        </div>
      </template>

      <!-- ============================================ -->
      <!-- 📄 ТЕКСТОВЫЙ УРОК -->
      <!-- ============================================ -->
      <template v-else-if="lessonType === 'text'">
        <div class="lesson-card__pictures" :class="iconBackgroundClass">
          <svg  :class="iconColorClass" class="h-12" viewBox="-3 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" >
              <g id="Icon-Set-Filled" transform="translate(-105.000000, -101.000000)" fill="currentColor">
                <path d="M125,109 C123.896,109 123,108.104 123,107 L123,103 L129,109 L125,109 L125,109 Z M124,119 L112,119 C111.448,119 111,118.553 111,118 C111,117.448 111.448,117 112,117 L124,117 C124.552,117 125,117.448 125,118 C125,118.553 124.552,119 124,119 L124,119 Z M124,125 L112,125 C111.448,125 111,124.553 111,124 C111,123.447 111.448,123 112,123 L124,123 C124.552,123 125,123.447 125,124 C125,124.553 124.552,125 124,125 L124,125 Z M123,101.028 C122.872,101.028 109,101 109,101 C106.791,101 105,102.791 105,105 L105,129 C105,131.209 106.791,133 109,133 L127,133 C129.209,133 131,131.209 131,129 L131,109 L123,101.028 L123,101.028 Z" id="text-document" ></path>
              </g>
            </g>
          </svg>

        </div>
      </template>

      <!-- ============================================ -->
      <!-- ❓ ТЕСТ -->
      <!-- ============================================ -->
      <template v-else-if="lessonType === 'quiz'">
        <div class="lesson-card__pictures" :class="iconBackgroundClass">
          <svg
              :class="iconColorClass"
              class="h-14"
              fill="currentColor"
              viewBox="0 0 294.023 294.023"
              xmlns="http://www.w3.org/2000/svg">
            <path d="M124.916,0.002c-1.649,0.045-3.169,0.9-4.064,2.285l-14.49,21.736h-49.35c-2.761,0-5,2.239-5,5v50c0,2.761,2.239,5,5,5h50c2.761,0,5-2.239,5-5V39.574l-10,15v19.449h-40v-40h37.682L85.631,55.117l-6.146-12.293c-1.205-2.485-4.196-3.523-6.681-2.318c-2.485,1.205-3.523,4.196-2.318,6.681c0.018,0.036,0.035,0.072,0.054,0.108l10,20c1.235,2.47,4.238,3.472,6.709,2.237c0.778-0.389,1.441-0.974,1.924-1.698l40-60c1.565-2.276,0.989-5.389-1.287-6.954C127.013,0.281,125.974-0.027,124.916,0.002L124.916,0.002z M147.012,44.025c-2.761,0-5,2.239-5,5v10c0,2.761,2.239,5,5,5h90c2.761,0,5-2.239,5-5v-10c0-2.761-2.239-5-5-5H147.012z M57.012,94.06c-2.761,0-5,2.239-5,5v50c0,2.761,2.239,5,5,5h50c2.761,0,5-2.239,5-5v-50c0-2.761-2.239-5-5-5H57.012z M62.012,104.06h40v40h-40V104.06z M147.012,114.023c-2.761,0-5,2.239-5,5v10c0,2.761,2.239,5,5,5h90c2.761,0,5-2.239,5-5v-10c0-2.761-2.239-5-5-5H147.012z M57.012,164.023c-2.761,0-5,2.239-5,5v50c0,2.761,2.239,5,5,5h50c2.761,0,5-2.239,5-5v-50c0-2.761-2.239-5-5-5H57.012z M62.012,174.023h40v40h-40V174.023z M147.012,184.058c-2.761,0-5,2.239-5,5v10c0,2.761,2.239,5,5,5h90c2.761,0,5-2.239,5-5v-10c0-2.761-2.239-5-5-5H147.012z M57.012,234.023c-2.761,0-5,2.239-5,5v50c0,2.761,2.239,5,5,5h50c2.761,0,5-2.239,5-5v-50c0-2.761-2.239-5-5-5L57.012,234.023L57.012,234.023z M62.012,244.023h40v40h-40V244.023z M147.012,254.023c-2.761,0-5,2.239-5,5v10c0,2.761,2.239,5,5,5h90c2.761,0,5-2.239,5-5v-10c0-2.761-2.239-5-5-5H147.012z"/>
          </svg>
        </div>

        <!-- Количество вопросов -->
        <div class="lesson-card__meta">
          <span class="text-red-700 bg-red-100 text-xs rounded-md py-1 px-2 font-semibold">
            {{ lessonMetaInfo }}
          </span>
        </div>
      </template>

      <!-- ============================================ -->
      <!-- 📝 ДОМАШНЕЕ ЗАДАНИЕ -->
      <!-- ============================================ -->
      <template v-else-if="lessonType === 'assignment'">
        <div class="lesson-card__pictures" :class="iconBackgroundClass">
          <svg
              :class="iconColorClass"
              class="h-12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.186 2.09c.521.25 1.136.612 1.625 1.101.49.49.852 1.104 1.1 1.625.313.654.11 1.408-.401 1.92l-7.214 7.213c-.31.31-.688.541-1.105.675l-4.222 1.353a.75.75 0 0 1-.943-.944l1.353-4.221a2.75 2.75 0 0 1 .674-1.105l7.214-7.214c.512-.512 1.266-.714 1.92-.402zm.211 2.516a3.608 3.608 0 0 0-.828-.586l-6.994 6.994a1.002 1.002 0 0 0-.178.241L9.9 14.102l2.846-1.496c.09-.047.171-.107.242-.178l6.994-6.994a3.61 3.61 0 0 0-.586-.828zM4.999 5.5A.5.5 0 0 1 5.47 5l5.53.005a1 1 0 0 0 0-2L5.5 3A2.5 2.5 0 0 0 3 5.5v12.577c0 .76.082 1.185.319 1.627.224.419.558.754.977.978.442.236.866.318 1.627.318h12.154c.76 0 1.185-.082 1.627-.318.42-.224.754-.559.978-.978.236-.442.318-.866.318-1.627V13a1 1 0 1 0-2 0v5.077c0 .459-.021.571-.082.684a.364.364 0 0 1-.157.157c-.113.06-.225.082-.684.082H5.923c-.459 0-.57-.022-.684-.082a.363.363 0 0 1-.157-.157c-.06-.113-.082-.225-.082-.684V5.5z" fill="currentColor"/>
          </svg>
        </div>

        <!-- Информация о задании -->
        <div class="lesson-card__meta">
          <span class="text-blue-700 bg-blue-100 text-xs rounded-md py-1 px-2 font-semibold">
            {{ lessonMetaInfo }}
          </span>
        </div>
      </template>

      <!-- ============================================ -->
      <!-- 🏷️ СТАТУС УРОКА (общий для всех типов) -->
      <!-- ============================================ -->
      <div v-if="lessonStatus" class="lesson-card__status">
        <!-- Завершен -->
        <svg
            v-if="lessonStatus === 'completed'"
            class="size-6 relative top-1 left-1"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.16909 2.7729C8.0664 1.51662 9.93353 1.51662 10.8309 2.7729L10.9738 2.9729C11.1316 3.194 11.3969 3.31239 11.6669 3.28239L12.3036 3.21164C13.7367 3.05241 14.9476 4.26329 14.7884 5.69635L14.7176 6.33311C14.6876 6.60315 14.806 6.86831 15.0271 7.02623L15.2271 7.16909C16.4834 8.0664 16.4834 9.93353 15.2271 10.8309L15.0271 10.9738C14.806 11.1316 14.6876 11.3969 14.7176 11.6669L14.7884 12.3036C14.9476 13.7367 13.7367 14.9476 12.3036 14.7884L11.6669 14.7176C11.3969 14.6876 11.1316 14.806 10.9738 15.0271L10.8309 15.2271C9.93353 16.4834 8.06648 16.4834 7.16909 15.2271L7.02623 15.0271C6.86831 14.806 6.60315 14.6876 6.33311 14.7176L5.69635 14.7884C4.26329 14.9476 3.05241 13.7367 3.21164 12.3036L3.28239 11.6669C3.31239 11.3969 3.194 11.1316 2.9729 10.9738L2.7729 10.8309C1.51662 9.93353 1.51662 8.06648 2.7729 7.16909L2.9729 7.02623C3.194 6.86831 3.31239 6.60315 3.28239 6.33311L3.21164 5.69635C3.05241 4.26329 4.26329 3.05241 5.69635 3.21164L6.33311 3.28239C6.60315 3.31239 6.86831 3.194 7.02623 2.9729L7.16909 2.7729ZM11.7803 6.96967C12.0732 7.26257 12.0732 7.73745 11.7803 8.03032L8.91615 10.8945C8.54827 11.2625 7.95173 11.2625 7.58385 10.8945L6.21967 9.53032C5.92678 9.23745 5.92678 8.76255 6.21967 8.46968C6.51257 8.1768 6.98744 8.1768 7.28033 8.46968L8.25 9.43935L10.7197 6.96967C11.0126 6.67678 11.4875 6.67678 11.7803 6.96967Z" fill="currentColor"/>
        </svg>

        <!-- Заблокирован -->
        <div  v-else-if="lessonStatus === 'locked'"
              class="locked-info">
              <div class="flex flex-wrap items-center justify-center">
                <svg class="size-12 text-red-500"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9Z" fill="currentColor"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5354 8.54297V7.2C11.5354 5.70937 10.3961 4.5 9 4.5C7.6039 4.5 6.46463 5.70937 6.46463 7.2V8.54297H5.625V13.5H12.375V8.54297H11.5354ZM7.32073 7.2C7.32073 6.20508 8.06817 5.4 9 5.4C9.93183 5.4 10.6793 6.20508 10.6793 7.2V8.54297H7.32073V7.2Z" fill="white"/>
                </svg>
                <!-- Время до разблокировки -->
                <p v-if="isLocked && availableIn" class="text-xs w-full text-center font-bold text-white mt-2">
                  {{ availableIn }}
                </p>
              </div>
        </div>
      </div>
    </div>

    <!-- Заголовок урока -->
    <div>
      <h5 class="lesson-card__title">{{ lessonTitle }}</h5>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// Данные урока
const lessonData = computed(() => props.lesson.lesson);
const lessonTitle = computed(() => lessonData.value?.title || 'Урок');
const lessonType = computed(() => lessonData.value?.type || 'text');
const isCompleted = computed(() => props.lesson.is_completed);
const isAvailable = computed(() => props.lesson.is_available);
const availableIn = computed(() => props.lesson.available_in);
const videoDuration = computed(() => props.lesson.video_duration);

// Статус урока
const isLocked = computed(() => !isAvailable.value);

const lessonStatus = computed(() => {
  if (isCompleted.value) return 'completed';
  if (isLocked.value) return 'locked';
  return null;
});

// 🎨 Фон внешнего блока (светлый)
const cardBackgroundClass = computed(() => {
  const backgrounds = {
    'video': '',
    'text': 'bg-gray-50',
    'quiz': 'bg-red-50',
    'assignment': 'bg-blue-50'
  };
  return backgrounds[lessonType.value] || 'bg-white';
});

// 🎨 Фон блока с иконкой (темный)
const iconBackgroundClass = computed(() => {
  const backgrounds = {
    'video': '',
    'text': 'bg-blue-600',
    'quiz': 'bg-red-500',
    'assignment': 'bg-blue-100'
  };
  return backgrounds[lessonType.value] || '';
});

// 🎨 Цвет иконки (SVG)
const iconColorClass = computed(() => {
  const colors = {
    'video': 'text-white',
    'text': 'text-white',
    'quiz': 'text-white',
    'assignment': 'text-blue-500'
  };
  return colors[lessonType.value] || 'text-gray-600';
});

// 🎨 Дополнительная информация
const lessonMetaInfo = computed(() => {
  const info = {
    'video': videoDuration.value || '0:00',
    'text': '',  // Уберите если не нужно
    'quiz': '10 вопросов',
    'assignment': 'Домашнее задание'
  };
  return info[lessonType.value] || '';
});

// CSS классы (убрали hover для assignment)
const lessonClasses = computed(() => {
  const classes = [];

  // Для доступных и незавершенных уроков
  if (isAvailable.value && !isCompleted.value) {
    classes.push('cursor-pointer');
    // Убираем hover для assignment
    if (lessonType.value !== 'assignment') {
      classes.push('hover:bg-gray-50');
    }
  }

  if (isLocked.value) {
    classes.push('opacity-75', 'cursor-not-allowed');
  }

  if (isCompleted.value) {
    classes.push('cursor-pointer');
  }

  return classes.join(' ');
});

// Обработка клика
const handleLessonClick = () => {
  if (isLocked.value) {
    console.log('🔒 Урок заблокирован:', lessonTitle.value);
    if (availableIn.value) {
      alert(`Урок "${lessonTitle.value}" будет ${availableIn.value}`);
    }
    return;
  }

  console.log('📝 Клик по уроку:', {
    id: lessonData.value.id,
    title: lessonTitle.value,
    type: lessonType.value,
    isAvailable: isAvailable.value,
    isCompleted: isCompleted.value
  });

  // Маппинг типов уроков на роуты
  const routeNames = {
    'video': 'VideoLesson',
    'text': 'TextLesson',
    'quiz': 'QuizLesson',
    // 'assignment': 'AssignmentLesson'  // Добавите позже
  };

  const routeName = routeNames[lessonType.value];

  if (routeName) {
    console.log(`✅ Переход на ${routeName}:`, lessonData.value.id);
    router.push({
      name: routeName,
      params: { id: lessonData.value.id }
    });
  } else {
    console.warn(`⚠️ Тип урока "${lessonType.value}" еще не реализован`);
    alert(`Урок: "${lessonTitle.value}"\n\nТип: ${lessonData.value.type_display}\n\n📝 Страница для этого типа урока в разработке...`);
  }
};

// Обработка ошибки загрузки изображения
const handleImageError = (e) => {
  console.warn('Ошибка загрузки превью видео');
  e.target.style.display = 'none';
};
</script>

<style scoped>
.lesson-card {
  transition: background-color 0.2s;
}
</style>