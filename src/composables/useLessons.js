import { ref } from 'vue';
import { coursesAPI } from '@/services/api';

export function useLessons() {
    const loading = ref(false);
    const error = ref(null);

    // Состояния прогресса курса
    const courseProgress = ref(0);
    const completedLessons = ref(0);
    const totalLessons = ref(0);
    const nextLesson = ref(null);

    /**
     * Завершить урок
     * @param {number} lessonId - ID урока
     * @returns {Promise<Object>} - Результат с прогрессом и следующим уроком
     */
    const completeLesson = async (lessonId) => {
        loading.value = true;
        error.value = null;

        try {
            const response = await coursesAPI.completeLesson(lessonId);

            // ✅ НОВЫЙ ФОРМАТ: course_progress теперь объект
            const progressData = response.data.course_progress;
            courseProgress.value = progressData.percentage;
            completedLessons.value = progressData.completed_lessons;
            totalLessons.value = progressData.total_lessons;

            // Сохраняем информацию о следующем уроке
            nextLesson.value = response.data.next_lesson;

            return {
                success: true,
                message: response.data.message,
                progress: progressData,
                nextLesson: response.data.next_lesson
            };

        } catch (e) {
            error.value = e.response?.data?.error || 'Ошибка завершения урока';
            console.error('Ошибка завершения урока:', e);
            throw e;
        } finally {
            loading.value = false;
        }
    };

    /**
     * Сбросить состояние
     */
    const reset = () => {
        courseProgress.value = 0;
        completedLessons.value = 0;
        totalLessons.value = 0;
        nextLesson.value = null;
        error.value = null;
    };

    return {
        // Состояния
        loading,
        error,
        courseProgress,
        completedLessons,
        totalLessons,
        nextLesson,

        // Методы
        completeLesson,
        reset
    };
}