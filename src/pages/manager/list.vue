<template>
  <el-card shadow="never" class="border-0">
    <!-- 搜索 / 重置 -->
    <el-form 
      :model="searchForm"
      label-width="80px"
      class="mb-3"
    >
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="關鍵詞">
            <el-input 
              v-model="searchForm.keyword"
              placeholder="管理員暱稱"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- :offset 往右偏移8列 -->
        <el-col :span="8" :offset="8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button type="info" @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

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
        <el-button text @click="getData">
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
              <h6>{{ row.username }}</h6>
              <small>ID: {{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所屬角色" align="center">
        <template #default="{ row }">
          {{ row.role?.name || "--" }}
        </template>
      </el-table-column>

      <el-table-column label="狀態" width="150" align="center">
        <template #default="{ row }">
          <!-- $event:當下status的值 -->
          <el-switch 
            :model-value="row.status" 
            :active-value="1" 
            inactive-value="0"
            @change="handleStatusChg($event, row)"
          ></el-switch>
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
            @confirm="handleDeleteManager(row.id)"
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
        <el-form-item label="用戶名" prop="username">
          <el-input v-model="form.username" placeholder="請輸入用戶名"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="password">
          <el-input v-model="form.password" placeholder="請輸入密碼"></el-input>
        </el-form-item>
        <!-- 頭像 avatar -->
        <el-form-item label="頭像" prop="avatar">
          <ChooseImage v-model="form.avatar"/>
        </el-form-item>
        <el-form-item label="所屬角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="選擇所屬角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-switch 
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
// api
import {
  getManagerList,
  updateManagerStatus,
  createManager,
  updateManager,
  deleteManager
 } from "@/api/user.js"
// components
import FormDrawer from "@/components/FormDrawer.vue"
import ChooseImage from "@/components/ChooseImage.vue"
// 提示彈窗
import { toast } from "@/utils/toast";

const searchForm = reactive({
  keyword: ""
})

const loading = ref(false)
const editId = ref(0) // 0 > 新增 / 當前id > 修改
const isTitle = computed(() => editId.value ? "修改管理員" : "新增管理員")
const tableData = ref([])

// 分頁
const curPage = ref(1) // 當前page
const total = ref(0) // 總筆數
const limit = ref(10) // 每頁顯示筆數

// 角色
const roles = ref([])

// 取得彈窗dom
const formDrawerRef = ref(null)
const formRef = ref(null)
// form 內容
const form = reactive({
  username: "",
  password: "",
  role_id: null,
  status: 1,
  avatar: ""
})

// 驗證rules規則
const rules = {
  username: [{
    required: true,
    message: "用戶名不能為空",
    trigger: "blur"
  }],
  password: [{
    required: true,
    message: "密碼不能為空",
    trigger: "blur"
  }],
  role_id: [{
    required: true,
    message: "role不能為空",
    trigger: "blur"
  }],
  status: [{
    required: true,
    message: "狀態不能為空",
    trigger: "blur" 
  }],
  avatar: [{
    required: false,
    message: "頭像不能為空",
    trigger: "blur"
  }]
}

// 獲取管理員列表數據
const getData = async(page = null) => {
  // 有切換 傳入當下頁碼,則重新給當前頁籤碼
  if(typeof page === "number") curPage.value = page
  loading.value = true // 打開loading

  try {
    await getManagerList(curPage.value, searchForm)
    .then(res => {
      // 成功獲取數據
      if(res.msg === "ok"){
        tableData.value = res.data.list
        total.value = res.data.totalCount
        // 獲取role數據
        roles.value = res.data.roles
      }
    }).finally(() => {
      loading.value = false // 關閉loading
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

// 重置
const resetSearchForm = () => {
  searchForm.keyword = ""
  getData()
}

// 修改管理者啟用狀態
const handleStatusChg = async (status, row) => {
  if(row.id) {
    try {
      await updateManagerStatus(row.id, status)
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", `修改管理者啟用狀態成功`)
          row.status = status
        }
      }).finally(() => {
        loading.value = false // 關閉loading
      })
    } catch(err) {
      console.log('err ======', err)
    }
  }
}

// 新增/修改 管理員
const handleSubmit = async () => {
  formRef.value.validate(async (valid) => {
    if(!valid) return false
    formDrawerRef.value.showLoading()

    try {
      // 修改公告 / 新增公告
      await (editId.value ? updateManager(editId.value, form) : createManager(form) )
      .then(res => {
        // 成功獲取數據
        if(res.msg === "ok"){
          toast("success", `${isTitle.value}成功`)
          // 修改刷新當前page / 新增 刷新第一頁
          getData(editId.value ? false : 1)
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

// 刪除管理員
const handleDeleteManager = async (id) => {
  loading.value = true

  try {
    await deleteManager(id)
    .then(res => {
      // 成功獲取數據
      if(res.msg === "ok"){
        toast("success", "成功刪除管理員")
        // 重新獲取數據
        getData()
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

// 新增管理員彈窗
const handleCreateNotice = () => {
  editId.value = 0 // 新增管理員
  // 重置form
  resetForm({
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: ""
  })
  formDrawerRef.value.openDrawer()
}

getData()
</script>

<style scoped>

</style>