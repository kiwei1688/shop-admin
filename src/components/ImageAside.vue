<template>
  <!-- 左側: 選項區 -->
  <el-aside width="200px" class="image-aside">
    <div class="top">
      <div v-for="(item, index) in 100"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
    <div class="bottom">
      分頁
    </div>
  </el-aside>
</template>

<script setup>
import { reactive, watch } from "vue"

</script>

<style scoped>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.image-aside .top{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom{
  height: 50px;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  @apply flex items-center justify-center;
}
</style>