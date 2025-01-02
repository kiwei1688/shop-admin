<template>
  <!-- <div>圖片列表</div> -->
  <el-container
    class="bg-white rounded"
    :style="{height : (containerH + 'px')}"
  >
      <el-header class="image-header">
        Header
      </el-header>
      <el-container>
        <!-- 左側: 選項區 -->
        <ImageAside/>
        <!-- 右側: 圖片區 -->
        <ImageMain/>
      </el-container>
    </el-container>
</template>

<script setup>
// component
import ImageAside from "@/components/ImageManage/ImageAside.vue"
import ImageMain from "@/components/ImageManage/ImageMain.vue"

// 動態計算container整體高度
const windowHeight = window.innerHeight || document.body.clientHeight
// 高度扣除上方header高度 & 頁籤標籤高度 & padding高度
const containerH = windowHeight - 64 - 44 - 40
</script>

<style scoped>
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>