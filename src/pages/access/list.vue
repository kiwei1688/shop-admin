<template>
  <!-- 影片教學 9-1 菜单权限列表实现 -->
  <div>
    <!-- 動態組件 :is -->
    <div class="testDemo">
      <div style="width: 25%;">
        <el-button type="primary" size="small" @click="testCom = comA">ComA</el-button>
        <el-button type="success" size="small" @click="testCom = comB">ComB</el-button>
      </div>
      <component :is="testCom" style="background-color: #ddd; width: 75%;"/>
    </div>
    <el-card shadow="never" class="border-0">
      <!-- 新增 / 刷新 -->
      <ListHeader @refresh="getData"/>
      菜單權限
      <!-- :default-expanded-keys 默認打開第一層子選單 -->
      <!-- data 為當筆數據 -->
      <el-tree 
        :data="tableData"
        :props="{
          label: 'name',
          children: 'child'
        }"
        v-loading="loading"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
      >
        <template #default="{ node, data }">
          <!-- left -->
          <div class="flex">
            <el-tag
              size="small"
              :type="data.menu ? '' : 'info'"
            >
              {{ data.menu ? "菜單" : "權限" }}
            </el-tag>
            <el-icon
              v-if="data.icon"
              :size="16"
              class="ml-2"
            >
              <component :is="data.icon"/>
            </el-icon>
          </div>

          <!-- right -->
          <div class="ml-auto">
            <el-switch
              modelValue="status"
              :active-value="1"
              :inactive-value="0"
              class="mr-2"
            />
            <el-button type="primary" size="small">修改</el-button>
            <el-button type="success" size="small">增加</el-button>
            <el-button type="danger" size="small">刪除</el-button>
          </div>
        </template>
      </el-tree>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 共用組件方法
import { useInitTable } from "@/utils/useCommon.js"
// api
import { getRuleList } from "@/api/rule.js"
// components
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新
import comA from "@/components/testDemo/comA.vue"
import comB from "@/components/testDemo/comB.vue"

const testCom = ref(comA)

const defaultExpandedKeys = ref([])

const {
  loading,
  tableData,
  getData
} = useInitTable(
  {
    getList: getRuleList, // 獲取菜單列表api方法
    onGetListSuccess: (res) => {
      tableData.value = res.data.list
      // 菜單id
      defaultExpandedKeys.value = res.data.list.map(item => item.id)
    }
  }
)
</script>

<style scoped>
  .el-tree-node__content {
    padding: 20px 0 !important;
  }
  .testDemo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 20px;
    margin: 0 0 20px 0;
  }
</style>