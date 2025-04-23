<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 刷新 -->
    <div class="flex items-center justify-between mb-4">
      <el-button 
        type="primary" 
        @click="handleCreateNotice"
      >
        新增
      </el-button>
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

    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column label="管理員" width="300">
        <template #default="{ row }">
          <div class="flex items-star">
            <el-avatar
              :size="60" 
              :src="row.avatar"
            >
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
            <div class="ml-3">
              <h6>{{ row.name }}</h6>
              <small>ID: {{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所屬管理員" align="center">
        <template #default="{ row }">
          {{ row.role?.name || "--" }}
        </template>
      </el-table-column>

      <el-table-column label="狀態" width="150" align="center">
        <template #default="{ row }">
          <el-switch :model-value="row.status" :active-value="1" inactive-value="0"></el-switch>
        </template>
      </el-table-column>
      <!-- table list -->
      <el-table-column label="操作" width="250" align="center">
        <template #default="{ row }">
          <!-- 修改 -->
          <el-button 
            type="primary"
            @click="handleUpdatedNotice(row)"
          >
            修改
          </el-button>
          <!-- 刪除 -->
          <el-popconfirm 
            title="是否刪除該管理員?"
            confirm-button-text="確認"
            cancel-button-text="取消"
            @confirm="handleDeleteNotice(row.id)"
          >
            <template #reference>
              <el-button type="danger">
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

    <!-- 新增 / 修改 公告--彈窗 -->
    <FormDrawer
      :title="isTitle"
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
import { ref, reactive, computed } from 'vue'
// api
// import {
//   getNoticeList,
//   createNotice,
//   updatedNotice,
//   deleteNotice
//  } from "@/api/notice.js"
import {
  getManagerList
 } from "@/api/user.js"
// components
import FormDrawer from "@/components/FormDrawer.vue"
// 提示彈窗
import { toast } from "@/utils/toast";

const loading = ref(false)
const editId = ref(0) // 0 > 新增 / 當前id > 修改
const isTitle = computed(() => editId.value ? "修改公告" : "新增公告")
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
    await getManagerList(curPage.value, {
      limit: 10,
      keyword: ""
    })
    .then(res => {
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
      // 修改公告 / 新增公告
      await (editId.value ? updatedNotice(editId.value, form) : createNotice(form) )
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", `${isTitle.value}成功`)
          // 修改刷新當前page / 新增 刷新第一頁
          getNoticeData(editId.value ? false : 1)
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

// 刪除公告
const handleDeleteNotice = async (id) => {
  loading.value = true

  try {
    await deleteNotice(id)
    .then(res => {
      // 成功獲取數據
      if(res.msg === "ok"){
        toast("success", "刪除公告成功")
        // 重新獲取數據
        getNoticeData()
      }
    }).finally(() => {
      // 關閉loading
      loading.value = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// 重置表單
function resetForm(row = false) {
  // 能拿到表單dom 先清除表單驗證狀態
  if(formRef.value) formRef.value.clearValidate()

  if(row) {
    // 遍歷 把當前row數據更新form表單數據
    for(const key in form) {
      form[key] = row[key]
    }
  }
}

// 修改公告
const handleUpdatedNotice = async (row) => {
  editId.value = row.id // 等於當前修改id
  resetForm(row)
  formDrawerRef.value.openDrawer()

}

// 新增公告彈窗
const handleCreateNotice = () => {
  editId.value = 0 // 新增公告
  resetForm({
    title: "",
    content: ""
  })
  formDrawerRef.value.openDrawer()
}

getNoticeData()
</script>

<style scoped>

</style>