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
