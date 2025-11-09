<template>
  <div class="email-sent-container">
    <div class="success-icon">✉️</div>

    <h1>Письмо отправлено!</h1>

    <div class="message">
      <p>На адрес <strong>{{ email }}</strong> отправлено письмо с ссылкой для подтверждения регистрации и установки пароля.</p>

      <p>Пожалуйста, проверьте вашу почту и перейдите по ссылке для завершения регистрации.</p>

      <p class="note">Ссылка действительна в течение 24 часов.</p>
    </div>

    <div class="info-box">
      <p><strong>Не получили письмо?</strong></p>
      <ul>
        <li>Проверьте папку "Спам" или "Нежелательная почта"</li>
        <li>Убедитесь, что email указан правильно</li>
        <li>Подождите несколько минут - доставка может занять время</li>
      </ul>
    </div>

    <div class="actions">
      <button @click="goToHome" class="btn-primary">
        На главную
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
import { usePageMeta } from '@/composables/usePageMeta';

usePageMeta('Проверьте почту', 'Письмо со ссылкой отпарвлено на почту');

onMounted(() => {
  // Получаем email из sessionStorage
  const savedEmail = sessionStorage.getItem('registration_email');
  if (savedEmail) {
    email.value = savedEmail;
  } else {
    // Если email нет, возвращаемся на главную
    router.push({ name: 'CheckEmail' });
  }
});

const goToHome = () => {
  sessionStorage.removeItem('registration_email');
  router.push({ name: 'CheckEmail' });
};
</script>

<style scoped>
.email-sent-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

.success-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

h1 {
  color: #4CAF50;
  margin-bottom: 30px;
}

.message {
  text-align: left;
  margin-bottom: 30px;
  line-height: 1.6;
}

.message p {
  margin-bottom: 15px;
}

.message strong {
  color: #4CAF50;
}

.note {
  font-size: 14px;
  color: #666;
  font-style: italic;
}

.info-box {
  background-color: #f9f9f9;
  border-left: 4px solid #4CAF50;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
}

.info-box p {
  margin-top: 0;
  margin-bottom: 10px;
}

.info-box ul {
  margin: 0;
  padding-left: 20px;
}

.info-box li {
  margin-bottom: 8px;
  color: #555;
}

.actions {
  margin-top: 30px;
}

.btn-primary {
  padding: 12px 30px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #45a049;
}
</style>