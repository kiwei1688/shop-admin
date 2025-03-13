<template>
  <!-- 拖拽上傳圖片 => 影片6 13
   action 接受一個api path_使用代理"/api/"前綴
   :headers 攜帶token請求api
   :on-success 上傳成功
   :on-error 上傳失敗
   :data 從父層傳入image_class_id
  -->
  <el-upload
    drag
    :action="uploadApi"
    multiple
    :headers="{
      token
    }"
    name="img"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload">
      <upload-filled />
    </el-icon>
    <div class="el-upload__text">
      把圖檔拖曳至此 <em>點擊上傳圖片</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        圖片檔案不能大於500kb,格式須為jpg&png
      </div>
    </template>
  </el-upload>
</template>

<script setup>
// 上傳圖片 api
import { uploadApi } from "@/api/image.js"
// 取得token
import { getToken } from "@/utils/auth.js"
// tips
import { toast } from '@/utils/toast'

const token = getToken()

// 接收父層傳入的數據
defineProps({
  data: Object
})

// 回傳給父層
const emit = defineEmits(["uploadSuccess"])

// 上傳成功
const uploadSuccess = (response, uploadFile, uploadFiles) => {
  emit("uploadSuccess", {
    response, uploadFile, uploadFiles
  })
}

// 上傳失敗
const uploadError = (error, uploadFile, uploadFiles) => {
  let ErrMsg = JSON.parse(error.message).msg || "上傳失敗"

  toast("error", ErrMsg)
}
</script>

<style scoped>

</style>