<template>
  {{ d.num.toFixed(0) }}
</template>

<script setup>
import { reactive, watch } from "vue"
import gsap from "gsap"

// 接受父組件數據
const props = defineProps({
  value: {
    type: Number,
    default: 0
  }
})

const d = reactive({
  num: 0
})

function AnimateToValue() {
  gsap.to(d, {
    // setting
    duration: 0.5, // 跑0.5s動畫
    num: props.value // 最終顯示的數值
  })
}

AnimateToValue()

// 防止setup執行完,數值才變化 => 數值有變化重新執行
watch(
  () => props.value, 
  ()=> AnimateToValue()
)
</script>