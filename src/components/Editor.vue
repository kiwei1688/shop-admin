<template>
  <el-form 
      :model="model"
      label-width="80px"
      class="mb-3"
    >
      <el-row :gutter="20">
        <!-- 默認slot (關鍵詞搜索) -->
        <slot/>
        <!-- 具名slot (展開進階搜索) -->
        <template v-if="showSearch">
          <slot name="showHeightSearch"/>
        </template>
        <!-- :offset 往右偏移8列 -->
        <el-col :span="8" :offset="showSearch ? 0 : 8">
          <div class="flex items-center justify-end">
            <el-button type="primary" @click="$emit('search')">搜索</el-button>
            <el-button type="info" @click="$emit('reset')">重置</el-button>
            <el-button
              v-if="hasHeightSearch" 
              type="warning" 
              @click="showSearch = !showSearch"
            >
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
import { ref, useSlots } from "vue"
const showSearch = ref(false)

// 判斷父層是否有具名slot元素 - 進階搜索showHeightSearch
const slots = useSlots()
const hasHeightSearch = ref(!!slots.showHeightSearch)

defineProps({
  model: Object
})
// 觸發執行父層的function
defineEmits(["search","reset"])
</script>