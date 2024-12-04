<template>
  <div class="mb-4">
    <!-- 上方 支付訂單4個面板 -->
    <el-row :gutter="20">
      <!-- 骨架屏 預載時先顯示,載入完顯示下方數據 -->
      <template v-if="panels.length === 0">
        <el-col :span="6" v-for="index in 4" :key="index">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <!-- 中間 數值 -->
                <span class="text-3xl font-bold text-gray-500">
                  <el-skeleton-item variant="h3" style="width: 80%" />
                </span>
                <el-divider/>
                <!-- 底部 -->
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
              
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col 
        :span="6" 
        :offset="0" 
        v-for="(item, index) in panels" 
        :key="index"
      >
        <el-card shadow="hover">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag
                :type="item.unitColor"
                effect="plain"
              >
              {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <!-- 中間 數值 -->
          <span class="text-3xl font-bold text-gray-500">
            <!-- gsap數字動畫 -->
            <CountTo :value="item.value"/>
          </span>
          <el-divider/>
          <!-- 底部 -->
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
  </div>
</template>

<script setup>
import { ref } from "vue"
// api
import { getStatistics1 } from "@/api/index.js"
// gsap 數字動畫組件
import CountTo from "@/components/CountTo.vue"

// 主控台 數據
const panels = ref([])

const getStatist = async () => {
  try {
    await getStatistics1().then(res => {
      // if(res.data.msg === "ok") {
        panels.value = res.data.panels
        console.log("獲取主控台數據 ========", panels.value)
      // }
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

getStatist()
</script>

<style scoped>

</style>
