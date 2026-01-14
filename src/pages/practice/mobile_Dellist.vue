<template>
  <!-- 01 模擬手機板本 / 列表往左滑刪除該產品功能 -->
  <div>
    <el-list class="elList">
      <el-list-item
        v-for="item in store.mitems"
        :key="item.id"
        @mousedown="startSwipe(item.id)"
        :style="{ transform: item.id === swipedItem ? `translateX(${-swipeOffset}px)` : 'translateX(0)' }"
        class="el-list-item prdItem"
      >
        {{ item.text }}
        <div class="swipe-buttons" v-if="item.id === swipedItem" :style="swipeButtonsStyle">
          <el-button type="primary" @click="cancelSwipe" size="small" class="elButton">取消</el-button>
          <el-button type="danger" @click="deleteItem(item.id)" size="small">刪除</el-button>
        </div>
      </el-list-item>
    </el-list>
  </div>
  <!-- 02 -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useListStore } from '@/stores/practice'

const store = useListStore()

// 01 模擬手機板本 / 列表往左滑刪除該產品功能 //====================================================
const swipedItem = ref(null)
const swipeOffset = ref(0)
const buttonWidth = ref(0) // 按鈕寬度

// 往左滑動
const startSwipe = (id) => {
  swipedItem.value = id
  // 計算總偏移值
  swipeOffset.value = 230
  // swipeOffset.value = buttonWidth.value * 2; // 替換為 2 個按鈕的寬度
}
// 取消刪除 恢復定位
const cancelSwipe = () => {
  swipeOffset.value = 0;
  swipedItem.value = null;
}
// 刪除該項目
const deleteItem = (id) => {
  store.deleteListItem(id); // 刪除該筆產品
  swipedItem.value = null;
  swipeOffset.value = 0;
}

const getElmWidth = () => {
  // 獲取按鈕寬度
  const buttons = document.getElementsByClassName("elButton");
  buttonWidth.value = buttons.clientWidth; // 獲取第一個按鈕的寬度
}

onMounted(() => {
  getElmWidth()
})

// 自動適應按鈕css樣式
const swipeButtonsStyle = {
  width: `${buttonWidth.value * 2}px`,
  position: "absolute",
  right: "0",
  display: "flex",
  gap: "10px"
}

// 02 ====================================================
</script>

<style scoped lang="scss">
// .swipe-buttons {
//   display: flex;
//   position: absolute;
//   top: 0;
//   right: 0;
//   right: -38vmin;
//   font-size: 2.7vmin;
// }
// .elList {
//   display: flex;
//   flex-direction: column;
// }
.prdItem {
  display: flex;
  position: relative;
  font-size: 2.7vmin;
  padding: 2vmin;
  border-bottom: 1px solid #fff;
  background: linear-gradient(to bottom, #ddd 60%, #999 100%);
}
.el-list-item {
  transition: transform 0.3s ease;
  position: relative;
  padding: 10px 16px; /* 調整內邊距 */
  box-sizing: border-box;
}
.swipe-buttons {
  display: flex; /* 隱藏直到滑動 */
  width: calc(100% - 16px); /* 使按鈕寬度隨屏幕寬度調整 */
}
.el-list-item:hover .swipe-buttons {
  display: flex; /* 滑動過程中顯示 */
}
.el-button+.el-button { margin-left: 0; }
// .el-list-item {
//   transition: transform 0.3s;
//   position: relative;
// }
</style>