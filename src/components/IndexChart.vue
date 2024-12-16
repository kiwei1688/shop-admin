<template>
  <el-card shadow="never" :body-style="{ padding: '20px' }">
    <template #header>
    <div class="flex justify-between">
      <!-- header -->
      <span class="text-sm">訂單統計</span>
      <div>
        <el-check-tag 
          v-for="(item, index) in dataOptions"
          :key="index"
          class="mr-2"
          :checked="curActive === item.value"
          @click="handleActive(item.value)"
        >
          {{ item.text }}
        </el-check-tag>
      </div>
    </div>
    </template>
    <!-- card body -->
    <div id="myChart" style="width: 100%; height: 300px">

    </div>
  </el-card>
  
</template>

<script setup>
import { ref, onMounted } from "vue"
import * as echarts from 'echarts';

const curActive = ref("week")
let option
let myChart = null

const dataOptions = [
  {
    text: "近1個月",
    value: "month"
  },
  {
    text: "近1周",
    value: "week"
  },
  {
    text: "近24個小時",
    value: "hour"
  },
]

const handleActive = (type) => {
  curActive.value = type
}

const getData = () => {
  option = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };

  option && myChart.setOption(option);
}

// dom渲染完執行
onMounted(() => {
  let chartDom = document.getElementById('myChart');
  myChart = echarts.init(chartDom);
  
  getData()
})
</script>