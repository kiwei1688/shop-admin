<template>
  <div class="mb-4">
    <!-- 上方 支付訂單4個面板 -->
    <el-row :gutter="20">
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
            {{ item.value }}
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
