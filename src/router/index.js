// createRouter 創建router實例
// createWebHistory 創建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'

// 默認路由,所有用戶共用
const routes = [
  // 一級路由
  {
    // 首頁
    path: '/',
    name: 'admin',
    component: () => import('@/layout/admin.vue'),
  },
  {
    // 登入
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login.vue'),
    meta: {
      title: "登入頁"
    }
  },
  {
    // 404
    path: '/:pathMatch(.*)*', 
    name: '404',
    component: () => import('@/pages/404.vue'),
    meta: {
      title: "404"
    }
  }
]

// 動態路由, 匹配後端數據動態加入路由
const asyncRouters = [
  {
    path: '/',
    name: '/',
    component: () => import('@/pages/index.vue'),
    meta: {
      title: "後台首頁"
    }
  },
  { // 商品管理
    path: '/goods/list',
    name: '/goods/list',
    component: () => import('@/pages/goods/list.vue'),
    meta: {
      title: "商品管理"
    }
  },
  { // 分類列表
    path: '/category/list',
    name: '/category/list',
    component: () => import('@/pages/category/list.vue'),
    meta: {
      title: "分類列表"
    }
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 用後端給的數據處理動態路由-使用遞迴處理
export function addRouters(menus){
  // 是否有新的路由
  let hasNewRoutes = false

  const findAndRoutesByMenus = (arr) => {
    // 處理塞入從後端拿到的二級子路由
    arr.forEach(e => {
      // 判斷目前path與後端傳入menu的path是否一致
      let item = asyncRouters.find(el => el.path === e.frontpath)

      // hasRoute() 檢查路由是否存在
      if(item && !router.hasRoute(item.path)) {
        // 動態添加路由,需將二級路由添加到首頁(admin)底下
        router.addRoute("admin", item)
        hasNewRoutes = true
      }
      // 如果有子路由,在調用自己傳入子路由(一層一層下去)
      if(e.child && e.child.length > 0)  findAndRoutesByMenus(e.child)
    })
  }

  findAndRoutesByMenus(menus)
  console.log("查看目前有的遞歸路由 ~~~~~",router.getRoutes())
  return hasNewRoutes
}

// 寫死的路由
// routes: [
  //   {
  //     path: '/',
  //     name: 'admin',
  //     component: () => import('@/layout/admin.vue'),
  //     children: [
  //       {
  //         path: '/',
  //         name: 'index',
  //         component: () => import('@/pages/index.vue'),
  //         meta: {
  //           title: "後台首頁"
  //         }
  //       },
  //       { // 商品管理
  //         path: '/goods/list',
  //         name: 'list',
  //         component: () => import('@/pages/goods/list.vue'),
  //         meta: {
  //           title: "商品管理"
  //         }
  //       },
  //       { // 分類列表
  //         path: '/category/list',
  //         name: 'category',
  //         component: () => import('@/pages/category/list.vue'),
  //         meta: {
  //           title: "分類列表"
  //         }
  //       }
  //     ]
  //   },
  //   {
  //     path: '/login',
  //     name: 'login',
  //     component: () => import('@/pages/login.vue'),
  //     meta: {
  //       title: "登入頁"
  //     }
  //   },
  //   {
  //     path: '/:pathMatch(.*)*', 
  //     name: '404',
  //     component: () => import('@/pages/404.vue'),
  //     meta: {
  //       title: "404"
  //     }
  //   }
  // ]