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
      <el-input 
        v-model="tag.subNewName"
        placeholder="選項值"
        @change="handleChange($event, tag)"
        size="small"
        class="w-20 ml-[-10px]"
      />
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
      + 添加選項值
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
  handleInputConfirm,
  createCardLoading,
  handleChange
} = initSkusCardItem(props.skuCardId)
</script>

<style scoped>
</style>