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

/**
 * 
 * @description: 新增菜單 api -- post
 * @param {  }
 * @return {*}
 */

export const createRule = async (data) => {
  return await request({
    url: "/admin/rule",
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 修改菜單 api -- post
 * @param { id: 菜單id }
 * @return {*}
 */

export const updatedRule = async (id, data) => {
  console.log("查看rule_id ====", id , data)
  return await request({
    url: `/admin/rule/${id}`,
    method: 'POST',
    data
  })
}