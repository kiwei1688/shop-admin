<template>
  <!-- 學習: 父層使用v-model綁定值,子組件定義defineProps使用modelValue
    選中icon後使用emit更新update:modelValue並將當下icon的值更新給父層
  -->
  <!-- icon選擇器 -->
  <div class="flex items-center">
    <!-- icon 顯示 -->
    <el-icon :size="20" class="mr-2" v-if="modelValue">
      <component :is="modelValue"/>
    </el-icon>
    <el-select
      filterable
      :modelValue="modelValue"
      class="m-2" 
      placeholder="請選擇圖標"
      @change="handleChange"
    >
      <el-option
        v-for="item in icons"
        :key="item"
        :label="item"
        :value="item"
      >
        <div class="flex items-center justify-between">
          <el-icon>
            <component :is="item"></component>
          </el-icon>
          <span class="text-gray-500">
            {{ item }}
          </span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
import { ref } from "vue"
// 全局引入element plus icons
import * as IconsList from '@element-plus/icons-vue'

const icons = ref(Object.keys(IconsList))

// 下拉選擇器 :modelValue 獲取父層傳入的v-model的值
defineProps({
  modelValue: String
})

// 選中icon後更新modelValue的值
const emit = defineEmits(["update:modelValue"])

// 選中的圖標回傳給父層的v-model,讓父層拿到icon的值
const handleChange = (icon) => {
  emit("update:modelValue", icon)
}
</script>

<style leng="scss" scoped>
  ::v-deep .el-select__wrapper {
    .el-select__selection {
      width: 150px;
    }
  }
</style>
