import request from '@/utils/http'

/**
 * 
 * @description: 指定分類下的圖片列表 api -- get
 * @param { page 傳入頁數 / id 分類id / limit 每頁N筆 (非必要) }
 * @return {*}
 */

export const getImageList = async (id, page = 1) => {
  return await request({
    url: `/admin/image_class/${id}/image/${page}`
  })
}

/**
 * 
 * @description: 圖片重新命名 api -- post
 * @param {  }
 * @return {*}
 */

export const updateImage = async (id, name) => {
  return await request({
    url: `/admin/image/${id}`,
    method: 'POST',
    data: { name }
  })
}

/**
 * 
 * @description: 刪除圖片 api -- post
 * @param { [698] }
 * @return {*}
 */

export const deleteImage = async (ids) => {
  console.log("idssssss !!!!!", ids)
  return await request({
    url: "/admin/image/delete_all",
    method: 'POST',
    data: { "ids":ids }
  })
}
 
/* 上傳圖片api - action 接受一個api path使用代理/api/ 前綴 */
export const uploadApi = "/api/admin/image/upload"




