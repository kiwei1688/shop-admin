import request from '@/utils/http'

/**
 * 
 * @description: 圖庫管理 api -- get
 * @param { page 傳入頁數 }
 * @return {*}
 */

export const getImageClassList = async (page) => {
  return await request({
    url: '/admin/image_class/' + page
  })
}


