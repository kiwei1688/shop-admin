<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 刷新 -->
    <ListHeader @handleCreate="handleCreateNotice" @refresh="getNoticeData"/>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="title" label="公告標題" width="180" style="color: red;" />
      <el-table-column prop="create_time" label="發佈時間" />
      <!-- table list -->
      <el-table-column label="操作" width="180" align="center">
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
            title="是否刪除該公告?"
            confirm-button-text="確認"
            cancel-button-text="取消"
            @confirm="handleDeleteNotice(row.id)"
          >
            <template #reference>
              <el-button 
                type="danger"
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
import {
  getNoticeList,
  createNotice,
  updatedNotice,
  deleteNotice
 } from "@/api/notice.js"
 // 共用表格功能組件
import { useInitTable } from "@/utils/useCommon.js"

// components
import FormDrawer from "@/components/FormDrawer.vue"
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新

// 提示彈窗
import { toast } from "@/utils/toast";

// 表格 & 分頁 & 搜索 組件 (共用)
// loading / 分頁
const {
  tableData,
  loading,
  curPage,
  total,
  limit,
  getData
} = useInitTable({
  getList: getNoticeList
})

const editId = ref(0) // 0 > 新增 / 當前id > 修改
const isTitle = computed(() => editId.value ? "修改公告" : "新增公告")

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