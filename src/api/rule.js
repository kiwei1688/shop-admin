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

/**
 * @description: 修改菜單權限 --
 *  post (switch切換)
 * @param { id : 菜單id / data }
 * @return {*}
 */
export const updateRuleStatus = async (id, data) => {
  return await request({
    url: `/admin/rule/${id}/update_status`,
    method: 'POST',
    data
  })
}

/**
 * @description: 刪除菜單 -- post
 * @param { id : 菜單id }
 * @return {*}
 */
export const deleteRule = async (id) => {
  return await request({
    url: `/admin/rule/${id}/delete`,
    method: 'POST'
  })
}