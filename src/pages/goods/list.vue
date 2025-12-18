<template>
<div>
  <el-tabs
    v-model="searchForm.tab"
    @tab-change="getData"
  >
    <el-tab-pane 
      v-for="item in tabBars" 
      :label="item.name" 
      :name="item.key" 
      :key="item.key"
    >
    </el-tab-pane>
  </el-tabs>

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
              v-model="searchForm.title"
              placeholder="商品名稱"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="0" v-if="showSearch">
          <el-form-item label="商品分類" prop="category_id">
            <el-select 
              v-model="searchForm.category_id"
              placeholder="請選擇商品分類"
            >
              <el-option v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select> 
          </el-form-item>
        </el-col>
        <!-- :offset 往右偏移8列 -->
        <el-col :span="8" :offset="showSearch ? 0 : 8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button type="info" @click="resetSearchForm">重置</el-button>
            <el-button type="warning" @click="showSearch = !showSearch">
              {{ showSearch ? "收合" : "展開" }}
              <el-icon>
                <ArrowUp v-if="showSearch" />
                <ArrowDown v-else />
              </el-icon>
            </el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 新增 / 刷新 -->
    <ListHeader
      layout="create,refresh"
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
      <el-table-column label="商品名稱" width="300">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image 
              :src="row.cover" 
              fit="cover"
              :lazy="true"
              class="mr-3 rounded"
              style="width:50px; height:50px;"
            ></el-image>
            <div class="flex-1">
              <p class="text-blue-600">{{ row.title }}</p>
              <div>
                <span class="text-rose-600">¥{{ row.min_price }}</span>
                <el-divider direction="vertical"/>
                <span class="text-green-600 text-xs">¥{{ row.min_oprice }}</span>
              </div>
              <p class="text-gray-400 text-xs mb-1">分類:{{ row.category ? row.category.name : "未分類" }}</p>
              <p class="text-gray-400 text-xs">創建時間:{{ row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="實際銷量" width="120" prop="sale_count" align="center"></el-table-column>
      <!-- 商品狀態 -->
      <el-table-column label="商品狀態" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status ? 'success':'danger'">
            {{ row.status ? '上架':'倉庫' }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 審核狀態 -->
      <el-table-column label="審核狀態" width="270" align="center">
        <template #default="{ row }">
          <div v-if="!row.ischeck">
            <el-button type="success" size="small" >審核通過</el-button>
            <el-button type="danger" size="small">審核拒絕</el-button>
          </div>
          <span v-else>{{ row.ischeck === 1 ? "通過" : "拒絕" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="總庫存" width="120" prop="stock" align="center"></el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <!-- 修改 -->
          <el-button type="primary" @click="handleUpdatedNotice(row)">修改</el-button>
          <el-button type="info" @click="handleUpdatedNotice(row)">商品規格</el-button>
          <el-button type="success" @click="handleUpdatedNotice(row)">設置輪播圖</el-button>
          <el-button type="warning" @click="handleUpdatedNotice(row)">商品詳情</el-button>
          <!-- 刪除 -->
          <el-popconfirm 
            title="是否刪除該商品?"
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
</div>
</template>

<script setup>
import { ref, reactive, toRefs} from 'vue'
import { useRoute } from "vue-router"
// api
import {
  getGoodsList,
  updateGoodsStatus,
  createGoods,
  updateGoods,
  deleteGoods
 } from "@/api/goods.js"
import {
  getCategoryList
} from "@/api/category.js"
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

const tabBars = [
  {
    key: "all",
    name: "全部"
  },
  {
    key: "checking",
    name: "審核中"
  },
  {
    key: "saling",
    name: "出售中"
  },
  {
    key: "off",
    name: "已下架"
  },
  {
    key: "min_stock",
    name: "庫存預警"
  },
  {
    key: "delete",
    name: "回收站"
  }
]

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
  titleName: "goods",
  searchForm: { // 傳要搜索的參數給子組件
    title: "",
    tab: "all", // 傳不同的商品狀態獲取不同的商品列表(全部/審核中/出售中/已下架/庫存預警/回收站)
    category_id: null
  },
  getList: getGoodsList, // 獲取管理列表
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
  delete: deleteGoods, // 刪除
  updateStatus: updateGoodsStatus // 修改啟用狀態
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
  titleName: "goods",
  form: { // 初始值
    username: "",
    password: "",
    role_id: null,
    status: 1,
    avatar: ""
  },
  rules: Object.assign({ username, password, role_id, status, avatar }),
  getData,
  update: updateGoods, // 傳修改商品api方法
  create: createGoods // 傳新增商品api方法
})

// 商品分類
const category_list = ref([])
const showSearch = ref(false)
const getCategoryData = async () => {
  loading.value = false
  try {
    // 接受父層傳入的api方法獲取數據
    await getCategoryList()
    .then(res => {
      if(res.msg === "ok"){
        category_list.value = res.data
      }
    }).finally(() => {
      loading.value = false
    })
  } catch(err) {
    console.log('err ======', err)
  }
}
getCategoryData()

</script>

<style scoped>
</style>