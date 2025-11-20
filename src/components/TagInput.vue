<template>
  <div class="flex gap-2">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      closable
      :disable-transitions="false"
      @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <!-- 輸入值 -->
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
      + 添加值
    </el-button>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue'

const props = defineProps({
    modelValue: String
})
// 通知父組件 更新了modelValue
const emit = defineEmits(["update:modelValue"])

const inputValue = ref('')
const dynamicTags = ref(props.modelValue ? props.modelValue.split(",") : [])
const inputVisible = ref(false)
const InputRef = ref()
// 刪除添加值
const handleClose = (tag) => {
  dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
  // 通知父組件 更新了modelValue
  emit("update:modelValue", dynamicTags.value.join(","))
}

const showInput = () => {
  inputVisible.value = true
  // 等元件dom掛載完成後執行
  nextTick(() => {
    InputRef.value.input.focus()
  })
}
// 輸入後 按enter觸發
const handleInputConfirm = () => {
  if (inputValue.value) {
    dynamicTags.value.push(inputValue.value)
    // 通知父組件 更新了modelValue
    emit("update:modelValue", dynamicTags.value.join(","))
  }
  inputVisible.value = false
  inputValue.value = ''
}
</script>