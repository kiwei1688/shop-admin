import request from '@/utils/http'

/**
 * 
 * @description: 主控台(上方四個面板數據) api -- get
 * @param 
 * @return {*}
 */

export const getStatistics1 = async () => {
  return await request({
    url: '/admin/statistics1'
  })
}

/**
 * 
 * @description: 店鋪及商品提示 api -- get
 * @param 
 * @return {*}
 */

export const getStatistics2 = async () => {
  return await request({
    url: '/admin/statistics2'
  })
}

/**
 * 
 * @description: 主控台(echarts圖表數據) api -- get
 * @param 
 * @return {*}
 */

export const getStatistics3 = async (type) => {
  return await request({
    url: "/admin/statistics3?type=" + type
  })



  
}
