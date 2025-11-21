<template>
  <MainLayout>
    <section class="hero py-6">
      <h1 class="display-1">
        <span id="hero-welcome">{{ greeting }}</span>,
        <span class="capitalize" id="hero-student-name">{{ user?.first_name || 'Не указано' }}</span>
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

<!--      &lt;!&ndash; 🆕 ДОБАВЬТЕ: Отладочная информация &ndash;&gt;-->
<!--      <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">-->
<!--        <p class="text-sm">-->
<!--          <strong>Активная вкладка:</strong> {{ activeTab }}<br>-->
<!--          <strong>Всех курсов:</strong> {{ allCourses.length }}<br>-->
<!--          <strong>Моих курсов:</strong> {{ myCourses.length }}-->
<!--        </p>-->
<!--      </div>-->

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
<!--          &lt;!&ndash; 🆕 ДОБАВЬТЕ: Отладочный блок &ndash;&gt;-->
<!--          <div class="col-span-full mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">-->
<!--            <p class="text-sm">-->
<!--              <strong>🔍 Отладка "Все курсы":</strong><br>-->
<!--              Показывается блок: {{ activeTab === 'all' ? 'Да' : 'Нет' }}<br>-->
<!--              Количество курсов: {{ allCourses.length }}<br>-->
<!--              Курсы пустые: {{ allCourses.length === 0 ? 'Да' : 'Нет' }}-->
<!--            </p>-->
<!--          </div>-->

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

          <CourseCard
              v-for="course in enrichedMyCourses"
              :key="course.course.id"
              :course="course"
              :show-progress="true"
              class="col-span-full md:col-span-6 lg:col-span-4"
          />
        </div>
      </div>
    </section>

    <div class="dashboard-container">

      <div v-if="loading" class="py-8 text-center">
        <p class="text-gray-600">Загрузка...</p>
      </div>

      <div v-else-if="error" class="py-8">
        <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600">{{ error }}</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { coursesAPI } from '@/services/api.js'; // ← убрали accountAPI
import { useAuthStore } from '@/stores/auth'; // ← ДОБАВЛЕНО
import MainLayout from '@/layouts/MainLayout.vue';
import CourseCard from '@/components/ui/CourseCard.vue';
import { usePageMeta } from '@/composables/usePageMeta.js';

usePageMeta('Dashboard', 'Личный кабинет');

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore(); // ← ДОБАВЛЕНО

// ✅ ИЗМЕНЕНО: используем данные из Store
const user = computed(() => authStore.user);

// ❌ УБРАЛИ: loading и error для профиля (не нужны)

// Курсы
const activeTab = ref('all');
const allCourses = ref([]);
const myCourses = ref([]);
const coursesLoading = ref(true);
const coursesError = ref('');

const courseProgressDetails = ref({});

// Уведомления о присоединении
const joinedMessage = ref('');
const joinedGroup = ref('');
const joinError = ref('');

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
  console.log('🔄 Обогащение курсов данными о блокировке...');

  return myCourses.value.map(course => {
    const courseId = course.course.id;
    const progressDetail = courseProgressDetails.value[courseId];

    console.log(`📚 Обработка курса ${courseId}:`, course.course.title);

    if (!progressDetail) {
      console.log(`⚠️ Нет детального прогресса для курса ${courseId}`);
      return course;
    }

    // Ищем следующий недоступный урок
    const nextLockedLesson = findNextLockedLesson(progressDetail);

    const enrichedCourse = {
      ...course,
      nextLockedLesson: nextLockedLesson,
      has_access: !nextLockedLesson
    };

    console.log(`✅ Обогащенный курс ${courseId}:`, {
      has_access: enrichedCourse.has_access,
      nextLockedLesson: enrichedCourse.nextLockedLesson
    });

    return enrichedCourse;
  });
});

// Функция поиска следующего заблокированного урока
const findNextLockedLesson = (progressDetail) => {
  console.log('🔍 Поиск заблокированного урока в прогрессе:', progressDetail);

  if (!progressDetail.modules) {
    console.log('⚠️ Нет модулей в прогрессе');
    return null;
  }

  for (const module of progressDetail.modules) {
    console.log(`📦 Модуль: ${module.title}`);

    for (const lessonProgress of module.lessons) {
      console.log(`  📝 Урок: ${lessonProgress.lesson.title}`);
      console.log(`     - is_completed: ${lessonProgress.is_completed}`);
      console.log(`     - is_available: ${lessonProgress.is_available}`);

      if (lessonProgress.is_completed) {
        console.log(`     ✓ Урок завершен, пропускаем`);
        continue;
      }

      console.log(`     → Это первый незавершенный урок`);

      if (!lessonProgress.is_available) {
        console.log(`  🔒 ЗАБЛОКИРОВАННЫЙ УРОК:`, {
          id: lessonProgress.lesson.id,
          title: lessonProgress.lesson.title,
          available_at: lessonProgress.available_at,
          available_in: lessonProgress.available_in
        });

        return {
          id: lessonProgress.lesson.id,
          title: lessonProgress.lesson.title,
          available_at: lessonProgress.available_at,
          available_in: lessonProgress.available_in
        };
      }

      console.log(`     ✅ Урок доступен, НЕ заблокирован`);
      return null;
    }
  }

  console.log('✅ Заблокированных уроков не найдено');
  return null;
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

  // ❌ УБРАЛИ: await loadProfile() - данные уже в Store
  await loadCourses();
});

// ❌ УБРАЛИ: функцию loadProfile() полностью

const loadCourses = async () => {
  coursesLoading.value = true;
  coursesError.value = '';

  try {
    console.log('📚 Начало загрузки курсов...');

    const allCoursesResponse = await coursesAPI.getAllCourses();
    allCourses.value = allCoursesResponse.data;

    const myCoursesResponse = await coursesAPI.getMyCourses();
    myCourses.value = myCoursesResponse.data;

    await loadCourseProgressDetails();

    if (myCourses.value.length === 0) {
      activeTab.value = 'all';
    } else {
      activeTab.value = 'my';
    }

  } catch (err) {
    console.error('❌ ОШИБКА загрузки курсов:', err);

    if (err.response?.status === 404) {
      coursesError.value = 'Эндпоинты не найдены. Проверьте URL в Django';
    } else {
      coursesError.value = err.response?.data?.detail || 'Не удалось загрузить курсы';
    }
    // ✅ УПРОСТИЛИ: убрали обработку 401 - interceptor сам перенаправит
  } finally {
    coursesLoading.value = false;
  }
};

const loadCourseProgressDetails = async () => {
  console.log('🔍 Загрузка детального прогресса...');

  const progressPromises = myCourses.value.map(async (course) => {
    const courseId = course.course.id;

    try {
      console.log(`📊 Загрузка прогресса для курса ${courseId}...`);
      const response = await coursesAPI.getCourseProgress(courseId);
      courseProgressDetails.value[courseId] = response.data;
      console.log(`✅ Прогресс курса ${courseId}:`, response.data);
    } catch (err) {
      console.error(`❌ Ошибка загрузки прогресса курса ${courseId}:`, err);
    }
  });

  await Promise.all(progressPromises);
  console.log('✅ Все детальные прогрессы загружены:', courseProgressDetails.value);
};

const handleTabChange = (tab) => {
  console.log('🔄 КЛИК на вкладку:', tab);
  activeTab.value = tab;
};
</script>