<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 批量刪除
    layout="create, delete, refresh" 傳入子組件決定要顯示的btn -->
    <ListHeader
      layout="create,delete,refresh"
      @handleCreate="handleCreateNotice"
      @refresh="getData"
    />
    <!-- 表格 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="name" label="規格名稱" width="180" style="color: red;" />
      <el-table-column prop="default" label="規格值" />
      <el-table-column prop="order" label="排序" />

      <!-- 修改角色狀態 -->
      <el-table-column label="狀態" width="150" align="center">
        <template #default="{ row }">
          <!-- $event:當下status的值 -->
          <el-switch 
            :model-value="row.status"
            :active-value="1"
            :inactive-value="0"
            :loading="row.statusLoading"
            :disabled="row.super === 1"
            @change="handleStatusChg($event, row)"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- table list -->
      <el-table-column label="操作" width="300" align="center">
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
            title="是否刪除該規格?"
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
        <el-form-item label="規格名稱" prop="name">
          <el-input
            v-model="form.name" 
            placeholder="請輸入規格名稱"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-switch 
            v-model="form.status"
            :active-value="1" 
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <!-- 規格值 -- 添加組件 -->
        <el-form-item label="規格值" prop="default">
          <tagInput v-model="form.default"></tagInput>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive} from 'vue'
import { useRouter, RouterLink, RouterView } from "vue-router"

// api
import {
  getSkusList,
  createSkus,
  updatedSkus,
  deleteSkus,
  updateSkusStatus
 } from "@/api/skus.js"
 
 // 共用表格功能組件
import { useInitTable, useInitForm } from "@/utils/useCommon.js"
// validate rules
// import { title, content } from "@/utils/validateRules.js"
// tips
import { toast } from '@/utils/toast'
// components
import FormDrawer from "@/components/FormDrawer.vue"
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新
import TagInput from "@/components/TagInput.vue" // 添加值

const router = useRouter()

// 表格 & 分頁 & 搜索 組件 (共用)
// loading / 分頁
const {
  tableData,
  loading,
  total,
  limit,
  getData,
  handleDeleteManager,
  handleStatusChg
} = useInitTable({
  titleName: "skus",
  getList: getSkusList,
  delete: deleteSkus,
  updateStatus: updateSkusStatus
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
  titleName: "skus",
  form: { // 初始值
    name: "",
    status: 1,
    default: "",
    order: 50
  },
  rules: {
    name: [{
      require: true,
      message: "角色名稱不能為空",
      trigger: "blur"
    }]
  },
  // rules: Object.assign({ title, content }),
  getData,
  update: updatedSkus,
  create: createSkus
})

</script>

<style scoped>
.testWrap {
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: 5px;
}

.routeBtn {
  display: flex;
  justify-content: space-between;
}

.routeBtn a {
  color: white;
  padding: 8px 15px;
  margin-left: 8px;
  border-radius: 8px;
  background-color: rgba(59, 130, 246, 0.5);
  transition: all 0.5s;
}
.routeBtn a.active {
  border: 1px solid red;
  background-color: #FF7575;
}
.menuBlue {
  padding: 2px;
  color: #2894FF;
  background-color: #ECF5FF;
  border: 1px solid #66B3FF;
  border-radius: 4px;
}
.menuGreen {
  padding: 2px;
  color: 	#009100;
  background-color: #DFFFDF;
  border: 1px solid 	#53FF53;
  border-radius: 4px;
}
</style>