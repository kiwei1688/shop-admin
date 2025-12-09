<template>
  <el-card shadow="never" class="border-0">
    <!-- 新增 / 刷新
    layout="create, refresh" 傳入子組件決定要顯示的btn -->
    <ListHeader
      layout="create,refresh" 
      @handleCreate="handleCreateNotice" 
      @refresh="getData"
    />

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column 
        prop="title" 
        label="優惠券名稱"
      >
        <template #default="{ row }">
          <div 
            class="border border-dashed py-2 px-4 rounded" 
            :class="row.statusText === '領取中' ? 'active' : 'inactive'"
          >
            <h5 class="font-bold text-md">{{ row.name }}</h5>
            <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="狀態" width="180"/>
      <el-table-column 
        prop="title"
        label="優惠"
        width="300"
      >
        <template #default="{ row }">
          <span v-if="!row.type" class="plus">滿減</span>
          <span v-else class="discount">折扣</span>
          {{ !row.type ? (`¥${row.value}`) : (`${row.value}折`) }}
        </template>
      </el-table-column>
      <el-table-column prop="total" label="發放數量" width="180"/>
      <el-table-column prop="used" label="已使用" width="180"/>
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
        <el-form-item label="優惠券名稱" prop="name">
          <el-input v-model="form.name" placeholder="請輸入優惠券名稱" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="類型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="0">滿減</el-radio>
            <el-radio :label="1">折扣</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="面值" prop="value">
          <el-input v-model="form.value" placeholder="請輸入面值" style="width: 50%">
            <template #append>{{ form.type ? "折" : "元" }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="發行量" prop="total">
          <el-input-number 
            v-model="form.total" 
            :min="0"
            :max="10000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="最低使用價格" prop="min_price">
          <el-input v-model="form.min_price" placeholder="請輸入最低使用價格" type="number"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number 
            v-model="form.order" 
            :min="0"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="活動時間">
          <el-input v-model="form.content" placeholder="請輸入面值"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="form.desc" placeholder="請輸入描述" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
// api
import {
  getCouponList,
  createCoupon,
  updatedCoupon,
  deleteCoupon,
  updateCouponStatus
 } from "@/api/coupon.js"
 // 共用表格功能組件
import { useInitTable, useInitForm } from "@/utils/useCommon.js"
// validate rules
import { title, content } from "@/utils/validateRules.js"

// components
import FormDrawer from "@/components/FormDrawer.vue"
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新

// 處理判斷優惠券狀態
const formatStatus = (row) => {
  let str = "領取中"
  let start_time = (new Date(row.start_time).getTime()) // 開始時間轉時間戳
  let now_time = (new Date().getTime()) // 現在時間
  let end_time = new Date(row.end_time).getTime() // 結束時間

  if(start_time > now_time) {
    str = "未開始"
  } else if(end_time < now_time) {
    str = "已結束"
  } else if(row.status === 0) {
    str = "已失效"
  }
  return str
}

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
  titleName: "coupon",
  getList: getCouponList,
  onGetListSuccess: (res) => {
    // 表格數據 => 轉化優惠券狀態後
    tableData.value = res.data.list.map(item => {
      // statusText為數據中新增優惠券的狀態
      item.statusText = formatStatus(item)
      return item
    })
    // 總數量
    total.value = res.data.totalCount
  },
  delete: deleteCoupon, // 刪除公告
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
  titleName: "coupon",
  form: { // 初始值
    name: "",
    type: 0,
    value: 0,
    total: 100,
    min_price: 0,
    start_time: null,
    end_time: null,
    order: 50,
    desc: "" // 描述
  },
  // rules: Object.assign({ title, content }),
  getData,
  update: updatedCoupon, // 傳修改優惠券api方法
  create: createCoupon // 傳新增優惠券api方法
})
</script>

<style scoped>
.active {
  @apply border-rose-600 bg-rose-50 text-red-500
}
.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400
}
.plus, .discount {
  font-weight: bold;
  padding: 4px;
}
.plus {
  color: red;
  background-color: #FFD2D2;
}
.discount {
  color: green;
  background-color: #DEFFAC;
}
</style>