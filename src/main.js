import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// import './style.css' 預設全局樣式
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'
// pinia 持久化
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
// 全局引入element plus icons
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 進度條_樣式
import "nprogress/nprogress.css"

const app = createApp(App)

// 全局引入element plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()

// 註冊持久化套件
pinia.use(piniaPluginPersistedstate)
// 設置 全局前置守衛
import "./permission"

app.use(pinia)
app.use(router)
app.use(ElementPlus)
// windi css
import 'virtual:windi.css'
app.mount('#app')
