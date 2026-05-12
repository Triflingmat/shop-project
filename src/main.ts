import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { useUserStore } from './stores/user'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus)

// 注册 Pinia（必须在 mount 之前）
const pinia = createPinia()
app.use(pinia)

// 注册路由
app.use(router)

// 启动时恢复登录状态（Pinia 初始化之后、mount 之前）
const userStore = useUserStore()
userStore.loadUser()

app.mount('#app')
