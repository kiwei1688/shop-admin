import { router, addRouters } from '@/router'
// utils
import { getToken } from "@/utils/auth"
import { showFullLoading, hideFullLoading } from "@/utils/common"
// tips
import { toast } from '@/utils/toast'
// 直接透過pinia action請求登入
import { useUserStore } from "@/stores/user"

// 全局前置守衛(路由發生變化觸發)
router.beforeEach(async (to, from, next) => {
  // 顯示全局loading
  showFullLoading()

  const token = getToken()
  const store = useUserStore()
  let hasNewRoutes = false // 有新路由
  let hasGetInfo = false

  // 未登入
  if(!token && to.path != "/login") {
    toast("error", "您尚未登錄!!")
    return next({path: "/login"})
  }

  // 防止 已經登入 & /login (重複登入)
  if(token && to.path === "/login") {
    toast("error", "請勿重複登錄!!")
    // 丟回 來的路徑
    return next({path: from.path ? from.path : "/" })
  }

  // 獲取 管理者相關信息(帶token去請求)
  if(token) {
    await store.getManmgerInfo()
    // 控制不重複請求
    hasGetInfo = true
    // 動態載入 二級路由的menu(傳入後端給的menu數據)
    hasNewRoutes = addRouters(store.managerInfo.data.menus)
  }
  // 設置頁面標題
  let title = (to.meta.title ? to.meta.title : "") + "- Vue3後台系統"
  document.title = title

  // 手動指定路由-> 解決遞迴動態路由重新整理後,路由丟失的問題
  hasNewRoutes ? next(to.fullPath) : next()
})

// 頁面加載完執行
router.afterEach((to, from) => {
  hideFullLoading()
})
