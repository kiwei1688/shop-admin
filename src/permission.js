import router from '@/router'
import { getToken } from "@/utils/auth"
import { toast } from '@/utils/toast'
// 直接透過pinia action請求登入
import { useUserStore } from "@/stores/user"

// 全局前置守衛
router.beforeEach(async (to, from, next) => {
  const token = getToken()
  const store = useUserStore()

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
  if(token) await store.getManmgerInfo()

  next()
})
