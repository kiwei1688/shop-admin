<template>
  <!-- 店鋪&商品提示 -->
  <el-card shadow="hover">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">{{ title }}</span>
        <el-tag
          :type="'#ff0000'"
          effect="plain"
        >
          {{ tip }}
        </el-tag>
      </div>
    </template>

    <!-- 卡片 zone -->
    <el-row :gutter="20">
      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in goodsData"
        :key="index"
      >
        <el-card shadow="hover" class="border-0 bg-light-500">
          <div class="flex flex-col items-center justify-center">
            <span class="text-xl mb-2 text-blue-500">{{ item.value }}</span>
            <span class="text-sm text-gray-500">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref } from "vue"

// 父層傳入的數據
defineProps({
  title: String,
  tip: String,
  goodsData: Array
})

</script>