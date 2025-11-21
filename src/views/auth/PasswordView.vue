<!-- src/views/PasswordView.vue -->
<template>
  <div class="min-h-dvh grid place-items-center bg-gray-50">
    <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow">
      <h1 class="text-xl font-semibold">Введите пароль</h1>
      <form class="mt-6 space-y-4" @submit.prevent="onLogin">
        <div>
          <label class="block text-sm font-medium mb-1">Email</label>
          <input :value="email" disabled class="w-full rounded-lg border px-3 py-2 bg-gray-100 text-gray-600" />
          <button type="button" class="mt-2 text-sm underline" @click="changeEmail">Изменить email</button>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Пароль</label>
          <input v-model="password" type="password" required class="w-full rounded-lg border px-3 py-2 outline-none focus:ring" />
          <p v-if="error" class="text-sm text-red-600 mt-1">{{ error }}</p>
        </div>
        <button :disabled="loading||!password" class="w-full rounded-lg px-4 py-2 text-white" :class="loading||!password?'bg-gray-400':'bg-black hover:opacity-90'">
          {{ loading ? 'Вхожу…' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuthFlowStore } from '@/stores/authFlow'

const route = useRoute()
const router = useRouter()
const flow = useAuthFlowStore()
const auth = useAuthStore()

const email = computed(() => route.query.email?.toString() || flow.email)
const password = ref('')
const loading = ref(false)
const error = ref('')

function changeEmail() {
  // ✅ ИСПРАВЛЕНО: правильное имя роута
  router.push({ name: 'CheckEmail' })
}

async function onLogin() {
  loading.value = true
  error.value = ''

  const { ok, data } = await auth.login(email.value, password.value).catch(() => ({ ok: false }))

  loading.value = false

  // ✅ ИСПРАВЛЕНО: правильное имя роута с заглавной буквы
  if (ok) {
    router.push({ name: 'Dashboard' })
  } else {
    error.value = data?.detail || 'Неверный email или пароль'
  }
}
</script>
