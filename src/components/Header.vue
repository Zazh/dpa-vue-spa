<template>
  <header class="header">
    <div class="brand--logo">
      <router-link :to="{ name: 'Dashboard' }" >
      <span class="hover:text-blue-600">
        <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_80_160)">
            <path d="M23.1055 35.8522C23.0863 35.7547 22.2934 34.2338 22.1813 34.0603C22.1129 33.9546 22.0883 33.6835 21.8777 33.8868C21.7574 34.0007 21.5332 35.8631 21.3691 36.2968C21.093 37.0342 20.475 37.1725 21 38.0752C21.0984 38.246 22.452 39.447 22.2879 39.5771C21.7902 39.5906 21.5633 39.1515 21.1094 38.9183C20.0266 38.3599 19.1789 38.5984 18.0496 38.9021C17.9594 37.8963 19.1242 38.0535 19.8242 37.815C19.9117 37.6903 18.7879 35.3155 18.5965 35.039C18.0387 34.2257 15.4273 31.4849 14.5715 31.1677C13.866 30.9075 12.8844 31.1217 12.1379 30.8695C11.2137 30.5551 11.1125 29.7987 9.63594 29.6903C8.29609 29.5927 8.39727 29.7824 7.85313 30.9048L7.72734 31.7181C6.94531 31.6178 6.39023 29.7174 6.48047 29.1427C6.52969 28.8309 7.04922 27.4022 7.24336 27.1745C7.68906 26.6513 9.52109 25.0898 10.1281 24.6127C11.2 23.7777 14.0137 22.5524 14.6891 21.6794C15.2141 20.999 16.9531 17.1982 17.2922 16.263C17.9539 14.4249 18.0633 12.2426 18.7496 10.3883C20.4887 8.30091 23.059 6.47645 24.7434 4.40257C25.8043 3.09861 26.5152 1.34463 27.5488 0L26.3867 4.06371C26.6273 4.1125 26.723 3.94171 26.8652 3.79532C27.5352 3.11216 27.918 2.08743 28.7082 1.48831L27.7539 5.01254C28.0137 5.2999 29.4068 3.74653 29.5982 3.592C29.7677 3.45374 29.8648 3.29109 29.8047 3.592C29.7281 3.98509 28.3117 6.52796 28.4375 6.6391C28.8777 6.85327 31.0734 5.30532 31.1691 5.41918C31.2102 5.92341 29.4738 7.6774 29.8047 7.99458L32.4023 7.4551C31.9566 8.31176 30.6223 8.68858 30.4883 9.62114H33.5645C33.6875 9.62114 34.0594 9.87326 34.3164 9.75669C34.568 9.9573 31.4727 10.7489 31.2703 10.8682C31.0953 10.9712 30.9887 11.0064 31.0352 11.245L34.4531 12.2616C33.5508 12.6845 32.4625 12.5923 31.5082 12.8689C31.3086 12.9258 31.2703 12.7957 31.3113 13.1427C32.1207 13.4734 32.9902 13.674 33.8051 13.9939C34.1004 14.1105 34.5762 14.2108 34.7293 14.5008L30.9668 15.0403L27.1496 25.3528L21.5086 27.4863L21.1969 27.9173C22.7035 28.8038 24.3906 29.7309 25.807 30.734C28.3992 32.572 32.6074 36.9339 34.6664 39.4361C34.8031 39.6015 34.9316 39.7777 35.0055 39.981C34.702 40.225 31.4563 37.712 30.8383 37.5412C30.5676 37.7065 30.7152 37.7662 30.7207 37.9153C30.7344 38.4141 30.7207 38.9617 30.9039 39.4361C30.5949 39.6774 29.4711 37.7201 29.0555 37.5412C28.8504 37.4544 28.8695 37.5981 28.8203 37.7092C28.7082 37.9668 28.5906 39.3141 28.3746 39.3006L26.7313 37.1345C26.4496 37.0749 26.5398 37.2457 26.4879 37.43C26.3621 37.88 26.332 38.368 26.25 38.8262C26.2172 39.0159 26.3785 39.2247 26.0504 39.165L24.6805 36.8634C24.1965 36.7469 23.7563 39.043 23.1109 39.0322C22.9797 38.105 23.2887 36.7089 23.1109 35.8468L23.1055 35.8522Z" fill="currentColor"/>
            <path d="M4.16992 11.2504C4.29297 11.2396 4.6457 11.1447 4.85078 11.1095C5.07227 11.0688 5.5 11 5.05859 10.8465L0.273438 9.01389C1.43008 9.00847 2.61953 9.43138 3.7625 9.48831C4.04688 9.50186 4.15625 9.56693 4.10156 9.21992L0 7.184C1.4082 7.65571 4.82344 7.68282 5.94727 8.40122C6.61172 8.82684 9.86289 11.8007 10.3934 12.4378C10.7707 12.8933 13.7457 18.326 13.8824 18.8356C13.9863 19.226 14.2324 21.5086 14.093 21.7228L10.0789 24.1545L9.57031 24.2602V20.6682C9.57031 19.3507 8.3918 18.1172 8.04453 16.8268C7.55781 16.5259 4.9957 17.6455 4.23828 17.4802L6.5707 15.39L6.69649 14.9075L3.41797 15.9892C4.23281 15.2057 5.34297 14.6716 6.15508 13.8909C6.30274 13.7499 6.475 13.6523 6.42578 13.4138L1.64336 13.5466L4.89453 12.6357C5.03399 12.6005 5.47695 12.6682 5.33203 12.3972C5.18711 12.1261 1.87578 11.6625 1.29063 11.5188C1.0582 11.4619 0.894141 11.6544 0.959766 11.245C1.99609 11.1718 3.15274 11.3426 4.17266 11.245L4.16992 11.2504Z" fill="currentColor"/>
            <path d="M16.7727 33.6591C16.9094 33.7757 17.8746 34.8329 17.9703 34.9766C18.066 35.1203 18.1836 35.264 18.1781 35.4456C18.1754 35.5269 17.3988 36.7686 17.325 36.8282C16.6031 37.4165 15.4191 36.5625 16.4035 38.4927C16.2941 38.6039 14.8996 37.7418 14.5496 37.6876C14.1996 37.6333 12.857 37.5385 12.518 37.552C12.1789 37.5656 11.6895 37.8502 11.3477 37.9505C11.1289 37.7228 12.3621 36.8905 12.5973 36.8201C13.3711 36.5869 14.3117 36.8173 15.1074 36.7306C16.3789 36.5923 16.6551 34.4968 16.2668 33.4775C16.4582 33.4531 16.6305 33.5398 16.7699 33.6564L16.7727 33.6591Z" fill="currentColor"/>
          </g>
          <defs>
            <clipPath id="clip0_80_160">
              <rect width="35" height="40" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </span>
      </router-link>
    </div>
    <nav class="menu">
      <ul class="nav">
        <li class="nav-item" :class="{ active: $route.name === 'Dashboard' }">
          <router-link :to="{ name: 'Dashboard' }" class="nav-item--link">
            <span>
              <svg class="h-5" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 18.3968C1 19.8346 2.15127 21 3.57143 21H16.4286C17.8488 21 19 19.8346 19 18.3968V9.18145C19 8.42145 18.672 7.69949 18.1021 7.20494L11.6735 1.6267C10.7105 0.791102 9.28951 0.791102 8.32651 1.6267L1.89797 7.20494C1.32802 7.69949 1 8.42145 1 9.18145V18.3968Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </router-link>
        </li>
        <li class="nav-item" ref="notificationsRef">
          <button @click="toggleNotifications" class="nav-item--link">
    <span>
              <svg class="h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.0153 2C5.53032 2 2.03132 5.344 2.03132 9.307C2.03132 10.726 2.47232 12.051 3.24132 13.167C3.35658 13.334 3.41831 13.5321 3.41832 13.735C3.41832 15.209 2.84932 16.695 2.33832 17.914C3.94132 17.694 4.98932 17.117 5.63332 16.301C5.76744 16.1312 5.953 16.0095 6.16216 15.9542C6.37132 15.8988 6.59278 15.9128 6.79332 15.994C7.77632 16.391 8.86532 16.614 10.0153 16.614C14.5003 16.614 17.9993 13.27 17.9993 9.307C17.9993 5.344 14.4993 2 10.0153 2ZM0.0313226 9.307C0.0313226 4.094 4.57632 0 10.0153 0C15.4543 0 19.9993 4.094 19.9993 9.307C19.9993 14.519 15.4543 18.613 10.0153 18.613C8.85732 18.613 7.74332 18.43 6.70632 18.09C5.44032 19.315 3.62232 19.906 1.42632 19.999C1.18618 20.0079 0.94797 19.9529 0.735952 19.8398C0.523934 19.7267 0.345675 19.5594 0.219323 19.355C0.097668 19.1622 0.0241666 18.9431 0.00502166 18.7159C-0.0141233 18.4888 0.02165 18.2604 0.109322 18.05C0.183322 17.87 0.258322 17.692 0.332322 17.516C0.850322 16.286 1.33532 15.134 1.40932 14.021C0.509533 12.6134 0.031375 10.9776 0.0313226 9.307Z" fill="currentColor"/>
              </svg>
    </span>
            <span v-if="notificationsCount > 0">
      <span class="nav-notice--icon"></span>
    </span>
          </button>

          <!-- Выпадающий список уведомлений -->
          <transition name="dropdown">
            <div v-if="isNotificationsOpen" class="notifications-dropdown">
              <div class="notifications-header">
                <span class="notifications-title">Уведомления</span>
                <button
                    v-if="notifications.length > 0"
                    @click="clearAllNotifications"
                    class="notifications-clear">
                  Очистить все
                </button>
              </div>

              <div class="notifications-list">
                <div v-if="notificationsLoading" class="notifications-loading">
                  Загрузка...
                </div>

                <div v-else-if="notifications.length === 0" class="notifications-empty">
                  Нет новых уведомлений
                </div>

                <div
                    v-else
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{ 'clickable': notification.link }"
                    @click="notification.link && goToNotificationLink(notification)">
                  <div class="notification-content">
                    <p class="notification-title">{{ notification.title }}</p>
                    <p class="notification-message">{{ notification.message }}</p>
                    <span class="notification-time">{{ formatDate(notification.created_at) }}</span>
                  </div>
                  <button
                      @click.stop="deleteNotification(notification.id)"
                      class="notification-delete">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </transition>
        </li>
        <li class="nav-item" ref="profileRef">
          <button
              @click="toggleMenu"
              class="nav-item--dropdown"
              :class="{ 'active': isMenuOpen }">
            <span id="profile_name">{{ userInitial }}</span>
          </button>

          <!-- Выпадающее меню -->
          <transition name="dropdown">
            <div v-if="isMenuOpen" class="profile-dropdown">
              <!-- Заголовок с email -->
              <div class="profile-dropdown-header">
                <div class="profile-avatar-large">
                  <span>{{ userInitial }}</span>
                </div>
                <div class="profile-info">
                  <p class="profile-name">{{ userName }}</p>
                  <p class="profile-email">{{ userEmail }}</p>
                </div>
              </div>

              <!-- Разделитель -->
              <div class="profile-dropdown-divider"></div>

              <!-- Пункты меню -->
              <div class="profile-dropdown-menu">
                <!-- Настройки -->
                <a
                    href="https://wa.me/77474860319"
                    target="_blank"
                    class="profile-dropdown-item">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
<!--                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">-->
<!--                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />-->
<!--                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />-->
<!--                  </svg>-->
                  <span>Служба поддержки</span>
                </a>

                <!-- Выйти -->
                <button
                    @click="handleLogout"
                    class="profile-dropdown-item logout-item">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Выйти</span>
                </button>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { notificationsAPI } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore(); // ← ДОБАВЛЕНО

// Состояние меню
const isMenuOpen = ref(false);
const profileRef = ref(null);

// Состояние уведомлений
const isNotificationsOpen = ref(false);
const notificationsRef = ref(null);
const notifications = ref([]);
const notificationsCount = ref(0);
const notificationsLoading = ref(false);

// ✅ ИЗМЕНЕНО: Данные пользователя из Store
const user = computed(() => authStore.user);

// Computed: Имя пользователя
const userName = computed(() => {
  if (!user.value) return 'Пользователь';
  return user.value.first_name || user.value.email || 'Пользователь';
});

// Computed: Email
const userEmail = computed(() => {
  return user.value?.email || '';
});

// Computed: Первая буква
const userInitial = computed(() => {
  if (!user.value) return 'A';

  if (user.value.first_name) {
    return user.value.first_name.charAt(0).toUpperCase();
  }

  if (user.value.email) {
    return user.value.email.charAt(0).toUpperCase();
  }

  return 'A';
});

// Переключение меню
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Закрытие меню при клике вне его
// Закрытие меню при клике вне его
const handleClickOutside = (event) => {
  if (profileRef.value && !profileRef.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
  if (notificationsRef.value && !notificationsRef.value.contains(event.target)) {
    isNotificationsOpen.value = false;
  }
};

// Загрузка уведомлений
const loadNotifications = async () => {
  try {
    notificationsLoading.value = true;
    const response = await notificationsAPI.getAll();
    notifications.value = response.data.results || [];
    notificationsCount.value = response.data.count || 0;
  } catch (err) {
    console.error('❌ Ошибка загрузки уведомлений:', err);
  } finally {
    notificationsLoading.value = false;
  }
};

// Переключение панели уведомлений
const toggleNotifications = async () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
  isMenuOpen.value = false; // Закрыть профиль

  if (isNotificationsOpen.value && notifications.value.length === 0) {
    await loadNotifications();
  }
};

// Удалить одно уведомление
const deleteNotification = async (id) => {
  try {
    await notificationsAPI.delete(id);
    notifications.value = notifications.value.filter(n => n.id !== id);
    notificationsCount.value = Math.max(0, notificationsCount.value - 1);
  } catch (err) {
    console.error('❌ Ошибка удаления уведомления:', err);
  }
};

// Очистить все уведомления
const clearAllNotifications = async () => {
  try {
    await notificationsAPI.clearAll();
    notifications.value = [];
    notificationsCount.value = 0;
  } catch (err) {
    console.error('❌ Ошибка очистки уведомлений:', err);
  }
};

// Перейти по ссылке уведомления
const goToNotificationLink = async (notification) => {
  if (notification.link) {
    await deleteNotification(notification.id);
    isNotificationsOpen.value = false;
    router.push(notification.link);
  }
};

// Форматирование даты
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  if (diff < 60000) return 'только что';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ч назад`;

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
};

// ❌ УБРАЛИ: loadProfile() - данные уже в Store

// Переход в настройки
const goToSettings = () => {
  isMenuOpen.value = false;
  console.log('🔧 Переход в настройки (пока пустая функция)');
  // TODO: router.push({ name: 'Settings' });
};

// ✅ ИЗМЕНЕНО: Выход через Store
const handleLogout = async () => {
  console.log('👋 Выход из системы');
  isMenuOpen.value = false;
  await authStore.logout(); // ← Отправит на backend + очистит локально
  router.push({ name: 'CheckEmail' });
};

// Lifecycle hooks
onMounted(async () => {
  document.addEventListener('click', handleClickOutside);

  // Загружаем количество уведомлений
  try {
    const response = await notificationsAPI.getCount();
    notificationsCount.value = response.data.count || 0;
  } catch (err) {
    console.error('❌ Ошибка загрузки счётчика уведомлений:', err);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Позиционирование для родителя */
.nav-item {
  position: relative;
}

/* Выпадающее меню */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  z-index: 1000;
}

/* Заголовок */
.profile-dropdown-header {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.profile-avatar-large {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9375rem;
}

.profile-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Разделитель */
.profile-dropdown-divider {
  height: 1px;
  background: #e5e7eb;
}

/* Меню */
.profile-dropdown-menu {
  padding: 0.5rem;
}

.profile-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
  font-size: 0.9375rem;
  color: #374151;
  font-weight: 500;
}

.profile-dropdown-item:hover {
  background-color: #f3f4f6;
}

.profile-dropdown-item svg {
  flex-shrink: 0;
  color: currentColor;
}

/* Кнопка выхода (красная) */
.profile-dropdown-item.logout-item {
  color: #dc2626;
}

.profile-dropdown-item.logout-item:hover {
  background-color: #fef2f2;
}

/* Анимация выпадающего меню */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* Уведомления */
.notifications-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 320px;
  max-height: 400px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 1000;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.notifications-title {
  font-weight: 600;
  color: #111827;
}

.notifications-clear {
  font-size: 0.75rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
}

.notifications-clear:hover {
  color: #dc2626;
}

.notifications-list {
  max-height: 320px;
  overflow-y: auto;
}

.notifications-loading,
.notifications-empty {
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item.clickable {
  cursor: pointer;
}

.notification-item.clickable:hover {
  background-color: #f9fafb;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 500;
  font-size: 0.875rem;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.notification-message {
  font-size: 0.8125rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.notification-delete {
  flex-shrink: 0;
  padding: 0.25rem;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0.25rem;
}

.notification-delete:hover {
  color: #dc2626;
  background-color: #fef2f2;
}
</style>