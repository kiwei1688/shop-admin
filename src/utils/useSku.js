import { ref, nextTick } from 'vue'
// api
import { 
  createGoodsSkusCard,
  updatedGoodsSkusCard,
  deleteGoodsSkusCard,
  sortGoodsSkusCard,
  createGoodsSkusCardValue
} from "@/api/goods.js"
// common方法
import { useArrayMoveUp, useArrayMoveDown } from "@/utils/common.js"

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
          newName: res.data.name,
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
  // const newItem = rebuildData(item)
  // newItem.newName = item.newName
  
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

// 排序商品規格選項(上移&下移)
export const bodyLoading = ref(false)
export async function sortCard(action, index) {
  // 淺拷貝數據
  let newSkuList = JSON.parse(JSON.stringify(sku_card_list.value))
  // 判斷執行上移or下移
  let actionFun = action === "cardUp" ? useArrayMoveUp : useArrayMoveDown
  actionFun(newSkuList, index)
  // 重新整理newSkuList
  let sortData = newSkuList.map((item, index) => {
    return {
      id: item.id,
      order: index + 1 // 索引從0開始
    }
  })
  bodyLoading.value = true
  try {
    await sortGoodsSkusCard({ sortdata : sortData })
    .then(res => {
      if(res.msg === "ok"){
        // 再次執行並更新sku_card_list數組,非拷貝數組
        actionFun(sku_card_list.value, index)
      }
    })
    .finally(() => {
      bodyLoading.value = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// skuCardValueList的數據 ==========
// goodsSkusCardValue:[  
//   {goods_skus_card_id: 2004
//   id: 5653
//   name: "内存"
//   order: 50
//   subNewName: "32g"
//   value: "32g"}......
// ]
// goods_id: 542
// id: 2004
// loading: false
// name: "内存"
// newName: "内存"
// order: 50
// type: 0

// 初始化規格選項列表 (內容)
export function initSkusCardItem(id) {
  // 找出當筆數據
  const skuCardValueList = sku_card_list.value.find(o => o.id === id)

  const inputValue = ref('')
  const dynamicTags = ref(['Tag 1', 'Tag 2', 'Tag 3'])
  const inputVisible = ref(false)
  const InputRef = ref()

  // 刪除該標籤
  const handleClose = (tag) => {
    dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  }

  const showInput = () => {
    inputVisible.value = true
    nextTick(() => {
      InputRef.value.input.focus()
    })
  }
  // 創建商品規格細項
  const createCardLoading = ref(false)
  const handleInputConfirm = async () => {
    if (!inputValue.value) {
      inputVisible.value = false
      return
    }
    createCardLoading.value = true
    try {
      await createGoodsSkusCardValue({
        goods_skus_card_id: id,
        name: skuCardValueList.name,
        order: 50,
        value: inputValue.value
      })
      .then(res => {
        if(res.msg === "ok"){
          skuCardValueList.goodsSkusCardValue.push({
            ...res.data,
            subNewName: res.data.value // 新增一筆text數據,為了不修改原值,修改失敗則不更動原值
          })
        }
      })
      .finally(() => { // 成功或失敗都會調用
        inputVisible.value = false
        inputValue.value = ''
        createCardLoading.value = false
      })
    } catch(err) {
      console.log('err ======', err)
    }
  }

  return { 
    skuCardValueList,
    inputValue,
    inputVisible,
    InputRef,
    handleClose,
    showInput,
    handleInputConfirm,
    createCardLoading
  }
}