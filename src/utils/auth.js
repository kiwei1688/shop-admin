// 使用vueuse cookie套件處理cookie
import { useCookies } from '@vueuse/integrations/useCookies'
const TokenKey = "admin-token"

const cookie = useCookies()

// 獲取token
export const getToken = () => {
  return cookie.get(TokenKey)
}

// 設置token
export const setToken = (token) => {
  return cookie.set(TokenKey, token)
}

// 清除token
export const removeToken = () => {
  return cookie.remove(TokenKey)
}