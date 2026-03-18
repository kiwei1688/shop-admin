import { ref } from 'vue'

// 商品id
export const goodsId = ref(0)
// 規格選項列表數據
export const sku_card_list = ref([])

// 初始化規格選項列表 (標題)
export function initSkuCardList(d) {
  sku_card_list.value = d.data.goodsSkusCard.map(item => {
    // 防止更新name失敗,恢復預設值
    item.newName = item.name
    item.logading = false // 更新時loading
    // 規格屬性值
    item.goodsSkusCardValue.map(v => {
      v.subNewName = v.value || "屬性值"
      return v
    })
    return item
  })
}

// 初始化規格選項列表 (內容)
export function initSkusCardItem(id) {
  // 找出符合當筆數據id
  const skuCardValueList = sku_card_list.value.find(o => o.id === id)
  return { skuCardValueList }
}