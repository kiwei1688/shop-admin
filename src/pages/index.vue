<template>
  <div class="mb-4">
    後臺首頁 admin
    <!-- {{ store.managerInfo }} -->
    <el-button type="primary" @click="handleLogout">退出登陸</el-button>
  </div>
</template>

<script setup>
  // 直接透過pinia action請求登入
  import { useUserStore } from "@/stores/user"
  // api
  import { logoutAPI } from "@/api/user"
  // 提示彈窗
  import { toast, showModal } from "../utils/toast";
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const store = useUserStore()

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

</style>
