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
            :class="{'border-2 border-blue-500': item.checked}"
          >
            <!-- 卡片圖片 :preview-src-list => 放大圖片檢視功能 -->
            <el-image 
              :src="item.url"
              fit="cover"
              :lazy="true"
              class="w-full h-[150px]"
              :preview-src-list="[item.url]"
              :initial-index="0"
            />
              <div class="image-title">{{ item.name }}</div>
              <div class="flex items-center justify-center p-2">
                <!-- 選擇圖片checkbox -->
                 <el-checkbox 
                  class="!mr-3"
                  v-model="item.checked"
                  @change="handleChooseChg(item)"
                  v-if="openChoose"
                  />
                <!-- 重新命名 -->
                <el-button 
                  type="primary"
                  size="small"
                  text
                  @click="handleEdit(item)"
                  class="reName_btn"
                >
                重新命名
                </el-button>

                <!-- 刪除 -->
                <el-popconfirm 
                title="是否刪除該圖片?"
                confirm-button-text="確認"
                cancel-button-text="取消"
                @confirm="handleDelete(item.id)"
              >
                  <template #reference>
                    <el-button 
                      type="danger" 
                      size="small" 
                      text
                      class="delete_btn"
                    >
                      刪除
                    </el-button>
                  </template>
                </el-popconfirm>
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

  <!-- 上傳圖片 組件 -->
  <el-drawer
    v-model="drawer"
    title="上傳圖片"
  >
    <UploadFile 
      :data="{ image_class_id }"
      @uploadSuccess="handleUploadSuccess"
    />
  </el-drawer>
</template>

<script setup>
import { ref, computed } from "vue"
// component 上傳圖片
import UploadFile from "@/components/imageManage/UploadFile.vue"
// 修改彈窗
import { showPrompt } from "@/utils/prompt.js"
// 提示彈窗
import { toast } from "@/utils/toast";
// api
import { 
  getImageList,
  updateImage,
  deleteImage
} from "@/api/image.js"

// 上傳圖片
const drawer = ref(false)

const openUploadFile = () => {
  drawer.value = true
}

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
        // 在imgList增加一個新屬性checked checkbox的選取狀態
        imgList.value = res.data.list.map(item => {
          item.checked = false // 預設為false
          return item
        })
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

// 重新命名圖片名稱
const handleEdit = ({ id, image_class_id, name }) => {
  // 彈出框
  showPrompt("重新命名", name)
  .then(async ({ value }) => { // 按"確認"執行then內容

    if(value) {
      try {
        loading.value = true // 打開loading
        // 更改命名
        await updateImage(id, value)
        .then(res => {
          // 成功獲取數據
          if(res.msg === "ok"){
            toast("success", "重新命名成功")
            // 重新拉取當頁數據
            loadData(image_class_id)
          }
        }).finally(() => {
          loading.value = false // 關閉loading
        })
      } catch(err) {
        console.log('err ======', err)
      }
    }

  })
}

// 刪除圖片
const handleDelete = async (imageId) => {
  if(imageId) {
    try {
      loading.value = true // 打開loading

      await deleteImage([imageId]) // 傳入id格式需為[1936]
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", "成功刪除圖片")
          // 重新拉取當頁數據
          loadData()
        }
      }).finally(() => {
        loading.value = false // 關閉loading
      })
    } catch(err) {
      console.log('err ======', err)
    }
  }
}

// 圖片選取的數量 選中的圖片
const emit = defineEmits(["chooseImg"])
const checkedImg = computed(() => imgList.value.filter(item => item.checked))
// 檢查當下只能選取一張圖片
const handleChooseChg = (item) => {
  if(item.checked && checkedImg.value.length > 1) {
    item.checked = false
    return toast("error", "只能選取一張圖片")
  }

  // 回傳選中的圖片至父層 (ChooseImage.vue)
  emit("chooseImg", checkedImg.value)
} 

// 上傳圖片成功,重新抓取數據
const handleUploadSuccess = () => getImgList(1)

// 父層傳入openChoose判斷~  管理員列表(有checkbox) - 可更新圖片 / 圖庫管理(沒有checkbox) - 不能更新圖片
defineProps({
  openChoose: {
    type: Boolean,
    default: false
  }
})

// 給父層使用
defineExpose({
  loadData,
  openUploadFile
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
  /* display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  justify-content: flex-start; */
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

.reName_btn {
  color: #844200;
  background-color: #FFE153;
  border: 1px solid #C6A300;
}
.reName_btn:hover {
  color: #fff !important;
  background-color: 	#BB5E00 !important;
}
.delete_btn {
  color: #fff;
  background-color: 	#D94600;
  border: 1px solid #C6A300;
}
.delete_btn:hover {
  color: #fff !important;
  background-color: 	#000 !important;
}
</style>