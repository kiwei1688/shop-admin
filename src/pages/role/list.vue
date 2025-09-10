<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 刷新 -->
    <ListHeader @handleCreate="handleCreateNotice" @refresh="getData"/>
    
    <div class="testWrap">
      <div>
        <el-button 
          type="danger"
          @click="testQuery"
        >
          測試路由參數query
        </el-button>
      </div>
      <!-- params 按鈕區 -->
      <div class="routeBtn">
        <div v-for="item in  btnData" :key="item.id">
          <RouterLink 
            :to="{
              name: 'xiagne',
              params: {
                id: item.id,
                name: item.name,
                age: item.age
              }
            }"
            active-class="active"
          >
            {{ item.name }}
          </RouterLink>
        </div>
      </div>
    </div>
    <!-- 動態路由params參數 == 展示區 -->
    <div>
      <RouterView></RouterView>
    </div>
    
    <!-- 表格 -->
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
import { ref, reactive, provide } from 'vue'
import { useRouter, RouterLink, RouterView } from "vue-router"

// api
import {
  getRoleList,
  createRole,
  updatedRole,
  deleteRole,
  updateRoleStatus
 } from "@/api/role.js"
 
 // 共用表格功能組件
import { useInitTable, useInitForm } from "@/utils/useCommon.js"
// validate rules
// import { title, content } from "@/utils/validateRules.js"

// components
import FormDrawer from "@/components/FormDrawer.vue"
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新

const router = useRouter()

let money = ref(100)
let car = reactive({
  brand: "奔馳",
  price: 100
})

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
  titleName: "role",
  getList: getRoleList,
  delete: deleteRole, 
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
  titleName: "role",
  form: { // 初始值
    title: "",
    content: ""
  },
  // rules: Object.assign({ title, content }),
  getData,
})

// params按鈕數據
const btnData = reactive([
  {
    id: 1,
    name: '李大同',
    age: 25
  },
  {
    id: 2,
    name: '王小名',
    age: 49
  }
])

// 測試路由參數 query
const testQuery = () => {
  router.push(
    {
      name: "/manager/list",
      query: {
        name: "田本初出出出出",
        age: 999
      }
    }
  )
}

// 修改money
function updateMoney(value) {
  money.value -= value
}

// 提供數據給孫子組件
provide("giveMoney", {money, updateMoney})
provide("giveCar", car)
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
</style>