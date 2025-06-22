<template>
  <!-- 影片教學 9-1 菜单权限列表实现 -->
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增 / 刷新 -->
      <ListHeader @refresh="getData"/>
      菜單權限
      <!-- :default-expanded-keys 默認打開第一層子選單 -->
      <el-tree 
        :data="tableData"
        :props="{
          label: 'name',
          children: 'child'
        }"
        v-loading="loading"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
      ></el-tree>
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

</style>