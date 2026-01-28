<template>
  <!-- dertroy-on-close: 關閉彈窗銷毀子組件 -->
  <FormDrawer
    ref="formDrawerRef" 
    title="設置商品詳情" 
    @submit="submit" 
    dertroy-on-close
  >
    <el-form :model="form">
      <el-form-item>
        <Editor v-model="form.content"/>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>

<script setup> 
import { ref, reactive } from "vue"
import ChooseImage from "@/components/ChooseImage.vue"
import FormDrawer from "@/components/FormDrawer.vue"
// api
import { readGoods, updateGoods } from "@/api/goods"
import { toast } from "@/utils/toast"
// 文字編輯器 tinyMCE
import Editor from "@/components/Editor.vue"

const formDrawerRef = ref(null)
const goodsId = ref(0)
const form = reactive({
  content: ""
})
const loading = ref(false)
const emit = defineEmits(["reloadData"])

// 打開輪撥圖彈框 (設置商品輪撥圖)
const open = async (row) => {
  goodsId.value = row.id
  row.contentLoading = true
  try {
    // 接受父層傳入的api方法獲取數據
    await readGoods(goodsId.value)
    .then(res => {
      if(res.msg === "ok"){
        form.content = res.data.content
        formDrawerRef.value.openDrawer()
      }
    }).finally(() => {
      row.contentLoading = false
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
    await updateGoods(goodsId.value, form)
    .then(res => {
      if(res.msg === "ok"){
        toast("success", "商品詳情設置成功!!")
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