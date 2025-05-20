<template>
  <!-- avatar頭像 已選 -->
  <div v-if="modelValue">
    <el-image :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded mr-2 border"></el-image>
  </div>
  <!-- avatar頭像 修改 -->
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25">
      <Plus/>
    </el-icon>
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
          openChoose
          ref="ImageMainRef"
          @chooseImg="handleChooseImg"
        />
      </el-container>
    </el-container>

    <!-- 底部按鈕 -->
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">確定</el-button>
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

// 開啟/關閉 圖片組件
const open = () => showDialog.value = true
const close = () => showDialog.value = false

// 開啟側邊彈窗層(新增圖片分類)
const handleOpenCreate = () => ImageAsideRef.value.handleCreate()

// 得到當下分類的id
const handleAsideChange = (image_type_id) => {
  ImageMainRef.value.loadData(image_type_id)
}
// 上傳圖片 - 調用 子組件的fun - 打開上傳圖片組件
const handleOpenUpload = () => ImageMainRef.value.openUploadFile()

// 接收父層數據
const props = defineProps({
  modelValue: [
    String, Array
  ]
})

// 回傳給父層
// "update:modelValue" 可動態讓父層<ChooseImage v-model="form.avatar"/> 的v-model獲取modelValue的數據
const emit = defineEmits(["update:modelValue"])

// ImageMain子組件選中的圖片
let urls = []
// ImageMain子組件選中的圖片
const handleChooseImg = (checkedImg) => {
  urls = checkedImg.map(item => item.url)
}

// 確定
const submit = () => {
  // 回傳給父層<ChooseImage v-model="form.avatar"/>
  if(urls.length) {
    emit("update:modelValue", urls[0])
  }
  close()
}
</script>

<style scoped>
  .choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center
    cursor-pointer hover:(bg-gray-100);
  }
</style>