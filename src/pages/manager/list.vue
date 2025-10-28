<template>
  <div style="padding: 10px;">
    接收query參數 : {{ query.name }} ~~ {{ query.age }}
  </div>
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
    <ListHeader @handleCreate="handleCreateNotice" @refresh="getData"/>

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
      <!-- 修改狀態 -->
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
import { ref, reactive, toRefs} from 'vue'
import { useRoute } from "vue-router"
// api
import {
  getManagerList,
  updateManagerStatus,
  createManager,
  updateManager,
  deleteManager
 } from "@/api/user.js"
// 共用表格功能組件
import { useInitTable, useInitForm } from "@/utils/useCommon.js"
// validate rules
import { username, password, role_id, status, avatar } from "@/utils/validateRules.js"

// components
import FormDrawer from "@/components/FormDrawer.vue"
import ChooseImage from "@/components/ChooseImage.vue"
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新

const route = useRoute()
// 要解構響應式數據必須用toRefs,不然會丟失響應式數據
const { query } = toRefs(route)

// 角色
const roles = ref([])

// 表格 & 分頁 & 搜索 組件 (共用)
const {
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  curPage,
  total,
  limit,
  getData,
  handleDeleteManager,
  handleStatusChg
} = useInitTable({
  titleName: "manager",
  searchForm: { keyword: "" }, // 傳要搜索的參數給子組件
  getList: getManagerList, // 獲取管理列表
  onGetListSuccess: (res) => {
    tableData.value = res.data.list.map(item => {
      item.statusLoading = false
      return item
    })
    tableData.value = res.data.list
    total.value = res.data.totalCount
    // 獲取role數據
    roles.value = res.data.roles
  },
  delete: deleteManager, // 刪除
  updateStatus: updateManagerStatus // 修改啟用狀態
})

// 表格 新增 / 修改
const {
  formDrawerRef,
  formRef,
  isTitle,
  form,
  rules,
  handleSubmit,
  resetForm,
  handleCreateNotice,
  handleUpdatedNotice
} = useInitForm({
  titleName: "manager",
  form: { // 初始值
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: ""
  },
  rules: Object.assign({ username, password, role_id, status, avatar }),
  getData,
  update: updateManager, // 傳修改管理員api方法
  create: createManager // 傳新增管理員api方法
})

</script>

<style scoped>
</style>