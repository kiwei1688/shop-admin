<template>
  <!-- dertroy-on-close: 關閉彈窗銷毀子組件 -->
  <el-drawer
    title="設置輪撥圖"
    v-model="dialogVisible"
    size="50%"
    dertroy-on-close
  >
    <el-form
      :model="form"
      label-width="80px"
    >
      <el-form-item label="輪撥圖">
        <ChooseImage :limit="9" v-model="form.banners"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
      </el-form-item>
    </el-form>
</el-drawer>
</template>

<script setup> 
import { ref, reactive } from "vue"
import ChooseImage from "@/components/ChooseImage.vue"
// api
import { readGoods, setGoodsBanner } from "@/api/goods"
import { toast } from "@/utils/toast"

const dialogVisible = ref(false)
const goodsId = ref(0)
const form = reactive({
  banners: []
})
const loading = ref(false)
const emit = defineEmits(["reloadData"])

// 打開輪撥圖彈框 (設置商品輪撥圖)
const open = async (row) => {
  goodsId.value = row.id
  row.bannersLoading = true
  try {
    // 接受父層傳入的api方法獲取數據
    await readGoods(goodsId.value)
    .then(res => {
      if(res.msg === "ok"){
        form.banners = res.data.goodsBanner.map(item => item.url)
        dialogVisible.value = true
      }
    }).finally(() => {
      row.bannersLoading = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}
// 提交
const submit = async () => {
  loading.value = true
  try {
    // 設置商品輪撥圖
    await setGoodsBanner(goodsId.value, form)
    .then(res => {
      if(res.msg === "ok"){
        toast("success", "商品輪撥圖設置成功!!")
        dialogVisible.value = false
        // 設置成功後,reload頁面
        emit("reloadData")
      }
    }).finally(() => {
      loading.value = false
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