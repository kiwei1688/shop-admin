<template>
  <!-- 左側: 選項區 -->
  <el-aside width="200px" class="image-aside" v-loading = loading>
    <div class="top">
      <!-- Left list -->
      <AsideList
        :active="activeId === item.id"
        v-for="(item, index) in imgList"
        :key="index"
      >
        {{ item.name }}
      </AsideList>
    </div>
    <div class="bottom">
      <!-- @current-change 切換時觸發 並傳送下一頁頁碼 -->
      <el-pagination 
        background 
        layout="prev, next" 
        :total="total"
        :current-page="curPage"
        :page-size="limit"
        @current-change="getImgData"
      />
    </div>
  </el-aside>
</template>

<script setup>
import { ref } from "vue"
import AsideList from "@/components/ImageManage/AsideList.vue"
// api
import { getImageClassList } from "@/api/image_class.js"

const loading = ref(false)
const activeId = ref(0) // 判斷選中id
const imgList = ref([]) // img 的數據

// 分頁
const curPage = ref(1) // 當前page
const total = ref(0) // 總筆數
const limit = ref(10) // 每頁顯示筆數

// 獲取圖庫數據
const getImgData = async (page = null) => {
  // 有切換next 重新給當前頁籤碼
  if(typeof page === "number") curPage.value = page

  try {
      loading.value = true

      await getImageClassList(curPage.value)
      .then(res => {
        total.value = res.data.totalCount

        if(res.msg === "ok"){
          imgList.value = res.data.list

          // 載入默認選中第一個item
          let item = imgList.value[0]
          if(item) activeId.value = item.id
        }
      }).finally(() => {
        loading.value = false
      })
  
    } catch(err) {
      console.log('err ======', err)
    }
  }

  getImgData()
</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.image-aside .top{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom{
  height: 50px;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  @apply flex items-center justify-center;
}
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover,
.aside-list.active {
  @apply bg-blue-100;
}
</style>