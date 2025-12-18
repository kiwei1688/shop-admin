import request from '@/utils/http'
import { queryParams } from "@/utils/common.js"

/**
 * @description: 獲取商品分類列表 -- get
 * @param { }
 * @return 
 * {*}
 */
export const getCategoryList = async () => {
  return await request({
    url: `/admin/category`
  })
}

/**
 * @description: 批量上架下架商品 -- post
 * @param { ids : 多個商品id / status: }
 * @return {*}
 */
export const updateGoodsStatus = async (ids, status) => {
  return await request({
    url: `/admin/goods/changestatus`,
    method: 'POST',
    data: { ids, status }
  })
}

/**
 * @description: 增加商品 -- post
 * @param { data : body的參數 }
 * @return {*}
 */
export const createGoods = async (data) => {
  return await request({
    url: "/admin/goods",
    method: 'POST',
    data
  })
}

/**
 * @description: 修改商品 -- post
 * @param { id : 商品id / data: body的參數}
 * @return {*}
 */
export const updateGoods = async (id, data) => {
  return await request({
    url: `/admin/goods/${id}`,
    method: 'POST',
    data
  })
}
