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
  
  <!-- 側邊 彈窗 -->
  <form-drawer
    title="新增"
    ref="formDrawerRef"
    @submit="handleSubmit"
    destroyOnClose
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <!-- 子組件slot顯示 -->
      <el-form-item label="分類名稱" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input v-model="form.order"></el-input>
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
// components
import FormDrawer from "@/components/FormDrawer.vue"
import AsideList from "@/components/ImageManage/AsideList.vue"
// 提示彈窗
import { toast } from "@/utils/toast";
// api
import { 
  getImageClassList,
  createImageClass
 } from "@/api/image_class.js"

const loading = ref(false)
const activeId = ref(0) // 判斷選中id
const imgList = ref([]) // img 的數據

// 分頁
const curPage = ref(1) // 當前page
const total = ref(0) // 總筆數
const limit = ref(10) // 每頁顯示筆數

const formDrawerRef = ref(null) // 獲取彈窗組件dom
const formRef = ref(null)

// 打開側邊彈窗 (執行FormDrawer組件的openDrawer()~)
const handleCreate = () => formDrawerRef.value.openDrawer()

// 定義form內容
const form = reactive({
  name: "",
  order: 50
})

// 驗證form規則
const rules = {
  name: [{
    required: true,
    message: "圖庫名稱不能為空",
    trigger: "blur"
  }]
}

// 執行提交
const handleSubmit = () => {
  // 驗證表單
  formRef.value.validate(async (valid) => {
    if(!valid) return false
    
    // 通過驗證
    try{
      await createImageClass(form)
      .then(res => {
        formDrawerRef.value.showLoading()
        if(res.msg === "ok") {
          toast("success", "新增圖庫分類成功")
          // 重新拉圖庫分類數據
          getImgData(1)
          form.name = ""
          // 關閉彈窗
          formDrawerRef.value.closeDrawer()
        }
      })
      .finally(() => {
        formDrawerRef.value.closeLoading()
      })
    } catch (err) {
      console.log("catch err !!!!!", err)
    }
  })
}

// 獲取圖庫數據
const getImgData = async (page = null) => {
  // 有切換 傳入當下頁碼,則重新給當前頁籤碼
  if(typeof page === "number") curPage.value = page

  try {
      loading.value = true // 打開loading

      await getImageClassList(curPage.value)
      .then(res => {
        total.value = res.data.totalCount
        // 成功獲取數據
        if(res.msg === "ok"){
          imgList.value = res.data.list

          // 載入默認選中第一個item
          let item = imgList.value[0]
          if(item) activeId.value = item.id
        }
      }).finally(() => {
        loading.value = false // 關閉loading
      })
  
    } catch(err) {
      console.log('err ======', err)
    }
  }

getImgData()

// 給外部OR父層使用
defineExpose({
  handleCreate
})
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