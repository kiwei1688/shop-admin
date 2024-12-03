<template>
  <!-- totalStore.asideWidth = pinia動態寬度 -->
  <div class="f-menu" :style="{width: totalStore.asideWidth}">
    <!-- 
      :collapse -- 動態摺疊 搭配computed處理
      unique-opened -- 保持只開啟一個子menu
      collapse-transition -- 開合動畫
    -->
    <el-menu
        class="border-0"
        unique-opened
        :default-active="defaultActive"
        :collapse="isCollapse"
        :collapse-transition=false
        @select="handleSelect"
      >
        <template v-for="(item, index) in asideMenus" :key="index">
          <!-- 判斷是否顯示二級menu -->
          <el-sub-menu 
            v-if="item.child && item.child.length > 0" 
            :index="item.name"
          >
            <template #title>
              <el-icon>
                <!-- 動態icon -->
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <!-- 二級menu -->
            <el-menu-item 
              v-for="(subItem, index) in item.child" 
              :index="subItem.frontpath"
              :key="index"
            >
              <el-icon>
                <!-- 動態icon -->
                <component :is="subItem.icon"></component>
              </el-icon>
              <span>{{ subItem.name }}</span>
            </el-menu-item>
          </el-sub-menu>
          <!-- 一層menu -->
          <el-menu-item v-else :index="item.frontpath">
            <el-icon>
              <!-- 動態icon -->
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
  </div>
</template>

<script setup>
import { computed, ref } from "vue"
import { useRouter, useRoute } from 'vue-router'
// pinia
import { handleTotalStore } from "@/stores/handleTotal"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const totalStore = handleTotalStore()
const store = useUserStore()
const route = useRoute()

// console.log("ddddddd", store.managerInfo.data)

// 當前的路由path
const defaultActive = ref(route.path)

// 左側menu
// const asideMenus = [
//   {
//     "name": "後台面板",
//     "icon": "help",
//     "child": [{
//       "name": "主控台",
//       "icon": "home-filled",
//       "frontpath": "/",
//       }
//     ]
//   },
//   {
//     "name": "商城管理",
//     "icon": "shopping-bag",
//     "child": [{
//       "name": "商品管理",
//       "icon": "shopping-cart-full",
//       "frontpath": "/goods/list",
//       }
//     ]
//   }
// ]
const asideMenus = computed(() => store.managerInfo.data.menus)

// 動態側邊欄位收合
const isCollapse = computed(() => !(totalStore.asideWidth === "250px"))

// 對應導頁
const handleSelect = (path) => {
  // 參數path為路徑
  router.push(path)
  
}

</script>

<style scoped>
.f-menu {
  /* width: 250px; */
  transition: all 0.2s;
  top: 64px;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  @apply shadow-2xl fixed bg-light-50;
}

.f-menu::-webkit-scrollbar {
  width: 0;
}
</style>