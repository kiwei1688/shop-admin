<template>
  <!-- 影片教學 9-1 菜单权限列表实现 -->
  <!-- 新增 & 修改 只供練習,api禁止操作!! -->
  <div>
    <el-card shadow="never" class="border-0">
      <!-- 新增 / 刷新 -->
      <ListHeader
        layout="create,refresh"
        @handleCreate="handleCreateNotice" 
        @refresh="getData"
      />
      菜單權限
      <!-- :default-expanded-keys 默認打開第一層子選單 -->
      <!-- data 為當筆數據 -->
      <el-tree 
        :data="tableData"
        :props="{
          label: 'name',
          children: 'child'
        }"
        v-loading="loading"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
      >
        <template #default="{ node, data }">
          <div class="flex">
            <el-tag
              size="small"
              :type="data.menu ? 'primary' : 'info'"
            >
              {{ data.menu ? "菜單" : "權限" }}
            </el-tag>
            <el-icon
              v-if="data.icon"
              :size="16"
              class="ml-2"
            >
              <component :is="data.icon"/>
            </el-icon>
            <span class="ml-2">{{ data.name }}</span>
          </div>

          <div class="ml-auto">
            <el-switch 
              :model-value="data.status"
              :active-value="1" 
              :inactive-value="0" 
              class="mr-2"
              @change="handleStatusChg($event, data)"
            />
            <el-button type="primary" size="small" @click.stop="handleUpdatedNotice(data)">
              修改
            </el-button>
            <el-button type="success" size="small" @click.stop="addChild(data.id)">
              增加
            </el-button>
            <!-- 刪除 -->
            <el-popconfirm 
              title="是否刪除該紀錄?"
              confirm-button-text="確認"
              cancel-button-text="取消"
              @confirm="handleDeleteManager(data.id)"
            >
              <template #reference>
                <el-button type="danger" size="small">
                  刪除
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-tree>

      <FormDrawer
        :title="isTitle"
        ref="formDrawerRef"
        @submit="handleSubmit"
        destroyOnClose
      >
        <el-form 
          :model="form"
          ref="formRef"
          :rules="rules"
          label-width="80px"
          :inline="false"
        >
          <el-form-item label="上級菜單" prop="rule_id">
            {{ form.rule_id }}
            <el-cascader
              v-model="form.rule_id"
              :options="options" 
              :props="{
                value: 'id', // 拿到選到對像的id
                label:'name', 
                children:'child', 
                checkStrictly: true, // 讓父子階層節點不相關
                emitPath: false // false只返回該節點的id賦值給form.rule_id
              }"
              placeholder="請選擇上級菜單"
            />
          </el-form-item>
          <el-form-item label="菜單/規則" prop="menu">
            <el-radio-group v-model="form.menu">
              <el-radio :label="1" border>菜單</el-radio>
              <el-radio :label="0" border>規則</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜單名稱" prop="name">
            <el-input v-model="form.name" placeholder="菜單名稱" style="width: 30%"></el-input>
          </el-form-item>
          <el-form-item label="菜單圖標" prop="icon" v-if="form.menu === 1">
            <IconSelect v-model="form.icon"/>
          </el-form-item>
          <el-form-item 
            label="前端路由"
            prop="frontpath"
            v-if="form.menu === 1 && form.rule_id > 0"
          >
            <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
          </el-form-item>
          <el-form-item label="後端規則" prop="condition" v-if="form.menu === 0">
            <el-input v-model="form.condition" placeholder="後端規則"></el-input>
          </el-form-item>
          <el-form-item label="請求方式" prop="method" v-if="form.menu === 0">
            <el-select v-model="form.method" class="m-2" placeholder="請選擇請求方式">
              <el-option
                v-for="item in ['GET','POST','PUT','DELETE']"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="order">
            <el-input-number v-model="form.order" :min="0" :max="1000"/>
          </el-form-item>
        </el-form>
      </FormDrawer>
    </el-card>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
// 共用組件方法
import { useInitTable, useInitForm } from "@/utils/useCommon.js"
// api
import { 
  getRuleList,
  createRule,
  updatedRule,
  updateRuleStatus,
  deleteRule
 } from "@/api/rule.js"
 // validate rules
// import { title, content } from "@/utils/validateRules.js"
// components
import ListHeader from "@/components/ListHeader.vue" // 新增/刷新
import FormDrawer from "@/components/FormDrawer.vue"
import IconSelect from "@/components/IconSelect.vue"

const { proxy } = getCurrentInstance()

const defaultExpandedKeys = ref([])
const options = ref([]) // 上級菜單的下拉數據
// lodash 隨機0-50
// console.log(proxy.lodash.random(0,50))

const {
  loading,
  tableData,
  getData,
  handleStatusChg,
  handleDeleteManager
} = useInitTable(
  {
    titleName: "rule",
    getList: getRuleList, // 獲取菜單列表api方法
    onGetListSuccess: (res) => {
      options.value = res.data.rules
      tableData.value = res.data.list
      // 菜單id
      defaultExpandedKeys.value = res.data.list.map(item => item.id)
    },
    delete: deleteRule, // 刪除菜單
    updateStatus: updateRuleStatus // 修改菜單啟用狀態
  }
)

// 菜單 新增 / 修改
const {
  formDrawerRef,
  formRef,
  isTitle,
  form,
  rules,
  handleSubmit,
  handleCreateNotice,
  handleUpdatedNotice
} = useInitForm({
  titleName: "rule",
  form: { // 初始值
    rule_id: 0,
    menu: 0,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: ""
  },
  // rules: Object.assign({ username, password, role_id, status, avatar }),
  getData,
  update: updatedRule, // 傳修改菜單api
  create: createRule // 傳新增菜單api
})

// 添加子分類
const addChild = (id) => {
  handleCreateNotice() // 開啟新增彈窗
  form.rule_id = id // 更新當下id
  form.status = 1
}
</script>

<style scoped>
  .el-tree-node__content {
    padding: 20px 0 !important;
  }
  .testDemo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: white;
    padding: 20px;
    margin: 0 0 20px 0;
  }
</style>