<template>
   <!-- 測試路由參數params 組件 -->
  <div class="testWrap">
    <h1>*** 路由參數 / params</h1>
    <div class="name">
       ID: {{ id }}
    </div>
    <div class="name">
      <!-- 姓名: {{ params.name }} -->
       姓名: {{ name }}
    </div>
    <div class="age">
      年齡: {{ age }}
    </div>
    <grandSunDemo/>
  </div>
</template>

<script setup>
// import { useRoute } from 'vue-router';
// import { toRefs } from 'vue'
// const route = useRoute()
// const { params } = toRefs(route)
import grandSunDemo from "@/components/testCom/grandSunDemo.vue"

// 接收路由參數 params
// 因為在route採用 props: true,所以可以用defineProps收params
defineProps(['id', 'name', 'age'])
</script>

<style scoped>
.testWrap {
  display: flex;
  flex-direction: column;
  justify-content: start;
  padding: 8px;
  border: 1px solid blue;
}

.testWrap h1 {
  font-size: 18px;
  font-weight: bold;
  color: green;
}

.testWrap h1,
.testWrap div {
  padding: 5px;
}
</style>