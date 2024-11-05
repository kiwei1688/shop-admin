// 管理用戶數據相關
import { ref } from 'vue'
import { defineStore } from 'pinia'
// user api
import { loginAPI, getManagerInfoAPI } from '@/api/user'
// cookie設置
import { removeToken } from "@/utils/auth"
import { removeLocalStorage } from "@/utils/common"

export const useUserStore = defineStore(
  'user',
  () => {
    // 取得登入的token state
    const tokenInfo = ref({})
    // 管理者信息
    const managerInfo = ref({})

    // 取得 token (action 同步 + 異步)
    const getTokenInfo = async ({ username, password }) => {
      try {
        await loginAPI({ username, password }).then((res) => {
          // 請求登入成功
          if (res.msg === 'ok') {
            console.log("登入成功 ~~~", res)
            // {msg: "ok", data: {token: 2312313}, path: "........"}
            tokenInfo.value = res.data
          }
        })
      } catch (err) {
        console.log('err ======', err.response.data)
      }
    }

    // 取得管理者信息 (需登入)
    const getManmgerInfo = async () => {
      try {
        await getManagerInfoAPI().then((res) => {
          // 請求登入成功
          if (res.msg === 'ok') {
            console.log("管理者登入信息 ~~~", res.data)
            managerInfo.value = res
          }
        })
      } catch (err) {
        console.log('err ======', err.response.data)
      }
    }

    // 退出登入
    const logout = () => {
      // 刪除cookie的token
      removeToken()
      // 清除localStorage
      // removeLocalStorage("user")
      localStorage.setItem("user", {})
      // 刪除pinia管理者數據
      managerInfo.value = {}
    }


    // 給外部組件使用
    return {
      tokenInfo,
      managerInfo,
      getTokenInfo,
      getManmgerInfo,
      logout
    }
  },
  {
    // pinia持久化設定
    persist: true
  }
)
