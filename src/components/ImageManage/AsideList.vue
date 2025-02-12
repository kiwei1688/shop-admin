<template>
  <!-- 左側: list區 -->
  <div class="aside-list" :class="{'active': active}">
    <!-- 標題 -->
    <span class="truncate">
      <slot/>
    </span>
    <el-button 
      text 
      type="primary" 
      size="small" 
      class="ml-auto px-1"
      @click="$emit('edit')"
    >
      <el-icon :size="12">
        <Edit/>
      </el-icon>
    </el-button>
    <el-button 
      text 
      type="primary" 
      size="small" 
      class="px-1"
      @click="$emit('delete')"
    >
      <el-icon :size="12">
        <Close/>
      </el-icon>
    </el-button>
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