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
    <div ref="echartEl" id="myChart" style="width: 100%; height: 300px"></div>
  </el-card>
  
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from "vue"
import * as echarts from 'echarts';
// api
import { getStatistics3 } from "@/api/index.js"
// vueUse resize
import { useResizeObserver } from "@vueuse/core"

const curActive = ref("week")
let myChart = null
const echartEl = ref(null)

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

// 切換時間選擇圖表數據
const handleActive = (type) => {
  curActive.value = type

  getData()
}

// 獲取圖表api數據
const getData = async () => {
  let option = {
    xAxis: {
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)"
        }
      }
    ]
  };

  // 獲取圖表數據
  try {
    myChart.showLoading() // 打開loading
    await getStatistics3(curActive.value).then(res => {
      if(res.msg === "ok"){
        option.xAxis["data"] = res.data.x
        option.series[0].data = res.data.y
        // 載入圖表
        myChart.setOption(option)
      }
    }).finally(() => {
      myChart.hideLoading() // 關閉loading
    })

  } catch(err) {
    console.log('err ======', err)
  }
}

// 處理圖表resize
useResizeObserver(echartEl, (entries) => {
  myChart.resize()
})

// dom渲染完執行
onMounted(() => {
  let chartDom = document.getElementById('myChart');
  myChart = echarts.init(chartDom);
  
  getData()
})

// 頁面被銷毀前,要銷毀echart,不然會出現白屏
onBeforeMount(() => {
  if(myChart) echarts.dispose(myChart)
})
</script>