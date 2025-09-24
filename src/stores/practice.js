// 管理用戶數據相關
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [
      { id: 1, name: '產品 A', type: 1 },
      { id: 2, name: '產品 B', type: 2 },
      { id: 3, name: '產品 C', type: 3 },
      { id: 4, name: '產品 D', type: 1 },
      { id: 5, name: '產品 E', type: 2 },
      { id: 6, name: '產品 F', type: 3 },
    ],
    filterType: 0,
  }),
  actions: {
    // 更新當下篩選的產品項
    setFilterType(type) {
      this.filterType = type
    }
  },
  getters: {
    // 展示對應產品
    filteredProducts(state) {
      // 展示全部產品
      if(state.filterType === 0) return state.products

      return state.products.filter(p => p.type === state.filterType)
    }
  }
})
