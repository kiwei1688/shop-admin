import { ref } from 'vue'
// api
import { 
  createGoodsSkusCard,
  updatedGoodsSkusCard,
  deleteGoodsSkusCard
 } from "@/api/goods.js"

// 商品規格--雙規格
// 商品id
export const goodsId = ref(0)
// 規格選項列表數據
export const sku_card_list = ref([])

// 初始化規格選項列表 (標題)
export function initSkuCardList(d) {
  sku_card_list.value = d.data.goodsSkusCard.map(item => {
    // 防止更新name失敗,恢復預設值
    item.newName = item.name
    item.loading = false // 更新時loading
    // 規格屬性值
    item.goodsSkusCardValue.map(v => {
      v.subNewName = v.value || "屬性值"
      return v
    })
    return item
  })
}

// 添加規格 (雙規格)
// loading
export const btnLoading = ref(false)
export async function addSkuCardEvent() {
  const data = {
    goods_id: goodsId.value, // 商品id
    name: "規格選項", // 規格名稱
    order: 50, // 排序
    type: 0, // 規格類型 0文字
  }

  btnLoading.value = true
  try {
    await createGoodsSkusCard(data)
    .then(res => {
      if(res.msg === "ok"){
        // api返回的數據只有goods_id / name / order / type
        // 上面sku_card_list Array裡面有新增三個屬性(newName, loading, goodsSkusCardValue)
        // 添加規格時,也必須手動增加給它
        sku_card_list.value.push({
          ...res,
          newName: res.name,
          loading: false,
          goodsSkusCardValue: []
        })
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// 修改商品規格名稱 (雙規格)
export async function handleUpdate(item) {
  item.loading = true
  try {
    await updatedGoodsSkusCard(item.id, {
      goods_id: item.goods_id,
      name: item.newName, // 修改後的值
      order: item.order,
      type: 0
    })
    .then(res => {
      if(res.msg === "ok"){
        // 修改成功 把name改為newName(修改後的值)
        item.name = item.newName
      }
    })
    .catch(err => {
      item.newName = item.name
    })
    .finally(() => {
      item.loading = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// 刪除商品規格 (雙規格)
export async function handleDelete(item) {
  item.loading = true
  try {
    await deleteGoodsSkusCard(item.id)
    .then(res => {
      if(res.msg === "ok"){
        const isIndex =  sku_card_list.value.findIndex(o => o.id === item.id)
        // -1表示找不到該數據
        if(isIndex !== -1) {
          sku_card_list.value.splice(isIndex, 1)
        }
      }
    })
    .finally(() => {
      item.loading = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}


// 初始化規格選項列表 (內容)
export function initSkusCardItem(id) {
  // 找出符合當筆數據id
  const skuCardValueList = sku_card_list.value.find(o => o.id === id)
  return { skuCardValueList }
}