<template>
  <MainLayout>
    <div class="lesson-container">
      <!-- Видео урока -->
      <div class="video-container">
        <video ref="videoPlayer" @ended="handleVideoEnded"></video>
      </div>

      <!-- Прогресс курса -->
      <div class="course-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: courseProgress + '%' }"></div>
        </div>
        <p class="text-sm text-gray-600">
          Прогресс: {{ completedLessons }} из {{ totalLessons }} уроков ({{ courseProgress }}%)
        </p>
      </div>

      <!-- Кнопка завершения урока -->
      <button
          @click="handleCompleteLesson"
          :disabled="loading || lessonCompleted"
          class="btn-complete">
        {{ loading ? 'Завершение...' : lessonCompleted ? 'Урок завершен ✓' : 'Завершить урок' }}
      </button>

      <!-- Следующий урок -->
      <div v-if="nextLesson" class="next-lesson-card">
        <h3>Следующий урок: {{ nextLesson.title }}</h3>

        <!-- Если доступен -->
        <button
            v-if="nextLesson.is_available"
            @click="goToNextLesson"
            class="btn-next">
          Перейти к следующему уроку →
        </button>

        <!-- Если заблокирован -->
        <div v-else class="locked-info">
          <svg class="lock-icon"><!-- замочек --></svg>
          <p>Откроется {{ nextLesson.available_in }}</p>
        </div>
      </div>

      <!-- Ошибка -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useLessons } from '@/composables/useLessons';
import MainLayout from '@/layouts/MainLayout.vue';

const router = useRouter();
const route = useRoute();

const lessonId = ref(parseInt(route.params.id));
const lessonCompleted = ref(false);

// Используем composable
const {
  loading,
  error,
  courseProgress,
  completedLessons,
  totalLessons,
  nextLesson,
  completeLesson
} = useLessons();

// Завершить урок
const handleCompleteLesson = async () => {
  try {
    const result = await completeLesson(lessonId.value);

    lessonCompleted.value = true;

    console.log('✅ Урок завершен!');
    console.log('📊 Прогресс:', result.progress);
    console.log('➡️ Следующий урок:', result.nextLesson);

    // Можно показать уведомление
    // toast.success('Урок завершен!');

  } catch (e) {
    console.error('❌ Ошибка завершения урока:', e);
  }
};

// Обработка завершения видео
const handleVideoEnded = () => {
  // Автоматически завершаем урок после просмотра видео
  if (!lessonCompleted.value) {
    handleCompleteLesson();
  }
};

// Переход к следующему уроку
const goToNextLesson = () => {
  if (nextLesson.value && nextLesson.value.is_available) {
    router.push({ name: 'Lesson', params: { id: nextLesson.value.id } });
  }
};
</script>

<style scoped>
.lesson-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.btn-complete {
  padding: 1rem 2rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-complete:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.next-lesson-card {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #f3f4f6;
  border-radius: 0.5rem;
}

.locked-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}
</style>