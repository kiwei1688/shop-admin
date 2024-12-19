<template>
  <!-- 首頁 主控台 -->
  <div class="mb-4">
    <!-- 上方 支付訂單4個面板 -->
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
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
    
    <!-- 8個面板 用戶/商品/訂單 ....... -->
    <IndexNavs/>

    <!-- 圖表面板 -->
    <el-row class="mt-4">
      <!-- 圖表面板 echarts -->
      <el-col 
        :span="12" 
        :offset="0" 
        class="pr-3"
        v-permission="['getStatistics2,GET']"
      >
        <!-- v-permission 自定義指令 判別權限 透過api接口別名 -->
        <IndexChart v-permission="['getStatistics3,GET']"/>
      </el-col>
      <!-- 店鋪&商品提示 -->
      <el-col :span="12" :offset="0" class="pl-3">
        <IndexCard 
          :title="'店鋪及商品提示'"
          tip="店鋪及商品提示"
          :goodsData="goods"
          class="mb-3"
        />

        <IndexCard 
          :title="'交易提示'"
          tip="需要立即處理的交易訂單"
          :goodsData="order"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue"
// api
import { 
  getStatistics1,
  getStatistics2 
} from "@/api/index.js"
// gsap 數字動畫組件
import CountTo from "@/components/CountTo.vue"
// 面板組件
import IndexNavs from "@/components/IndexNavs.vue"
import IndexChart from "@/components/IndexChart.vue"
import IndexCard from "@/components/IndexCard.vue"

// 主控台 數據
const panels = ref([])
// 商品提示數據
const goods = ref([])
const order = ref([])

// 獲取主控台api數據
const getStatist = async () => {
  try {
    await getStatistics1().then(res => {
      // if(res.data.msg === "ok") {
        panels.value = res.data.panels
      // }
    })
    // 店鋪商品提示數據
    await getStatistics2().then(res => {
      if(res.msg === "ok") {
        goods.value = res.data.goods
        order.value = res.data.order
      }
    })
  } catch(err) {
    console.log('err ======', err)
  }
}

getStatist()
</script>

<style scoped>

</style>
