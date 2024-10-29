<template>
  <el-row class="login-container">
    <el-col :lg="12" class="left">
      <div class="welcome">歡迎光臨</div>
      <div class="subTitle">Vue3 + Vite商城後台系統</div>
    </el-col>
    <el-col :lg="12" class="right">
      <h2 class="welcomeTitle">歡迎回來</h2>
      <div class="login-wrap">
        <span class="login-line"></span>
        <span>帳號密碼登入</span>
        <span class="login-line"></span>
      </div>

      <!-- fome表單 -->
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="請輸入用戶名"
          >
            <!-- icon -->
            <template #prefix>
              <el-icon class="el-input__icon">
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            placeholder="請輸入密碼"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon class="el-input__icon">
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-[250px]" @click="onSubmit">
            登 入
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
  import { ref, reactive, onMounted, onBeforeMount } from 'vue'
  // 直接透過pinia action請求登入
  import { useUserStore } from "@/stores/user"
  // cookie設置
  import { setToken } from "@/utils/auth"
  import { toast } from '@/utils/toast'
  import { useRouter } from 'vue-router'

  // 實例化 pinia
  const store = useUserStore()
  const router = useRouter()

  // 取得form的ref dom
  const formRef = ref(null)

  const form = reactive({
    username: "admin",
    password: "admin"
  })
  
  // 驗證規則
  const rules = {
    username: [
      { required: true, message: '用戶名不能為空', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '密碼不能為空', trigger: 'blur' },
      // { min: 3, max: 12, message: '密碼長度須為3-12個字符', trigger: 'blur' },
    ]
  }

  const onSubmit = () => {
    // 表單驗證
    formRef.value.validate(async (validate) => {
      // 驗證通過後
      if(validate) {
        try {
          // 獲取token
          await store.getTokenInfo(form)

          if(store.tokenInfo.token) {
            // 設置token到cookie
            setToken(store.tokenInfo.token)

            // 獲取 管理者相關信息(帶token去請求)
            // await store.getManmgerInfo()
            // console.log("管理者信息 ~~~", store.managerInfo)

            // 提示用戶
            toast("success", "登入成功!!")
            router.replace({path:'/'})
          }
        } catch(err) {
          console.log("catch err !!!!!", err)
        }
      }
    })
  }

  // 監聽enter事件 (enter登入)
  const onKeyUp = ((e) => {
    console.log("eeeee", e)
    if(e.key === "Enter") onSubmit()
  })

  onMounted(() => {
    document.addEventListener("keyup", onKeyUp)
  })

  // 離開該page前 卸載手動綁定事件
  onBeforeMount(() => {
    document.removeEventListener("keyup", onKeyUp)
  })

</script>

<style scoped>
.login-container {
  @apply min-h-screen bg-indigo-500;
}

.login-container .left,
.login-container .right {
  @apply flex items-center justify-center flex-col;
}

.login-container .right {
  @apply bg-light-50;
}

.left .welcome {
  @apply font-bold text-5xl text-light-50 mb-4;
}

.left .subTitle {
  @apply font-bold text-gray-50;
}

.right .welcomeTitle {
  @apply font-bold text-3xl text-gray-800;
}

.right .login-wrap {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}

.right .login-line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>
