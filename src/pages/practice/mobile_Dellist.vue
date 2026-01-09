<template>
  <!-- 01 模擬手機板本 / 列表往左滑刪除該產品功能 -->
  <div>
    <el-list class="elList">
      <el-list-item
        v-for="item in store.mitems"
        :key="item.id"
        @mousedown="startSwipe(item.id)"
        :style="{ transform: item.id === swipedItem ? `translateX(${-offset}px)` : 'translateX(0)' }"
        class="el-list-item prdItem"
      >
        {{ item.text }}
        <div class="swipe-buttons" v-if="item.id === swipedItem">
          <el-button @click="cancelSwipe">取消</el-button>
          <el-button type="danger" @click="deleteItem(item.id)">刪除</el-button>
        </div>
      </el-list-item>
    </el-list>
  </div>
  <!-- 02 -->
</template>

<script setup>
import { ref } from 'vue'
import { useListStore } from '@/stores/practice'

const store = useListStore()

// 01 ====================================================
const swipedItem = ref(null)
const offset = ref(0)
// 往左滑動
const startSwipe = (id) => {
  swipedItem.value = id
  offset.value = 0
  // offset.value += 150
  (offset.value = 150) + "vmin"  // 往左偏移值
}
// 取消刪除 恢復定位
const cancelSwipe = () => {
  offset.value = 0;
  swipedItem.value = null;
}
// 刪除該項目
const deleteItem = (id) => {
  store.deleteListItem(id); // 刪除該筆產品
  swipedItem.value = null;
  offset.value = 0;
}

// 02 ====================================================
</script>

<style scoped lang="scss">
.swipe-buttons {
  display: flex;
  position: absolute;
  top: 0;
  right: -38vmin;
  font-size: 2.7vmin;
  border: 1px solid red;
}
.elList {
  display: flex;
  flex-direction: column;
}
.prdItem {
  display: flex;
  position: relative;
  font-size: 2.7vmin;
  padding: 2vmin;
  border-bottom: 1px solid #fff;
  background: linear-gradient(to bottom, #ddd 60%, #999 100%);
}
.el-list-item {
  transition: transform 0.3s;
  position: relative;
}
</style>