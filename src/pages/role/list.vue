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
      <el-table-column prop="name" label="角色名稱" width="180" style="color: red;" />
      <el-table-column prop="desc" label="角色描述" />
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
          <!-- 配置權限 -->
          <el-button 
            type="success"
            @click="openSetRule(row)"
          >
            配置權限
          </el-button>
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
        <el-form-item label="角色名稱" prop="name">
          <el-input
            v-model="form.name" 
            placeholder="請輸入角色名稱"
          ></el-input>
        </el-form-item>
        <el-form-item label="公告描述" prop="desc">
          <el-input
            v-model="form.desc"
            placeholder="請輸入角色描述"
            type="textarea"
            :rows="5"
          ></el-input>
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

    <!-- 權限配置--彈窗 -->
    <FormDrawer
      title="權限配置"
      ref="SetRuleFormDrawerRef"
      @submit="handleSetRuleSubmit"
    >
      <el-tree-v2
        node-key="id"
        ref="elTreeRef"
        :default-expanded-keys="defaultExpandedKeys"
        :data="ruleList"
        :props="{label: 'name', children: 'child'}"
        show-checkbox
        :height="treeHeight"
        @check="handleTreeCheck"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tab :type="data.menu ? '' : 'info'" size="small">
              <span :class="data.menu ? 'menuBlue' : 'menuGreen'">
                {{ data.menu ? "菜單" : "權限" }}
              </span>
            </el-tab>
            <span class="ml-2 text-sm">
              {{ data.name }}
            </span>
          </div>
        </template>
      </el-tree-v2>
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
 import { getRuleList } from "@/api/rule.js"
 
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
  handleStatusChg
} = useInitTable({
  titleName: "role",
  getList: getRoleList,
  delete: deleteRole,
  updateStatus: updateRoleStatus
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
    name: "",
    desc: "",
    status: 1
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
  update: updatedRole,
  create: createRole
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

// 權限配置 === 獲取ref dom
const SetRuleFormDrawerRef = ref(null)
const elTreeRef = ref(null)

const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0) // 當前操作的角色
const defaultExpandedKeys = ref([])

// 當前角色擁有的權限id
const ruleIds = ref([])

const openSetRule = async (row) => {
  roleId.value = row.id
  // 獲取rule list數據
  try {
    await getRuleList(1)
    .then(res => {
      formDrawerRef.value.showLoading()
      treeHeight.value = window.innerHeight - 180

      if(res.msg === "ok") {
        ruleList.value = res.data.list
        // 預設打開第一層菜單
        defaultExpandedKeys.value = res.data.list.map(item => item.id)
        SetRuleFormDrawerRef.value.openDrawer()
        // 當前role擁有的權限id
        ruleIds.value = row.rules.map(item => item.id)

        setTimeout(() => {
          // setCheckedKeys()-為element-plus處理預設選中第一層menu方法
          elTreeRef.value.setCheckedKeys(ruleIds.value)
        }, 150)
      }
    }).finally(() => {
      // 關閉loading
      formDrawerRef.value.closeLoading()
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

const handleSetRuleSubmit = () => {

}
// 點擊任一權限配置 checkbox
const handleTreeCheck = (...e) => {
  console.log(e)
}

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