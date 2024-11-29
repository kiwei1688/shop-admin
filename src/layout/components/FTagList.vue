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
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
    
  </div>
  <div style="height: 44px;"></div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'

// pinia
import { handleTotalStore } from "@/stores/handleTotal"
// 使用vueuse cookie套件處理cookie
import { useCookies } from '@vueuse/integrations/useCookies'


const route = useRoute()
const router = useRouter()
const totalStore = handleTotalStore()
const cookie = useCookies()

// 選中對應的path
const activeTab = ref(route.path)
const tabList = ref([
  {
    title: '後臺首頁',
    path: '/'
  },
])

// 添加標籤導航
const addTab = (tab) => {
  // 檢查tabList是否有此筆數據,-1為找不到
  const noData = tabList.value.findIndex(el => el.path === tab.path) === -1
  // 沒有該數據 => push進去
  if(noData) {
    tabList.value.push(tab)
  }
  // 重新存入cookie
  cookie.set("tabList", tabList.value)
}

// 監聽route切換-> 有切換就調用
onBeforeRouteUpdate((to, from) => {
  // 選中state
  activeTab.value = to.path

  // {title: '分類列表', path: '/category/list'}
  const tabObj = { 
    title: to.meta.title, 
    path: to.path 
  }

  addTab(tabObj)
})

// 點標籤導航導向對應頁面
const changeTab = (path) => {
  // 對應的route path
  activeTab.value = path
  router.push(path)
}

// 移除導航標籤
// 需求: 移除當下標籤,則下一個標籤是選中狀態
const removeTab = (curPath) => {
    // curPath => 當前路徑
    let tabs = tabList.value
    let a = activeTab.value

    // 刪除當下選中標籤
    if(a === curPath) {
      tabs.forEach((item, index) => {
        // 選中當下標籤
        if(item.path === curPath) {
          // 上一個or下一個標籤
          const nextTab = tabs[index + 1] || tabs[index - 1]
          if(nextTab) {
            a = nextTab.path
          }
        }
      })
    }

    activeTab.value = a
    router.push(a)
    // 過濾掉刪除的標籤
    tabList.value = tabList.value.filter(item => item.path !== curPath)

    cookie.set("tabList", tabList.value)
}

// 初始化標籤導航列表
const initTabList = () => {
  let tabs = cookie.get("tabList")
  if(tabs) tabList.value = tabs
}

initTabList()
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