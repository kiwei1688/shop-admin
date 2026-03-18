<template>
  <!-- 規格詳細內容 -->
  <div v-for="(tag, index) in skuCardValueList.goodsSkusCardValue" :key="index">
    {{ tag.subNewName }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { initSkusCardItem } from "@/utils/useSku.js"

const props = defineProps({
  skuCardId: [Number, String]
})

const { skuCardValueList } = initSkusCardItem(props.skuCardId)
</script>

<style scoped>
</style>