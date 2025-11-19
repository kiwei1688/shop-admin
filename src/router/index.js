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
  { // 自己練習用page
    path: '/practice/list',
    name: 'practice',
    component: () => import('@/pages/practice/list.vue'),
    meta: {
      title: "練習用"
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
  { // 商品管理 / 商品管理
    path: '/goods/list',
    name: '/goods/list',
    component: () => import('@/pages/goods/list.vue'),
    meta: {
      title: "商品管理"
    }
  },
  { // 商品管理 / 分類列表
    path: '/category/list',
    name: '/category/list',
    component: () => import('@/pages/category/list.vue'),
    meta: {
      title: "分類列表"
    }
  },
  { // 商品管理 / 規格管理
    path: '/skus/list',
    name: '/skus/list',
    component: () => import('@/pages/skus/list.vue'),
    meta: {
      title: "規格管理"
    }
  },
  { // 商品管理 / 優惠券列表
    path: '/coupon/list',
    name: '/coupon/list',
    component: () => import('@/pages/coupon/list.vue'),
    meta: {
      title: "優惠券列表"
    }
  },
  { // 用戶管理 / 用戶管理
    path: '/user/list',
    name: '/user/list',
    component: () => import('@/pages/user/list.vue'),
    meta: {
      title: "用戶管理"
    }
  },
  { // 訂單管理 / 訂單管理
    path: '/order/list',
    name: '/order/list',
    component: () => import('@/pages/order/list.vue'),
    meta: {
      title: "訂單列表"
    }
  },
  { // 訂單管理 / 評價管理
    path: '/comment/list',
    name: '/comment/list',
    component: () => import('@/pages/comment/list.vue'),
    meta: {
      title: "評價"
    }
  },
  { // 其他模塊 / 圖庫列表
    path: '/image/list',
    name: '/image/list',
    component: () => import('@/pages/image/list.vue'),
    meta: {
      title: "圖庫列表"
    }
  },
  { // 其他模塊 / 公告列表
    path: '/notice/list',
    name: '/notice/list',
    component: () => import('@/pages/notice/list.vue'),
    meta: {
      title: "公告列表"
    }
  },
  { // 系統設置 / 基礎配置
    path: '/setting/base',
    name: '/setting/base',
    component: () => import('@/pages/setting/base.vue'),
    meta: {
      title: "基礎配置"
    }
  },
  { // 管理員管理 / 管理員管理 == :age? 的? 代表可傳 可不傳
    path: '/manager/list',
    name: '/manager/list',
    component: () => import('@/pages/manager/list.vue'),
    meta: {
      title: "管理員列表管理"
    }
  },
  { // 管理員管理 / 權限管理
    path: '/access/list',
    name: '/access/list',
    component: () => import('@/pages/access/list.vue'),
    meta: {
      title: "權限管理"
    }
  },
  { // 管理員管理 / 角色管理 ===> 傳送動態路由params參數
    path: '/role/list',
    name: '/role/list',
    component: () => import('@/pages/role/list.vue'),
    children: [
      {
        name: "xiagne",
        // 子路徑不用帶"/"
        path: "testParams/:id/:name/:age?",
        // path: "testParams",
        component: () => import('@/components/testParams.vue'),
        //第一種寫法 頁面可直接用defineProps(['id', 'name', 'age'])接收數據
        props: true
        //第二種寫法-函式
        // props(route) {
        //   return route.params
        // }
      }
    ],
    meta: {
      title: "角色管理"
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