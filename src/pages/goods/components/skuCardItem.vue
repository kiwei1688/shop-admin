<template>
  <!-- 規格詳細內容 -->

  <div class="flex gap-2">
    <el-tag
      v-for="(tag, index) in skuCardValueList.goodsSkusCardValue"
      :key="index"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
      effect="plain"
    >
      {{ tag.subNewName }}
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="w-20"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      + New Tag
    </el-button>
  </div>
</template>

<script setup>
import { initSkusCardItem } from "@/utils/useSku.js"

const props = defineProps({
  skuCardId: [Number, String]
})

const { 
  skuCardValueList,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm
} = initSkusCardItem(props.skuCardId)
</script>

<style scoped>
</style>