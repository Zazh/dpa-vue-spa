<template>
  <div
      class="program-item"
      :class="moduleClasses">
    <!-- Заголовок модуля -->
    <div class="program-item__header" @click="toggleModule">
      <div class="program-item__title" :class="{ 'text-black': hasActiveStatus }">
        <span class="w-8 inline-flex">{{ moduleNumber }}.</span>
        <span>{{ module.title }}</span>
      </div>
      <ul class="program-item__sidebar">
        <!-- Статус модуля -->
        <li v-if="moduleStatus !== 'available'">
          <!-- Недоступен (замочек) -->
          <svg
              v-if="moduleStatus === 'locked'"
              class="size-5 text-red-500"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
            <path d="M18 9C18 13.9706 13.9706 18 9 18C4.02944 18 0 13.9706 0 9C0 4.02944 4.02944 0 9 0C13.9706 0 18 4.02944 18 9Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5354 8.54297V7.2C11.5354 5.70937 10.3961 4.5 9 4.5C7.6039 4.5 6.46463 5.70937 6.46463 7.2V8.54297H5.625V13.5H12.375V8.54297H11.5354ZM7.32073 7.2C7.32073 6.20508 8.06817 5.4 9 5.4C9.93183 5.4 10.6793 6.20508 10.6793 7.2V8.54297H7.32073V7.2Z" fill="white"/>
          </svg>

          <!-- В процессе (пауза) -->
          <svg
              v-else-if="moduleStatus === 'in-progress'"
              class="size-6 text-orange-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM14 8C14.5523 8 15 8.44772 15 9L15 15C15 15.5523 14.5523 16 14 16C13.4477 16 13 15.5523 13 15L13 9C13 8.44772 13.4477 8 14 8ZM10 8C10.5523 8 11 8.44772 11 9L11 15C11 15.5523 10.5523 16 10 16C9.44771 16 9 15.5523 9 15L9 9C9 8.44772 9.44772 8 10 8Z" fill="currentColor"/>
          </svg>

          <!-- Завершен (галочка) -->
          <svg
              v-else-if="moduleStatus === 'completed'"
              class="size-6"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.16909 2.7729C8.0664 1.51662 9.93353 1.51662 10.8309 2.7729L10.9738 2.9729C11.1316 3.194 11.3969 3.31239 11.6669 3.28239L12.3036 3.21164C13.7367 3.05241 14.9476 4.26329 14.7884 5.69635L14.7176 6.33311C14.6876 6.60315 14.806 6.86831 15.0271 7.02623L15.2271 7.16909C16.4834 8.0664 16.4834 9.93353 15.2271 10.8309L15.0271 10.9738C14.806 11.1316 14.6876 11.3969 14.7176 11.6669L14.7884 12.3036C14.9476 13.7367 13.7367 14.9476 12.3036 14.7884L11.6669 14.7176C11.3969 14.6876 11.1316 14.806 10.9738 15.0271L10.8309 15.2271C9.93353 16.4834 8.06648 16.4834 7.16909 15.2271L7.02623 15.0271C6.86831 14.806 6.60315 14.6876 6.33311 14.7176L5.69635 14.7884C4.26329 14.9476 3.05241 13.7367 3.21164 12.3036L3.28239 11.6669C3.31239 11.3969 3.194 11.1316 2.9729 10.9738L2.7729 10.8309C1.51662 9.93353 1.51662 8.06648 2.7729 7.16909L2.9729 7.02623C3.194 6.86831 3.31239 6.60315 3.28239 6.33311L3.21164 5.69635C3.05241 4.26329 4.26329 3.05241 5.69635 3.21164L6.33311 3.28239C6.60315 3.31239 6.86831 3.194 7.02623 2.9729L7.16909 2.7729ZM11.7803 6.96967C12.0732 7.26257 12.0732 7.73745 11.7803 8.03032L8.91615 10.8945C8.54827 11.2625 7.95173 11.2625 7.58385 10.8945L6.21967 9.53032C5.92678 9.23745 5.92678 8.76255 6.21967 8.46968C6.51257 8.1768 6.98744 8.1768 7.28033 8.46968L8.25 9.43935L10.7197 6.96967C11.0126 6.67678 11.4875 6.67678 11.7803 6.96967Z" fill="#2F8152"/>
          </svg>
        </li>

        <!-- Стрелка -->
        <li>
          <svg
              class="size-4 caret"
              :class="{ 'rotate-180': isExpanded }"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
            <path d="M0.752685 0.658692L7.75269 8.65869L14.7527 0.658691" stroke="#666666" stroke-width="2"/>
          </svg>
        </li>
      </ul>
    </div>

    <!-- Тело модуля -->
    <div class="program-item__body">
      <LessonCard
          v-for="lesson in module.lessons"
          :key="lesson.id"
          :lesson="lesson"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import LessonCard from './LessonCard.vue';

const props = defineProps({
  module: {
    type: Object,
    required: true
  },
  moduleNumber: {
    type: Number,
    required: true
  },
  // 🆕 ДОБАВЬТЕ: Пропс для проверки предыдущего модуля
  previousModuleCompleted: {
    type: Boolean,
    default: false
  }
});

const isExpanded = ref(false);

// Определение статуса модуля
const moduleStatus = computed(() => {
  const completed = props.module.completed_lessons;
  const total = props.module.total_lessons;

  const firstLesson = props.module.lessons[0];
  if (firstLesson && !firstLesson.is_available) {
    return 'locked';
  }

  if (completed === total && total > 0) {
    return 'completed';
  }

  if (completed > 0 && completed < total) {
    return 'in-progress';
  }

  return 'available';
});

const hasActiveStatus = computed(() => {
  return moduleStatus.value === 'in-progress';
});

// CSS классы модуля
const moduleClasses = computed(() => {
  const classes = [];

  if (isExpanded.value) {
    classes.push('available');
    classes.push('active');
  }

  return classes.join(' ');
});

const toggleModule = () => {
  isExpanded.value = !isExpanded.value;
};

// 🔧 ИСПРАВЛЕНО: Логика автоматического раскрытия
onMounted(() => {
  const completed = props.module.completed_lessons;
  const total = props.module.total_lessons;

  // 1. Первый модуль открыт ТОЛЬКО если прогресс = 0% (ученик только начал)
  if (props.moduleNumber === 1 && completed === 0) {
    isExpanded.value = true;
    console.log(`✅ Модуль ${props.moduleNumber}: открыт (первый модуль, прогресс 0%)`);
    return;
  }

  // 2. Любой модуль in-progress всегда открыт
  if (moduleStatus.value === 'in-progress') {
    isExpanded.value = true;
    console.log(`✅ Модуль ${props.moduleNumber}: открыт (in-progress)`);
    return;
  }

  // 3. Модуль available открыт если предыдущий модуль завершен
  if (moduleStatus.value === 'available' && props.previousModuleCompleted) {
    isExpanded.value = true;
    console.log(`✅ Модуль ${props.moduleNumber}: открыт (available, предыдущий завершен)`);
    return;
  }

  console.log(`❌ Модуль ${props.moduleNumber}: закрыт`);
});
</script>

<style scoped>
.caret {
  transition: transform 0.3s ease;
}

.caret.rotate-180 {
  transform: rotate(180deg);
}
</style>