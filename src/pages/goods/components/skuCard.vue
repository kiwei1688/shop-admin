<template>
  <el-form-item label="規格選項">
    <el-card 
      shadow="never" 
      class="w-full mb-2"
      v-for="item in sku_card_list"
      :key="item.id"
      v-loading="item.loading"
    >
      <!-- 規格選項 -->
      <template #header>
        <div class="flex items-center">
          <!-- input @change方法,input值有變更觸發hanhandleUpdate() -->
          <el-input
            v-model="item.newName"
            placeholder="規格名稱" 
            style="width: 200px;"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon><more/></el-icon>
            </template>
          </el-input>
          <el-button size="small" class="ml-auto"><el-icon><Top/></el-icon></el-button>
          <el-button size="small"><el-icon><Bottom/></el-icon></el-button>
            <!-- 刪除 -->
            <el-popconfirm 
              title="是否刪除該商品規格?"
              confirm-button-text="確認"
              cancel-button-text="取消"
              @confirm="handleDelete(item)"
            >
              <template #reference>
                <el-button size="small">
                  <el-icon><Delete/></el-icon>
                </el-button>
              </template>
            </el-popconfirm>
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
  btnLoading,
  handleUpdate,
  handleDelete
} from "@/utils/useSku.js"

</script>

<style>
.el-card__header {
  @apply !p-2 bg-gray-50;
}
</style>