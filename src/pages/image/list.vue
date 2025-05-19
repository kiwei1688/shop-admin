<template>
  <!-- 圖片列表 -->
  <el-container
    class="bg-white rounded"
    :style="{height : (containerH + 'px')}"
  >
    <!-- 上方header -->
    <el-header class="image-header">
      <el-button
        type="primary"
        size="normal"
        @click="handleOpenCreate"
      >
        新增圖片分類
      </el-button>
      <!-- 上傳圖片 -->
      <el-button
        type="warning"
        size="normal"
        @click="handleOpenUpload"
      >
        上傳圖片
      </el-button>
    </el-header>
    <el-container>
      <!-- 左側: 分類列表區 -->
      <ImageAside
        ref="ImageAsideRef"
        @changeType="handleAsideChange"
      />
      <!-- 右側: 圖片展示區 -->
      <ImageMain
        ref="ImageMainRef"
      />
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from "vue"
// component
import ImageAside from "@/components/ImageManage/ImageAside.vue"
import ImageMain from "@/components/ImageManage/ImageMain.vue"

// 動態計算container整體高度
const windowHeight = window.innerHeight || document.body.clientHeight
// 高度扣除上方header高度 & 頁籤標籤高度 & padding高度
const containerH = windowHeight - 64 - 44 - 40

// 獲取ImageAside組件的dom
const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)
// 開啟側邊彈窗層(新增圖片分類)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const handleAsideChange = (image_type_id) => {
  console.log("得到當下分類的id ~~~~~", image_type_id)
  ImageMainRef.value.loadData(image_type_id)
}
// 上傳圖片 - 調用 子組件的fun - 打開上傳圖片組件
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()
</script>

<style scoped>
</style>

