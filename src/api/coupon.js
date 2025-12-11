import request from '@/utils/http'

/**
 * 
 * @description: 優惠券列表 api -- get
 * @param { page 傳入頁數  }
 * @return {*}
 */

export const getCouponList = async (page) => {
  return await request({
    url: `/admin/coupon/${page}`
  })
}

/**
 * 
 * @description: 新增優惠券 api -- post
 * @param { 優惠券 }
 * @return {*}
 */

export const createCoupon = async (data) => {
  return await request({
    url: "/admin/coupon",
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 修改優惠券 api -- post
 * @param { id: 優惠券id }
 * @return {*}
 */

export const updatedCoupon = async (id, data) => {
  return await request({
    url: `/admin/coupon/${id}`,
    method: 'POST',
    data
  })
}

/**
 * 
 * @description: 刪除優惠券 api -- post
 * @param { id: 優惠券id }
 * @return {*}
 */

export const deleteCoupon = async (id) => {
  return await request({
    url: `/admin/coupon/${id}/delete`,
    method: 'POST',
    data: { id }
  })
}

/**
 * 
 * @description: 失效優惠券 api -- post
 * @param { id: 優惠券id, status: 0 失效 }
 * @return {*}
 */

export const updateCouponStatus = async (id) => {
  return await request({
    url: `/admin/coupon/${id}/update_status`,
    method: 'POST',
    data: { status: 0 }
  })
}

