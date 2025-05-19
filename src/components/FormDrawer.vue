<template>
  <!-- 抽屜組件 -->
  <el-drawer 
    v-model="showDrawer" 
    :title="title" 
    :size="size"
    :close-on-click-modal="false"
    :destroy-on-close="destroyOnClose"
  >
    <!-- 修改密碼 表單 -->
    <div class="formDrawer">
      <!-- 彈窗 - 資訊內容 -->
      <div class="content">
        <slot></slot>
      </div>
      <!-- 底部按鈕 -->
      <div class="bottomBtn">
        <el-button type="primary" @click="submit" :loading="loading">
          {{ confirmText }}
        </el-button>
        <el-button type="default" @click="closeDrawer">
          取 消
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
  import { ref } from "vue"
  const showDrawer = ref(false)
  const loading = ref(false)

  const showLoading = () => loading.value = true
  const closeLoading = () => loading.value = false

  // 接收父層組件傳入的屬性
  const props = defineProps({
    title: String,
    size: {
      type: String,
      default: "45%"
    },
    destroyOnClose: { // 關閉後銷毀子組件
      type: Boolean,
      default: false
    },
    confirmText: {
      type: String,
      default: "提 交"
    }
  })
  // 執行父層組件的@submit
  const emit = defineEmits(["submit"])
  // 開啟側邊彈窗
  const openDrawer = () => showDrawer.value = true
  // 關閉側邊彈窗
  const closeDrawer = () => showDrawer.value = false
  // 觸發執行父層@submit對應的fun功能 (提交,新增...)
  const submit = () => emit("submit")

  // 給外部使用
  defineExpose({
    openDrawer,
    closeDrawer,
    showLoading,
    closeLoading
  })
</script>

<style scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  position: relative;
  @apply flex flex-col;
}

.formDrawer .content {
  flex: 1;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}

.formDrawer .bottomBtn {
  height: 50px;
  @apply mt-auto flex items-center
}
</style>