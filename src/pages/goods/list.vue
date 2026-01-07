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
     <Search 
      :model="searchForm"
      @search="getData" 
      @reset="resetSearchForm"
    >
      <!-- 默認slot -->
      <SearchItem label="關鍵詞">
        <el-input
          v-model="searchForm.title"
          placeholder="商品名稱"
          clearable
        ></el-input>
      </SearchItem>
      <!-- 具名slot -->
      <template #showHeightSearch>
        <SearchItem label="商品分類">
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
        </SearchItem>
      </template>
     </Search>
    <!-- 新增 / 刷新 -->
    <ListHeader
      layout="create,delete,refresh"
      @handleCreate="handleCreateNotice"
      @refresh="getData"
      @delete="handleMultiDelete"
    >
      <!-- 批量上下架  1:上架 / 0:下架 -->
      <el-button 
        v-if="searchForm.tab === 'all' || searchForm.tab === 'off'"
        
        size="small"
        @click="handleMultiStatusChange(1)"
      >
        批量上架
      </el-button>
      <el-button
        v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'"
        size="small" 
        @click="handleMultiStatusChange(0)"
      >
        批量下架
      </el-button>
    </ListHeader>
    <!-- 表格 -->
    <el-table
      :data="tableData"
      ref="multipleTableRef"
      border
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40"/>
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
              <p class="text-gray-400 text-xs mb-1">
                分類:{{ row.category ? row.category.name : "未分類" }}
              </p>
              <p class="text-gray-400 text-xs">
                創建時間:{{ row.create_time }}
              </p>
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
      <el-table-column v-if="searchForm.tab !== 'delete'" label="審核狀態" width="270" align="center">
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
        <template #default="{ row }" v-if="searchForm.tab !== 'delete'">
          <!-- 修改 -->
          <el-button type="success" @click="handleUpdatedNotice(row)">修改</el-button>
          <el-button type="success">商品規格</el-button>
          <el-button 
            :type="row.goods_banner.length === 0 ? 'danger' : 'primary'"
            @click="handleSetGoodsBanners(row)"
            :loading="row.bannersLoading"
          >設置輪播圖</el-button>
          <el-button type="success">商品詳情</el-button>
          <!-- 刪除 -->
          <el-popconfirm 
            title="是否刪除該商品?"
            confirm-button-text="確認"
            cancel-button-text="取消"
            @confirm="handleDeleteManager(row.id)"
          >
            <template #reference>
              <el-button type="success">
                刪除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        <span>暫無操作</span>
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
        <el-form-item label="商品名稱" prop="title">
          <el-input v-model="form.title" placeholder="請輸入商品名稱,不能超過60個字符"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <chooseImage v-model="form.cover"/>
        </el-form-item>
        <el-form-item label="商品分類" prop="category_id">
          <el-select v-model="form.category_id" placeholder="選擇所屬商品分類">
            <el-option
              v-for="item in category_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item type="textarea" label="商品描述" prop="desc">
          <el-input v-model="form.desc" placeholder="選填. 商品賣點"></el-input>
        </el-form-item>
        <el-form-item label="單位" prop="unit">
          <el-input v-model="form.unit" placeholder="請輸入單位" style="width:50%;"></el-input>
        </el-form-item>
        <el-form-item label="總庫存" prop="stock">
          <el-input v-model="form.stock" type="number" style="width: 40%;">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="庫存預警" prop="min_stock">
          <el-input v-model="form.min_stock" type="number" style="width: 40%;">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低銷售價" prop="min_price">
          <el-input v-model="form.min_price" type="number" style="width: 40%;">
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最低原價" prop="min_oprice">
          <el-input v-model="form.min_oprice" type="number" style="width: 40%;">
            <template #append>件</template>
          </el-input>
        </el-form-item>
        <el-form-item label="庫存顯示" prop="stock_display">
          <el-radio-group v-model="form.stock_display">
            <el-radio :value="0">隱藏</el-radio>
            <el-radio :value="1">顯示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :value="0">放入倉庫</el-radio>
            <el-radio :value="1">立即上架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
  <!-- 設置輪撥圖--彈窗 -->
  <Banners ref="bannerRef" @reloadData="getData"/>
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

import Search from "@/components/search.vue" // 搜索區
import SearchItem from "@/components/SearchItem.vue" // el-col共用結構
import Banners from "./banners.vue" // 設置輪撥圖彈窗

const route = useRoute()
// 要解構響應式數據必須用toRefs,不然會丟失響應式數據
const { query } = toRefs(route)

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
  multipleTableRef,
  handleSelectionChange,
  handleMultiDelete,
  handleMultiStatusChange
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
      item.bannersLoading = false
      return item
    })
    tableData.value = res.data.list
    total.value = res.data.totalCount
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
    title: null, // 商品名稱
    category_id: null, // 商品分類
    cover: null, // 商品封面
    desc: null, // 商品描述
    unit: "件", // 商品單位
    stock: 100, // 總庫存
    min_stock: 10, // 庫存預警
    status: 1, // 是否上架 0 倉庫 / 1 上架
    stock_display: 1, // 庫存顯示 0隱藏 / 1顯示
    min_price: 0, // 最低銷售
    min_oprice: 0 // 最低原價
  },
  rules: Object.assign({ username, password, role_id, status, avatar }),
  getData,
  update: updateGoods, // 傳修改商品api方法
  create: createGoods // 傳新增商品api方法
})

// 商品分類
const category_list = ref([])
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

// 設置輪撥圖彈窗
const bannerRef = ref(null)
// 開啟彈窗
const handleSetGoodsBanners = (row) => bannerRef.value.open(row)

</script>

<style scoped>
</style>