import './assets/main.css'
import '@primevue/themes/aura'; // Importación moderna del tema
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Volvemos a Pinia
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // Usamos Pinia
app.use(router)
app.use(PrimeVue)

// Conectar a Vue DevTools en desarrollo
if (process.env.NODE_ENV === 'development' && (globalThis as any).__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  app.config.performance = true;
  (globalThis as any).__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
}

app.mount('#app')
