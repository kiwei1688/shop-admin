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
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/practice'

const store = useProductStore()

const filterType = computed(() => store.filterType)

// 更新當下篩選的產品項
function setFilter(type) {
  store.setFilterType(type)
}

const filteredProducts = computed(() => store.filteredProducts)
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

</style>