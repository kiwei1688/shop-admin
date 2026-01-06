<template>
  <!-- avatar頭像 已選 -->
  <div v-if="modelValue">
    <!-- modelValue: 傳入單一圖檔url -->
    <el-image v-if="typeof modelValue === 'string'" :src="modelValue" fit="cover" class="w-[100px] h-[100px] rounded mr-2 border"></el-image>
    <!-- modelValue: 商品管理(設置輪播圖) 傳入Array格式,多張圖檔url -->
    <div v-else class="flex flex-wrap">
      <div 
        class="relative h-[100px] w-[100px] rounded border mr-2 mb-2"
        v-for="(url,index) in modelValue" :key="index"
      >
        <!-- 移除圖片 -->
        <el-icon
          class="absolute right-[5px] top-[5px] cursor-pointer"
          style="z-index: 10;"
          @click="removeImage(url)"
        >
          <CircleClose style="color: red; font-weight: bold;"/>
        </el-icon>
        <el-image
          :src="url"
          fit="cover"
          class="w-[100px] h-[100px] rounded border mr-2"
        ></el-image>
      </div>
    </div>
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
          :limit="limit"
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
import { toast } from "@/utils/toast"

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
  ],
  limit: { // 選取圖片總數的限制
    type: Number,
    default: 1
  }
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

// 移除圖片 (篩選掉不要的圖片url)
const removeImage = (url) => {
  const allImg = props.modelValue.filter(item => item !== url)
  emit("update:modelValue", allImg) // 重新更新父層數據
}
// 確定 送出
const submit = () => {
  // 回傳給父層<ChooseImage v-model="form.avatar"/>
  let value = []
  if(props.limit === 1) { // 只能選一張
    value = urls[0]
  } else { // banner輪撥圖選多張
    value = [...props.modelValue, ...urls]
    // 選中的圖片數量 > 限制的圖片數量
    if(value.length > props.limit) {
      return toast("error","最多還能選擇"+(props.limit - props.modelValue.length)+"張")
    }
  }

  if(value) emit("update:modelValue", value)
  close()
}
</script>

<style scoped>
  .choose-image-btn {
    @apply w-[100px] h-[100px] rounded border flex justify-center items-center
    cursor-pointer hover:(bg-gray-100);
  }
</style>