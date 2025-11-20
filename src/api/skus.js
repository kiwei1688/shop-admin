import request from '@/utils/http'

/**
 * 
 * @description: 商品規格列表 api -- get
 * @param { page 傳入頁數  }
 * @return {*}
 */

export const getSkusList = async (page) => {
  return await request({
    url: `/admin/skus/${page}`
  })
}

/**
 * 
 * @description: 新增商品規格 api -- post
 * @param { 商品規格 }
 * @return {*}
 */

export const createSkus = async (data) => {
  return await request({
    url: "/admin/skus",
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 修改商品規格 api -- post
 * @param { id: 商品規格id }
 * @return {*}
 */

export const updatedSkus = async (id, data) => {
  return await request({
    url: `/admin/skus/${id}`,
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 刪除商品規格 api -- post
 * @param { ids: 商品規格 }
 * @return {*}
 */

export const deleteSkus = async (ids) => {
  // 需傳入arr格式
  ids = !Array.isArray(ids) ? [ids] : ids
  
  return await request({
    url: `/admin/skus/delete_all`,
    method: 'POST',
    data: { ids }
  })
}

/**
 * @description: 修改商品規格 --
 *  post (switch切換)
 * @param { 
 *  id : 商品規格id
 *  data: { "status" : status } 單單只傳入一個status的參數
 * }
 * @return {*}
 */
export const updateSkusStatus = async (id, status) => {
  return await request({
    url: `/admin/skus/${id}/update_status`,
    method: 'POST',
    data: { "status" : status }
  })
}

