<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 刷新 -->
    <div class="flex items-center justify-between mb-4">
      <el-button type="primary" size="small" @click="handleCreateNotice">新增</el-button>
      <!-- 右側 重新刷新提示 -->
      <el-tooltip
        effect="dark" 
        content="刷新數據" 
        placement="top"
      >
        <el-button text @click="getNoticeData">
          <el-icon :size="20">
            <Refresh/>
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>

    <el-table
      :data="tableData"
      border 
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="title" label="公告標題" width="180" />
      <el-table-column prop="create_time" label="發佈時間" />
      <!-- table list -->
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" text>修改</el-button>
          <!-- 刪除 -->
          <el-popconfirm 
            title="是否刪除該公告?"
            confirm-button-text="確認"
            cancel-button-text="取消"
            @confirm="handleDelete(row.id)"
          >
            <template #reference>
              <el-button 
                text 
                type="primary" 
                size="small" 
                class="px-1"
              >
                刪除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分頁 -->
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      >
      </el-pagination>
    </div>

    <!-- 新增公告--彈窗 -->
    <FormDrawer
      title="新增公告"
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
        <el-form-item label="公告標題" prop="title">
          <el-input v-model="form.title" placeholder="請輸入公告標題"></el-input>
        </el-form-item>
        <el-form-item label="公告內容" prop="content">
          <el-input v-model="form.content" placeholder="請輸入公告內容" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive } from 'vue'
// api
import {
  getNoticeList,
  createNotice
 } from "@/api/notice.js"
// components
import FormDrawer from "@/components/FormDrawer.vue"
// 提示彈窗
import { toast } from "@/utils/toast";

const loading = ref(false)
const tableData = ref([])

// 分頁
const curPage = ref(1) // 當前page
const total = ref(0) // 總筆數
const limit = ref(10) // 每頁顯示筆數

// 取得彈窗dom
const formDrawerRef = ref(null)
const formRef = ref(null)
// form 內容
const form = reactive({
  title: "",
  content: ""
})

// 驗證rules規則
const rules = {
  title: [{
    required: true,
    message: "公告標題不能為空",
    trigger: "blur"
  }],
  content: [{
    required: true,
    message: "公告內容不能為空",
    trigger: "blur"
  }]
}


// 獲取公告列表數據
const getNoticeData = async(page = null) => {
  // 有切換 傳入當下頁碼,則重新給當前頁籤碼
  if(typeof page === "number") curPage.value = page
  loading.value = true // 打開loading

  try {
    await getNoticeList(curPage.value)
    .then(res => {
      console.log("reeee", res)
      // 成功獲取數據
      if(res.msg === "ok"){
        tableData.value = res.data.list
        total.value = res.data.totalCount
      }
    }).finally(() => {
      loading.value = false // 關閉loading
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// 新增公告
const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if(!valid) return false
    formDrawerRef.value.showLoading()

    try {
      await createNotice(form)
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", "新增公告成功")
          // 刷新第一頁
          getNoticeData(1)
          formDrawerRef.value.closeDrawer()
        }
      }).finally(() => {
        // 關閉loading
        formDrawerRef.value.closeLoading()
      })
    } catch(err) {
      console.log('err ======', err)
    }
  })
}

const handleDelete = (rowId) => {
  console.log(rowId)
}
// open公告彈窗
const handleCreateNotice = () => {
  formDrawerRef.value.openDrawer()
}

getNoticeData()
</script>

<style scoped>

</style>