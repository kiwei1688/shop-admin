<template>
  <el-form-item label="規格選項">
    <el-card 
      shadow="never" 
      class="w-full mb-2"
      v-for="item in sku_card_list"
      :key="item.id"
    >
      <!-- 規格選項 -->
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.newName"
            placeholder="規格名稱" 
            style="width: 200px;"
          >
            <template #append>
              <el-icon><more/></el-icon>
            </template>
          </el-input>
          <el-button size="small" class="ml-auto"><el-icon><Top/></el-icon></el-button>
          <el-button size="small"><el-icon><Bottom/></el-icon></el-button>
          <el-button size="small"><el-icon><Delete/></el-icon></el-button>
        </div>
      </template>
      <!-- card-body -->
       <SkuCardItem :skuCardId="item.id"/>
    </el-card>
    <el-button
      type="success"
      :loading="btnLoading"
      @click="addSkuCardEvent"
    >添加商品規格</el-button>
  </el-form-item>
</template>

<script setup>
import { ref } from 'vue'
// 規格選項
import SkuCardItem from "./skuCardItem.vue"
import { 
  sku_card_list,
  addSkuCardEvent,
  btnLoading
} from "@/utils/useSku.js"

</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>