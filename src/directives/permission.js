import { useUserStore } from "@/stores/user"

// 判斷是否有該權限,沒有則移除該節點
function hasPermission(value, el=false) {
  // 判斷是否array
  if(!Array.isArray(value)) throw new Error(`"需配置權限, 例如: v-permission="['getStatistics3,GET']"`)

  const store = useUserStore()
  // chk是否有找到api權限別名
  const hasAuth = value.findIndex(el => store.managerInfo.data.ruleNames.includes(el)) !== -1
  // 有該dom但沒有權限
  if(el && !hasAuth) {
    // 移除該dom
    el.parentNode && el.parentNode.removeChild(el)
  }
  return hasAuth
}

export default {
  // 註冊自訂義組件
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        // 判斷是否有該api權限(別名),沒有則移除該dom
        // binding.value 為判斷別名 - 'getStatistics3,GET' -> 傳入參數的值
        hasPermission(binding.value, el)
      }
    });
  }
}