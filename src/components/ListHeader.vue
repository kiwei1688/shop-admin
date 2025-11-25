<template>
   <!-- 表格上方 == 新增 / 刷新 -->
  <div class="flex items-center justify-between mb-4">
    <div>
      <el-button 
        v-if="btns.includes('create')"
        type="primary"
        @click="$emit('handleCreate')"
      >
        新增
      </el-button>
      
      <!-- 刪除 -->
      <el-popconfirm
        v-if="btns.includes('delete')"
        title="是否刪除所選的規格?"
        confirm-button-text="確認"
        cancel-button-text="取消"
        @confirm="$emit('delete')"
      >
        <template #reference>
          <el-button type="danger">
            批量刪除
          </el-button>
        </template>
      </el-popconfirm>
    </div>

    <!-- 右側 重新刷新提示 -->
    <el-tooltip
      v-if="btns.includes('refresh')"
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
import { computed } from "vue"

// 父層傳入字串決定要顯示的按鈕
const props = defineProps({
  layout: {
    type: String,
    default: "create, refresh"
  }
})
// 父層傳入字串輸入成arr格式
const btns = computed(() => props.layout.split(","))


// 傳遞父層執行
defineEmits(["handleCreate", "refresh","delete"])
</script>
