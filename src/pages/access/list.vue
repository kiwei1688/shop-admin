<template>
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增 / 刷新 -->
      <ListHeader/>
      菜單權限
      <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"/> -->
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
// api
import { useInitTable } from "@/utils/useCommon.js"

import { getRuleList } from "@/api/rule.js"
// components
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新

console.log(useInitTable(999))

</script>

<style scoped>

</style>