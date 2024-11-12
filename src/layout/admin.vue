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
          <f-list></f-list>

          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script setup>
// components
import FHeader from "./components/FHeader.vue"
import FMenu from "./components/FMenu.vue"
import FList from "./components/FList.vue"
// pinia
import { handleTotalStore } from "@/stores/handleTotal"

const totalStore = handleTotalStore()

</script>

<style scoped>
.f-aside {
  transition: all 0.2s;
}
</style>