<template>
   <!-- 表格上方 == 新增 / 刷新 -->
  <div class="flex items-center justify-between mb-4">
    <el-button 
      type="primary"
      @click="$emit('handleCreate')"
    >
      新增
    </el-button>
    <!-- 右側 重新刷新提示 -->
    <el-tooltip
      effect="dark" 
      content="刷新數據" 
      placement="top"
    >
      <el-button text @click="$emit('refresh')">
        <el-icon :size="20">
          <Refresh/>
        </el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup>
// 傳遞父層執行
defineEmits(["handleCreate", "refresh"])
</script>
