import request from '@/utils/http'

/**
 * 
 * @description: 圖庫分類列表 api -- get
 * @param { page 傳入頁數 }
 * @return {*}
 */

export const getImageClassList = async (page) => {
  return await request({
    url: '/admin/image_class/' + page
  })
}
 


/**
 * 
 * @description: 新增圖庫分類 api -- post
 * @param { data - 傳入form表單內容 }
 * @return {*}
 */

export const createImageClass = async (data) => {
  return await request({
    url: '/admin/image_class',
    method: 'POST',
    data
  })
}


