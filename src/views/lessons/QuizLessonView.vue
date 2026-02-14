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
          <svg v-else-if="notification.type === 'error'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>

          <!-- Иконка предупреждения -->
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
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

    <!-- ✅ МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ -->
    <Transition name="modal">
      <div v-if="confirmDialog.show" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div class="flex items-start gap-4 mb-4">
            <svg class="w-12 h-12 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ confirmDialog.title }}</h3>
              <p class="text-sm text-gray-600">{{ confirmDialog.message }}</p>
            </div>
          </div>
          <div class="flex gap-3 justify-end">
            <button
                @click="confirmDialog.reject()"
                class="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Отмена
            </button>
            <button
                @click="confirmDialog.resolve()"
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700"
            >
              Продолжить
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Кнопка назад и заголовок -->
    <section class="py-4 lg:py-6 grid grid-cols-12 gap-4 lg:gap-8">
      <div class="col-span-full lg:col-span-2">
        <button v-if="currentScreen !== 'taking'" @click="goBack" class="btn-back">
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
      <div class="text-xl">Загрузка теста...</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-xl text-red-600">{{ error }}</div>
    </div>

    <!-- Контент квиза -->
    <section v-else-if="lesson && quiz" class="w-full">
      <div class="courses-content">
        <div class="col-span-full md:col-span-8 md:col-start-3">

          <!-- ========== ЭКРАН 1: Информация и старт ========== -->
          <div v-if="currentScreen === 'info'" class="space-y-6">

            <!-- Информация о тесте -->
            <div class="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <h3 class="text-xl font-bold text-gray-900">О тесте</h3>

              <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span>Вопросов: <strong>{{ quiz.questions_count }}</strong></span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Проходной балл: <strong>{{ parseFloat(quiz.passing_score) }}%</strong></span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Время: <strong>{{ quiz.time_limit_minutes > 0 ? `${quiz.time_limit_minutes} мин` : 'Без ограничений' }}</strong></span>
                </div>

                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <span>Попыток: <strong>{{ quiz.user_attempts_count }}/{{ quiz.max_attempts }}</strong></span>
                </div>
              </div>

            </div>

            <!-- Тест уже сдан — зелёный блок -->
            <div v-if="!quiz.can_attempt.allowed && quiz.can_attempt.message === 'Тест уже сдан'" class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                  <p class="text-green-800 font-medium">
                    {{ quiz.can_attempt.message }}. Результат: {{ Math.round(passedAttempt?.score_percentage) }}%
                  </p>
                </div>
              </div>
            </div>

            <!-- Расписание экзамена (бесплатные группы) -->
            <div v-else-if="showExamSchedule" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                  <!-- Таймер обратного отсчёта -->
                  <p v-if="examStatus === 'countdown'" class="text-blue-800 font-medium">
                    Тест начнётся через:
                    <span class="font-mono text-lg font-bold">{{ countdown }}</span>
                  </p>
                  <!-- Дата в будущем -->
                  <p v-else-if="examStatus === 'future'" class="text-blue-800 font-medium">
                    Итоговый тест: {{ scheduleDateText }}
                  </p>
                  <!-- Тест активен — показываем кнопку ниже -->
                  <template v-else-if="examStatus === 'active'">
                    <p class="text-green-800 font-medium">Тест доступен! Осталось: {{ timeLeft }}</p>
                  </template>
                  <!-- Время прошло -->
                  <p v-else-if="examStatus === 'expired'" class="text-gray-500 font-medium">
                    Итоговый тест завершён
                  </p>
                </div>
              </div>
            </div>

            <!-- Ожидание / лимит исчерпан — жёлтый блок -->
            <div v-else-if="!quiz.can_attempt.allowed" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <div class="flex-1">
                  <!-- С таймером обратного отсчёта -->
                  <p v-if="retryCountdown !== null" class="text-yellow-800 font-medium">
                    Повторная попытка через:
                    <span class="font-mono text-lg font-bold">{{ formatRetryTime(retryCountdown) }}</span>
                  </p>
                  <!-- Без таймера (лимит исчерпан) -->
                  <p v-else class="text-yellow-800 font-medium">{{ quiz.can_attempt.message }}</p>
                </div>
              </div>
            </div>

            <!-- Кнопка старта -->
            <button
                v-else-if="quiz.can_attempt.allowed || examIsAvailable"
                @click="startQuiz"
                :disabled="startingQuiz"
                class="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ startingQuiz ? 'Запуск теста...' : 'Начать тест' }}
            </button>

            <!-- История попыток -->
            <div v-if="attemptHistory.length > 0" class="mt-8">
              <h3 class="text-lg font-bold mb-4">История попыток</h3>
              <div class="space-y-2">
                <div
                    v-for="attempt in attemptHistory"
                    :key="attempt.id"
                    class="bg-white border border-gray-300 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p class="font-medium">Попытка #{{ attempt.attempt_number }}</p>
                    <p class="text-sm text-gray-500">
                      {{ new Date(attempt.started_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                    </p>
                  </div>
                  <div class="text-right">
                    <!-- Завершён успешно -->
                    <p v-if="attempt.status === 'completed'" class="font-bold" :class="parseFloat(attempt.score_percentage) >= quiz.passing_score ? 'text-green-600' : 'text-red-600'">
                      {{ parseFloat(attempt.score_percentage) }}%
                    </p>
                    <!-- Время истекло -->
                    <p v-else-if="attempt.status === 'timeout'" class="text-sm font-medium text-red-600">
                      Время истекло
                    </p>
                    <!-- В процессе -->
                    <p v-else class="text-sm text-yellow-600">В процессе</p>
                    <p class="text-sm text-gray-500 font-medium flex gap-1 items-center justify-end">
                      <span>
<!--                        Длительность:-->
                      </span>
                      <span class="leading-none">{{ attempt.duration.formatted }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== ЭКРАН 2: Прохождение теста ========== -->
          <div v-if="currentScreen === 'taking'" class="space-y-6">

            <!-- Прогресс и таймер -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium">Вопрос {{ currentQuestionIndex + 1 }} из {{ questions.length }}</span>
                <span v-if="timeRemaining !== null" class="text-sm font-medium" :class="timeRemaining < 60 ? 'text-red-600' : 'text-gray-600'">
                  {{ formatTime(timeRemaining) }}
                </span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div
                    class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }"
                ></div>
              </div>
            </div>

            <!-- Текущий вопрос -->
            <div v-if="currentQuestion" class="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
              <div>
                <div class="flex items-start gap-3 mb-4">
                  <span class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {{ currentQuestionIndex + 1 }}
                  </span>
                  <h3 class="text-lg font-semibold text-gray-900 flex-1">{{ currentQuestion.question_text }}</h3>
<!--                  <span class="text-sm text-gray-500">{{ currentQuestion.points }} {{ currentQuestion.points === 1 ? 'балл' : 'балла' }}</span>-->
                </div>

                <p v-if="currentQuestion.question_type === 'multiple_choice'" class="text-sm text-gray-600 mb-4">
                  (Можно выбрать несколько вариантов)
                </p>
              </div>

              <!-- Варианты ответов -->
              <div class="space-y-3">
                <label
                    v-for="answer in currentQuestion.answers"
                    :key="answer.id"
                    class="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-colors hover:border-blue-300"
                    :class="{
                    'border-blue-500 bg-blue-50': isAnswerSelected(answer.id),
                    'border-gray-200': !isAnswerSelected(answer.id)
                  }"
                >
                  <input
                      :type="currentQuestion.question_type === 'single_choice' ? 'radio' : 'checkbox'"
                      :name="`question-${currentQuestion.id}`"
                      :value="answer.id"
                      :checked="isAnswerSelected(answer.id)"
                      @change="selectAnswer(answer.id)"
                      class="mt-1 w-4 h-4 text-blue-600"
                  />
                  <span class="flex-1">{{ answer.answer_text }}</span>
                </label>
              </div>
            </div>

            <!-- Навигация -->
            <div class="flex justify-between gap-4">
              <button
                  v-if="currentQuestionIndex > 0"
                  @click="previousQuestion"
                  class="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                ← Назад
              </button>
              <div v-else></div>

              <button
                  v-if="currentQuestionIndex < questions.length - 1"
                  @click="nextQuestion"
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Далее →
              </button>
              <button
                  v-else
                  @click="confirmSubmit"
                  :disabled="submitting"
                  class="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {{ submitting ? 'Отправка...' : 'Завершить тест' }}
              </button>
            </div>
          </div>

          <!-- ========== ЭКРАН 3: Результаты ========== -->
          <div v-if="currentScreen === 'results' && results" class="space-y-6">

            <!-- Общий результат -->
            <!-- Общий результат -->
            <div class="bg-white border-2 rounded-lg p-8 text-center"
                 :class="results.time_expired ? 'border-yellow-500' : (results.passed ? 'border-green-500' : 'border-red-500')">
              <div class="mb-4">
                <!-- Иконка таймаута -->
                <svg v-if="results.time_expired" class="w-20 h-20 mx-auto text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <!-- Иконка успеха -->
                <svg v-else-if="results.passed" class="w-20 h-20 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <!-- Иконка провала -->
                <svg v-else class="w-20 h-20 mx-auto text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>

              <h2 class="text-xl font-bold mb-2"
                  :class="results.time_expired ? 'text-yellow-600' : (results.passed ? 'text-green-600' : 'text-red-600')">
                {{ results.time_expired ? 'Время истекло!' : (results.passed ? 'Тест пройден!' : 'Тест не пройден') }}
              </h2>

              <p class="text-5xl font-bold"
                 :class="results.time_expired ? 'text-yellow-600' : (results.passed ? 'text-green-600' : 'text-red-600')">
                {{ Math.round(results.score) }}%
              </p>

              <p class="text-gray-600 pt-2">
                Проходной балл: {{ parseFloat(results.passing_score) }}%
              </p>

              <p v-if="!results.time_expired" class="text-sm text-gray-600">
                Правильных ответов: {{ results.correct_answers }} из {{ results.total_questions }}
              </p>

              <p v-else class="text-sm text-yellow-700 mt-2">
                Тест не засчитан — время на прохождение истекло
              </p>

              <p class="text-sm text-gray-500 mt-4">
                Попытка #{{ results.attempt_number }}
              </p>
            </div>


            <!-- Детальный разбор -->
            <div v-if="results.passed && quiz.show_correct_answers && results.questions?.length > 0" class="space-y-4">
              <h3 class="text-xl font-bold">Разбор ответов</h3>

              <div
                  v-for="(question, index) in results.questions"
                  :key="question.id"
                  class="bg-white border rounded-lg p-6"
                  :class="question.is_correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'"
              >
                <div class="flex items-start gap-3 mb-4">
                <span class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" :class="question.is_correct ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
                  {{ index + 1 }}
                </span>
                  <div class="flex-1">
                    <h4 class="font-semibold mb-2">{{ question.question_text }}</h4>
                    <p class="text-sm" :class="question.is_correct ? 'text-green-700' : 'text-red-700'">
                      {{ question.is_correct ? '✓ Правильно' : '✗ Неправильно' }}
                      ({{ question.points_earned }}/{{ question.points }} {{ question.points === 1 ? 'балл' : 'балла' }})
                    </p>
                  </div>
                </div>

                <div class="space-y-2 ml-11">
                  <div
                      v-for="answer in question.answers"
                      :key="answer.id"
                      class="p-3 rounded-lg flex items-start gap-2"
                      :class="{
                        'bg-green-100 border border-green-300': answer.is_correct,
                        'bg-red-100 border border-red-300': !answer.is_correct && question.user_selected_ids?.includes(answer.id),
                        'bg-gray-50': !answer.is_correct && !question.user_selected_ids?.includes(answer.id)
                      }"
                  >
                    <span v-if="answer.is_correct" class="text-green-600 font-bold">✓</span>
                    <span v-else-if="question.user_selected_ids?.includes(answer.id)" class="text-red-600 font-bold">✗</span>
                    <span v-else class="text-gray-400">○</span>
                    <span>{{ answer.answer_text }}</span>
                  </div>
                </div>

                <p v-if="question.explanation" class="mt-4 ml-11 text-sm text-gray-700 bg-white p-3 rounded-lg border">
                  <strong>Пояснение:</strong> {{ question.explanation }}
                </p>
              </div>
            </div>

            <div v-if="!results.passed && !results.time_expired" class="bg-yellow-50 border border-gray-300 rounded-lg p-6">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <h4 class="font-semibold text-yellow-900 mb-2">Тест не пройден</h4>
                  <p class="text-sm text-yellow-800">
                    Повторите попытку чтобы улучшить результат!
                    <br>
                    <span v-if="quiz.can_attempt?.allowed" class="text-sm text-yellow-700 mt-2">
                      Осталось попыток: <strong>{{ quiz.max_attempts - quiz.user_attempts_count }}</strong>
                    </span>
                  </p>

                </div>
              </div>
            </div>
            <div v-if="results.time_expired" class="bg-yellow-50 border border-yellow-300 rounded-lg p-6">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
                </svg>
                <div>
                  <h4 class="font-semibold text-yellow-900 mb-2">Время истекло</h4>
                  <p class="text-sm text-yellow-800">
                    К сожалению, время на прохождение теста закончилось. Попытка засчитана как неуспешная.
                    <br>
                    <span v-if="quiz.can_attempt?.allowed" class="text-sm text-yellow-700 mt-2">
                      Осталось попыток: <strong>{{ quiz.max_attempts - quiz.user_attempts_count }}</strong>
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <!-- Кнопки действий -->
            <div class="flex gap-4">
              <button
                  v-if="quiz.can_attempt?.allowed && !results.passed"
                  @click="resetQuiz"
                  class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Пройти еще раз
              </button>
              <button
                  @click="goBack"
                  class="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Вернуться к курсу
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { lessonsAPI, quizzesAPI } from '@/services/api';
import MainLayout from '@/layouts/MainLayout.vue';
import { usePageMeta } from '@/composables/usePageMeta';
import { useExamCountdown } from '@/composables/useExamCountdown.js'

const route = useRoute();
const router = useRouter();

// Состояния
const loading = ref(true);
const error = ref(null);
const lesson = ref(null);
const quiz = ref(null);
const attemptHistory = ref([]);
const notification = ref({
  show: false,
  message: '',
  type: 'success' // 'success', 'error', 'warning'
});

const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  resolve: () => {},
  reject: () => {}
});

// Функция показа уведомления
function showNotification(message, type = 'success') {
  notification.value = {
    show: true,
    message,
    type
  };

  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

// Функция подтверждения
function showConfirm(title, message) {
  return new Promise((resolve, reject) => {
    confirmDialog.value = {
      show: true,
      title,
      message,
      resolve: () => {
        confirmDialog.value.show = false;
        resolve(true);
      },
      reject: () => {
        confirmDialog.value.show = false;
        reject(false);
      }
    };
  });
}

// Экраны: 'info', 'taking', 'results'
const currentScreen = ref('info');

// Прохождение теста
const startingQuiz = ref(false);
const currentAttemptId = ref(null);
const questions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref({}); // { questionId: [answerIds] }
const timeRemaining = ref(null);
const timerInterval = ref(null);
// Таймер ожидания повторной попытки
const retryCountdown = ref(null);
const retryTimerInterval = ref(null);

// Отправка и результаты
const submitting = ref(false);
const results = ref(null);

usePageMeta('Тест', 'Личный кабинет');

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);

// Найти успешно сданную попытку
const passedAttempt = computed(() => {
  return attemptHistory.value.find(
      attempt => attempt.status === 'completed' &&
          parseFloat(attempt.score_percentage) >= quiz.value?.passing_score
  );
});

// === Расписание экзамена ===
const examSchedule = computed(() => quiz.value?.can_attempt?.exam_schedule ?? null)

async function refetchCanAttempt() {
  try {
    const response = await lessonsAPI.getLesson(route.params.id)
    quiz.value = response.data.quiz
  } catch (err) {
    console.error('Ошибка обновления can_attempt:', err)
  }
}

const { status: examStatus, countdown, isAvailable: examIsAvailable, timeLeft, scheduleDateText } =
    useExamCountdown(examSchedule, refetchCanAttempt)

const showExamSchedule = computed(() =>
    quiz.value?.can_attempt?.allowed === false && examSchedule.value != null
)

// Предупреждение при попытке уйти во время теста
function handleBeforeUnload(e) {
  if (currentScreen.value === 'taking') {
    e.preventDefault();
    e.returnValue = 'Тест в процессе! Если вы уйдёте, попытка будет не засчитана.';
    return e.returnValue;
  }
}

onMounted(async () => {
  await loadLesson();
  await loadAttemptHistory();

  // Предупреждение при закрытии вкладки
  window.addEventListener('beforeunload', handleBeforeUnload);

});

onUnmounted(() => {
  clearTimer();
  clearRetryTimer();

  window.removeEventListener('beforeunload', handleBeforeUnload);
});

// Предупреждение при переходе на другую страницу
onBeforeRouteLeave((to, from, next) => {
  if (currentScreen.value === 'taking') {
    const answer = window.confirm('Тест в процессе! Если вы уйдёте, попытка будет не засчитана. Вы уверены?');
    if (answer) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

// Загрузить урок
async function loadLesson() {
  try {
    loading.value = true;
    error.value = null;

    console.log('📥 Загружаем квиз-урок:', route.params.id);

    const response = await lessonsAPI.getLesson(route.params.id);

    lesson.value = response.data.lesson;
    quiz.value = response.data.quiz;

    console.log('✅ Квиз загружен:', quiz.value);

    // Запускаем таймер ожидания если есть
    if (quiz.value?.can_attempt?.available_at) {
      startRetryTimer(quiz.value.can_attempt.available_at);
    }

  } catch (err) {
    console.error('❌ Ошибка загрузки урока:', err);
    error.value = err.response?.data?.error || 'Не удалось загрузить тест';
  } finally {
    loading.value = false;
  }
}

// Загрузить историю попыток
async function loadAttemptHistory() {
  try {
    const response = await quizzesAPI.getAttempts();
    // Фильтруем только попытки этого квиза
    attemptHistory.value = response.data.filter(
        attempt => attempt.quiz_title === lesson.value?.title
    );
  } catch (err) {
    console.error('Ошибка загрузки истории:', err);
  }
}

// Начать тест
async function startQuiz() {
  try {
    startingQuiz.value = true;

    const response = await quizzesAPI.startQuiz(quiz.value.id);

    currentAttemptId.value = response.data.attempt_id;
    questions.value = response.data.quiz.questions;
    userAnswers.value = {};
    currentQuestionIndex.value = 0;

    if (response.data.time_limit_minutes > 0) {
      timeRemaining.value = response.data.time_limit_minutes * 60;
      startTimer();
    }

    currentScreen.value = 'taking';

    console.log('✅ Тест начат, attempt_id:', currentAttemptId.value);

  } catch (err) {
    console.error('❌ Ошибка старта теста:', err);
    // ✅ БЫЛО: alert('Не удалось начать тест. Попробуйте позже.');
    showNotification('Не удалось начать тест. Попробуйте позже.', 'error');
  } finally {
    startingQuiz.value = false;
  }
}


// Таймер
function startTimer() {
  timerInterval.value = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearTimer();
      submitQuiz(true); // передаём флаг что время истекло
    }
  }, 1000);
}

function clearTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Таймер ожидания повторной попытки
function startRetryTimer(availableAt) {
  clearRetryTimer();

  const targetTime = new Date(availableAt).getTime();

  const updateCountdown = () => {
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((targetTime - now) / 1000));

    if (remaining <= 0) {
      clearRetryTimer();
      retryCountdown.value = null;
      // Автоматически разблокируем кнопку
      quiz.value.can_attempt = {
        allowed: true,
        message: 'Можно начать тест',
        available_at: null
      };
    } else {
      retryCountdown.value = remaining;
    }
  };

  updateCountdown();
  retryTimerInterval.value = setInterval(updateCountdown, 1000);
}

function clearRetryTimer() {
  if (retryTimerInterval.value) {
    clearInterval(retryTimerInterval.value);
    retryTimerInterval.value = null;
  }
}

function formatRetryTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Выбор ответа
function selectAnswer(answerId) {
  const questionId = currentQuestion.value.id;

  if (!userAnswers.value[questionId]) {
    userAnswers.value[questionId] = [];
  }

  if (currentQuestion.value.question_type === 'single_choice') {
    // Одиночный выбор - заменяем
    userAnswers.value[questionId] = [answerId];
  } else {
    // Множественный выбор - toggle
    const index = userAnswers.value[questionId].indexOf(answerId);
    if (index > -1) {
      userAnswers.value[questionId].splice(index, 1);
    } else {
      userAnswers.value[questionId].push(answerId);
    }
  }
}

function isAnswerSelected(answerId) {
  const questionId = currentQuestion.value?.id;
  return userAnswers.value[questionId]?.includes(answerId) || false;
}

// Навигация по вопросам
function nextQuestion() {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

// Подтверждение отправки
async function confirmSubmit() {
  const unanswered = questions.value.filter(q => !userAnswers.value[q.id] || userAnswers.value[q.id].length === 0);

  if (unanswered.length > 0) {
    try {
      await showConfirm(
          'Завершить тест?',
          `У вас остались ${unanswered.length} неотвеченных вопросов. Вы уверены что хотите завершить тест?`
      );
      submitQuiz(false);
    } catch {
      return;
    }
  } else {
    submitQuiz(false);
  }
}

// Отправить тест
async function submitQuiz(isTimeout = false) {
  try {
    submitting.value = true;
    clearTimer();

    // Если время истекло — показываем сообщение сразу
    if (isTimeout) {
      showNotification('⏱ Время истекло! Отправляем результаты...', 'warning');
    }

    const answers = Object.keys(userAnswers.value).map(questionId => ({
      question_id: parseInt(questionId),
      answer_ids: userAnswers.value[questionId]
    }));

    console.log('Отправка ответов:', answers);

    const response = await quizzesAPI.submitAnswers(currentAttemptId.value, answers);

    // Обрабатываем ответ с учётом timeout
    results.value = {
      ...response.data,
      score: response.data.score,
      passed: response.data.passed,
      correct_answers: response.data.correct_answers,
      total_questions: response.data.total_questions || questions.value.length,
      passing_score: response.data.passing_score || quiz.value.passing_score,
      attempt_number: response.data.attempt_number,
      time_expired: response.data.time_expired || false,
      status: response.data.status || 'completed'
    };

    currentScreen.value = 'results';

    console.log('Результаты получены:', results.value);

    await loadAttemptHistory();
    await refetchCanAttempt();

  } catch (err) {
    console.error('❌ Ошибка отправки теста:', err);
    showNotification('Не удалось отправить тест. Попробуйте еще раз.', 'error');
  } finally {
    submitting.value = false;
  }
}

// Сбросить и начать заново
function resetQuiz() {
  currentScreen.value = 'info';
  currentAttemptId.value = null;
  questions.value = [];
  userAnswers.value = {};
  currentQuestionIndex.value = 0;
  timeRemaining.value = null;
  results.value = null;
  clearTimer();

  // Перезагрузить данные
  loadLesson();
  loadAttemptHistory();
}

// Кнопка назад
function goBack() {
  router.back();
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

.notification.warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95));
}

/* Анимация уведомления */
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

/* Модальное окно */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white {
  transform: scale(0.9);
}

.modal-leave-to .bg-white {
  transform: scale(0.9);
}
</style>