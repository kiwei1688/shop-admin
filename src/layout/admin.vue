<template>
  <el-container>
      <!-- header -->
      <el-header>
        <f-header/>
      </el-header>
      <!-- main container -->
      <el-container>
        <!-- 左側 欄位 -->
        <el-aside :width="totalStore.asideWidth" class="f-aside">
          <f-menu></f-menu>
        </el-aside>
        <!-- 右側 主要container -->
        <el-main>
          <!-- 右側container == 標籤導航 -->
          <f-TagList></f-TagList>
          <!-- 右側container == 主要內容 -->
          <!-- Component == 拿到link後切換的不同組件 -->
          <router-view v-slot="{ Component }">
            <!-- :is動態組件綁定
             :max 緩存最多10組,最久未訪問會被銷毀
              -->
            <transition name="fade">
              <keep-alive :max="10">
                <component :is="Component"></component>
              </keep-alive>
            </transition>
          </router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script setup>
// components
import FHeader from "./components/FHeader.vue"
import FMenu from "./components/FMenu.vue"
import FTagList from "./components/FTagList.vue"
// pinia
import { handleTotalStore } from "@/stores/handleTotal"

const totalStore = handleTotalStore()

</script>

<style scoped>
.f-aside {
  transition: all 0.2s;
}

/* 進入前 */
.fade-enter-from {
  opacity: 0;
  -webkit-transform: translate3d(0, -100%, 0);
  transform: translate3d(0, -100%, 0);
}

/* 進入後 */
.fade-enter-to {
  opacity: 1;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

/* 離開前 */
.fade-leave-from {
  opacity: 1;
}

/* 離開後 */
.fade-leave-to {
  opacity: 0;-webkit-transform: translate3d(0, 100%, 0);
  transform: translate3d(0, 100%, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-active {
  transition-delay: 0.3s;
}
</style>