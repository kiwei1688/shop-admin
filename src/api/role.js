import request from '@/utils/http'

/**
 * 
 * @description: 角色管理列表 api -- get
 * @param { page 傳入頁數  }
 * @return {*}
 */

export const getRoleList = async (page) => {
  return await request({
    url: `/admin/role/${page}`
  })
}

/**
 * 
 * @description: 新增角色管理 api -- post
 * @param { title: 公告標題 / content: 公告內容 }
 * @return {*}
 */

export const createRole = async (data) => {
  return await request({
    url: "/admin/role",
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 修改角色管理 api -- post
 * @param { id: 角色管理id / title: 角色管理標題 / content: 公告內容 }
 * @return {*}
 */

export const updatedRole = async (id, data) => {
  return await request({
    url: `/admin/role/${id}`,
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 刪除角色管理 api -- post
 * @param { id: 角色管理id }
 * @return {*}
 */

export const deleteRole = async (id) => {
  return await request({
    url: `/admin/role/${id}/delete`,
    method: 'POST',
  })
}

/**
 * @description: 修改角色管理狀態 --
 *  post (switch切換)
 * @param { 
 *  id : 角色管理id
 *  data: { "status" : status } 單單只傳入一個status的參數
 * }
 * @return {*}
 */
export const updateRoleStatus = async (id, status) => {
  return await request({
    url: `/admin/role/${id}/update_status`,
    method: 'POST',
    data: { "status" : status }
  })
}

/**
 * 
 * @description: 配置角色全縣 api -- post
 * @param { id: 角色管理id }
 * @return {*}
 * 
 * 
 */

export const setRoleRules = async (id, rule_ids) => {
  return await request({
    url: `/admin/role/set_rules`,
    method: 'POST',
    data: { id, rule_ids }
  })
}


