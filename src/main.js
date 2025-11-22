import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as Sentry from "@sentry/vue";
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();

// Sentry - мониторинг ошибок
Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    enabled: !!import.meta.env.VITE_SENTRY_DSN,
});

app.use(pinia);
app.use(router);
app.mount('#app');