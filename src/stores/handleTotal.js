// 管理用戶數據相關
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const handleTotalStore = defineStore(
  'total',
  () => {
    // 側邊欄width
    const asideWidth = ref("250px")

    // 側邊欄 打開&關閉
    const handleAsideWidth = () => {
      asideWidth.value = asideWidth.value === "250px" ? "64px" : "250px"
    }


    // 給外部組件使用
    return {
      asideWidth,
      handleAsideWidth
    }
  },
  {
    // pinia持久化設定
    persist: true
  }
)
