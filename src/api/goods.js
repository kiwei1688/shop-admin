import request from '@/utils/http'
import { queryParams } from "@/utils/common.js"

/**
 * @description: 獲取商品列表 -- get
 * @param { page : 當前頁數 / query : 網址列帶入的query數據 }
 * @return 
 * {*}
 */
export const getGoodsList = async (page, query = {}) => {
  const res = queryParams(query)
  return await request({
    url: `/admin/goods/${page}${res}`
  })
}

/**
 * @description: 批量上架下架商品 -- post
 * @param { ids : 要上下架的多個商品id / status: 1:上架 / 0:下架 }
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

/**
 * @description: 刪除商品 -- post
 * @param { ids : 商品id }
 * @return {*}
 */
export const deleteGoods = async (ids) => {
  return await request({
    url: `/admin/goods/delete_all`,
    method: 'POST',
    data: { ids }
  })
}

/**
 * @description: 查看商品資料 -- get
 * @param { id: 當筆商品id }
 */
export const readGoods = async (id) => {
  return await request({
    url: `/admin/goods/read/${id}`
  })
}

/**
 * @description: 設置商品輪撥圖 -- post
 * @param { id : 商品id / data: 輪撥圖的array數據}
 */
export const setGoodsBanner = async (id, data) => {
  return await request({
    url: `/admin/goods/banners/${id}`,
    method: 'POST',
    data
  })
}

/**
 * @description: 設置商品skus規格(單規格 / 雙規格) -- post
 * @param { id : 商品id / data: skus}
 */
export const updateGoodsSkus = async (id, data) => {
  return await request({
    url: `/admin/goods/updateskus/${id}`,
    method: 'POST',
    data
  })
}

/**
 * @description: 添加商品規格(雙規格) -- post
 * @param { data: 商品規格 }
 */
export const createGoodsSkusCard = async (data) => {
  return await request({
    url: `/admin/goods_skus_card`,
    method: 'POST',
    data
  })
}

/**
 * @description: 修改商品規格選項名稱(雙規格) -- post
 * @param { data: 商品規格數據 }
 */
export const updatedGoodsSkusCard = async (id, data) => {
  return await request({
    url: `/admin/goods_skus_card/${id}`,
    method: 'POST',
    data
  })
}

/**
 * @description: 刪除商品規格選項(雙規格) -- post
 * @param { id: 商品規格id }
 */
export const deleteGoodsSkusCard = async (id) => {
  return await request({
    url: `/admin/goods_skus_card/${id}/delete`,
    method: 'POST'
  })
}

