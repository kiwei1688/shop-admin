// createRouter 創建router實例
// createWebHistory 創建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // path和component對應關係的位置
  routes: [
    // 一級路由
    {
      // 首頁
      path: '/',
      name: 'index',
      // redirect: '/index',
      component: () => import('@/pages/index.vue'),
    },
    {
      // 登入
      path: '/login',
      name: 'login',
      component: () => import('@/pages/login.vue'),
    },
    {
      // 404
      path: '/:pathMatch(.*)*', 
      name: '404',
      component: () => import('@/pages/404.vue'),
    }
  ]
})

export default router