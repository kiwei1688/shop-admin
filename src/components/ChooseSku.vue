<template>
  <!-- 彈窗 -->
  <el-dialog
    title="規格選擇"
    v-model="dialogVisible"
    width="80%"
    top="5vh"
  >
    <!-- 主要內容區塊 -->
    <el-container style="height:65vh;">
      <el-aside width="220px;" class="image-aside">
        <div class="top">
          {{ tableData }}
        </div>
        <!-- 分頁 -->
        <div class="bottom">
          <!-- @current-change 切換時觸發 並傳送下一頁頁碼 -->
          <el-pagination
            background 
            layout="prev, next" 
            :total="total"
            :current-page="curPage"
            :page-size="limit"
            @current-change="getData"
          />
        </div>
      </el-aside>
      <el-main>
        主要內容
      </el-main>
    </el-container>
    <!-- 底部按鈕 -->
    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">確定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue"
// api
import { getSkusList } from "@/api/skus"
// get表格數據方法
import { useInitTable } from "@/utils/useCommon.js"
// 獲取aside列表數據
const {
  loading,
  curPage,
  limit,
  total,
  tableData, // 列表數據
  getData
} = useInitTable({
  getList: getSkusList
})

const dialogVisible = ref(false)

// 開啟彈窗
const open = async () => {
  // 獲取page1 數據
  await getData(1)
  dialogVisible.value = true
}
// 確定 送出
const submit = () => {
  
}

defineExpose({
  open
})
</script>

<style scoped>

</style>