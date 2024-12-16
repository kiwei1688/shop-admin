<template>
  <div class="f-header">
    <!-- 左側 logo -->
    <span class="logo">
      <el-icon class="mr-1">
        <eleme-filled/>
      </el-icon>
      後台系統
    </span>
    <!-- 左側 icon 縮放 -->
    <el-tooltip
      effect="dark"
      content="左側欄位縮放"
      placement="bottom"
    >
      <el-icon class="icon-btn" @click="totalStore.handleAsideWidth">
        <fold v-if="totalStore.asideWidth === '250px'"/>
        <Expand v-else/>
      </el-icon>
    </el-tooltip>
    <!-- 重新刷新 -->
    <el-tooltip
      effect="dark"
      content="刷新"
      placement="bottom"
    >
      <el-icon class="icon-btn" @click="handleRefresh">
        <refresh/>
      </el-icon>
    </el-tooltip>

    <!-- 右側 -->
    <div class="ml-auto flex items-center">
      <el-tooltip
        effect="dark"
        content="全屏"
        placement="bottom"
      >
        <el-icon class="icon-btn" @click="toggle">
          <full-screen v-if="!isFullscreen"/>
          <aim v-else/>
        </el-icon>
      </el-tooltip>

      <!-- 下拉選單 -->
      <el-dropdown class="f-dropdown" @command="handleCommand">
        <span class="flex items-center text-light-50">
          <!-- 頭像 -->
          <el-avatar class="mr-2" :size="25" :src="store.managerInfo.data.avatar"/>
          {{ store.managerInfo.data.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="repassword">修改密碼</el-dropdown-item>
            <el-dropdown-item command="logout">退出登陸</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>

  <!-- 抽屜組件 修改密碼 -->
  <form-drawer 
    ref="formDrawerRef"
    title="修改密碼"
    destroyOnClose
    @submit="handleUpdatePassword"
  >
    <el-form 
      ref="formRef" 
      :rules="rules" 
      :model="form" 
      class="w-[500px]"
      label-width="80px"
    >
      <el-form-item prop="oldpassword" label="舊密碼">
        <el-input 
          v-model="form.oldpassword" 
          placeholder="請輸入舊密碼"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="新密碼">
        <el-input 
          v-model="form.password" 
          placeholder="請輸入新密碼"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword" label="確認密碼">
        <el-input 
          v-model="form.repassword" 
          placeholder="再次確認新密碼"
          type="password"
          show-password
        >
        </el-input>
      </el-form-item>
    </el-form>
  </form-drawer>
</template>

<script setup>
  import { ref, reactive } from "vue"
  // 直接透過pinia action請求登入
  import { useUserStore } from "@/stores/user"
  import { handleTotalStore } from "@/stores/handleTotal"
  // 組件
  import FormDrawer from "@/components/FormDrawer.vue";
  // api
  import { logoutAPI, updatepassword } from "@/api/user"
  // 提示彈窗
  import { toast, showModal } from "@/utils/toast";
  import { useRouter } from 'vue-router'
  // 全屏功能
  import { useFullscreen } from '@vueuse/core'
  import { showFullLoading, hideFullLoading } from "@/utils/common"

  const { 
    isFullscreen, // 全屏狀態
    toggle // 切換全屏
  } = useFullscreen()
  const router = useRouter()
  const store = useUserStore()
  const totalStore = handleTotalStore()
  
  // 修改密碼 Dom元件
  const formDrawerRef = ref(null)

  // 取得form的ref dom
  const formRef = ref(null)
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: ""
  })

  // 驗證規則
  const rules = {
    oldpassword: [
      { required: true, message: '舊密碼不能為空', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '新密碼不能為空', trigger: 'blur' },
    ],
    repassword: [
      { required: true, message: '確認新密碼不能為空', trigger: 'blur' },
    ]
  }

  // 處理下拉選項
  const handleCommand = (key) => {
    switch(key) {
      case "logout": // 登出
        handleLogout()
        break;
      case "repassword": // 修改密碼
        // formDrawer組件的openDrawer方法
        formDrawerRef.value.openDrawer()
        break;
      default:
        break;
      }
  }

  // 刷新
  const handleRefresh = () => location.reload()

  // 退出登入
  const handleLogout = () => {
    showModal("是否要退出登陸?", "warning", "提示")
    .then(async (res) => {
      // 請求成功&失敗都會走finally
      await logoutAPI().finally(() => {
        // 刪除cookie的token / 刪除pinia管理者
        store.logout()
        // 跳回首頁
        router.push({ path: "/login" })
        // 提示logout
        toast("success", "您已退出登陸") 
      })
    })
  }

  // 修改密碼
  const handleUpdatePassword = () => {
    // 表單驗證
    formRef.value.validate(async (validate) => {
      // 驗證通過後
      if(validate) {
        try {
          // 開啟loading
          // formDrawerRef.value.showLoading()
          showFullLoading()
          await updatepassword(form)
          .then(res => {
            // 提示用戶
            toast("修改密碼成功,請重新登錄!!")
            // 退出登陸 讓用戶重新登入
            store.logout()
            // 導回登入頁
            router.push({ path: "/login" })
          })
          // 請求成功or失敗都會執行
          .finally(() => {
            // 關閉loading
            // formDrawerRef.value.closeLoading()
            hideFullLoading()
          })
          
        } catch(err) {
          console.log("catch err !!!!!", err)
        }
      }
    })
  }

</script>

<style scoped lang="scss">
@import '@/styles/common.scss';
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
  z-index: 1000;
}

.f-header .f-dropdown {
  height: 64px;
  cursor: pointer;
  @apply flex justify-center items-center mx-5;
}

.f-header .f-dropdown:hover {
  border: unset;
}

.logo {
  width: 250px;
  @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
  @apply flex justify-center items-center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}

.icon-btn:hover {
  @apply bg-indigo-500;
}
</style>