<template>
  <div class="f-header">
    <!-- 左側 logo -->
    <span class="logo">
      <el-icon class="mr-1">
        <eleme-filled/>
      </el-icon>
      後台系統
    </span>
    <el-icon class="icon-btn"><fold/></el-icon>
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
            <!-- <el-dropdown-item>Action 3</el-dropdown-item> -->
            <!-- <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item> -->
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
  // 直接透過pinia action請求登入
  import { useUserStore } from "@/stores/user"
  // api
  import { logoutAPI } from "@/api/user"
  // 提示彈窗
  import { toast, showModal } from "@/utils/toast";
  import { useRouter } from 'vue-router'
  // 全屏功能
  import { useFullscreen } from '@vueuse/core'

  const { 
    isFullscreen, // 全屏狀態
    toggle // 切換全屏
  } = useFullscreen()
  const router = useRouter()
  const store = useUserStore()

  // 處理下拉選項
  const handleCommand = (key) => {
    switch(key) {
      case "logout": // 登出
        handleLogout()
        break;
      case "repassword": // 修改密碼
        console.log("修改密碼")
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

</script>

<style scoped>
.f-header {
  @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
  height: 64px;
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