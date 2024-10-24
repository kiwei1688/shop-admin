// message component
import { ElMessage } from 'element-plus'

// 共用訊息提示
export const toast = (type = "success", message, dangerouslyUseHTMLString = false) => {
  ElMessage(
    {
      type,
      message,
      dangerouslyUseHTMLString,
      duration: 3000
    }
  )
}