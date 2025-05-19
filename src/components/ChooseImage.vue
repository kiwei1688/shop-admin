<template>
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25"><Plus/></el-icon>
  </div>
  <!-- 彈窗 -->
  <el-dialog
    title="選擇圖片"
    v-model="showDialog"
    width="80%"
    top="5vh"
  >
    <!-- 圖片列表 -->
    <el-container
      class="bg-white rounded"
      style="height: 70vh"
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
          @chooseImg="handleChooseImg"
        />
      </el-container>
    </el-container>

    <!-- 底部按鈕 -->
    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue"
// component
import ImageAside from "@/components/ImageManage/ImageAside.vue"
import ImageMain from "@/components/ImageManage/ImageMain.vue"

const showDialog = ref(false)
// 獲取ImageAside組件的dom
const ImageAsideRef = ref(null)
const ImageMainRef = ref(null)
// ImageMain子組件選中的圖片
const urls = []

const open = () => {
  showDialog.value = true
}

// 開啟側邊彈窗層(新增圖片分類)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

const handleAsideChange = (image_type_id) => {
  // console.log("得到當下分類的id ~~~~~", image_type_id)
  ImageMainRef.value.loadData(image_type_id)
}
// 上傳圖片 - 調用 子組件的fun - 打開上傳圖片組件
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()

// ImageMain子組件選中的圖片
const handleChooseImg = (checkedImg) => {
  console.log(checkedImg)
  urls = checkedImg.map(item => item.url)
}

// 提交
const submit = () => {
  console.log("SSSSSS")
}
</script>

<style scoped>
  .choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center
    cursor-pointer hover:(bg-gray-100);
  }
</style>