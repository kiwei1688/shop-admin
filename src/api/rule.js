import request from '@/utils/http'

/**
 * 
 * @description: 獲取菜單權限列表 api -- get
 * @param { page 傳入頁數  }
 * @return {*}
 */

export const getRuleList = async (page) => {
  return await request({
    url: `/admin/rule/${page}`
  })
}