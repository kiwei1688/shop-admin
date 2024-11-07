// axios基礎封裝
import axios from 'axios'
import { toast } from '@/utils/toast'
// import 'element-plus/theme-chalk/el-message.css'
// pinia
import { useUserStore } from '@/stores/user'
// cookie設置
import { getToken } from "@/utils/auth"
// api
import { logoutAPI } from "@/api/user"
// import router from '@/router'

const httpInstance = axios.create({
  // api_main path
  // baseURL: 'http://ceshi13.dishait.cn/admin',
  baseURL: '/api',
  // 超時時間
  timeout: 5000
})
// 攔截器

// 請求攔截
httpInstance.interceptors.request.use(
  (config) => {
    // 從cookie取出token
    const token = getToken()

    // 攜帶token

    // const { token } = JSON.parse(localStorage.getItem("memberInfo") || "{}");
    if (token) {
      console.log("取得token ~~", token)
      // config.headers.Authorization = `Bearer ${token}` == 前端的寫法
      // 請求header添加token (後端寫法)
      config.headers["token"] = token
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 響應攔截
httpInstance.interceptors.response.use(
  (res) => {
    return res.data
  },
  // 統一處理error提示
  (error) => {
    // error.response.data = {msg: '用户名错误', errorCode: 20000}
    const errorCode = error.response.data.errorCode
    const msg = error.response.data.msg || "請求失敗!!"
    const store = useUserStore()

    // 修改密碼時~~token失效後,將用戶強制登出,reload
    if(msg === "非法token，请先登录！") {
      store.logout()
      setTimeout(() => {
        location.reload()
      }, 1500)
    }

    // 全局 error提示
    switch (errorCode) {
      case 20000:
        toast('error', msg)
        break
      default:
        break
    }

    // switch (errorStatus) {
    //   case 401: // token失效
    //     console.log('錯誤狀態馬 401 =======', error.response.request.status)
    //     // 清空pinia 用戶數據
    //     store.clearUserInfo()
    //     // 返回login page
    //     router.push({ path: '/login' })

    //     ElMessage({
    //       type: 'warning',
    //       message: error.response.data.message
    //     })
    //     break
    //   // 帳號or密碼錯誤
    //   case 400:
    //     console.log('錯誤狀態馬 400 =======', error.response.request.status)
    //     router.push({ path: '/login' })

    //     ElMessage({
    //       type: 'warning',
    //       message: error.response.data.message
    //     })
    //     break
    //   default:
    //     break
    // }

    return Promise.reject(error)
  }
)

export default httpInstance
