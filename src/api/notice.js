import request from '@/utils/http'

/**
 * 
 * @description: 獲取公告列表 api -- get
 * @param { page 傳入頁數  }
 * @return {*}
 */

export const getNoticeList = async (page) => {
  return await request({
    url: `/admin/notice/${page}`
  })
}

/**
 * 
 * @description: 新增公告 api -- post
 * @param { title: 公告標題 / content: 公告內容 }
 * @return {*}
 */

export const createNotice = async (data) => {
  return await request({
    url: "/admin/notice",
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 修改公告 api -- post
 * @param { id: 公告id / title: 公告標題 / content: 公告內容 }
 * @return {*}
 */

export const updatedNotice = async (id, data) => {
  return await request({
    url: `/admin/notice/${id}`,
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 刪除公告 api -- post
 * @param { id: 公告id }
 * @return {*}
 */

export const deleteNotice = async (id) => {
  return await request({
    url: `/admin/notice/${id}/delete`,
    method: 'POST',
  })
}



