import request from '@/utils/http'

/**
 * @description: login api -- post
 * @param { username, password }
 * @return {*}
 */

export const loginAPI = async ({ username, password }) => {
  return await request({
    url: '/admin/login',
    method: 'POST',
    data: {
      username,
      password
    }
  })
}

/**
 * @description: 取得管理者信息 -- post
 * @param
 * @return {*}
 */

export const getManagerInfoAPI = async () => {
  return await request({
    url: '/admin/getinfo',
    method: 'POST',
  })
}

/**
 * @description: 登出 -- post
 * @param
 * @return {*}
 */
export const logoutAPI = async () => {
  return await request({
    url: '/admin/logout',
    method: 'POST'
  })
}

/**
 * @description: 修改密碼 -- post
 * @param
 * @return {*}
 */
export const updatepassword = async (data) => {
  return await request({
    url: '/admin/updatepassword',
    method: 'POST',
    data
  })
}

/**
 * @description: 獲取管理員列表 -- get
 * @param { page : 當前頁數 / query : 網址列帶入的query數據 }
 * @return 
 * {*}
 */
export const getManagerList = async (page, query = {}) => {
  // 組合query數值
  let q = []
  for(const [key] of Object.entries(query)) {
    if(query[key]){
      // encodeURIComponent() 防止參數丟失需先轉換
      q.push(`${key}=${encodeURIComponent(query[key])}`)
    }
  }
  // 拼接出來的query值 為 ?limit=10&keyword=ceshi
  let res = q.join("&")
  res = res ? `?${res}` : ""

  return await request({
    url: `/admin/manager/${page}${res}`
  })
}

/**
 * @description: 修改管理員狀態 -- post
 * @param { id : 管理員id / status: 管理員是否啟用 0:禁用, 1:啟用 }
 * @return {*}
 */
export const updateManagerStatus = async (id, status) => {
  return await request({
    url: `/admin/manager/${id}/update_status`,
    method: 'POST',
    data: { status }
  })
}
