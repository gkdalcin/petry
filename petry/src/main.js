import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vue3TouchEvents from 'vue3-touch-events'
import './index.css'

const app = createApp(App)

app.use(router)
app.use(Vue3TouchEvents, {dragFrequency: 15});
app.mount('#app')
