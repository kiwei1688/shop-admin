import { ref, reactive } from "vue"
// api
import { logoutAPI, updatepassword } from "@/api/user"
// 提示彈窗
import { toast, showModal } from "@/utils/toast";
import { useRouter } from 'vue-router'
// 直接透過pinia action請求登入
import { useUserStore } from "@/stores/user"

// 修改密碼 組件
export async function useRePassWord (){
  const router = useRouter()
  const store = useUserStore()

  // 取得form的ref dom
  const formRef = ref(null)
  // 修改密碼 Dom元件
  const formDrawerRef = ref(null)

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

  // 修改密碼
  const handleUpdatePassword = async () => {
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
            toast("修改密碼成功,請重新登form錄!!")
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

  const openRePassword = () => formDrawerRef.value.openDrawer()

  return {
    formRef,
    formDrawerRef,
    form,
    rules,
    handleUpdatePassword,
    openRePassword
  }
}