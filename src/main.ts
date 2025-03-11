import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'

// 로컬 스토리지 초기화
localStorage.removeItem('vuex')

const app = createApp(App)

// Vuex 스토어 설정
app.use(store);

// 라우터 설정
app.use(router);

app.mount('#app');