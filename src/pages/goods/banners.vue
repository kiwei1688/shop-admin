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
        <ChooseImage v-model="form.banners"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
</el-drawer>
</template>

<script setup> 
import { ref, reactive } from "vue"
import ChooseImage from "@/components/ChooseImage.vue"
// api
import { readGoods } from "@/api/goods"

const dialogVisible = ref(false)
const goodsId = ref(0)
const form = reactive({
  banners: []
})

// 設置商品輪撥圖api
const handleGoodsBanners = async (goodsId) => {
  try {
    // 接受父層傳入的api方法獲取數據
    await readGoods(goodsId)
    .then(res => {
      if(res.msg === "ok"){
        form.banners = res.data.goodsBanner.map(item => item.url)
        dialogVisible.value = true
      }
    }).finally(() => {
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// 打開輪撥圖彈框
const open = (row) => {
  goodsId.value = row.id
  handleGoodsBanners(goodsId.value)
  
}
// 提交
const submit = () => {

}
// 導出給外部使用
defineExpose({
  open
})
</script>