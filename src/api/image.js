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
 




