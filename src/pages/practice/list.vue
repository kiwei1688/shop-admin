<template>
  <div class="practice_wrap">
    <div class="p-title">✦ 01 / 分類展示產品</div>
    <el-button-group>
      <el-button
        :type="filterType === 0 ? 'primary' : 'default'"
        @click="setFilter(0)"
      >全部產品</el-button>
      <el-button
        :type="filterType === 1 ? 'primary' : 'default'"
        @click="setFilter(1)"
      >產品一</el-button>
      <el-button
        :type="filterType === 2 ? 'primary' : 'default'"
        @click="setFilter(2)"
      >產品二</el-button>
      <el-button
        :type="filterType === 3 ? 'primary' : 'default'"
        @click="setFilter(3)"
      >產品三</el-button>
    </el-button-group>

    <div class="prd_wrap">
      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col 
          :span="8" 
          v-for="product in filteredProducts" 
          :key="product.id" 
          style="margin-top: 10px;"
        >
          <el-card>
            <h3>{{ product.name }}</h3>
            <p>類型: {{ product.type }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>

  <div class="practice_wrap">
    <div class="p-title">✦ 02 / 展示banner不同動態圖</div>

    <div class="banner" :style="{ backgroundImage: `url(${randomBg})` }">
      <!-- 上方按鈕區 -->
      <div class="button-group">
        <button
          v-for="btn in buttons"
          :key="btn.key"
          :class="['banner-btn', { active: current === btn.key }]"
          @click="changeBanner(btn.key)"
        >
          {{ btn.label }}
        </button>
      </div>

      <!-- 方塊動畫區 -->
      <div class="squares">

        
        <!-- 大方塊 -->
        <transition name="fade-up">
          <div
            v-if="current"
            :key="`${current}-big`"
            class="square big"
            :class="current"
          ></div>
        </transition>

        <!-- 小方塊 -->
        <transition name="fade-down">
          <div
            v-if="current"
            :key="`${current}-small`"
            class="square small"
            :class="current"
          ></div>
        </transition>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/practice'

const store = useProductStore()

const filterType = computed(() => store.filterType)

// 模擬背景圖清單
const backgrounds = [
  "https://picsum.photos/1200/400?random=1",
  "https://picsum.photos/1200/400?random=2",
  "https://picsum.photos/1200/400?random=3",
];

const randomBg = ref("");
const current = ref("about"); // 預設顯示「關於我們」

const buttons = [
  { key: "about", label: "關於我們", color: "blue" },
  { key: "news", label: "最新消息", color: "red" },
  { key: "product", label: "產品說明", color: "green" },
];

// 更新當下篩選的產品項
function setFilter(type) {
  store.setFilterType(type)
}

const filteredProducts = computed(() => store.filteredProducts)

onMounted(() => {
  randomBg.value = backgrounds[Math.floor(Math.random() * backgrounds.length)];
});
// 點擊切換不同banner圖片
function changeBanner(type) {
  current.value = type;
}

</script>

<style scoped lang="scss">
.p-title {
  font-size: 20px;
  color: white;
  font-weight: bold;
  padding: 0 0 10px; 
}
.practice_wrap {
  width: 1280px;
  margin: 25px auto;
  padding: 25px;
  background-color: #63c2fc;
}
.practice_wrap {
  .prd_wrap {
    // border: 1px solid red;
  }
}


/* === Banner 基本設定 === */
.banner {
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

/* === 按鈕區 === */
.button-group {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
}

.banner-btn {
  background: rgba(255, 255, 255, 0.7);
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.banner-btn.active,
.banner-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

/* === 方塊區 === */
.squares {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 大小方塊共用設定 */
.square {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  margin: 10px auto;
  opacity: 0.9;
}

/* 顏色分類 */
.about {
  background-color: #007bff;
}

.news {
  background-color: #e63946;
}

.product {
  background-color: #2a9d8f;
}

/* 大方塊 */
.square.big {
  width: 180px;
  height: 180px;
}

/* 小方塊 */
.square.small {
  width: 100px;
  height: 100px;
}

/* === 動畫效果 === */
.fade-up-enter-active,
.fade-up-leave-active,
.fade-down-enter-active,
.fade-down-leave-active {
  transition: all 0.8s ease;
}

/* 大方塊向上淡出/淡入 */
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

/* 小方塊向下淡出/淡入 */
.fade-down-enter-from {
  opacity: 0;
  transform: translateY(-40px);
}
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>