<template>
  <div 
    class="f-tagList"
    :style="{ left: totalStore.asideWidth }"
  >
    <!-- tab-change: activeTab改變時觸發 -->
    <el-tabs
      v-model="activeTab"
      type="card"
      class="flex-1"
      style="min-width: 100px;"
      @tab-remove="removeTab"
      @tab-change="changeTab"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.path !== '/'"
      >
       
      </el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">關閉其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部關閉</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
    
  </div>
  <div style="height: 44px;"></div>
</template>

<script setup>
// 上方導航標籤
import { useTagList } from "@/utils/useTagList.js"

// pinia
import { handleTotalStore } from "@/stores/handleTotal"

const totalStore = handleTotalStore()
const {
  activeTab,
  tabList,
  changeTab,
  removeTab,
  handleClose
} = useTagList()
</script>

<style scoped>
.f-tagList {
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
  @apply fixed bg-gray-100 flex items-center px-2;
}

.tag-btn {
  height: 32px;
  width: 32px;
  @apply bg-white rounded ml-auto flex items-center justify-center px-2;
}

:deep(.el-tabs__header) {
  border: 0 !important;
  @apply mb-0 
}

:deep(.el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  @apply bg-white mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) 
{
  height: 32px;
  line-height: 32px;
}

:deep(.is-disabled) {
  cursor: not-allowed;
}
</style>