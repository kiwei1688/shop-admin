<template>
  <!-- 右側: 圖片區 -->
  <el-main class="image-main" v-loading="loading">
    <div class="top">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item, index) in imgList" :key="index">
          <el-card 
            shadow="hover" 
            class="relative mb-3"
            :body-style="{'padding':'8px'}"
          >
            <el-image 
              :src="item.url"
              fit="cover"
              :lazy="true"
              class="w-full h-[150px]"
            ></el-image>
              <div class="image-title">{{ item.name }}</div>
              <div class="flex items-center justify-center p-2">
                <el-button type="primary" size="small" text>重新命名</el-button>
                <el-button type="danger" size="small" text>刪除</el-button>
              </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 分頁 -->
    <div class="bottom">
      <!-- @current-change 切換時觸發 並傳送下一頁頁碼 -->
      <el-pagination 
        background 
        layout="prev, pager, next"
        :total="total"
        :current-page="curPage"
        :page-size="limit"
        @current-change="getImgList"
      />
    </div>
  </el-main>
</template>

<script setup>
import { ref, reactive } from "vue"
// api
import { 
  getImageList
} from "@/api/image.js"

// 分頁
const curPage = ref(1) // 當前page
const total = ref(0) // 總筆數
const limit = ref(10) // 每頁顯示筆數

const loading = ref(false)
const imgList = ref([]) // img 的數據
// 分類id
const image_class_id = ref(0)

// 獲取指定分類圖片
const getImgList = async (page = null) => {
  // 有切換 傳入當下頁碼,則重新給當前頁籤碼
  if(typeof page === "number") curPage.value = page

  try {
    loading.value = true // 打開loading

    await getImageList(image_class_id.value, curPage.value)
    .then(res => {
      total.value = res.data.totalCount

      // 成功獲取數據
      if(res.msg === "ok"){
        imgList.value = res.data.list
      }
    }).finally(() => {
      loading.value = false // 關閉loading
    })

  } catch(err) {
    console.log('err ======', err)
  }
}

// 根據分類id重新加載右側圖片的列表 (給左側imageAside分類的組件調用)
const loadData = (image_type_id) => {
  // 頁碼init為第一頁
  curPage.value = 1
  image_class_id.value = image_type_id
  // 獲取圖片列表數據
  getImgList()
  console.log("得到對應圖片列表 ======", imgList.value)
}

// 給父層使用
defineExpose({
  loadData
})

</script>

<style scoped>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  padding: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start;
}
.image-main .top .outer-box{
  width: 150px;
  height: 130px;
  border: 1px solid red;
}
.image-main .bottom {
  height: 50px;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  border-top: 1px solid #eee;
  @apply flex items-center justify-center;
}

.image-title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  @apply text-sm truncate text-gray-100 bg-opacity-50 bg-gray-800 p-2;
}
</style>