<template>
  <el-form 
      :model="searchForm"
      label-width="80px"
      class="mb-3"
    >
      <el-row :gutter="20">
        <!-- 默認slot -->
        <slot/>
        <!-- 具名slot -->
        <template v-if="showSearch">
          <slot name="show"/>
        </template>
        <!-- :offset 往右偏移8列 -->
        <el-col :span="8" :offset="showSearch ? 0 : 8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="$emit('search')">搜索</el-button>
            <el-button type="info" @click="$emit('reset')">重置</el-button>
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
</template>

<script setup>
import { ref } from "vue"
// 觸發執行父層的function
defineEmits(["search","reset"])
const showSearch = ref(false)
</script>