import { createApp } from 'vue'
import './style.css'
import AppRouter from './AppRouter.vue'
import router from './router'

createApp(AppRouter).use(router).mount('#app')
