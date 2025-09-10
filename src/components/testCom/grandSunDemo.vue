<template>
   <!-- 孫子組件 -->
  <div class="grandWrap">
    <h1>*** 孫子組件 / porvide & inject</h1>
    <div class="grandWrap_info">
      錢: {{ money }} --- 車子品牌: {{ getCar.brand }}/{{ getCar.price }}
      <el-button type="primary" @click="updateMoney(6)">修改錢</el-button>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue'

// 接收父曾數據
const {money, updateMoney} = inject("giveMoney", "我是默認直")
let getCar = inject(
  "giveCar", 
  {
    brand: "未知",
    price: 0
  }
)
</script>

<style scoped>
.grandWrap {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 8px;
  margin-top: 20px;
}

.grandWrap h1 {
  font-size: 18px;
  font-weight: bold;
  color: green;
}

.grandWrap h1,
.grandWrap div {
  padding: 5px;
}

.grandWrap .grandWrap_info {
  border: 1px solid #d4d4d4;
}
</style>