<template>
  <!-- 右側: 圖片區 -->
  <el-main class="image-main">
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
  </el-main>
</template>

<script setup>
import { reactive, watch } from "vue"

</script>

<style scoped>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-main .bottom {
  height: 50px;
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  @apply flex items-center justify-center;
}
</style>