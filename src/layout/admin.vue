<template>
  <el-container>
      <!-- header -->
      <el-header>
        <f-header/>
      </el-header>
      <!-- main container -->
      <el-container>
        <!-- left side bar -->
        <el-aside>
          <f-menu></f-menu>
        </el-aside>
        <!-- right container -->
        <el-main>
          <f-list></f-list>

          <router-view></router-view>
        </el-main>
      </el-container>
  </el-container>
</template>

<script setup>
import FHeader from "./components/FHeader.vue"
import FMenu from "./components/FMenu.vue"
import FList from "./components/FList.vue"

</script>

<style scoped>

</style>