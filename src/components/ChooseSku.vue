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
      <!-- 左側選項 -->
      <el-aside 
        width="220px;" 
        class="image-aside"
      >
        <div class="top">
          <div class="sku-list" 
            v-for="(item, index) in tableData" 
            :key="index"
            :class="{'active': (activeId === item.id)}"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
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
      <!-- 右側 -->
      <el-main>
        <el-checkbox-group v-model="form.list">
          <!-- vue3.0 捨棄:label用法,改用:value="item" 解決單選bug問題 -->
          <el-checkbox
            v-for="item in list" :key="item" :value="item"
            border
          >
            {{ item }}
          </el-checkbox>
        </el-checkbox-group>
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
import { reactive, ref } from "vue"
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
  getList: getSkusList,
  onGetListSuccess: (res) => {
    tableData.value = res.data.list // 列表數據
    total.value = res.data.totalCount // 總數
    // 切換預設選中第一個數據
    if(tableData.value.lenght) handleChangeActiveId(tableData.value[0].id)
  }
})

const dialogVisible = ref(false)
// 左側當前選中id
const activeId = ref(0)
// 左側數據(存tableData的default數據)
const list = ref([])
// 右側選中的值
const form = reactive({
  list: []
})

// 開啟彈窗
const open = async () => {
  // 獲取第一頁 數據
  await getData(1)
  dialogVisible.value = true
}
// 左側規格選擇
// 右側主要內容的數據要渲染tableData的default數據
function handleChangeActiveId(id) {
  activeId.value = id
  list.value = []
  // 找出當下link的該筆數據
  let mainItem = tableData.value.find(item => item.id === id)
  if(mainItem) {
    // 將default字串用,分割成array
    list.value = mainItem.default.split(",")
  }
}
// 確定 送出
const submit = () => {
  
}

defineExpose({
  open
})
</script>

<style scoped>
.sku-list {
  border-bottom: 1px solid #ddd;
  @apply p-3 text-sm text-gray-600 flex items-center cursor-pointer;
}
.sku-list:hover,
.sku-list.active {
  @apply bg-blue-100;
}
</style>