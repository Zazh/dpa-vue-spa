<template>
  <MainLayout>
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
      <div class="text-xl">Загрузка урока...</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="flex justify-center items-center py-20">
      <div class="text-xl text-red-600">{{ error }}</div>
    </div>

    <!-- Контент урока -->
    <section v-else-if="lesson && video" class="w-full">
      <div class="courses-content">
        <!-- Vimeo плеер -->
        <div class="col-span-full"> <!-- ← добавьте v-if="video" -->
          <div class="lg:pt-4">
            <div class="overflow-hidden rounded-lg" style="padding:56.25% 0 0 0;position:relative;">
              <iframe
                  ref="videoFrame"
                  :src="video.embed_url"
                  frameborder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerpolicy="strict-origin-when-cross-origin"
                  style="position:absolute;top:0;left:0;width:100%;height:100%;"
                  :title="lesson.title"
              ></iframe>
            </div>
          </div>
        </div>

        <!-- Прогресс просмотра -->
        <!--        <div v-if="!progress.is_completed" class="col-span-full md:col-span-8 md:col-start-3 pt-4">-->
        <!--          <div class="bg-gray-100 rounded-lg p-4">-->
        <!--            <div class="flex justify-between mb-2">-->
        <!--              <span class="text-sm font-medium">Просмотрено</span>-->
        <!--              <span class="text-sm font-medium">{{ Math.round(currentProgress) }}%</span>-->
        <!--            </div>-->
        <!--            <div class="w-full bg-gray-300 rounded-full h-2">-->
        <!--              <div-->
        <!--                  class="bg-blue-600 h-2 rounded-full transition-all duration-300"-->
        <!--                  :style="{ width: currentProgress + '%' }"-->
        <!--              ></div>-->
        <!--            </div>-->
        <!--            <p class="text-xs text-gray-600 mt-2">-->
        <!--              Для завершения урока необходимо просмотреть минимум {{ video.completion_threshold }}%-->
        <!--            </p>-->
        <!--          </div>-->
        <!--        </div>-->

        <!-- Уведомление о завершении -->
        <!--        <div v-if="progress.is_completed" class="col-span-full md:col-span-8 md:col-start-3 pt-4">-->
        <!--          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">-->
        <!--            <strong class="font-bold">✅ Урок завершен!</strong>-->
        <!--            <span class="block sm:inline"> Вы можете пересмотреть материал в любое время.</span>-->
        <!--          </div>-->
        <!--        </div>-->

        <div class="col-span-full md:col-span-8 md:col-start-3 flex flex-wrap gap-12 pb-12">
          <!-- Таймкоды - ТОЛЬКО для завершенных уроков -->
          <div v-if="video.timecodes && video.timecodes.length > 0 && progress.is_completed" class="w-full">
            <!-- ↑ добавили && progress.is_completed -->

            <div class="pt-4">
              <h2 class="h2 font-bold text-black leading-tight">Содержание видео</h2>
            </div>

            <ul class="pt-8 flex flex-col gap-4">
              <li
                  v-for="(timecode, index) in video.timecodes"
                  :key="index"
                  class="text-gray-700 flex cursor-pointer hover:text-black"
                  @click="seekToTime(timecode.time)"
              >
                <span class="w-16 underline text-blue-500">{{ formatTime(timecode.time) }}</span>
                <span>{{ timecode.label }}</span>
              </li>
            </ul>
          </div>

          <!-- Описание -->
          <div v-if="lesson.description" class="w-full">
            <div>
              <h2 class="h2 font-bold text-black leading-tight">Описание</h2>
            </div>
            <div class="pt-4">
              <p class="text-gray-700">{{ lesson.description }}</p>
            </div>
          </div>

          <!-- Материалы -->
          <div v-if="materials && materials.length > 0" class="w-full">
            <div>
              <h2 class="text-xl font-bold text-black leading-tight">Материалы к уроку</h2>
            </div>
            <ul class="flex flex-col gap-3 pt-4">
              <li
                  v-for="material in materials"
                  :key="material.id"
                  class="border-1 border-gray-300 rounded-md text-gray-700 hover:text-blue-600"
              >

                <a :href="material.file || material.url"
                   target="_blank"
                   class="flex gap-4 items-center py-4 px-4 w-full"
                >
                <span class="text-blue-600">
                    <svg class="h-7" viewBox="0 0 36 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M28.5785 0H12.7385L0 12.6685V36.6184C0 40.6884 3.32945 44 7.42282 44H28.5785C32.6706 44 36 40.6884 36 36.6184V7.38167C36 3.31099 32.6706 0 28.5785 0ZM33.2522 36.6183C33.2522 39.1859 31.1597 41.2668 28.5785 41.2668H7.42282C4.84035 41.2668 2.74787 39.1859 2.74787 36.6183V13.8008H9.98229C12.1328 13.8008 13.8777 12.0667 13.8777 9.92757V2.73315H28.5785C31.1597 2.73315 33.2522 4.81404 33.2522 7.38167V36.6183Z" fill="currentColor"/>
                      <path d="M8.15007 21.6232H4.80683C4.17026 21.6232 3.78894 22.0373 3.78894 22.6574V31.3005C3.78894 32.0491 4.28159 32.5425 4.96562 32.5425C5.63487 32.5425 6.12741 32.0492 6.12741 31.3005V28.6748C6.12741 28.6109 6.16011 28.579 6.22398 28.579H8.15007C10.505 28.579 11.9221 27.1463 11.9221 25.1089C11.9222 23.0396 10.5214 21.6232 8.15007 21.6232ZM8.00616 26.5572H6.22398C6.16011 26.5572 6.12741 26.5253 6.12741 26.4623V23.74C6.12741 23.6761 6.16011 23.6444 6.22398 23.6444H8.00616C8.99288 23.6444 9.58198 24.2335 9.58198 25.109C9.5821 25.9844 8.99288 26.5572 8.00616 26.5572Z" fill="currentColor"/>
                      <path d="M17.3193 21.6232H14.7566C14.1201 21.6232 13.7387 22.0373 13.7387 22.6574V31.4281C13.7387 32.0492 14.12 32.4468 14.7566 32.4468H17.3193C19.6267 32.4468 21.0603 31.7145 21.633 29.9479C21.8392 29.3268 21.9521 28.579 21.9521 27.035C21.9521 25.491 21.8391 24.7431 21.633 24.1221C21.0601 22.3555 19.6267 21.6232 17.3193 21.6232ZM19.3894 29.1362C19.1178 29.9954 18.3388 30.3619 17.2554 30.3619H16.1738C16.1099 30.3619 16.0772 30.33 16.0772 30.2663V23.8039C16.0772 23.74 16.1099 23.7081 16.1738 23.7081H17.2554C18.3388 23.7081 19.1178 24.0747 19.3894 24.9339C19.5007 25.3005 19.5793 25.937 19.5793 27.0351C19.5793 28.1331 19.5006 28.7697 19.3894 29.1362Z" fill="currentColor"/>
                      <path d="M30.3243 21.6232H25.0729C24.4363 21.6232 24.0534 22.0373 24.0534 22.6574V31.3005C24.0534 32.0491 24.5476 32.5425 25.2317 32.5425C25.8993 32.5425 26.3935 32.0492 26.3935 31.3005V28.2125C26.3935 28.1494 26.4245 28.1175 26.4884 28.1175H29.5453C30.2294 28.1175 30.627 27.7036 30.627 27.1144C30.627 26.5252 30.2294 26.1121 29.5453 26.1121H26.4884C26.4245 26.1121 26.3935 26.0802 26.3935 26.0164V23.74C26.3935 23.6761 26.4245 23.6444 26.4884 23.6444H30.3243C30.9773 23.6444 31.4077 23.2148 31.4077 22.6421C31.4076 22.0527 30.9771 21.6232 30.3243 21.6232Z" fill="currentColor"/>
                    </svg>
                  </span>
                  <ul class="flex flex-col text-sm gap-1 font-medium">
                    <li class="leading-tight">{{ material.title }}</li>
                    <li v-if="material.description" class="leading-tight text-xs text-gray-700">
                      {{ material.description }}
                    </li>
                  </ul>
                  <span class="ml-auto text-blue-600">
                    <svg class="h-7" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3333C0 7.04793 -1.19209e-07 3.90524 1.95263 1.95263C3.90524 -1.19209e-07 7.04793 0 13.3333 0C19.6187 0 22.7615 -1.19209e-07 24.714 1.95263C26.6667 3.90524 26.6667 7.04793 26.6667 13.3333C26.6667 19.6187 26.6667 22.7615 24.714 24.714C22.7615 26.6667 19.6187 26.6667 13.3333 26.6667C7.04793 26.6667 3.90524 26.6667 1.95263 24.714C-1.19209e-07 22.7615 0 19.6187 0 13.3333ZM13.3333 5.66667C13.8856 5.66667 14.3333 6.11439 14.3333 6.66667V13.5857L16.6263 11.2929C17.0168 10.9024 17.6499 10.9024 18.0404 11.2929C18.4309 11.6835 18.4309 12.3165 18.0404 12.7071L14.0404 16.7071C13.8529 16.8947 13.5985 17 13.3333 17C13.0681 17 12.8137 16.8947 12.6263 16.7071L8.62623 12.7071C8.23571 12.3165 8.23571 11.6835 8.62623 11.2929C9.01675 10.9024 9.64992 10.9024 10.0404 11.2929L12.3333 13.5857V6.66667C12.3333 6.11439 12.7811 5.66667 13.3333 5.66667ZM8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21H18.6667C19.2189 21 19.6667 20.5523 19.6667 20C19.6667 19.4477 19.2189 19 18.6667 19H8Z" fill="currentColor"/>
                    </svg>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { lessonsAPI } from '@/services/api.js';
import MainLayout from '@/layouts/MainLayout.vue';
import Player from '@vimeo/player';
import { usePageMeta } from '@/composables/usePageMeta.js';

const route = useRoute();
const router = useRouter();

// Состояния
const loading = ref(true);
const error = ref(null);
const lesson = ref(null);
const video = ref(null);
const progress = ref(null);
const materials = ref([]);

function getDownloadName(material) {
  if (!material.file) return undefined;
  const translitMap = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i',
    'й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t',
    'у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y',
    'ь':'','э':'e','ю':'yu','я':'ya',
    'А':'A','Б':'B','В':'V','Г':'G','Д':'D','Е':'E','Ё':'Yo','Ж':'Zh','З':'Z','И':'I',
    'Й':'Y','К':'K','Л':'L','М':'M','Н':'N','О':'O','П':'P','Р':'R','С':'S','Т':'T',
    'У':'U','Ф':'F','Х':'Kh','Ц':'Ts','Ч':'Ch','Ш':'Sh','Щ':'Shch','Ъ':'','Ы':'Y',
    'Ь':'','Э':'E','Ю':'Yu','Я':'Ya'
  };
  const title = (material.title || 'file')
    .split('').map(ch => translitMap[ch] || ch).join('')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const urlPath = new URL(material.file, location.origin).pathname;
  const ext = urlPath.includes('.') ? '.' + urlPath.split('.').pop() : '';
  return title + ext;
}
const currentProgress = ref(0);
const nextLesson = ref(null);

// Vimeo player
const videoFrame = ref(null);
let player = null;
let lessonCompleted = false;
let wasPlayingBeforeHidden = false;

// Milestone-based progress tracking (вместо отправки каждые 5 сек)
const MILESTONES = [10, 20, 30, 40, 50, 60, 70, 80, 85, 90, 95];
let sentMilestones = new Set();


usePageMeta('Страница урока', 'Личный кабинет');


// Обработка видимости вкладки (пауза при переключении)
function handleVisibilityChange() {
  if (!player) return;

  if (document.hidden) {
    // Вкладка скрыта — ставим на паузу если играло
    player.getPaused().then(paused => {
      if (!paused) {
        wasPlayingBeforeHidden = true;
        player.pause();
        console.log('⏸️ Видео приостановлено (вкладка скрыта)');
      }
    });
  } else {
    // Вкладка снова активна — возобновляем если играло до этого
    if (wasPlayingBeforeHidden) {
      wasPlayingBeforeHidden = false;
      player.play();
      console.log('▶️ Видео возобновлено (вкладка активна)');
    }
  }
}

// Загрузка урока
onMounted(async () => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
  await loadLesson();
});

// Очистка при размонтировании
onUnmounted(() => {
  // Удаляем слушатель видимости вкладки
  document.removeEventListener('visibilitychange', handleVisibilityChange);

  if (player) {
    player.off('timeupdate');
    player = null;
  }
});


// Загрузить урок
async function loadLesson() {
  try {
    loading.value = true;
    error.value = null;

    console.log('📥 Загружаем урок:', route.params.id);

    const response = await lessonsAPI.getLesson(route.params.id);

    lesson.value = response.data.lesson;
    video.value = response.data.video;
    progress.value = response.data.progress;
    materials.value = response.data.materials || [];

    console.log('✅ Урок загружен:', lesson.value.title);
    console.log('🎥 Видео:', video.value);

    // Устанавливаем текущий прогресс и отмечаем уже пройденные milestone'ы
    currentProgress.value = progress.value.watch_percentage || 0;
    sentMilestones = new Set(MILESTONES.filter(m => m <= currentProgress.value));

    // КРИТИЧНО: Устанавливаем loading = false ПЕРЕД nextTick
    loading.value = false;

    // Ждем рендеринга
    console.log('⏳ Ждем рендеринга DOM...');
    await nextTick();

    console.log('✅ nextTick завершен, проверяем iframe...');
    console.log('videoFrame.value:', videoFrame.value);

    // Еще одна задержка для уверенности
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log('✅ Дополнительная задержка прошла, повторная проверка...');
    console.log('videoFrame.value:', videoFrame.value);

    // Теперь инициализируем плеер
    await initializePlayer();

  } catch (err) {
    console.error('❌ Ошибка загрузки урока:', err);
    error.value = err.response?.data?.error || 'Не удалось загрузить урок';
    loading.value = false; // ← На случай ошибки тоже
  }
}

// Инициализация Vimeo плеера
async function initializePlayer() {
  console.log('🎬 Инициализация плеера...');
  console.log('videoFrame.value:', videoFrame.value);

  if (!videoFrame.value) {
    console.warn('⚠️ iframe еще не в DOM, ждем 500мс...');
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!videoFrame.value) {
      console.error('❌ iframe так и не появился в DOM');
      return;
    }
  }

  try {
    player = new Player(videoFrame.value);
    console.log('✅ Vimeo плеер создан');

    // Слушаем обновление времени
    player.on('timeupdate', handleTimeUpdate);
    console.log('✅ Слушатель timeupdate добавлен');

    // Если урок уже завершен
    if (progress.value.is_completed) {
      lessonCompleted = true;
      console.log('ℹ️ Урок уже завершен ранее');
    }

  } catch (err) {
    console.error('❌ Ошибка инициализации Vimeo плеера:', err);
  }
}

// Обработка прогресса просмотра (milestone-based)
async function handleTimeUpdate(data) {
  const percentage = (data.seconds / data.duration) * 100;

  // Обновляем UI
  currentProgress.value = percentage;

  // Отправляем только при пересечении milestone'ов: 10,20,...,80,85,90,95
  const newMilestones = MILESTONES.filter(m => !sentMilestones.has(m) && percentage >= m);

  if (newMilestones.length > 0) {
    newMilestones.forEach(m => sentMilestones.add(m));

    try {
      const highestMilestone = Math.max(...newMilestones);
      const response = await lessonsAPI.updateVideoProgress(route.params.id, {
        percentage: highestMilestone
      });

      // Проверяем достигли ли порога завершения
      if (response.data.is_mostly_watched && !lessonCompleted) {
        await completeLesson();
      }

    } catch (err) {
      console.error('Ошибка обновления прогресса:', err);
      // Не прерываем просмотр из-за ошибки сети
    }
  }
}

// Завершение урока
async function completeLesson() {
  lessonCompleted = true;

  try {
    const response = await lessonsAPI.completeLesson(route.params.id);

    // Обновляем статус
    progress.value.is_completed = true;

    // Сохраняем следующий урок (если нужен для отображения)
    nextLesson.value = response.data.next_lesson;

    // Тихое уведомление через console
    console.log('✅ Урок завершен!');
    console.log('📊 Прогресс курса:', response.data.course_progress);

    if (response.data.next_lesson) {
      console.log('➡️ Следующий урок:', response.data.next_lesson.title);
    } else {
      console.log('🎉 Это был последний урок курса!');
    }

  } catch (err) {
    console.error('❌ Ошибка завершения урока:', err);
    lessonCompleted = false; // Позволить повторить
  }
}


// Вернуться к курсу
function goToCourse() {
  // Предполагаем что есть courseId в контексте
  // Можно получить из lesson или сохранить при переходе
  router.push('/courses/my');
}

// Кнопка назад
function goBack() {
  router.back();
}

async function seekToTime(seconds) {
  if (!player) return;

  try {
    // 1. Сначала скролл
    videoFrame.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    // 2. Небольшая задержка для плавности
    await new Promise(resolve => setTimeout(resolve, 100));

    // 3. Переход в видео
    await player.setCurrentTime(seconds);

    console.log(`✅ Переход на ${formatTime(seconds)}`);

  } catch (err) {
    console.error('Ошибка:', err);
  }
}

// Форматирование времени
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
</script>

<style scoped>

</style>