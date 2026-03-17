<template>
  <!-- dertroy-on-close: 關閉彈窗銷毀子組件 -->
  <FormDrawer
    ref="formDrawerRef"
    title="設置商品規格"
    @submit="submit" 
    dertroy-on-close
    size="60%"
  >
    <el-form :model="form">
      <el-form-item label="規格類型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0">單規格</el-radio>
          <el-radio :label="1">雙規格</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 單規格 form.sku_type = 0 -->
      <template v-if="form.sku_type === 0">
        <el-form-item label="市場價格">
          <el-input v-model="form.sku_value.oprice" style="width:35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="預設價格">
          <el-input v-model="form.sku_value.pprice" style="width:35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本價格">
          <el-input v-model="form.sku_value.cprice" style="width:35%">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input v-model="form.sku_value.weight" style="width:35%">
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品體積">
          <el-input v-model="form.sku_value.volume" style="width:35%">
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <!-- 多規格 form.sku_type = 1 -->
      <template v-else>
        <SkuCard/>
      </template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import FormDrawer from "@/components/FormDrawer.vue"
// api
import { readGoods, updateGoodsSkus } from "@/api/goods"
import { toast } from "@/utils/toast"
// 文字編輯器 tinyMCE
import Editor from "@/components/Editor.vue"
// 商品多規格
import SkuCard from "./components/skuCard.vue"

const formDrawerRef = ref(null)
const goodsId = ref(0)

const form = reactive({
  sky_type: 0, // 0 單規格 / 1 雙規格
  "sku_value": {
    "oprice": 0, // 市場價格
    "pprice": 0, // 預設價格
    "cprice": 0, // 成本價格
    "weight": 0, // 商品重量
    "volume": 0, // 商品體積
  }
})
const loading = ref(false)
const emit = defineEmits(["reloadData"])

// 打開輪撥圖彈框 (設置商品輪撥圖)
const open = async (row) => {
  goodsId.value = row.id
  row.skusLoading = true
  try {
    // 接受父層傳入的api方法獲取數據
    await readGoods(goodsId.value)
    .then(res => {
      if(res.msg === "ok"){
        form.sku_type = res.data.sku_type
        form.sku_value = res.data.sku_value || {
          "oprice": 0,
          "pprice": 0,
          "cprice": 0,
          "weight": 0,
          "volume": 0,
        }
        formDrawerRef.value.openDrawer()
      }
    }).finally(() => {
      row.skusLoading = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}
// 提交
const submit = async () => {
  formDrawerRef.value.showLoading()
  try {
    // 設置商品輪撥圖
    await updateGoodsSkus(goodsId.value, form)
    .then(res => {
      if(res.msg === "ok"){
        toast("success", "商品規格設置成功!!")
        formDrawerRef.value.closeDrawer()
        // 設置成功後,reload頁面
        emit("reloadData")
      }
    }).finally(() => {
      formDrawerRef.value.closeLoading()
    })
  } catch(err) {
    console.log('err ======', err)
  }
}
// 導出給外部使用
defineExpose({
  open
})
</script>