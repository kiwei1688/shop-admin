<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 刷新 -->
    <ListHeader @handleCreate="handleCreateNotice" @refresh="getData"/>

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
            @confirm="handleDeleteManager(row.id)"
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
import { useInitTable, useInitForm } from "@/utils/useCommon.js"
// validate rules
import { title, content } from "@/utils/validateRules.js"

// components
import FormDrawer from "@/components/FormDrawer.vue"
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新

// 表格 & 分頁 & 搜索 組件 (共用)
// loading / 分頁
const {
  tableData,
  loading,
  total,
  limit,
  getData,
  handleDeleteManager,
} = useInitTable({
  getList: getNoticeList,
  delete: deleteNotice, // 刪除公告
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
  titleName: "notice",
  form: { // 初始值
    title: "",
    content: ""
  },
  rules: Object.assign({ title, content }),
  getData,
  update: updatedNotice, // 傳修改管理員api方法
  create: createNotice // 傳新增管理員api方法
})
</script>

<style scoped>

</style>