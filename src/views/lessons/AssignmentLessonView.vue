<template>
  <MainLayout>
    <!-- ✅ УВЕДОМЛЕНИЕ -->
    <Transition name="toast">
      <div v-if="notification.show" class="notification" :class="notification.type">
        <div class="flex items-center gap-3">
          <!-- Иконка успеха -->
          <svg v-if="notification.type === 'success'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>

          <!-- Иконка ошибки -->
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>

          <span class="flex-1 font-medium">{{ notification.message }}</span>

          <button @click="notification.show = false" class="opacity-70 hover:opacity-100">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Кнопка назад и заголовок -->
    <section class="py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-8">
      <div class="col-span-full lg:col-span-2">
        <button @click="goBack" class="btn-back">
          <span class="btn-back__icon">
            <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.4949 0.743164L1.49487 9.74316L11.4949 18.7432" stroke="#fff" stroke-width="2"/>
            </svg>
          </span>
          <span class="btn-back__text">Назад</span>
        </button>
      </div>
      <div class="col-span-full lg:col-span-10 flex items-center">
        <h2 v-if="lesson" class="h2 font-bold text-black leading-tight mt-3">
          {{ lesson.title }}
        </h2>
      </div>
    </section>

    <!-- Загрузка -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="text-xl">Загрузка задания...</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-xl text-red-600">{{ error }}</div>
    </div>

    <!-- Контент задания -->
    <section v-else-if="lesson && assignment" class="w-full">
      <div class="courses-content">
        <div class="col-span-full md:col-span-8 md:col-start-3">

          <!-- ========== ЭКРАН 1: Информация и форма сдачи ========== -->
          <div v-if="currentScreen === 'info'" class="space-y-6">

            <!-- Информация о задании -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 class="text-xl font-bold text-gray-900">О задании</h3>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Максимальный балл: <strong>{{ assignment.max_score }}</strong></span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Дедлайн: <strong>{{ assignment.deadline_days }} дней</strong></span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <span>{{ assignment.require_text ? 'Текст обязателен' : 'Текст опционально' }}</span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                  </svg>
                  <span>{{ assignment.require_file ? 'Файл обязателен' : 'Файл не требуется' }}</span>
                </div>
              </div>

              <!-- Пересдача -->
              <div v-if="!assignment.allow_resubmission" class="pt-4 border-t">
                <p class="text-sm text-red-600">
                  ⚠️ Пересдача запрещена. Проверьте работу перед отправкой!
                </p>
              </div>
            </div>

            <!-- Инструкции -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h3 class="text-xl font-bold mb-4">Задание</h3>
              <div class="prose prose-sm max-w-none" v-html="formatInstructions(assignment.instructions)"></div>
            </div>

            <!-- Описание урока
            <div v-if="lesson.description" class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p class="text-gray-700">{{ lesson.description }}</p>
            </div>
            -->

            <!-- История сдач -->
            <div v-if="submissions.length > 0" class="space-y-4 mt-12">
              <h3 class="text-lg font-bold">История сдач</h3>

              <div
                  v-for="submission in submissions"
                  :key="submission.id"
                  class="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors"
                  @click="viewSubmission(submission.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-sm font-medium text-gray-600">Попытка #{{ submission.submission_number }}</span>
                    <span
                        class="px-3 py-1 text-xs font-semibold rounded-full"
                        :class="getStatusClass(submission.status)"
                    >
                      {{ getStatusText(submission.status) }}
                    </span>
                  </div>
                  <div class="text-right">
                    <p v-if="submission.score !== null" class="font-bold text-lg">
                      {{ submission.score }}/{{ assignment.max_score }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ new Date(submission.submitted_at).toLocaleDateString('ru-RU') }}
                    </p>
                  </div>
                </div>

                <div v-if="submission.comments_count > 0" class="mt-2 text-sm text-gray-600">
                  💬 {{ submission.comments_count }} {{ submission.comments_count === 1 ? 'комментарий' : 'комментариев' }}
                </div>
              </div>
            </div>

            <!-- Форма сдачи -->
            <div v-if="canSubmit" class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 class="text-xl font-bold">Сдать задание</h3>

              <!-- Текст ответа -->
              <div v-if="assignment.require_text || !assignment.require_file">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Текст ответа {{ assignment.require_text ? '*' : '(опционально)' }}
                </label>
                <textarea
                    v-model="submissionForm.text"
                    rows="8"
                    class="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Введите ваш ответ..."
                ></textarea>
              </div>

              <!-- Файл -->
              <div v-if="assignment.require_file || !assignment.require_text">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Прикрепить файл {{ assignment.require_file ? '*' : '' }}
                </label>
                <input
                    ref="fileInput"
                    type="file"
                    @change="handleFileSelect"
                    class="w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100
                    cursor-pointer"
                />
                <div v-if="submissionForm.fileName" class="mt-2 flex items-center gap-2">
                  <span class="text-sm text-gray-600">{{ submissionForm.fileName }}</span>
                  <button
                      @click="clearFile"
                      type="button"
                      class="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Стереть
                  </button>
                </div>
              </div>

              <!-- Кнопка отправки -->
              <button
                  @click="submitAssignment"
                  :disabled="submitting || !isFormValid"
                  class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ submitting ? 'Отправка...' : 'Отправить на проверку' }}
              </button>
            </div>

            <!-- Сообщение если нельзя сдать -->
            <div v-else class="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
              <p class="text-yellow-800 font-medium">{{ getCannotSubmitReason() }}</p>
            </div>

          </div>

          <!-- ========== ЭКРАН 2: Просмотр сдачи ========== -->
          <div v-if="currentScreen === 'viewing' && currentSubmission" class="space-y-6">

            <!-- Информация о сдаче -->
            <div class="bg-white border-2 rounded-lg p-6" :class="getSubmissionBorderClass(currentSubmission.status)">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <h3 class="text-xl font-bold">Попытка #{{ currentSubmission.submission_number }}</h3>
                  <span
                      class="px-3 py-1 text-sm font-semibold rounded-full"
                      :class="getStatusClass(currentSubmission.status)"
                  >
                    {{ getStatusText(currentSubmission.status) }}
                  </span>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">Дата сдачи:</span>
                  <p class="font-medium">{{ new Date(currentSubmission.submitted_at).toLocaleString('ru-RU') }}</p>
                </div>
                <div v-if="currentSubmission.reviewed_at">
                  <span class="text-gray-600">Дата проверки:</span>
                  <p class="font-medium">{{ new Date(currentSubmission.reviewed_at).toLocaleString('ru-RU') }}</p>
                </div>
                <div v-if="currentSubmission.score !== null">
                  <span class="text-gray-600">Балл:</span>
                  <p class="text-2xl font-bold" :class="currentSubmission.score >= (assignment.max_score * 0.7) ? 'text-green-600' : 'text-red-600'">
                    {{ currentSubmission.score }}/{{ assignment.max_score }}
                  </p>
                </div>
                <div v-if="currentSubmission.reviewed_by_name">
                  <span class="text-gray-600">Проверил:</span>
                  <p class="font-medium">{{ currentSubmission.reviewed_by_name }}</p>
                </div>
              </div>
            </div>

            <!-- Текст ответа -->
            <div v-if="currentSubmission.submission_text" class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="font-bold mb-3">Ваш ответ:</h4>
              <div class="prose prose-sm max-w-none whitespace-pre-wrap">{{ currentSubmission.submission_text }}</div>
            </div>

            <!-- Прикрепленный файл -->
            <div v-if="currentSubmission.file_url" class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="font-bold mb-3">Прикрепленный файл:</h4>
              <a
                  :href="currentSubmission.file_url"
                  target="_blank"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Скачать файл
              </a>
            </div>

            <!-- Обратная связь от преподавателя -->
            <div v-if="currentSubmission.feedback" class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="font-bold mb-3 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Обратная связь от преподавателя:
              </h4>
              <div class="prose prose-sm max-w-none whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">{{ currentSubmission.feedback }}</div>
            </div>

            <!-- Комментарии (чат) -->
            <div class="bg-white border border-gray-200 rounded-lg p-6">
              <h4 class="font-bold mb-4">Комментарии</h4>

              <!-- Список комментариев -->
              <div v-if="currentSubmission.comments?.length > 0" class="space-y-4 mb-4 max-h-96 overflow-y-auto">
                <div
                    v-for="comment in currentSubmission.comments"
                    :key="comment.id"
                    class="flex gap-3"
                    :class="comment.is_instructor ? 'flex-row' : 'flex-row-reverse'"
                >
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                         :class="comment.is_instructor ? 'bg-blue-500' : 'bg-gray-500'"
                    >
                      {{ comment.author_name.charAt(0) }}
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="rounded-lg p-3"
                         :class="comment.is_instructor ? 'bg-blue-50' : 'bg-gray-100'"
                    >
                      <p class="text-xs text-gray-600 mb-1">
                        {{ comment.author_name }} • {{ new Date(comment.created_at).toLocaleString('ru-RU') }}
                      </p>
                      <p class="text-sm whitespace-pre-wrap">{{ comment.message }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-gray-500">
                Комментариев пока нет
              </div>

              <!-- Форма добавления комментария -->
              <div class="flex gap-3">
                <input
                    v-model="commentText"
                    @keyup.enter="addComment"
                    type="text"
                    placeholder="Написать комментарий..."
                    class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    @click="addComment"
                    :disabled="!commentText.trim() || addingComment"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ addingComment ? '...' : 'Отправить' }}
                </button>
              </div>
            </div>

            <!-- Кнопка пересдачи -->
            <div v-if="currentSubmission.can_resubmit" class="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
              <h4 class="font-bold mb-2 text-yellow-900">Требуется доработка</h4>
              <p class="text-sm text-yellow-800 mb-4">
                Преподаватель вернул работу на доработку. Вы можете сдать исправленную версию.
              </p>
              <button
                  @click="backToInfo"
                  class="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700"
              >
                Отправить новую версию
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { lessonsAPI, assignmentsAPI } from '@/services/api';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta';

const route = useRoute();
const router = useRouter();

// Состояния
const loading = ref(true);
const error = ref(null);
const lesson = ref(null);
const assignment = ref(null);
const submissions = ref([]);

// Экраны: 'info', 'viewing'
const currentScreen = ref('info');

// Форма сдачи
const fileInput = ref(null);
const submitting = ref(false);
const submissionForm = ref({
  text: '',
  file: null,
  fileName: ''
});

// Просмотр сдачи
const currentSubmission = ref(null);
const commentText = ref('');
const addingComment = ref(false);

usePageMeta('Домашнее задание', 'Личный кабинет');

// Можно ли сдать
const canSubmit = computed(() => {
  if (!assignment.value) return false;

  // Проверяем последнюю сдачу
  const lastSubmission = submissions.value[0];

  if (!lastSubmission) {
    // Первая сдача - разрешено
    return true;
  }

  // Если на проверке - нельзя
  if (lastSubmission.status === 'in_review') {
    return false;
  }

  // Если зачтено - нельзя
  if (lastSubmission.status === 'passed') {
    return false;
  }

  // Если требуется доработка - можно если разрешена пересдача
  if (lastSubmission.status === 'needs_revision') {
    return assignment.value.allow_resubmission;
  }

  // Если не зачтено - можно если разрешена пересдача
  if (lastSubmission.status === 'failed') {
    return assignment.value.allow_resubmission;
  }

  return false;
});

// После других ref
const notification = ref({
  show: false,
  message: '',
  type: 'success' // 'success' или 'error'
});

// Функция показа уведомления
function showNotification(message, type = 'success') {
  notification.value = {
    show: true,
    message,
    type
  };

  // Автоматически скрыть через 3 секунды
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

// Валидация формы
const isFormValid = computed(() => {
  if (!assignment.value) return false;

  const hasText = submissionForm.value.text.trim().length > 0;
  const hasFile = submissionForm.value.file !== null;

  if (assignment.value.require_text && !hasText) return false;
  if (assignment.value.require_file && !hasFile) return false;

  return hasText || hasFile;
});

onMounted(async () => {
  await loadLesson();
  await loadSubmissions();
});

// Загрузить урок
async function loadLesson() {
  try {
    loading.value = true;
    error.value = null;

    console.log('📥 Загружаем assignment-урок:', route.params.id);

    const response = await lessonsAPI.getLesson(route.params.id);

    lesson.value = response.data.lesson;
    assignment.value = response.data.assignment;

    console.log('✅ Assignment загружен:', assignment.value);

  } catch (err) {
    console.error('❌ Ошибка загрузки урока:', err);
    error.value = err.response?.data?.error || 'Не удалось загрузить задание';
  } finally {
    loading.value = false;
  }
}

// Загрузить свои сдачи
async function loadSubmissions() {
  try {
    const response = await assignmentsAPI.getMySubmissions();

    // Фильтруем только сдачи этого задания
    submissions.value = response.data.filter(
        sub => sub.assignment_title === lesson.value?.title
    );

    console.log('✅ Сдачи загружены:', submissions.value.length);

  } catch (err) {
    console.error('Ошибка загрузки сдач:', err);
  }
}

// Обработка выбора файла
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    submissionForm.value.file = file;
    submissionForm.value.fileName = file.name;
  }
}

function clearFile() {
  submissionForm.value.file = null;
  submissionForm.value.fileName = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

// Сдать задание
async function submitAssignment() {
  try {
    submitting.value = true;

    const formData = new FormData();

    if (submissionForm.value.text) {
      formData.append('submission_text', submissionForm.value.text);
    }

    if (submissionForm.value.file) {
      formData.append('submission_file', submissionForm.value.file);
    }

    const response = await assignmentsAPI.submitAssignment(assignment.value.id, formData);

    // Очистить форму
    submissionForm.value = {
      text: '',
      file: null,
      fileName: ''
    };

    // Обновить список сдач
    await loadSubmissions();

    // ✅ ЗАМЕНИТЬ:
    showNotification('Работа успешно отправлена на проверку!', 'success');

  } catch (err) {
    console.error('Ошибка отправки:', err);
    // ✅ ЗАМЕНИТЬ:
    showNotification(err.response?.data?.error || 'Не удалось отправить задание', 'error');
  } finally {
    submitting.value = false;
  }
}

// Просмотр сдачи
async function viewSubmission(submissionId) {
  try {
    loading.value = true;

    const response = await assignmentsAPI.getSubmission(submissionId);
    currentSubmission.value = response.data;
    currentScreen.value = 'viewing';

  } catch (err) {
    console.error('❌ Ошибка загрузки сдачи:', err);
    // ✅ ЗАМЕНИТЬ:
    showNotification('Не удалось загрузить сдачу', 'error');
  } finally {
    loading.value = false;
  }
}

// Добавить комментарий
async function addComment() {
  if (!commentText.value.trim() || !currentSubmission.value) return;

  try {
    addingComment.value = true;

    const response = await assignmentsAPI.addComment(
        currentSubmission.value.id,
        commentText.value
    );

    currentSubmission.value.comments.push(response.data.comment);
    commentText.value = '';

    // ✅ ДОБАВИТЬ:
    showNotification('💬 Комментарий отправлен', 'success');

  } catch (err) {
    console.error('❌ Ошибка добавления комментария:', err);
    // ✅ ЗАМЕНИТЬ:
    showNotification('Не удалось отправить комментарий', 'error');
  } finally {
    addingComment.value = false;
  }
}

// Вернуться к информации
function backToInfo() {
  currentScreen.value = 'info';
  currentSubmission.value = null;
}

// Кнопка назад
function goBack() {
  router.back();
}

// Форматирование инструкций
function formatInstructions(text) {
  return text.replace(/\n/g, '<br>');
}

// Статусы
function getStatusText(status) {
  const statuses = {
    'waiting': 'Ожидает сдачи',
    'in_review': 'На проверке',
    'needs_revision': 'Требуется доработка',
    'failed': 'Не зачтено',
    'passed': 'Зачтено'
  };
  return statuses[status] || status;
}

function getStatusClass(status) {
  const classes = {
    'waiting': 'bg-gray-100 text-gray-700',
    'in_review': 'bg-yellow-100 text-yellow-700',
    'needs_revision': 'bg-orange-100 text-orange-700',
    'failed': 'bg-red-100 text-red-700',
    'passed': 'bg-green-100 text-green-700'
  };
  return classes[status] || 'bg-gray-100 text-gray-700';
}

function getSubmissionBorderClass(status) {
  const classes = {
    'in_review': 'border-yellow-500',
    'needs_revision': 'border-orange-500',
    'failed': 'border-red-500',
    'passed': 'border-green-500'
  };
  return classes[status] || 'border-gray-200';
}

function getCannotSubmitReason() {
  const lastSubmission = submissions.value[0];

  if (!lastSubmission) {
    return 'Нет доступа к сдаче задания';
  }

  if (lastSubmission.status === 'in_review') {
    return 'Ваша работа находится на проверке. Дождитесь результатов.';
  }

  if (lastSubmission.status === 'passed') {
    return 'Задание уже зачтено!';
  }

  if (lastSubmission.status === 'needs_revision' && !assignment.value.allow_resubmission) {
    return 'Пересдача запрещена для этого задания.';
  }

  if (lastSubmission.status === 'failed' && !assignment.value.allow_resubmission) {
    return 'Пересдача запрещена для этого задания.';
  }

  return 'Сдача недоступна';
}
</script>

<style scoped>
/* Уведомление */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  min-width: 320px;
  max-width: 500px;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  color: white;
}

.notification.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95));
}

.notification.error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
}

/* Анимация */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>