<template>
  <MainLayout>
    <section class="hero py-6">
      <h1 class="display-1">
        <span id="hero-welcome">{{ greeting }}</span>,
        <span id="hero-student-name">{{ formattedName }}</span>
      </h1>
    </section>

    <!-- Уведомление об успешном присоединении к группе -->
    <section v-if="joinedMessage" class="py-4">
      <div class="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
        <svg class="size-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-green-800 font-semibold">{{ joinedMessage }}</p>
        </div>
      </div>
    </section>

    <!-- Уведомление об ошибке -->
    <section v-if="joinError" class="py-4">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
        <svg class="size-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p class="text-red-800 font-semibold">{{ joinError }}</p>
        </div>
      </div>
    </section>

    <section class="courses py-8">
      <div class="w-full">
        <ul class="courses-nav">
          <li>
            <button
                @click="handleTabChange('all')"
                :class="['courses-nav--item', { active: activeTab === 'all' }]">
              Все курсы
            </button>
          </li>
          <li>
            <button
                @click="handleTabChange('my')"
                :class="['courses-nav--item', { active: activeTab === 'my' }]">
              Мои курсы
            </button>
          </li>
        </ul>
      </div>

      <!-- Загрузка -->
      <div v-if="coursesLoading" class="py-8 text-center">
        <p class="text-gray-600">Загрузка курсов...</p>
      </div>

      <!-- Ошибка -->
      <div v-else-if="coursesError" class="py-8">
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600">{{ coursesError }}</p>
        </div>
      </div>

      <div v-else class="w-full">
        <!-- ВСЕ КУРСЫ -->
        <div v-if="activeTab === 'all'" class="courses-content">

          <div v-if="allCourses.length === 0" class="col-span-full text-center py-12">
            <p class="text-gray-500 text-lg">Курсы не найдены</p>
          </div>

          <CourseCard
              v-for="course in allCourses"
              :key="course.id"
              :course="course"
              :show-progress="false"
              class="col-span-full md:col-span-6 lg:col-span-4"
          />
        </div>

        <!-- МОИ КУРСЫ -->
        <div v-if="activeTab === 'my'" class="courses-content">

          <article
              v-if="enrichedMyCourses.length === 0"
              @click="handleTabChange('all')"
              class="courses-card col-span-full md:col-span-6 lg:col-span-4 base-card cursor-pointer transition-shadow">
            <div class="card_body">
              <div class="empty">
                <div class="size-12 flex justify-center items-center bg-gray-300 rounded-md">
                  +
                </div>
                <p class="text-sm text-gray-700">Выбрать курс</p>
              </div>
            </div>
            <div class="card_footer">
              <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
                У вас нет доступных курсов. После покупки они будут на этой странице
              </p>
            </div>
          </article>

          <template v-for="course in enrichedMyCourses" :key="course.course.id">
            <OfflineCourseCard
                v-if="course.is_offline"
                :course="course"
                class="col-span-full md:col-span-6 lg:col-span-4"
            />
            <CourseCard
                v-else
                :course="course"
                :show-progress="true"
                class="col-span-full md:col-span-6 lg:col-span-4"
            />
          </template>


          <!-- карточка сертификата -->
          <article
              v-for="graduation in graduations"
              :key="graduation.id"
              class="courses-card col-span-full md:col-span-6 lg:col-span-4 base-card"
          >
            <div class="card_body"
                 @click="router.push({ name: 'CourseDetail', params: { id: graduation.course_id } })"
            >
              <div class="title">
                <div class="w-full">
                  <h4 class="h4">{{ graduation.course_title }}</h4>
                </div>

              </div>
              <div class="progress">
                <div class="progress-info">
                  <ul class="progress-info__list">
                    <li class="progress-info__list--item">
                      <p>
<!--                        <span class="lessons_count">Сертификат готов</span>-->
                      </p>
                    </li>
                  </ul>
                </div>
                <div class="progress-completed">
                  <ul class="progress-completed__list">
                    <li class="progress-completed__list--item">
                    <span>
                      <svg class="h-4 mb-0.5" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.125 13.5H7.875C10.7034 13.5 12.1177 13.5 12.9963 12.6213C13.875 11.7427 13.875 10.3285 13.875 7.5V2.99854C13.7661 3.00006 13.6132 3.00004 13.5 3.00001H1.5C1.38679 3.00004 1.2339 3.00006 1.125 2.99854V7.5C1.125 10.3285 1.125 11.7427 2.00368 12.6213C2.88236 13.5 4.29657 13.5 7.125 13.5ZM9.79462 6.37462C10.0015 6.14287 9.98137 5.7873 9.74962 5.58045C9.51787 5.37352 9.1623 5.39362 8.95545 5.62537L6.69645 8.15542L6.04462 7.42537C5.83769 7.19362 5.4821 7.17352 5.25037 7.38045C5.01864 7.5873 4.99851 7.94287 5.20541 8.17462L6.27682 9.37462C6.38355 9.49417 6.53618 9.5625 6.69645 9.5625C6.85665 9.5625 7.00927 9.49417 7.116 9.37462L9.79462 6.37462Z" fill="#3D3BFF"/>
                        <path d="M0 1.5C0 0.792892 4.47035e-08 0.439342 0.219667 0.219667C0.439342 4.47035e-08 0.792892 0 1.5 0H13.5C14.2071 0 14.5606 4.47035e-08 14.7803 0.219667C15 0.439342 15 0.792892 15 1.5C15 2.20711 15 2.56066 14.7803 2.78033C14.5606 3 14.2071 3.00001 13.5 3.00001H1.5C0.792893 3.00001 0.439342 3 0.219667 2.78033C4.47035e-08 2.56066 0 2.20711 0 1.5Z" fill="currentColor"/>
                      </svg>
                    </span>
                      <p>
                        Архивный курс
                      </p>
                    </li>
                    <li class="progress-completed__list--item">
                    <span>
                      <svg class="size-5" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.16909 2.7729C8.0664 1.51662 9.93353 1.51662 10.8309 2.7729L10.9738 2.9729C11.1316 3.194 11.3969 3.31239 11.6669 3.28239L12.3036 3.21164C13.7367 3.05241 14.9476 4.26329 14.7884 5.69635L14.7176 6.33311C14.6876 6.60315 14.806 6.86831 15.0271 7.02623L15.2271 7.16909C16.4834 8.0664 16.4834 9.93353 15.2271 10.8309L15.0271 10.9738C14.806 11.1316 14.6876 11.3969 14.7176 11.6669L14.7884 12.3036C14.9476 13.7367 13.7367 14.9476 12.3036 14.7884L11.6669 14.7176C11.3969 14.6876 11.1316 14.806 10.9738 15.0271L10.8309 15.2271C9.93353 16.4834 8.06648 16.4834 7.16909 15.2271L7.02623 15.0271C6.86831 14.806 6.60315 14.6876 6.33311 14.7176L5.69635 14.7884C4.26329 14.9476 3.05241 13.7367 3.21164 12.3036L3.28239 11.6669C3.31239 11.3969 3.194 11.1316 2.9729 10.9738L2.7729 10.8309C1.51662 9.93353 1.51662 8.06648 2.7729 7.16909L2.9729 7.02623C3.194 6.86831 3.31239 6.60315 3.28239 6.33311L3.21164 5.69635C3.05241 4.26329 4.26329 3.05241 5.69635 3.21164L6.33311 3.28239C6.60315 3.31239 6.86831 3.194 7.02623 2.9729L7.16909 2.7729ZM11.7803 6.96967C12.0732 7.26257 12.0732 7.73745 11.7803 8.03032L8.91615 10.8945C8.54827 11.2625 7.95173 11.2625 7.58385 10.8945L6.21967 9.53032C5.92678 9.23745 5.92678 8.76255 6.21967 8.46968C6.51257 8.1768 6.98744 8.1768 7.28033 8.46968L8.25 9.43935L10.7197 6.96967C11.0126 6.67678 11.4875 6.67678 11.7803 6.96967Z" fill="#2F8152"/>
                      </svg>
                    </span>
                      <p>
                        Пройдено
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <a  :href="graduation.certificate_url"
                target="_blank"
                download
                @click.stop
                class="card_footer cursor-pointer transition-colors">
              <div class="icon">
                <svg class="h-7" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13.3333C0 7.04793 -1.19209e-07 3.90524 1.95263 1.95263C3.90524 -1.19209e-07 7.04793 0 13.3333 0C19.6187 0 22.7615 -1.19209e-07 24.714 1.95263C26.6667 3.90524 26.6667 7.04793 26.6667 13.3333C26.6667 19.6187 26.6667 22.7615 24.714 24.714C22.7615 26.6667 19.6187 26.6667 13.3333 26.6667C7.04793 26.6667 3.90524 26.6667 1.95263 24.714C-1.19209e-07 22.7615 0 19.6187 0 13.3333ZM13.3333 5.66667C13.8856 5.66667 14.3333 6.11439 14.3333 6.66667V13.5857L16.6263 11.2929C17.0168 10.9024 17.6499 10.9024 18.0404 11.2929C18.4309 11.6835 18.4309 12.3165 18.0404 12.7071L14.0404 16.7071C13.8529 16.8947 13.5985 17 13.3333 17C13.0681 17 12.8137 16.8947 12.6263 16.7071L8.62623 12.7071C8.23571 12.3165 8.23571 11.6835 8.62623 11.2929C9.01675 10.9024 9.64992 10.9024 10.0404 11.2929L12.3333 13.5857V6.66667C12.3333 6.11439 12.7811 5.66667 13.3333 5.66667ZM8 19C7.44772 19 7 19.4477 7 20C7 20.5523 7.44772 21 8 21H18.6667C19.2189 21 19.6667 20.5523 19.6667 20C19.6667 19.4477 19.2189 19 18.6667 19H8Z" fill="currentColor"/>
                </svg>
              </div>
              <p class="text-sm text-gray-700 leading-tight font-medium inline-block">
                <span class="pt-1 inline-flex">Скачать сертификат</span>
              </p>
            </a>
          </article>
        </div>
      </div>
    </section>


  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { coursesAPI, graduatesAPI } from '@/services/api.js';
import { useAuthStore } from '@/stores/auth'; //
import MainLayout from '@/layouts/MainLayout.vue';
import CourseCard from '@/components/ui/CourseCard.vue';
import OfflineCourseCard from '@/components/ui/OfflineCourseCard.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';


usePageMeta('Dashboard', 'Личный кабинет');

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // ← ДОБАВЛЕНО

// используем данные из Store
const user = computed(() => authStore.user);

// Курсы
const activeTab = ref('all');
const allCourses = ref([]);
const myCourses = ref([]);
const coursesLoading = ref(true);
const coursesError = ref('');


// Уведомления о присоединении
const joinedMessage = ref('');
const joinedGroup = ref('');
const joinError = ref('');

const graduations = ref([]);
const graduationsLoading = ref(false);

// Таймеры
let countdownInterval = null;
const currentTime = ref(Date.now());

// Динамическое приветствие
const greeting = computed(() => {
  const hour = new Date().getHours();

  if (hour >= 0 && hour < 6) {
    return 'Доброй ночи';
  } else if (hour >= 6 && hour < 12) {
    return 'Доброе утро';
  } else if (hour >= 12 && hour < 18) {
    return 'Добрый день';
  } else {
    return 'Добрый вечер';
  }
});


// Обогащенные курсы с деталями прогресса
const enrichedMyCourses = computed(() => {
  const now = currentTime.value;

  return myCourses.value.map(course => {
    // ✅ Данные теперь приходят напрямую из API
    const nextLocked = course.next_lesson_available_at;

    let timeRemaining = null;
    let isNowAvailable = false;

    if (nextLocked?.available_at) {
      const targetTime = new Date(nextLocked.available_at).getTime();
      const remaining = targetTime - now;

      if (remaining <= 0) {
        isNowAvailable = true;
      } else {
        timeRemaining = formatTimeFromMs(remaining);
      }
    }

    return {
      ...course,
      nextLockedLesson: nextLocked ? {
        id: nextLocked.lesson_id,
        title: nextLocked.lesson_title,
        available_at: nextLocked.available_at,
        is_now_available: isNowAvailable
      } : null,
      timeRemaining: timeRemaining,
      has_access: !nextLocked || isNowAvailable
    };
  });
});

// Вспомогательная функция форматирования
const formatTimeFromMs = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days} д. ${hours % 24} ч.`;
  }

  if (hours > 0) {
    return `${hours} ч. ${minutes} мин.`;
  }

  return `${minutes} мин.`;
};



// Открыть сертификат
const openCertificate = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

onMounted(async () => {
  // Проверяем query параметры
  if (route.query.joined === 'true') {
    joinedMessage.value = route.query.message || 'Вы успешно присоединились к группе';
    joinedGroup.value = route.query.group || '';

    setTimeout(() => {
      joinedMessage.value = '';
      joinedGroup.value = '';
      router.replace({ name: 'Dashboard' });
    }, 10000);
  }

  if (route.query.error) {
    joinError.value = route.query.error;

    setTimeout(() => {
      joinError.value = '';
      router.replace({ name: 'Dashboard' });
    }, 10000);
  }

  await loadCourses();
  await loadGraduations();

  // ✅ ДОБАВИТЬ ЭТУ СТРОКУ:
  startTimers();
});

// ✅ ДОБАВИТЬ onUnmounted:
onUnmounted(() => {
  stopTimers();
});


const loadCourses = async () => {
  coursesLoading.value = true;
  coursesError.value = '';

  try {
    console.log('📚 Начало загрузки курсов...');

    // загружаем все курсы и мои курсы
    const [allCoursesResponse, myCoursesResponse] = await Promise.all([
      coursesAPI.getAllCourses(),
      coursesAPI.getMyCourses()
    ]);

    allCourses.value = allCoursesResponse.data;
    myCourses.value = myCoursesResponse.data;

    // ✅ Сразу показываем курсы, прогресс догрузим фоном
    if (myCourses.value.length === 0) {
      activeTab.value = 'all';
    } else {
      activeTab.value = 'my';
    }


  } catch (err) {
    console.error('❌ ОШИБКА загрузки курсов:', err);
    coursesError.value = err.response?.data?.detail || 'Не удалось загрузить курсы';
  } finally {
    coursesLoading.value = false;
  }
};



const loadGraduations = async () => {
  try {
    graduationsLoading.value = true;
    const response = await graduatesAPI.getMyGraduations();

    if (response.data.has_graduations) {
      // ✅ Показываем только выпущенные сертификаты (менеджер нажал "Выпустить")
      graduations.value = response.data.graduations.filter(
          g => g.status === 'graduated' && g.certificate_url
      );
      console.log('🎓 Выпуски с сертификатами:', graduations.value.length);
    }
  } catch (err) {
    console.error('❌ Ошибка загрузки выпусков:', err);
  } finally {
    graduationsLoading.value = false;
  }
};

// Запуск таймеров
const startTimers = () => {
  // Обновляем время каждую минуту для countdown
  countdownInterval = setInterval(() => {
    currentTime.value = Date.now();
  }, 60000);
};

// Остановка таймеров
const stopTimers = () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
};

// Форматированное имя (каждое слово с заглавной буквы)
const formattedName = computed(() => {
  const name = user.value?.first_name;
  if (!name) return 'Не указано';

  return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
});

const handleTabChange = (tab) => {
  console.log('🔄 КЛИК на вкладку:', tab);
  activeTab.value = tab;
};
</script>