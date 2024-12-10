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
