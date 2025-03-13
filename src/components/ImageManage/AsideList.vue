<template>
  <!-- 左側: list區 -->
  <div class="aside-list" :class="{'active': active}">
    <!-- 標題 -->
    <span class="truncate">
      <slot/>
    </span>
    <!-- 編輯 icon -->
    <el-button 
      text 
      type="primary" 
      size="small" 
      class="ml-auto px-1"
      @click.stop="$emit('edit')"
    >
      <el-icon :size="12">
        <Edit/>
      </el-icon>
    </el-button>

    <!-- 刪除 icon -->
    <el-popconfirm 
      title="是否刪除該分類?"
      confirm-button-text="確認"
      cancel-button-text="取消"
      @confirm.stop="$emit('delete')"
    >
      <template #reference>
        <el-button 
          text 
          type="primary" 
          size="small" 
          class="px-1"
        >
          <el-icon :size="12">
            <Close/>
          </el-icon>
        </el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<script setup>

defineProps ({
  active: {
    type: Boolean,
    default:false
  }
})

// 曝露按鈕事件至外部
defineEmits(["edit","delete"])

</script>

<style scoped>

</style>