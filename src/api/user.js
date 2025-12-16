import request from '@/utils/http'
import { queryParams } from "@/utils/common.js"

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
  const res = queryParams(query)
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

/**
 * @description: 創建管理員 -- post
 * @param { data : body的參數 }
 * @return {*}
 */
export const createManager = async (data) => {
  return await request({
    url: "/admin/manager",
    method: 'POST',
    data
  })
}

/**
 * @description: 修改管理員 -- post
 * @param { id : 管理員id / data: body的參數}
 * @return {*}
 */
export const updateManager = async (id, data) => {
  return await request({
    url: `/admin/manager/${id}`,
    method: 'POST',
    data
  })
}

/**
 * @description: 刪除管理員 -- post
 * @param { id : 管理員id }
 * @return {*}
 */
export const deleteManager = async (id) => {
  return await request({
    url: `/admin/manager/${id}/delete`,
    method: 'POST'
  })
}
